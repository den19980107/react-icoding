const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const config = require('../config/database'); //在我們的config file裡面可以設定要用的database URL
const path = require('path');

// for uplaod video
const Video = require('../model/video');
const uploadModule = require('express-fileupload');
let ObjectID = require('mongodb').ObjectID;
// router.use(uploadModule())

//上傳照片
const crypto = require("crypto");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
router.use(methodOverride('_method'));

var fs = require('fs');

//init gfs   
let gfs

mongoose.connect(config.database);
let db = mongoose.connection;


//check connection
db.once('open', function () {
    console.log("connect to mongodb");

    //init Stream
    gfs = Grid(db.db, mongoose.mongo);
    gfs.collection('uploads');
});

//create storage engine

const storage = new GridFsStorage({
    url: config.database,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({
    storage
});

//上傳照片到教材
router.post('/', ensureAuthenticated, upload.any(), function (req, res) {
    console.log(req.url);
    //console.log("/uploader/image/" + req.files[0].filename);
    var CKEcallback = req.query.CKEditorFuncNum;
    var fileUrl = "/uploader/image/" + req.files[0].filename;
    var msg = "";
    res.send(`<script type="text/javascript">
    window.parent.CKEDITOR.tools.callFunction("${CKEcallback}", "${fileUrl}", "上傳成功");
    console.log("sendback");
    </script>`);

});

//@顯示照片的route
router.get('/image/:imageName', ensureAuthenticated, (req, res) => {
    gfs.files.findOne({
        filename: req.params.imageName
    }, (err, img) => {
        //check if image exists
        if (!img || img.length === 0) {
            return res.status(404).json({
                err: 'No image exists'
            })
        }
        //check if image
        if (img.contentType === 'image/jpeg' || img.contentType === "image/png") {
            const readstream = gfs.createReadStream(img.filename);
            readstream.pipe(res);
        } else {
            return res.status(404).json({
                err: 'No an image'
            })
        }
    });
})

// 在單元中上傳影片
// params:
// id : 影片所屬的 unit 的 id
// location : "local" || "youtube" 表示影片處存在本地還是 youtube
router.post('/unit/:id/video/:location', upload.any(), function (req, res) {
    if (req.params.location == "local") {
        if (req.files && req.files.length > 0) {
            let files = req.files;
            files.forEach(file => {
                if (file.mimetype.startsWith("video/")) {
                    const unitId = req.params.id;
                    const fileName = file.originalname;

                    let video = new Video();
                    video._id = ObjectID()
                    video.videoName = fileName
                    video.videoURL = file.filename
                    video.belongUnit = unitId
                    video.isLocal = true; // 表示這部影片會儲存在伺服器資料庫
                    video.save(function (err) {
                        if (err) {
                            res.status(500).json("上傳失敗！")
                        } else {
                            res.sendStatus(200);
                        }
                    })
                }
            });
        }
    } else if (req.params.location == "youtube") {

    }
});

// 取得影片
router.get('/video/:vid', function (req, res) {
    Video.findById(req.params.vid, function (err, video) {
        if (video.isLocal) { // 確認影片是否是存在本地的
            const fileName = video.videoURL;
            gfs.files.findOne({ //找出影片資訊‘
                filename: fileName
            }, (err, video) => {
                if (!video || video.length === 0) {
                    return res.status(404).json({
                        err: 'No Video exists'
                    })
                }
                if (video.contentType.startsWith("video/")) { // 檢視影片型態是否為 video
                    const path = './assets/' + video.filename;
                    if (fs.existsSync(path)) {
                        let { videoStream, head } = getVideoStream(path, req, res);
                        res.writeHead(206, head);
                        videoStream.pipe(res);
                    } else {
                        const rs = gfs.createReadStream(video); //把影片從 mongo 中讀出來
                        const ws = fs.createWriteStream(path) // 設定檔案要存的位址
                        var stream = rs.pipe(ws) //把檔案存到檔案中
                        stream.on('finish', function () { // 當檔案讀完之後
                            let { videoStream, head } = getVideoStream(path, req, res);
                            res.writeHead(200, head);
                            videoStream.pipe(res);
                        });
                    }
                } else {
                    return res.status(404).json({
                        err: 'No an Video'
                    })
                }
            });
        }
    })
})

function getVideoStream(path, req, res) {
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunckSize = (end - start) + 1;
        const file = fs.createReadStream(path, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Range': 'bytes',
            'Content-Length': chunckSize,
            'Content-Type': 'video/mp4'
        }
        // res.writeHead(206, head);
        // file.pipe(res);
        return {
            head: head,
            videoStream: file
        }
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4'
        }
        // res.writeHead(200, head);
        const file = fs.createReadStream(path)
        return {
            head: head,
            videoStream: file
        }
    }
}

//Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', '請先登入');
        let nextURL = req.originalUrl.replace(new RegExp('/', 'g'), '%2F');
        //console.log("inuser ensure = "+nextURL);
        //console.log("url = /users/login/?r="+nextURL);

        res.redirect('/users/login/?r=' + nextURL);
    }
}
module.exports = router;