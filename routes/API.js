const express = require('express');
const router = express.Router();
//todo 做刪除單元
let ObjectID = require('mongodb').ObjectID;
//bring in Article models
let Article = require('../model/article');
//bring User model
let User = require('../model/user');
//bring Class model
let Class = require('../model/class');
//bring Unit model
let Unit = require('../model/unit');
//bring Chapter model
let Chapter = require('../model/chapter');
//bring Video model
let Video = require('../model/video');
//bring Videobehavior model
let Videobehavior = require('../model/videobehavior');
//bring student take courese model
let StudebtTakeCourse = require('../model/StudentTakeCourse');
//bring student comment chapter model
let studentCommentChapter = require('../model/studentCommentChapter');
//bring student comment video model
let studentCommentVideo = require('../model/studentCommentVideo');
//bring Test model
let Test = require('../model/test');
//bring Homework model
let Homework = require('../model/homework');
//bring student submit test model
let studntSubmitTest = require('../model/studentSubmitTest');
//bring student submit homework model
let studntSubmitHomework = require('../model/studentSubmitHomework');
//寄email的工具
var nodemailer = require('nodemailer');
//bring note model
let Note = require('../model/note')
//bring ClassEBook model
let classEBook = require('../model/classEBook')
//bring RFM model
let RFM = require('../model/RFM')
//bring studentWatchChapter modal
let studentWatchChapter = require('../model/studentWatchChapter');
//bring coding qution modal
let CodingQution = require("../model/codeQution");
//bring School model
let School = require('../model/school');

// 拿到user資訊
router.get('/getUser/:id', function (req, res) {
    console.log(req.params.id)
    User.findById(req.params.id, function (err, User) {
        if (err) {
            return res.status('500').send({ message: "無此使用者!" })
        } else {
            res.json(User);
        }
    })
})

//拿到所有學校
router.get('/getSchools', function (req, res) {
    let schoolArray = [];
    School.find({}, function (err, schools) {
        if (err) {
            console.log(err)
        } else {
            schools.forEach(school => {
                if (!schoolArray.includes(school.schoolName)) {
                    schoolArray.push(school.schoolName)
                }
            });

            let responseData = {
                schoolArray: schoolArray
            }

            res.json(responseData)
        }
    })
});

//用學校名稱搜尋科系
router.get('/getDepartments/:schoolName', function (req, res) {
    let schoolName = req.params.schoolName;
    School.find({
        schoolName: schoolName
    }, function (err, schools) {
        if (err) {
            console.log(err)
        } else {
            let departments = []
            schools.forEach(school => {
                departments.push(school.departmentName)
            })

            let response = {
                departments: departments
            }

            res.json(response)
        }
    })
})

//拿到所有課程
router.get('/getClasses', function (req, res) {
    Class.find({}, function (err, classes) {
        if (err) {
            res.send('{"error" : "要求失敗", "status" : 500}')
        } else {
            res.json(classes);
        }
    })
})

//拿到一筆課程
router.get('/getClass/:id', function (req, res) {
    Class.find({ _id: ObjectID(req.params.id) }, function (err, classinfo) {
        if (err) {
            return res.status('500').send({ message: "無此課程!" })
        } else {
            res.json(classinfo[0]);
        }
    })
})

//拿到課程內的單元
router.get("/getUnit/:classId", function (req, res) {
    Unit.find({ belongClass: req.params.classId }, function (err, Units) {
        if (err) {
            res.send('{"error" : "要求失敗", "status" : 500}')
        } else {
            res.json(Units)
        }
    })
})

//拿到單元內影片 給ios開發用的
router.get('/getVideo/:unitID', function (req, res) {
    Video.find({
        belongUnit: req.params.unitID
    }, function (err, videos) {
        if (err) {
            res.send('{"error" : "要求失敗", "status" : 500}');
        } else {
            //console.log(videos);

            studentCommentVideo.find({}, function (err, comments) {
                if (err) {
                    res.send('{"error" : "要求失敗", "status" : 500}');
                } else {
                    Videobehavior.find({}, function (err, behaviors) {
                        if (err) {
                            res.send('{"error" : "要求失敗", "status" : 500}');
                        } else {
                            processArray(videos, comments, behaviors).then(function (videoinfo) {
                                res.json(videoinfo)
                            });
                        }
                    })
                }
            })
        }
    })
})

