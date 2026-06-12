const { lockedVideo } = require("../linksService");
const { addLog } = require("../logService");
const { runCommand, clearNames } = require("../toolsService");


exports.simulateDownload = async (newVideos, Links) => {
    const videoForDownload = [];

    const clearedLinks = clearNames(Links)
    const linksMap = clearedLinks.length > 0
        ? new Map(clearedLinks.map(link => [link.name, link]))
        : new Map();

    console.log(`🥽 Simulating a download\n`)
    let i = 0;
    for (const video of newVideos) {
        i++
        //if (videoForDownload.length >= 5) break;
        try {
            const comand1 = `yt-dlp -s "${video.url}"`
            const respond = await runCommand(comand1);
            if (respond.stdout) {
                console.log(`[${i}/${newVideos.length}] processing video : ${video.name}`)
                videoForDownload.push({ name: video.name, url: video.url })
            }
        } catch (err) {
            console.log(`❌ Error processing link: ${video.url}`);
            const errorMessage = err?.message || String(err) || "";
            let category = "General error";

            if (errorMessage.includes("Sign in to confirm your age")) {
                category = "Age restriction"
            } else if (errorMessage.includes("This video is only available to Music Premium members")) {
                category = "Music Premium";
            } else if (errorMessage.includes("blocked it in your country")) {
                category = "Country restriction";
            }else{
                console.error(`Unusual error: ${err}`)
            }

            await addLog({
                type: "SimulatingDownload",
                message: `🧱 Video ${video.name} : ${category} `
            });
            await lockedId(linksMap, video)
        }
    };
    return videoForDownload;
}

async function lockedId(linksMap, video) {
    const foundVideo = linksMap.get(video.name);
    if (foundVideo) {
        await lockedVideo({
            id: foundVideo.id,
            locked: true
        });
        console.log(`Video id: ${foundVideo.id} LOCKED ✅ (Name: ${foundVideo.name})`)
    } else {
        console.log(`Video not found in Map: ${video.name}`)
    }
}

//ОШИБКИ
