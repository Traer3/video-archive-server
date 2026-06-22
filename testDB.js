const { deleteExtension } = require("./services/toolsService");
const { getVideoList } = require("./services/videoService")


const SERVER_URL = 'http://192.168.0.9:3001'
exports.testDB = async () =>{
    const dbVids = await getVideoList();
    const allVideos = await fetch(`${SERVER_URL}/api/server/videos?page=1&limit=20000`);
    const allVideosFolder = await allVideos.json()
    //console.log("folder vids ",allVideosFolder.videos)
    await checkNames(dbVids,allVideosFolder.videos)
}

async function checkNames(DBVideos, FolderVideos) {
    //DBVideos.map(vid => console.log("DB name : ",vid.name))
    //FolderVideos.map(vid => console.log("Folder name : ",deleteExtension(vid.name)))
    for(const video of FolderVideos){
        const foundVideo = DBVideos.filter(vids => vids.name === deleteExtension(video.name))
        if(!foundVideo){
            console.log("Video file missing in DB: ", video.name)
        }
    }
}