//拿到單元內影片
router.get('/getVideoInUnit/:unitID', function (req, res) {
    Video.find({
        belongUnit: req.params.unitID
    }, function (err, videos) {
        if (err) {
            res.send('{"error" : "要求失敗", "status" : 500}');
        } else {
            //console.log(videos);

            studentCommentVideo.find({}, function (err, comments) {
                if (err) {
                    res.send('{"error" : "要求失敗", "status" : 500}');
                } else {
                    Videobehavior.find({}, function (err, behaviors) {
                        if (err) {
                            res.send('{"error" : "要求失敗", "status" : 500}');
                        } else {
                            processArray(videos, comments, behaviors).then(function (videoinfo) {
                                res.send(`{"videos" : ${JSON.stringify(videoinfo)}} `);
                            });
                        }
                    })
                }
            })
        }
    })
})
async function processArray(videos, comments, behaviors) {
    let data = await append(videos, comments, behaviors)
    return data
}

function append(videos, comments, behaviors) {
    for (let i = 0; i < videos.length; i++) {
        videos[i].comments = [];
    }
    let data = []
    for (let i = 0; i < videos.length; i++) {
        videosinfo = {
            belongUnit: videos[i].belongUnit,
            videoName: videos[i].videoName,
            videoURL: videos[i].videoURL,
            vtime: videos[i].vtime,
            postTime: videos[i].postTime,
            _id: ObjectID(videos[i]._id).toString(),
            comments: [],
            watchTime: 0
        }
        for (let j = 0; j < comments.length; j++) {
            if (videos[i].id == comments[j].videoID) {
                videos[i].comments.push(comments[j].body);
                videosinfo.comments.push(comments[j].body)
            }
        }
        data.push(videosinfo)
    }

    for (let i = 0; i < data.length; i++) {
        for (j = 0; j < behaviors.length; j++) {
            //console.log(data[i]._id, behaviors[j].videoID);

            if (data[i]._id == behaviors[j].videoID) {
                data[i].watchTime++;
            }
        }
    }
    return data
}

//刪除單元
router.post('/deleteUnit/:unitID', function (req, res) {
    Unit.remove({ _id: req.params.unitID }, function (err) {
        if (err) {
            //console.log(err);
            res.send('{"error" : "刪除失敗", "status" : 500}');
        } else {
            res.send('{"success" : "儲存成功"}');
        }
    })
})


//rename單元
router.post('/renameUnit/:unitID', function (req, res) {
    console.log(req.body);

    let myquery = { _id: req.params.unitID };
    let newvalues = { $set: { unitName: req.body.unitName } };
    Unit.updateOne(myquery, newvalues, function (err) {
        if (err) {
            //console.log(err);
            res.send('{"error" : "更改失敗", "status" : 500}');
        } else {
            res.send('{"success" : "儲存成功"}');
        }
    })
})

//send影片資訊
router.get('/getVideoInfo/:videoID', function (req, res) {
    Video.findById(req.params.videoID, function (err, videoinfo) {
        Videobehavior.find({
            videoID: videoinfo._id
        }, function (err, behaviors) {
            if (err) {
                res.send('{"error" : "要求失敗", "status" : 500}');
            } else {
                res.send(`{"videoinfo" : ${JSON.stringify(videoinfo)},"behaviors":${JSON.stringify(behaviors)} }`);
            }
        })
    })
})

