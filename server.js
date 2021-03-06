const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database'); //在我們的config file裡面可以設定要用的database URL
const port = process.env.PORT || 5000;



mongoose.connect(config.database, {
   useNewUrlParser: true
});
let db = mongoose.connection;

//check connection
db.once('open', function () {
   console.log("connect to mongodb");
});
//check for db errors
db.on('error', function (err) {
   //console.log(err);
});

//init app
const app = express();


//bring video behavior model
let Videobehavior = require('./model/videobehavior');
//bring Video model
let Video = require('./model/video');

//socket.io
server = require('http').createServer(app)
io = require('socket.io').listen(server)
io.on('connection', function (socket) {
   console.log('socket connection');
   let isStart = false;
   let videobehavior = new Videobehavior();
   socket.on('videoAction', function (obj) {
      console.log(obj.type)
      if (obj.type == "open") {
         isStart = true;
         videobehavior.videoActions.push("0:0:0");
         var currentdate = new Date();
         var datetime = currentdate.getDate() + "/" +
            (currentdate.getMonth() + 1) + "/" +
            currentdate.getFullYear() + " @ " +
            currentdate.getHours() + ":" +
            currentdate.getMinutes() + ":" +
            currentdate.getSeconds();
         videobehavior.watchTime = datetime;
         videobehavior.watcherID = obj.watcherID;
         videobehavior.videoID = obj.videoID;
         Video.findById({
            _id: obj.videoID
         }, function (err, video) {
            console.log(obj);

            if (video.vtime == '' || video.vtime == '0' || video.vtime == 0) {
               let newVideo = {};
               newVideo.videoName = video.videoName;
               newVideo.videoURL = video.videoURL;
               newVideo.belongUnit = video.belongUnit;
               newVideo.vtime = obj.vtime;
               let query = {
                  _id: video._id
               }
               Video.update(query, newVideo, function (err) {
                  if (err) {
                     console.log(err);
                     return;
                  } else {
                     console.log("success");
                  }

               });
            }
         })

      }
      if (isStart) {
         if (obj.type == "play") {
            videobehavior.videoActions.push("play:" + obj.time + ":" + obj.time);
         }
         if (obj.type == "pause") {
            videobehavior.videoActions.push("pause:" + obj.time + ":" + obj.time);
         }
         if (obj.type == "fastTurn") {
            videobehavior.videoActions.push("fastTurn:" + obj.beginTime + ":" + obj.endTime);
         }
         if (obj.type == "note") {
            videobehavior.videoActions.push("note:" + obj.time + ":" + obj.time);
         }
         if (obj.type == "close") {
            videobehavior.videoActions.push("close:" + obj.time + ":" + obj.time);
            videobehavior.videoActions.push("totalWatchTime:" + obj.totalTime + ":" + obj.totalTime);
            videobehavior.save(function (err) {
               if (err) {
                  console.log("save videobehavior err:" + err);
               }
               console.log("save videobehavior success")
               console.log(videobehavior);
            });
         }
      }
   });
   socket.on("script", function (script) {
      //從伺服端拿到script的資訊
      //內容有：
      //input: "some input"
      //language: "程式語言"
      //script: "程式碼""
      console.log(script);
      console.log("--------------------");
      sendScriptToApi(script.script, script.input, script.language, socket);

   })
})

var request = require('request');

