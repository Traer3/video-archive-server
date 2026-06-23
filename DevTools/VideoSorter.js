const path = require("path");

const { readFolders, databaseOverwrite, getVideoList, importVideo } = require("../services/videoService.js");
const { exists, cleanName, deleteExtension } = require("../services/toolsService.js");
const { getLinks } = require("../services/linksService.js");
const VIDEOS_DIR = path.join(__dirname, "../videos");

exports.videoSorter = async () => {
    console.log("Sorting videos id DB");
    console.log("📂 Searching video from Folders");
    if (!(await exists(VIDEOS_DIR))) {
        console.error("Missing video folder");
        return;
    };
    const oldTable = await getVideoList();
    

    const videoFiles = await readFolders(VIDEOS_DIR);
    const likedVideos = await getLinks();

    const noCategory = await noCategorySorter(videoFiles, likedVideos);
    const YTvideos = await YTVideos(videoFiles, likedVideos);
    
    const sortedList = [...YTvideos, ...noCategory];

    const newList =  writeOldData(oldTable, sortedList);
    await DatabaseOverwrite(newList);
    console.log("✅ Videos sorted!")
};

async function noCategorySorter(videoFiles,likedList) {
    const noCategoryVideos = []
    const likedListSet = new Set(likedList.map(video => cleanName(video.name)));

    for(const video of videoFiles){
        const videoName = deleteExtension(video.name)
        const cleanVideoName = cleanName(videoName);
        if(cleanVideoName === 'isfull'){
            continue;
        }
        const foundVideo = likedListSet.has(cleanVideoName);
        if(!foundVideo){
            noCategoryVideos.push(videoName);
        }
    };
    return noCategoryVideos;
}

async function YTVideos(videoFiles, likedList) {
    const YTvideos = new Set();
    const likedListName = [...likedList.map(video => video.name)].reverse()
    const fileNames = new Set(videoFiles.map(video => {
        const videoName = deleteExtension(video.name);
        const cleanedName = cleanName(videoName)
        return cleanedName;
    }));
    
    likedListName.forEach(vid => {
        const videoName = cleanName(vid);
        const foundVideo = fileNames.has(videoName);
        if(foundVideo){ 
            YTvideos.add(vid)
        };
    })
    const reverseExistedList = [...YTvideos].reverse()
    
    return reverseExistedList;
};

async function DatabaseOverwrite(newList) {
    console.log("🔄 Rewriting old DB");
    //const result = await databaseOverwrite();
    //if (result.success) { result.message }

    try {
        for(const video of newList){
            console.log("video: ",video)
            /*
            await importVideo({
                name: video.name,
                duration: video.duration,
                sizeMB: video.size_mb,
                category: video.category,
                isitunique: video.isitunique,
                filtered: video.filtered
            });
            */
        };
    } catch (err) {
        console.error("❌ Error during DatabaseOverwrite : ", err.message);
    }
};

function writeOldData(oldTable, sortedList) {
    const videos = []
    const oldTableMap = new Map(oldTable.map(video => [cleanName(video.name), video]))
    for(const newVideo of sortedList){
        const cleanVideoName = cleanName(newVideo)
        const foundVideo = oldTableMap.get(cleanVideoName);
        
        if(foundVideo){
            const {id, ...video} = foundVideo;
            videos.push(video)
        }
    };
    return videos
}