//send影片detial
router.get('/getVideoDetial/:videoID', function (req, res) {
    Video.findById(req.params.videoID, function (err, videoinfo) {
        Videobehavior.find({
            videoID: videoinfo._id
        }, function (err, behaviors) {
            let watchers = []
            for (let i = 0; i < behaviors.length; i++) {
                if (watchers.indexOf(ObjectID(behaviors[i].watcherID).toString()) == -1) {
                    watchers.push(ObjectID(behaviors[i].watcherID).toString())
                }
            }
            query = {
                _id: watchers
            }
            User.find(query, function (err, watchersInfo) {
                Unit.findById({
                    _id: videoinfo.belongUnit
                }, function (err, Unit) {
                    Class.findById({
                        _id: Unit.belongClass
                    }, function (err, ClassInfo) {
                        let videoName = videoinfo.videoName;
                        let videoWatchTime = behaviors.length;
                        let videoTime = parseInt(videoinfo.vtime);
                        let belongUnit = Unit;
                        let belongClass = ClassInfo;
                        let watchersNumber = watchersInfo.length;
                        let data = {
                            "videoName": videoName,
                            "videoWatchTime": videoWatchTime,
                            "videoTime": videoTime,
                            "watchersInfo": watchersInfo,
                            "belongUnit": belongUnit,
                            "belongClass": belongClass,
                            "watchersNumber": watchersNumber
                        }
                        //console.log(data);
                        res.send(`[{
                            "videoName":${JSON.stringify(videoName)},
                            "videoWatchTime":"${JSON.stringify(videoWatchTime)}",
                            "videoTime":"${JSON.stringify(videoTime)}",
                            "watchersNumber":"${JSON.stringify(watchersNumber)}"
                        },
                        ${JSON.stringify(watchersInfo)}
                        ,
                        ${JSON.stringify(belongUnit)}
                        ,
                        ${JSON.stringify(belongClass)}
                        ]`);
                    });
                })
            })
        })
    })
})

//send影片留言
router.get('/getVideoComment/:videoID', function (req, res) {
    studentCommentVideo.find({
        videoID: req.params.videoID
    }, function (err, comments) {
        if (err) {
            res.send('{"error" : "要求失敗", "status" : 500}');
        } else {
            res.send(`{"comments" : ${JSON.stringify(comments)}}`);
        }
    })
})