function heredoc(fn) {
   return fn.toString().split('\n').slice(1, -1).join('\n') + '\n'
}
let clientIdandSecret = [{
   clientId: "6bae7e59775c3636b4bf78cdaed7c898",
   clientSecret: "88c23aa459149f14b0bf2b1ee57b834e727f8fd612848c2290a755b83145cde2"
},
{
   clientId: "e66752ae88e8398116a9db0fabca477a",
   clientSecret: "aa1d0ee049e376efcce7f8ecc7b9de6a4a27a20b21e9d4d935c61200b73e369"
},
{
   clientId: "19dea378b4d9d32cf26fa7874fd341fa",
   clientSecret: "7ccba1aed6624fac8ad8ceffde8163c6b0f32aa867f75551dc6e885dd32bc9bf"
},
{
   clientId: "86114495714bafbab3940b911f2b2430",
   clientSecret: "4bba8244592196944b848865233437c6fd017d798ed7febc42ec2f3d4cfab3aa"
},
{
   clientId: "bcaa4f910abd2163aeea19e6af139c97",
   clientSecret: "40ae2377986d16495b5392bc9e470eb08d31f8fd42d7fe92b666dbd836a936a5"
},
{
   clientId: "b422f021917fd4123450ec85f3f128c5",
   clientSecret: "dc6435955202ae72b80dfae2fff9044c7ab3c2890bc5bfbb246a5eafd3017eef"
},
{
   clientId: "a93d50f12ef2bfd953696a982eaa07c7",
   clientSecret: "da93ea10831281027fb255bbd03d96b77f6f39266bcb400dac417fd4724edc31"
},
// fdm的
{
   clientId: "99c2672f5dce9ee9171173169c6c5fb9",
   clientSecret: "a7d1e2ea03bd4e32cd1284c17f51b94ff71c1473b38b98b53aab81138a902ea7"
},
//der的
{
   clientId: "264e6ff43435e0f0ff02a5a0ca3d5fdd",
   clientSecret: "e7fa5fe51f02c6bee8b6bd322fb2da9ca11f45d5ab9e784b804f4a200d37dcb9"
},
//全速衝線的
{
   clientId: "e14f2665b86ef91de9427aab4a4b4af4",
   clientSecret: "107e5014ae6aa0266fa197274299513146e1688e7c19035a1dc61497b2d5141e"
},
//勁豪的
{
   clientId: "89a97a9b4cca969f591bcf2c53e18ce5",
   clientSecret: "17744fd2cc7fbe37b70317d41844688a415bf0a08317535f22d7541feb1fb8ad"
},
//俊成的
{
   clientId: "e4d78f63a8cb4519300e855de8ff908c",
   clientSecret: "40e7690cd58cdfdd5252d7687b816c58c5f5a8f63948a34f0624f170f375cf97"
},
{
   clientId: "7396cf893d492bde69303506411ff238",
   clientSecret: "5f567b1102df0329c0333e3c29ca8df1231fead27ae8be5f225cd0b0127549ba"
},
{
   clientId: "4afe1a62e03936b375fcba723f89861f",
   clientSecret: "ba06a43d80b4a11d1541e3b6af11c7927f3de7ef409d062ed7a9fdc1959fdb69"
},
{
   clientId: "f2e831474c72f650e310b6d440fedadd",
   clientSecret: "f08441ab68fb62f3e4541e2d9548dea2b9558c281c3591eb5d6601d04e5d5db0"
},
{
   clientId: "af80fb1ac4ca88d689e09726c5f92a98",
   clientSecret: "3266b028edb3183330d5f7f5f076ad478a5dde8bca633c6f8e76d19c0c268e4c"
},
]
let indexOfAPIkey = Math.floor(Math.random() * clientIdandSecret.length)
var sendScriptToApi = function (script, input, language, socket) {

   var program = {
      stdin: input,
      script: script,
      language: language,
      versionIndex: "0",
      clientId: clientIdandSecret[indexOfAPIkey].clientId,
      clientSecret: clientIdandSecret[indexOfAPIkey].clientSecret
   };


   var answer = {
      error: "",
      statusCode: "",
      body: ""
   }
   request({
      url: 'https://api.jdoodle.com/execute',
      method: "POST",
      json: program
   },
      function (error, response, body) {
         answer.error = error;
         answer.statusCode = response;
         answer.body = body;


         socket.emit('answer', answer);
      });
}
//-------------------編譯程式

//bring in models
let Article = require('./model/article');
//Bring in User Model
let User = require('./model/user');

// Body parse middleware
app.use(bodyParser.urlencoded({
   extended: false
}));
app.use(bodyParser.json({ limit: '50mb' }));

//Set public folder static
app.use(express.static(path.join(__dirname, 'public')));

//Express Session Middleware
app.use(session({
   secret: 'keyboard cat',
   resave: true,
   saveUninitialized: true
}));

//Express Message Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
   res.locals.messages = require('express-messages')(req, res);
   next();
});

//Express Valudator Middleware
app.use(expressValidator());

//Passport Config
require('./config/passport')(passport);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


//設定一個user的全域變數 "*"代表所有route
app.get('*', function (req, res, next) {
   res.locals.user = req.user || null;
   next();
});

//Home Route
app.get('/', ensureAuthenticated, function (req, res) {
   Article.find({}, function (err, articles) {

      if (err) {
         console.log(err);
      } else {
         res.render('index');
      }

   });
});

//Bring in Route file
let articles = require('./routes/articles');
let users = require('./routes/users');
let Class = require('./routes/class');
let backend = require('./routes/backend');
let SDC = require('./routes/SDC');
let coding = require('./routes/coding');
let uploader = require('./routes/uploader');
let API = require('./routes/API');
let school = require('./routes/school');
app.use('/articles', articles);
app.use('/users', users);
app.use('/class', Class);
app.use('/backend', backend);
app.use('/SDC', SDC);
app.use('/coding', coding);
app.use('/uploader', uploader);
app.use('/api', API);
app.use('/school', school);
//start server
server.listen(port, function () {
   console.log("Server started on port" + port);
})


//Access Control
function ensureAuthenticated(req, res, next) {
   if (req.isAuthenticated()) {
      return next();
   } else {
      req.flash('danger', '請先登入！');
      res.redirect('/users/login');
   }
}