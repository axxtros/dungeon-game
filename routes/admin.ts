
var app = require('../app');
//var session = require('express-session');
var fs = require('fs');
var path = require('path');

import * as webLabelDAO from "../modules/webPageLabelsDAO";
import * as objFileParser from "../modules/ObjFileParser";
import * as util from "../modules/Util";

//app.use(express.bodyParser());              //ez fontos, az upload file miatt, hogy lássa a file-t
//app.use(express.cookieParser('secret'));    //ez kell a session miatt
//app.use(express.cookieSession());

var error_msg_upload_obj_file = "";
var succ_msg_upload_obj_file = "";
var display_upload_obj_file_block = 'none';

app.post('/uploadfile', function (req, res) {
    //https://www.hacksparrow.com/handle-file-uploads-in-express-node-js.html
    //console.log('@req.body: ' + req.body.toString());
    //console.log('@req.files: ' + req.files.toString());
    
    if (!util.Util.checkFileExtension(req.files.uploadedFileName.originalFilename, 'obj')) {
        error_msg_upload_obj_file = 'A feltöltött állomány nem obj kiterjesztésű, ezért nem tölthető fel!';
    } else {
        //ha nincs benne az 'utf-8' paraméter, akkor a szimpla (nyers) buffer tartalmat hozza fel, ezért kell a kódolás
        fs.readFile(req.files.uploadedFileName.path, "utf-8", function (err, data) {    //a files után az input name attributum értékét kell betenni
            if (err) {
                error_msg_upload_obj_file = "A feltöltés során váratlan hiba lépett fel!";
                throw err;
            }
            // data will contain your file contents
            //console.log(data);            
            //http://stackoverflow.com/questions/16732166/read-txt-files-lines-in-js-node-js
            var fileContent = data.toString().split('\n');
            //console.log(fileContent);
            var objFileParderClass = new objFileParser.ObjFileParser(fileContent);
            succ_msg_upload_obj_file = "Feltöltés sikeres!";
        });
    }
    display_upload_obj_file_block = 'block';
    res.redirect('/admin');
});

exports.admin = function (req, res, next) {
    //var sess1 = req.session;
    console.log('@admin username: ' + req.session.username);    //session változó kiolvasása

    res.render('admin.ejs', {
        program_name: webLabelDAO.WebpageLabelsNameSpace.WebPageLabels.PROGRAM_NAME,
        program_version: webLabelDAO.WebpageLabelsNameSpace.WebPageLabels.PROGRAM_VERSION,
        program_developer: webLabelDAO.WebpageLabelsNameSpace.WebPageLabels.PROGRAM_DEVELOPER,
        //obj file uploader block control
        error_msg_upload_obj: error_msg_upload_obj_file,
        succ_msg_upload_obj: succ_msg_upload_obj_file,
        block: display_upload_obj_file_block
    });
}