const path = require('path');
const fsPromises = require("fs").promises

const { deleteExtension, cleanName } = require("../toolsService");
const { readFolders } = require("../videoService");

const VIDEOS_DIR = path.join(__dirname, "../../videos");

exports.getVideoSize = async (videoName) =>{
    const files = await readFolders(VIDEOS_DIR);
    try{
        const normalName = cleanName(videoName) //videoName.toLowerCase().trim()
        for (const file of files) {
            
            const fileName = cleanName(deleteExtension(file.name) )  //.toLowerCase().trim()
            const filePath = file.fullPath
            if (fileName === normalName) {
                const stat = await fsPromises.stat(filePath);
                const sizeMB = (stat.size / (1024 * 1024)).toFixed(2);
                return{
                    name: videoName,
                    duration: "",
                    sizeMB: sizeMB,
                    category: '',
                    fullPath: filePath
                }
            }
        };
        console.log("Video not found! ", videoName)
        return null
    }catch(err){
        console.error(`❌ Error with ${videoName} : ${err}`)
        return null
    };
};