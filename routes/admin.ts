
var app = require('../app');
//var session = require('express-session');
var fs = require('fs');
var path = require('path');

import * as webLabelDAO from "../modules/webPageLabelsDAO";
import * as objFileParser from "../modules/ObjFileParser";
import * as util from "../modules/Util";
import * as appcons from "../modules/AppConstans";

//app.use(express.bodyParser());              //ez fontos, az upload file miatt, hogy lássa a file-t
//app.use(express.cookieParser('secret'));    //ez kell a session miatt
//app.use(express.cookieSession());

var display_upload_obj_file_block = 'none';
var objFileUploaderMsg = "";
var objFileUploaderMsgColor = "";

app.post('/uploadfile', function (req, res) {
    //https://www.hacksparrow.com/handle-file-uploads-in-express-node-js.html
    //console.log('@req.body: ' + req.body.toString());
    //console.log('@req.files: ' + req.files.toString());

    objFileUploaderMsg = "";   

    if (!util.Util.checkFileExtension(req.files.uploadedFileName.originalFilename, 'obj')) {
        objFileUploaderMsg = appcons.AppConstans.ADMIN_OBJ_UPLOAD_FILE_EXTENSION_ERR_MSG;
    } else {
        //ha nincs benne az 'utf-8' paraméter, akkor a szimpla (nyers) buffer tartalmat hozza fel, ezért kell a kódolás
        fs.readFile(req.files.uploadedFileName.path, "utf-8", function (err, data) {    //a files után az input name attributum értékét kell betenni
            if (err) {
                objFileUploaderMsg = appcons.AppConstans.ADMIN_OBJ_UPLOAD_FILE_EXPECT_ERR_MSG;
                throw err;
            }
            // data will contain your file contents
            //console.log(data);            
            //http://stackoverflow.com/questions/16732166/read-txt-files-lines-in-js-node-js
            var fileContent = data.toString().split('\n');
            var objFileParderClass = new objFileParser.ObjFileParser();
            objFileUploaderMsg = objFileParderClass.objFileParser(fileContent);
        });
    }
    display_upload_obj_file_block = 'block';    
    res.redirect('/admin');
});

exports.admin = function (req, res, next) {
    //var sess1 = req.session;
    console.log('@admin username: ' + req.session.username);    //session változó kiolvasása

    //obj uploader result message
    objFileUploaderMsgColor = util.Util.getLayoutMessageColor(objFileUploaderMsg);
    objFileUploaderMsg = util.Util.getLayoutMessage(objFileUploaderMsg);

    res.render('admin.ejs', {
        program_name: webLabelDAO.WebpageLabelsNameSpace.WebPageLabels.PROGRAM_NAME,
        program_version: webLabelDAO.WebpageLabelsNameSpace.WebPageLabels.PROGRAM_VERSION,
        program_developer: webLabelDAO.WebpageLabelsNameSpace.WebPageLabels.PROGRAM_DEVELOPER,
        //obj file uploader block control
        msg_color: objFileUploaderMsgColor,
        msg_text: objFileUploaderMsg,
        block: display_upload_obj_file_block
    });
}