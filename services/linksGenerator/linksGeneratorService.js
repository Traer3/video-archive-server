const { consoleAuthorization } = require("../../middleware/auth/authorize");
const { getVideoList } = require("../videoService");
const { cleanName, clearNames } = require('../toolsService');
const { writeLinks, getLinks } = require('../linksService');
const { getYouTubeLinks } = require("./getYouTubeLinks");
const { newNameChecker } = require("./newNameChecker");
const { simulateDownload } = require("./simulatingDownload");

exports.YTGetLinks = async () => {
    console.log(`\nReceiving links...`);
    const DBvideos = await getVideoList();
    const Links = await getLinks();
    const auth = await consoleAuthorization();
    
    const currentYTVideos = auth.status
        ? await getYouTubeLinks(auth.client)
        : [];
    
    const freshLinks = await sendNewLinks(Links, currentYTVideos);
    if (freshLinks || freshLinks.length > 0) {
        console.log("freshLinks : ",freshLinks)
        await sendLikes(freshLinks);
    }
    return;
    const newVideos = await newNameChecker(currentYTVideos, DBvideos, Links);
    if (!newVideos) {
        console.log("No fresh videos")
        return [];
    }
    
    const newVideos2 = [
        {
            name: '[Blue Archive] Aris & Kei - Protocol SUPERNOVA MV',
            url: 'https://youtu.be/Pm4KSlf19pI'
        },
        {
            name: 'YESOD',
            url: 'https://youtu.be/v3lsDlgi3IE'
        },
        {
            name: 'Bury the Light',
            url: 'https://youtu.be/sFsq8Pb0Meo'
        }
    ]
    let videoForDownload
    if (newVideos.length !== 0) {
        videoForDownload = await simulateDownload(newVideos, Links)
        console.log(`\n🏁 Links written`);
        return videoForDownload;
    }
};

async function sendNewLinks(Links, YTVideos) {
    if (!Links || Links.length === 0) {
        await sendLikes(YTVideos);
        return [];
    }

    //const cleanLinks = clearNames(Links);
    //const cleanYTLinks = clearNames(YTVideos);
    const linkNames = new Set(Links.map(video => cleanName(video.name)))
    const freshLinks = YTVideos.filter(video => !linkNames.has(cleanName(video.name)));
    return freshLinks;
}

async function sendLikes(YouTubeVideos) {
    const skipVideoName = ['private video', 'deleted video'];
    const reverseYTLinks = [...YouTubeVideos].reverse();

    for (const video of reverseYTLinks) {
        if (skipVideoName.includes(cleanName(video.name))) {
            //console.log(`⏭ Skipping private || deleted videos...`)
            continue;
        }
        await writeLinks({
            name: video.name,
            category: 'YouTube',
            locked: false,
            isitunique: false
        })
    };
    return console.log(`✅ Links written\n`);
}