//delete影片
router.post('/deleteVideo/:videoID', function (req, res) {
    // TODO 把 upload chunck 跟 upload file 一起刪掉 現在還沒有刪掉實際的影片檔案
    Video.remove({ _id: req.params.videoID }, function (err) {
        if (err) {
            //console.log(err);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    })
})

//send講義資訊 for ios app
router.get('/getChapter/:UnitID', function (req, res) {
    Chapter.find({
        belongUnit: req.params.UnitID
    }, function (err, chapters) {
        if (err) {
            res.send('{"error" : "要求失敗", "status" : 500}');
        } else {
            res.json(chapters)
        }
    })
})

//send講義資訊
router.get('/getChapterInUnit/:chapterID', function (req, res) {
    Chapter.find({
        belongUnit: req.params.chapterID
    }, function (err, chapters) {
        if (err) {
            res.send('{"error" : "要求失敗", "status" : 500}');
        } else {
            //console.log(chapters);
            studentCommentChapter.find({}, function (err, comments) {
                if (err) {
                    res.send('{"error" : "要求失敗", "status" : 500}');
                } else {
                    // processArray(chapters, comments, {}).then(function (chapterinfo) {
                    //     console.log("------------");
                    //     console.log(chapterinfo);
                    // });
                    res.json(chapters)
                    // res.send(`{"chapter" : ${JSON.stringify(chapters)},"comment":${JSON.stringify(comments)}} `);
                }
            })
        }
    })
})

//send電子書資訊
router.get('/classEBook/:chapterID', function (req, res) {
    classEBook.find({
        belongUnit: req.params.chapterID
    }, function (err, classEBooks) {
        if (err) {
            res.send('{"error" : "要求失敗", "status" : 500}');
        } else {
            // console.log(classEBooks);
            res.send(`{"classEBooks" : ${JSON.stringify(classEBooks)}} `);
        }
    })
})

//rename講義名稱
router.post('/renameChapter/:chapterID', function (req, res) {
    let myquery = { _id: req.params.chapterID };
    let newvalues = { $set: { chapterName: req.body.chapterName } };
    Chapter.updateOne(myquery, newvalues, function (err) {
        if (err) {
            console.log(err);
            res.send('{"error" : "更改失敗", "status" : 500}');
        } else {
            res.send('{"success" : "儲存成功"}');
        }
    })
})

//delete講義
router.post('/deleteChapter/:chapterID', function (req, res) {
    Chapter.remove({ _id: req.params.chapterID }, function (err) {
        if (err) {
            console.log(err);
            res.send('{"error" : "刪除失敗", "status" : 500}');
        } else {
            res.send('{"success" : "儲存成功"}');
        }
    })
})


//rename講義名稱
router.post('/renameTest/:testID', function (req, res) {
    let myquery = { _id: req.params.testID };
    let newvalues = { $set: { testName: req.body.testName } };
    Test.updateOne(myquery, newvalues, function (err) {
        if (err) {
            console.log(err);
            res.send('{"error" : "更改失敗", "status" : 500}');
        } else {
            res.send('{"success" : "儲存成功"}');
        }
    })
})

//delete測驗
router.post('/deleteTest/:testID', function (req, res) {
    Test.remove({ _id: req.params.testID }, function (err) {
        if (err) {
            console.log(err);
            res.send('{"error" : "刪除失敗", "status" : 500}');
        } else {
            res.send('{"success" : "儲存成功"}');
        }
    })
})

//send測驗資訊 for ios app
router.get('/getTest/:chapterID', function (req, res) {
    Test.find({
        belongUnit: req.params.chapterID
    }, function (err, tests) {
        if (err) {
            res.send('{"error" : "要求失敗", "status" : 500}');
        } else {
            res.json(tests)
        }
    })
})

//send測驗資訊
router.get('/getTestInUnit/:chapterID', function (req, res) {
    Test.find({
        belongUnit: req.params.chapterID
    }, function (err, tests) {
        if (err) {
            res.send('{"error" : "要求失敗", "status" : 500}');
        } else {
            res.json(tests);
        }
    })
})

//RFM分析
router.post('/showRFMAnalizying/:videoID', function (req, res) {
    let a = req.body.a;
    let b = req.body.b;
    let r = req.body.r;
    let focusPoint = req.body.focusPoint
    console.log(focusPoint);
    let videoID = req.params.videoID;
    RFM.findOne({ videoID: req.params.videoID }, function (err, urfm) {
        if (urfm) {
            RFM.updateMany({ videoID: req.params.videoID }, { $set: { focusPoint: req.body.focusPoint, avalue: a, bvalue: b, rvalue: r } }, { w: 1 }, function (err) {
                if (err) {
                    console.log(err);
                }
                console.log("rfm update success");
            })
        } else {
            let rfm = new RFM();
            rfm.videoID = videoID;
            rfm.avalue = a;
            rfm.bvalue = b;
            rfm.rvalue = r;
            rfm.focusPoint = req.body.focusPoint;
            console.log(rfm);
            rfm.save(function (err) {
                if (err) {
                    console.log(err);
                }
                console.log("rfm save success");
            });
        }
    })
    Video.findById(videoID, function (err, videoinfo) {
        if (err) {
            console.log(err);
        }
        let vtime = videoinfo.vtime;
        Videobehavior.find({ videoID: videoID }, function (err, videobehaviors) {
            if (videobehaviors.length == 0) {
                res.send('{"response" : "沒有觀看紀錄", "status" : 500}');
            } else {
                videobehaviors = videobehaviors.sort(function (a, b) {
                    return a.watcherID > b.watcherID ? 1 : -1;
                });
                let studentBehavior = [{
                    studentID: "",
                    behaviors: [],
                    lastwatchTime: new Date(1999)
                }];
                let nowWatcherID = videobehaviors[0].watcherID;
                studentBehavior[0].studentID = nowWatcherID;
                let count = 0;

                for (let i = 0; i < videobehaviors.length; i++) {
                    if (nowWatcherID == videobehaviors[i].watcherID) {
                        studentBehavior[count].behaviors.push(videobehaviors[i].videoActions);
                        let date = videobehaviors[i].watchTime.split("@")[0];
                        let year = date.split("/")[2];
                        let month = date.split("/")[1];
                        let day = date.split("/")[0];
                        let time = videobehaviors[i].watchTime.split("@")[1];
                        let hr = time.split(":")[0];
                        let mm = time.split(":")[1];
                        let ss = time.split(":")[2];
                        if (studentBehavior[count].lastwatchTime < new Date(Date.UTC(year, month - 1, day, hr, mm, ss))) {
                            studentBehavior[count].lastwatchTime = new Date(Date.UTC(year, month - 1, day, hr, mm, ss));
                        }
                        //console.log(year,month,day,hr,mm,ss);

                    } else {
                        //console.log("------------------------");
                        nowWatcherID = videobehaviors[i].watcherID;
                        count++;
                        studentBehavior[count] = {
                            studentID: "",
                            behaviors: [],
                            lastwatchTime: ""
                        }
                        studentBehavior[count].studentID = nowWatcherID;
                        studentBehavior[count].behaviors.push(videobehaviors[i].videoActions);
                        let date = videobehaviors[i].watchTime.split("@")[0];
                        let year = date.split("/")[2];
                        let month = date.split("/")[1];
                        let day = date.split("/")[0];
                        let time = videobehaviors[i].watchTime.split("@")[1];
                        let hr = time.split(":")[0];
                        let mm = time.split(":")[1];
                        let ss = time.split(":")[2];
                        if (studentBehavior[count].lastwatchTime < new Date(Date.UTC(year, month - 1, day, hr, mm, ss))) {
                            studentBehavior[count].lastwatchTime = new Date(Date.UTC(year, month - 1, day, hr, mm, ss));
                        }
                        console.log(year, month, day, hr, mm, ss);
                    }
                }
                //TODO 濾掉無效紀錄
                for (let i = 0; i < studentBehavior.length; i++) {
                    let tempbehaviors = []
                    //console.log("學生："+studentBehavior[i].studentID);
                    //console.log("濾掉之前有"+studentBehavior[i].behaviors.length+"筆紀錄");
                    //console.log("影片時間 = "+vtime);
                    console.log("觀看者:" + studentBehavior[i].watcherID);
                    console.log("原始的觀看行為記錄次數 = ", studentBehavior[i].behaviors.length);
                    for (let j = 0; j < studentBehavior[i].behaviors.length; j++) {
                        //console.log("觀看時間 = "+studentBehavior[i].behaviors[j][studentBehavior[i].behaviors[j].length-1].split(":")[1]);

                        // if(studentBehavior[i].behaviors[j][studentBehavior[i].behaviors[j].length-1].split(":")[1]>vtime/20){
                        tempbehaviors.push(studentBehavior[i].behaviors[j])
                        // }
                    }
                    studentBehavior[i].behaviors = tempbehaviors
                    //console.log("濾掉之後有"+studentBehavior[i].behaviors.length+"筆紀錄");
                    //console.log("------------------");

                }
                let studentRFM = []
                for (let i = 0; i < studentBehavior.length; i++) {
                    studentRFM[i] = {
                        R: "",
                        F: "",
                        M: 0,
                        studentID: "",
                        studentName: ""
                    }
                }


                let date = new Date().toLocaleString().split(" ")[0].replace(",", "");

                //根據不同電腦 new Date().toLocaleString() 出來會有可能有 10/22/2019 or 2019-10-22 所以要調整一下
                let seporator;
                let year;
                let month;
                let day;
                if (date.includes("-")) {
                    year = date.split("-")[0];
                    month = date.split("-")[1];
                    day = date.split("-")[2];
                } else if (date.includes("/")) {
                    year = date.split("/")[2];
                    month = date.split("/")[0];
                    day = date.split("/")[1];
                }

                let time = new Date().toLocaleString().split(" ")[1];
                let hr = time.split(":")[0];
                let mm = time.split(":")[1];
                let ss = time.split(":")[2].split(".")[0];
                let nowTime = new Date(Date.UTC(year, month - 1, day, hr, mm, ss));
                console.log(Date.UTC(year, month - 1, day, hr, mm, ss))
                console.log(date, year, month, day, hr, mm, ss)
                console.log(nowTime)

                let studentIDs = []
                for (let i = 0; i < studentRFM.length; i++) {
                    console.log(nowTime)
                    console.log(studentBehavior[i].lastwatchTime)
                    console.log((nowTime - studentBehavior[i].lastwatchTime) / 3600000)
                    studentRFM[i].R = (nowTime - studentBehavior[i].lastwatchTime) / 3600000;
                    studentRFM[i].F = studentBehavior[i].behaviors.length;
                    console.log("觀看者:" + studentBehavior[i].studentID);
                    console.log("過濾後的觀看行為記錄次數 = ", studentRFM[i].F);

                    let videoTimeLine = []
                    for (let k = 0; k < vtime; k++) {
                        videoTimeLine[k] = 0;
                    }
                    let finishPersent = 0; //影片觀看完整度
                    let focusPointCompleteTimes = 0; //重點完成次數
                    let noteTimes = 0 //筆記次數
                    for (let j = 0; j < studentBehavior[i].behaviors.length; j++) {
                        //console.log(studentBehavior[i].behaviors[j]);
                        for (let k = 0; k < studentBehavior[i].behaviors[j].length; k++) {
                            let action = studentBehavior[i].behaviors[j][k].split(":")[0]
                            if (action == "note") {
                                noteTimes++
                            }
                            if (action == "play") {
                                let start = parseInt(studentBehavior[i].behaviors[j][k].split(":")[1])
                                let end = parseInt(studentBehavior[i].behaviors[j][k + 1].split(":")[1])
                                for (let l = start; l <= end; l++) {
                                    videoTimeLine[l] += 1;
                                }
                            }
                        }
                        // studentRFM[i].M += parseInt(studentBehavior[i].behaviors[j].slice(-1).pop().split(":")[1])
                        // studentRFM[i].M += parseInt(studentBehavior[i].behaviors[j].slice(0).join().split("note").length-1)//筆記次數

                    }
                    //console.log(videoTimeLine);
                    let watchedSecond = 0;
                    for (let q = 0; q < vtime; q++) { //影片完成率迴圈
                        if (videoTimeLine[q] != 0) {
                            watchedSecond++;
                        }
                    }
                    for (let q = 0; q < focusPoint.length; q++) { //重點完成率迴圈
                        for (let p = parseInt(focusPoint[q].start); p <= parseInt(focusPoint[q].stop); p++) {
                            if (videoTimeLine[p] != 0 && videoTimeLine[p] != undefined) {
                                focusPointCompleteTimes += videoTimeLine[p];
                            }
                        }
                    }
                    finishPersent = watchedSecond / vtime;
                    // console.log("finishPersent = "+finishPersent);
                    // console.log("focusPointCompleteTimes = "+focusPointCompleteTimes);
                    // console.log("noteTimes = "+noteTimes);

                    //最終公式
                    studentRFM[i].M = a * finishPersent + b * focusPointCompleteTimes + r * noteTimes
                    console.log("完成比率:", finishPersent);
                    console.log("重點完成率:", focusPointCompleteTimes);
                    console.log("筆記次數:", noteTimes);
                    console.log(studentRFM[i].R, studentRFM[i].F, studentRFM[i].M);

                    console.log("---------------------------");

                    studentRFM[i].studentID = studentBehavior[i].studentID;
                    studentIDs.push(ObjectID(studentBehavior[i].studentID).toString())
                    //studentRFM[i].studentName = findById(studentBehavior[i].studentID)
                }
                User.find({ _id: studentIDs }, function (err, studentinfo) {
                    for (let i = 0; i < studentRFM.length; i++) {
                        for (let j = 0; j < studentinfo.length; j++) {
                            //console.log(studentRFM[i].studentID,studentinfo[j]);
                            if (studentRFM[i].studentID == studentinfo[j]._id) {
                                studentRFM[i].studentName = studentinfo[j].name;
                            }
                        }
                    }
                    //console.log(studentRFM);
                    res.json(studentRFM)
                })
            }
        })
    })
})

//send Userinfo
router.get('/getuserinfo/:userid/:videoID', function (req, res) {
    User.findById(req.params.userid, function (err, userinfo) {
        if (err) {
            console.log(err);
        }
        Video.findById(req.params.videoID, function (err, videoinfo) {
            if (err) {
                console.log(err);
            }
            Unit.findById(videoinfo.belongUnit, function (err, unitinfo) {
                if (err) {
                    console.log(err);
                }
                Class.findById(unitinfo.belongClass, function (err, classinfo) {
                    if (err) {
                        console.log(err);
                    }
                    Unit.find({ belongClass: classinfo._id }, function (err, thisClassUnits) {
                        if (err) {
                            console.log(err);
                        }
                        let unitIDs = [];
                        for (let i = 0; i < thisClassUnits.length; i++) {
                            unitIDs.push(ObjectID(thisClassUnits[i]._id).toString())
                        }
                        Test.find({ belongUnit: unitIDs }, function (err, thisClassTests) {
                            if (err) {
                                console.log(err);
                            }
                            studntSubmitTest.find({ belongUnit: unitIDs, writer: req.params.userid }, function (err, thisUserSubmitTest) {
                                if (err) {
                                    console.log(err);
                                }
                                Video.find({ belongUnit: unitIDs }, function (err, thisClassVideo) {
                                    let VideoIDs = [];
                                    for (let i = 0; i < thisClassVideo.length; i++) {
                                        VideoIDs.push(ObjectID(thisClassVideo[i]._id).toString())
                                    }
                                    Videobehavior.find({ videoID: VideoIDs, watcherID: req.params.userid }, function (err, thisUserWatchVideo) {
                                        let totalWatchVideo = [];
                                        for (let i = 0; i < thisUserWatchVideo.length; i++) {
                                            if (totalWatchVideo.indexOf(thisUserWatchVideo[i].videoID) == -1) {
                                                totalWatchVideo.push(thisUserWatchVideo[i].videoID)
                                            }
                                        }
                                        //console.log("---------------------");

                                        //console.log(thisUserSubmitTest);
                                        //console.log(thisClassTests);
                                        //console.log("測驗填寫完整度 ＝ "+ thisUserSubmitTest.length/thisClassTests.length);
                                        //console.log("影片觀看完整度 ＝ "+ totalWatchVideo.length/thisClassVideo.length);

                                        let publicInfo = {
                                            department: userinfo.department,
                                            email: userinfo.email,
                                            name: userinfo.name,
                                            schoolname: userinfo.schoolname,
                                            studentid: userinfo.studentid,
                                            username: userinfo.username,
                                            thisClassTests: thisClassTests,
                                            userSubmitTest: thisUserSubmitTest,
                                            totalWatchVideo: totalWatchVideo,
                                            thisClassVideo: thisClassVideo,
                                            classinfo: classinfo
                                        }
                                        res.json(publicInfo)
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
})
router.post('/sendEmail', function (req, res) {
    let title = req.body.title;
    let sender = req.body.sender;
    let recever = req.body.recever.split(',');
    let body = req.body.body;
    for (let i = 0; i < recever.length; i++) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'nkust.online.study@gmail.com',
                pass: 'kkc060500'
            }
        });
        //console.log(student.email);
        var mailOptions = {
            from: sender,
            to: recever[i],
            subject: title,
            text: body
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                res.sendStatus(500)
            } else {
                res.sendStatus(200)
            }
        });
    }
})

//delete 程式題
router.post('/deletCodingQution/:qutionID', function (req, res) {
    CodingQution.remove({ _id: req.params.qutionID }, function (err) {
        if (err) {
            console.log(err);
            res.send('{"error" : "刪除失敗", "status" : 500}');
        } else {
            res.send('{"success" : "儲存成功"}');
        }
    })
})


//顯示所有有修這堂課的學生
router.get('/getStudentInClass/:classID', function (req, res) {
    Class.findById(req.params.classID, function (error, classinfo) {
        StudebtTakeCourse.find({
            classID: req.params.classID
        }, function (err, students) {
            if (err) {
                console.log(err);
            }
            let findStudentInfoQuery = [];
            for (let i = 0; i < students.length; i++) {
                findStudentInfoQuery.push(ObjectID(students[i].studentID).toString());

            }
            User.find({
                _id: findStudentInfoQuery
            }, function (err, users) {
                if (err) {
                    console.log(err);
                }
                let find = [];
                for (let j = 0; j < students.length; j++) {
                    for (let z = 0; z < students.length; z++) {
                        if (users[z] != undefined) {
                            if (findStudentInfoQuery[j] == users[z]._id) {
                                find.push(users[z]).toString();
                            }
                        }
                    }
                }
                res.json({ users: find })
            });
        })
    })
});

//Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', '請先登入');
        res.redirect('/users/login');
    }
}

module.exports = router;
