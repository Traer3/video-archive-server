const { cleanName } = require("../toolsService");

exports.clearNames = (videos) => {
    return clearNames(videos)
}

exports.newNameChecker = async (YTVideos, DBvideos, Links) => {
    if (!YTVideos) return;
    try {
        const cleanLinks = await clearNames(Links);

        const NamesFromDB = new Set(DBvideos.map(video => cleanName(video.name)))
        const newVids = []
        for(const video of YTVideos){
            const cleanVideo = cleanName(video.name);
            const isTrash = cleanVideo === "private video" || cleanVideo === "deleted video";
            if (isTrash){
                continue;
            }
            const isAlreadyInDB = NamesFromDB.has(cleanVideo);
            if(!isAlreadyInDB){
                newVids.push(video);
            }
        }

        const checkedVideos = await lockedLinks(newVids, cleanLinks);

        return checkedVideos;
    } catch (err) {
        console.error(`Error in newNameChecker : ${err}`)
    }
};

async function clearNames(videos) {
    const cleanedVideos = [];
    for (const video of videos) {
        let clearedVideo = {
            ...video,
            name: cleanName(video.name)
        }
        cleanedVideos.push(clearedVideo)
    }
    return cleanedVideos;
};
async function lockedLinks(newVids, cleanLinks) {
    if (!newVids || newVids.length === 0) return [];
    try {
        if (cleanLinks.length === 0) {
            console.log("Table links is empty")
            return newVids;
        };
    
        const lockedVideos = new Set(
            cleanLinks
                .filter(vid => vid.locked === true)
                .map(vid => vid.name)
        );

        if (lockedVideos.size === 0) {
            //console.log("No locked vidoes found in DB")
            return newVids;
        }
        
        const canDownload = newVids.filter(vid => {
            const cleanVid = cleanName(vid.name)
            const isLocked = lockedVideos.has(cleanVid);

            if (isLocked) {
                //console.log(`Skiping! Allready locked: ${vid.name}`);
            }
            return !isLocked;
        });
        return canDownload;
    } catch (err) {
        console.error(`❌ Error while sorting lockedLinks `, err.message);
        return [];
    }
};
