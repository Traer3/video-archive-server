const { YTGetLinks } = require("./services/linksGenerator/linksGeneratorService");
const { simulateDownload } = require("./services/linksGenerator/simulatingDownload");
const { getLinks, writeUpdate } = require("./services/linksService");
const { generateThumbnails } = require("./services/thumbnailGeneratorService");
const { checkHours } = require("./services/toolsService");
const { beginDownloadingVideos } = require("./services/videoDownloaderService");

exports.VideoDownloader = async () => {
    try {
        const likedVideos = await getLinks(); 
        if (!likedVideos || likedVideos.length === 0) {
            const freshLinks = await YTGetLinks();
            if(freshLinks && freshLinks.length > 0){
                await downloadLinks(freshLinks)
            };
            await generateThumbnails()
            return;
        }
        
        const latestVideo = await updateTime(likedVideos);
        const latestVideoTime = latestVideo.last_updated;
        const checkTime = checkHours(6, latestVideoTime)

        if (true) {
            const currentTime = new Date();
            await writeUpdate({
                id: latestVideo.id,
                lastUpdated: currentTime
            });
            const freshLinks = await YTGetLinks();
            if(freshLinks && freshLinks.length > 0){
                await downloadLinks(freshLinks);
            };
            await generateThumbnails()
        }
        return;
    } catch (err) {
        console.log(`❌ Error in VideoDownloader ${err.message}`);
        return null;
    }
};

async function downloadLinks(links) {
    const chunkSize = 10;
    console.log("links.length : ",links.length)     
    if(links.length > chunkSize){
        for(let i = 0; i < links.length; i += chunkSize){
            const linksForSimulation = links.slice(i,i + chunkSize);
            const testedLinks = await simulateDownload(linksForSimulation);
            await beginDownloadingVideos(testedLinks)
        }
    }else{
        const testedLinks = await simulateDownload(links, );
        await beginDownloadingVideos(testedLinks)
    }
}

async function updateTime(likedVideos) {
    const reverseYTLinks = [...likedVideos].reverse();
    const latestVideo = reverseYTLinks[0];
    const currentTime = new Date();

    if (!latestVideo.last_updated) {
        await writeUpdate({
            id: latestVideo.id,
            lastUpdated: currentTime
        });
        return { ...latestVideo, last_updated: currentTime };
    } else {
        return latestVideo;
    }
}

