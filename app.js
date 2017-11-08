var express = require('express');//익스프레스를 가져옴
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var expressSession = require('express-session')
var multer = require('multer');//업로드를 위한 multer를 가져옴
var fs = require('fs');
var http = require('http');
var path = require('path');
var app = express();
var mime = require('mime');

var audioMerge = require('./src/audioMerge.js');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ storage: storage }).any());

app.post('/process/photo', function (req, res) {

    var files = req.files;
    //현재의 파일 정보를 저장할 변수 선언
    var originalname = '', name = '', mimetype = '', size = 0;
    var fileNames = [];
    const path = './uploads/'

    if (Array.isArray(files)) {
        console.log('배열에 들어 있는 파일 개수: %d', files.length);

        for (var index = 0; index < files.length; index++) {
            originalname = files[index].originalname;
            name = files[index].name;
            mimetype = files[index].mimetype;
            size = files[index].size;
            fileNames.push(path + originalname);
        }
    } else {
        console.log('파일개수:1');

        originalname = files[index].originalname;
        name = files[index].name;
        mimetype = files[index].mimetype;
        size = files[index].size;
        fileNames.push(path + originalname);
    }
    console.log('현재의 파일 정보:' + originalname + ',' + name + ',' + mimetype + ',' + size);
    audioMerge.merge(req, res, fileNames);
})

app.get('/wait', function (req, res) {
    res.send('Wait');
});

app.get('/success', function (req, res) {
    res.render('success');
});

app.get('/download/:id', function (req, res) {

    var id = req.params.id;
    var file = './results/result.mp3';
    if (id != '1') {
        file = './results/result.json';
    }

    filename = path.basename(file), mimetype = mime.getType(file);
    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);

    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
});

app.get('/', function (req, res) {
    res.send('Hello World!');
});


http.createServer(app).listen( process.env.PORT || app.get('port'), function () {
    console.log('Server Start Port ' + app.get('port'));
});