
const fs = require("fs");
const path = require("path");
const mime = require("mime");

exports.merge = function (req, res, files) {
    var audiosprite = require('audiosprite');
    var opts = { output: './results/result', gap: 0.5, export: 'mp3', channels:2, bitrate:64, format:'createjs' };

    audiosprite(files, opts, function (err, obj) {
        if (err) return console.error(err);

        console.log(JSON.stringify(obj, null, 2))

        let strJson = JSON.stringify(obj, null, 2)
        exportJson(req, res, strJson);
    });
}

exportJson = function (req, res, strJson) {
    console.log("Going to write into existing file");
    fs.writeFile('./results/result.json', strJson, function (err) {
        if (err) {
            return console.error(err);
        }

        console.log("Data written successfully!");
        console.log("Let's read newly written data");

        fs.readFileSync('./results/result.json', function (err, data) {
            if (err) {
                return console.error(err);
            }
            console.log("Asynchronous read: " + data.toString());
        })

        downloadResults(req, res);
    });
}

downloadResults = function (req, res) {

    const mp3FilePath = './results/result.mp3';
    const jsonFilePath = './results/result.json';

    filename = path.basename(mp3FilePath), mimetype = mime.getType(mp3FilePath);
    res.send( mp3FilePath );
    removeFolders();
};

removeFolders = function()
{
    const directory = 'uploads';
    fs.readdir(directory, (err, files) => {
      if (err) throw err;
    
      for (const file of files) {
        fs.unlink(path.join(directory, file), err => {
          if (err) throw err;
        });
      }
    });
}



