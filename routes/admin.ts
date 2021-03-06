﻿
var app = require('../app');
//var session = require('express-session');
var fs = require('fs');
var path = require('path');
var async = require('async');

import * as webLabelDAO from "../modules/webPageLabelsDAO";
import * as objFileControl from "../modules/ObjFileControl";
import * as object3d from "../modules/Object3D";
import * as glStorage from "../modules/GLStorage";
import * as globject3D from "../modules/GLObject3D";
import * as util from "../modules/Util";
import * as appcons from "../modules/AppConstans";

//app.use(express.bodyParser());              //ez fontos, az upload file miatt, hogy lássa a file-t
//app.use(express.cookieParser('secret'));    //ez kell a session miatt
//app.use(express.cookieSession());

var loaded3D: object3d.Object3D;
var objFileControlClass = new objFileControl.ObjFileControl();

var objFileUploaderMsgText = "";
var objFileUploaderMsgColor = "";
var objFileUploaderBlockDispaly = 'none';
var objFileUploaderBlockSymbol = appcons.AppConstans.OPEN_PANEL_SYMBOL;

var objLoaderMsgText = "";
var objLoaderMsgColor = "";
var objLoaderBlockDispaly = 'none';
var objLoaderBlockSymbol = appcons.AppConstans.OPEN_PANEL_SYMBOL;

//admin menüpontok panel vezérlése
app.post('/adminPanelOpenCloseAction', function (req, res) {    
    if (req.body.panelName != null) {
        switch (req.body.panelName) {
            case 'objectfileuploaderdiv':
                objFileUploaderBlockDispaly == 'none' ? objFileUploaderBlockDispaly = 'block' : objFileUploaderBlockDispaly = 'none';
                objFileUploaderBlockSymbol == appcons.AppConstans.OPEN_PANEL_SYMBOL ? objFileUploaderBlockSymbol = appcons.AppConstans.CLOSE_PANEL_SYMBOL : objFileUploaderBlockSymbol = appcons.AppConstans.OPEN_PANEL_SYMBOL;
                break;
            case 'objectloaderdiv':
                objLoaderBlockDispaly == 'none' ? objLoaderBlockDispaly = 'block' : objLoaderBlockDispaly = 'none';
                objLoaderBlockSymbol == appcons.AppConstans.OPEN_PANEL_SYMBOL ? objLoaderBlockSymbol = appcons.AppConstans.CLOSE_PANEL_SYMBOL : objLoaderBlockSymbol = appcons.AppConstans.OPEN_PANEL_SYMBOL;
                break;
        }
    }
    res.redirect('/admin');
});

//obj állomány feltöltése
app.post('/objFileuploadAction', function (req, res) {
    //https://www.hacksparrow.com/handle-file-uploads-in-express-node-js.html
    //console.log('@req.body: ' + req.body.toString());
    //console.log('@req.files: ' + req.files.toString());

    objFileUploaderMsgText = "";   

    if (!util.Util.checkFileExtension(req.files.uploadedFileName.originalFilename, 'obj')) {
        objFileUploaderMsgText = appcons.AppConstans.ADMIN_OBJ_UPLOAD_FILE_EXTENSION_ERR_MSG;
    } else {
        //ha nincs benne az 'utf-8' paraméter, akkor a szimpla (nyers) buffer tartalmat hozza fel, ezért kell a kódolás
        fs.readFile(req.files.uploadedFileName.path, "utf-8", function (err, data) {    //a files után az input name attributum értékét kell betenni
            if (err) {
                objFileUploaderMsgText = appcons.AppConstans.ADMIN_OBJ_UPLOAD_FILE_EXPECT_ERR_MSG;
                throw err;
            }
            // data will contain your file contents
            //console.log(data);            
            //http://stackoverflow.com/questions/16732166/read-txt-files-lines-in-js-node-js
            var fileContent = data.toString().split('\n');
            var objFileControlClass = new objFileControl.ObjFileControl();
            objFileUploaderMsgText = objFileControlClass.objFileParser(fileContent);
        });
    }
    objFileUploaderBlockDispaly = 'block';
    res.redirect('/admin');
});

//obj állomány betöltése
app.post('/objloaderAction', function (req, res) {
    var objectId = req.body.object3DIdField;
    try {
        objFileControlClass.get3DObject(Number(objectId));

        //objFileControlClass.getGL3DObject(objectId);

    } catch(err) {
        console.log(err.message);
    }
    objLoaderBlockDispaly = 'block';    
    res.redirect('/admin');    
});

exports.admin = function (req, res, next) {
    //var sess1 = req.session;
    console.log('@admin username: ' + req.session.username);    //session változó kiolvasása        

    //obj uploader result message
    objFileUploaderMsgColor = util.Util.getLayoutMessageColor(objFileUploaderMsgText);
    objFileUploaderMsgText = util.Util.getLayoutMessage(objFileUploaderMsgText);
    objLoaderMsgColor = util.Util.getLayoutMessageColor(objLoaderMsgColor);
    objLoaderBlockSymbol = util.Util.getLayoutMessage(objLoaderBlockSymbol);

    res.render('admin.ejs', {
        program_name: webLabelDAO.WebpageLabelsNameSpace.WebPageLabels.PROGRAM_NAME,
        program_version: webLabelDAO.WebpageLabelsNameSpace.WebPageLabels.PROGRAM_VERSION,
        program_developer: webLabelDAO.WebpageLabelsNameSpace.WebPageLabels.PROGRAM_DEVELOPER,
        //obj file uploader block
        upload_obj_file_block_label: appcons.AppConstans.ADMIN_OBJ_UPLOAD_MENU_LABEL,
        upload_obj_file_block_msg_color: objFileUploaderMsgColor,
        upload_obj_file_block_msg_text: objFileUploaderMsgText,
        upload_obj_file_block_display: objFileUploaderBlockDispaly,
        upload_obj_file_block_symbol: objFileUploaderBlockSymbol,
        //obj loader
        obj_loader_block_label: appcons.AppConstans.OBJ_LOADER_MENU_LABEL,
        obj_loader_msg_color: objLoaderMsgColor,
        obj_loader_msg_text: objLoaderMsgText,
        obj_loader_block_display: objLoaderBlockDispaly,
        obj_loader_block_symbol: objLoaderBlockSymbol,
        loaded_3d: /*loaded3D != null ? loaded3D :*/ objFileControlClass.getLoaded3DObject()
    });
}