`
video:  {
  name: 'Pr‎ je‎ t  M‎ on  Br‎ i‎ r‎ot',
  duration: '16:21',
  size_mb: '237.95',
  category: 'YouTube',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.074Z
}
video:  {
  name: 'Decide. Unlock. Break It Down.',
  duration: '4:05',
  size_mb: '180.42',
  category: 'YouTube',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.075Z
}
video:  {
  name: '[블루아카이브] 유우카 테스트',
  duration: '0:31',
  size_mb: '4.63',
  category: 'YouTube',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.077Z
}
video:  {
  name: 'KAYOKO',
  duration: '0:38',
  size_mb: '3.12',
  category: 'YouTube',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.079Z
}
video:  {
  name: 'Glue you back together',
  duration: '0:15',
  size_mb: '2.20',
  category: 'YouTube',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.081Z
}
video:  {
  name: '[Limbus Company OST] Canto IX Mix to increase your Productivity',
  duration: '56:29',
  size_mb: '123.91',
  category: 'YouTube',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.082Z
}
video:  {
  name: 'Hero but WE GALLOP ON TOGETHER',
  duration: '5:20',
  size_mb: '46.68',
  category: 'YouTube',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.084Z
}
video:  {
  name: '＂NUH UH!!!＂ [Library of Ruina Spoilers]',
  duration: '0:33',
  size_mb: '3.96',
  category: 'YouTube',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.086Z
}
video:  {
  name: '미스터리한「수영복 나구사」｜ 메모리얼 로비 번역【블루아카이브】',
  duration: '3:03',
  size_mb: '26.69',
  category: 'YouTube',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.088Z
}
video:  {
  name: '케이픽업',
  duration: '0:34',
  size_mb: '7.71',
  category: 'YouTube',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.089Z
}
video:  {
  name: '블루아카이브 애니메이션',
  duration: '1:34',
  size_mb: '12.60',
  category: 'YouTube',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.091Z
}
video:  {
  name: '밀수 Smuggling',
  duration: '0:49',
  size_mb: '2.33',
  category: 'YouTube',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.093Z
}
video:  {
  name: '[블루 아카이브] 옆에 앉을게요, 선생님. #케이',
  duration: '0:38',
  size_mb: '3.98',
  category: 'YouTube',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.095Z
}
video:  {
  name: '이부키를 들어서 [블루아카이브]',
  duration: '0:53',
  size_mb: '7.14',
  category: 'YouTube',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.097Z
}
video:  {
  name: 'What are you, president of Sensei fan club？',
  duration: '0:04',
  size_mb: '0.53',
  category: 'YouTube',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.098Z
}
video:  {
  name: '【ブルアカ】ナグサ(水着) PV',
  duration: '0:15',
  size_mb: '2.12',
  category: 'YouTube',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.100Z
}
video:  {
  name: '[Blue Archive] Bunny Girl Toki here. Yay.☆',
  duration: '0:15',
  size_mb: '4.44',
  category: 'YouTube',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.102Z
}
video:  {
  name: '[Blue Archive] Aris & Kei - Protocol SUPERNOVA MV',
  duration: '3:22',
  size_mb: '51.19',
  category: 'YouTube',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.104Z
}
video:  {
  name: 'yo',
  duration: '0:07',
  size_mb: '0.75',
  category: 'YouTube',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.105Z
}
video:  {
  name: '千夏 エピソード「ほんまに『ヤだ』」｜ゼンレスゾーンゼロ',
  duration: '1:29',
  size_mb: '14.79',
  category: 'YouTube',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.107Z
}
video:  {
  name: '[Blue Archive OST 183] (Cyber) New Year March ｜ Event Theme BGM (Drum + Bass)',
  duration: '1:52',
  size_mb: '101.29',
  category: 'YouTube',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.109Z
}
video:  {
  name: 'Amazing innovation ： From car lighter to heat based electronic component removal device',
  duration: '3:24',
  size_mb: '73.74',
  category: '',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.111Z
}
video:  {
  name: 'DILATAÇÃO HIPNÓTICA 6.0 (Slowed)',
  duration: '3:08',
  size_mb: '6.38',
  category: '',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.112Z
}
video:  {
  name: 'EPICTALE - P.E.R.F.E.C.T Song',
  duration: '0:57',
  size_mb: '4.89',
  category: '',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.114Z
}
video:  {
  name: "Epictale OST - Revolution [Epic!Gaster's Theme] ｜ EPIC ROCK REARRANGEMENT",
  duration: '2:17',
  size_mb: '24.96',
  category: '',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.116Z
}
video:  {
  name: "Epictale OST - Rise Against The Darkness [Battle Theme] ｜｜ Ilay's Originals",
  duration: '3:42',
  size_mb: '81.31',
  category: '',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.118Z
}
video:  {
  name: 'GILDEDGUY STORY #3 - Basement Busk',
  duration: '8:23',
  size_mb: '46.56',
  category: '',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.120Z
}
video:  {
  name: 'GLITCHTALE - Fragments of Bitter Efforts ｜ Fragmented Extremity Part 1 Full Soundtrack Album!',
  duration: '6:49',
  size_mb: '148.64',
  category: '',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.121Z
}
video:  {
  name: 'GTA San Andreas - Ah shit, here we go again.',
  duration: '0:03',
  size_mb: '0.13',
  category: '',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.123Z
}
video:  {
  name: 'Garou vs Heroes ｜｜ One Punch Man',
  duration: '0:19',
  size_mb: '2.86',
  category: '',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.125Z
}
video:  {
  name: 'Gravity is a Harness (1)',
  duration: '0:24',
  size_mb: '2.12',
  category: '',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.127Z
}
video:  {
  name: 'Land of Immortals',
  duration: '4:53',
  size_mb: '5.78',
  category: '',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.128Z
}
video:  {
  name: 'Terraria Calamity Mod Music - ＂Signal Received＂ - Theme of Draedon (Pre-Fight)',
  duration: '3:33',
  size_mb: '78.83',
  category: '',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.130Z
}
video:  {
  name: "The Death Of God's Will (ULTRAKILL OST- with intro and dialogues and battle effects)",
  duration: '12:26',
  size_mb: '21.13',
  category: '',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.132Z
}
video:  {
  name: 'The Only Thing I Know For Real - Dual Mix',
  duration: '2:26',
  size_mb: '14.75',
  category: '',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.134Z
}
video:  {
  name: 'UNDERVERSE - Eventful ｜｜ Remix [By Ilay Boter]',
  duration: '1:31',
  size_mb: '14.19',
  category: '',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.135Z
}
video:  {
  name: 'UNDERVERSE - Regret ｜｜ A Fan-Soundtrack By Ilay Boter',
  duration: '2:38',
  size_mb: '53.74',
  category: '',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.137Z
}
video:  {
  name: 'Vergil walking Devil May Cry 3',
  duration: '0:23',
  size_mb: '6.14',
  category: '',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.139Z
}
/////////////////////////////////////////////////////////////////               10
video:  {
  name: '[ThePruld] We are the souls (new ending) (1)',
  duration: '5:07',
  size_mb: '24.92',
  category: '',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.141Z
}
video:  {
  name: 'blood blockade battlefront ED 1 full',
  duration: '4:08',
  size_mb: '16.91',
  category: '',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.143Z
}
video:  {
  name: 'whitty.mp4',
  duration: '0:06',
  size_mb: '1.58',
  category: '',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.144Z
}
video:  {
  name: 'ДЕЛАЕМ ГИГАНТСКУЮ ГАЗОВУЮ ПЛАВИЛЬНЮ ДЛЯ ЛИТЬЯ',
  duration: '22:29',
  size_mb: '1316.30',
  category: '',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.146Z
}
video:  {
  name: 'ПИКАП мастер 80 lvl ★ CS 1.6 подборка СМЕШНЫХ приколов',
  duration: '13:36',
  size_mb: '190.60',
  category: '',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.148Z
}
video:  {
  name: '【 #踊ってみた 】체리팝  ⧸ Momoi ⧸ DECO＊27 #shorts #dance',
  duration: '0:21',
  size_mb: '4.69',
  category: '',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.150Z
}
video:  {
  name: '【ブルアカ】ゲヘナ生徒でチェンソーマンパロディ【手書きアニメーションMAD】(黒舘ハルナ⧸愛清フウカ⧸夜桜キララ⧸丹花イブキ⧸陸八魔アル⧸空崎ヒナ)',
  duration: '1:02',
  size_mb: '10.90',
  category: '',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.151Z
}
video:  {
  name: '芸術杖の作り方 ～その光線ドリルで打ち抜いて～ #noita #voiceroid実況プレイ',
  duration: '12:44',
  size_mb: '267.24',
  category: '',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.153Z
}
video:  {
  name: '芸術杖の作り方 ～その光線ドリルで打ち抜いて～',
  duration: '12:44',
  size_mb: '267.24',
  category: '',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.155Z
}
video:  {
  name: '뿅~？ 뿅~ 뿅~! 【 Doodle Archive 】 #블루아카 #ブルアカ #Bluearchive',
  duration: '0:31',
  size_mb: '12.41',
  category: '',
  isitunique: false,
  filtered: false,
  created_at: 2026-06-22T23:45:34.157Z
}
`