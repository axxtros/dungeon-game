
var app = require('../app');
//var session = require('express-session');
var fs = require('fs');

import * as webLabelDAO from "../modules/webPageLabelsDAO";

//app.use(express.bodyParser());              //ez fontos, az upload file miatt, hogy lássa a file-t
//app.use(express.cookieParser('secret'));    //ez kell a session miatt
//app.use(express.cookieSession());

var fileProperties = "";

app.post('/uploadfile', function (req, res) {
    //https://www.hacksparrow.com/handle-file-uploads-in-express-node-js.html
    console.log(req.body);
    console.log(req.files);

    //ha nincs benne az 'utf-8' paraméter, akkor a szimpla (nyers) buffer tartalmat hozza fel, ezért kell a kódolás
    fs.readFile(req.files.uploadedFileName.path, "utf-8", function (err, data) {    //a files után az input name attributum értékét kell betenni
        if (err) throw err;
        // data will contain your file contents
        console.log(data);
        fileProperties = data;

        //http://stackoverflow.com/questions/16732166/read-txt-files-lines-in-js-node-js
        var array = data.toString().split('\n');
        console.log(array);
    });
    res.redirect('/admin');
});

exports.admin = function (req, res, next) {
    //var sess1 = req.session;
    console.log('@admin username: ' + req.session.username);    //session változó kiolvasása

    res.render('admin.ejs', {
        program_name: webLabelDAO.WebpageLabelsNameSpace.WebPageLabels.PROGRAM_NAME,
        program_version: webLabelDAO.WebpageLabelsNameSpace.WebPageLabels.PROGRAM_VERSION,
        program_developer: webLabelDAO.WebpageLabelsNameSpace.WebPageLabels.PROGRAM_DEVELOPER,
        file_properites: fileProperties.split('\r\n')
    });
}