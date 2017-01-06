
import express = require('express');

var router = express.session(); //Router();
var app = express();
var async = require('async');


var server = require('http').createServer(app);
var io = require('socket.io')(server);

//var appModule = require('../modules/application');

//import * as appControl from "../modules/application";
import * as storage from "../modules/storage";
import * as webLabelDAO from "../modules/webPageLabelsDAO";
import * as socketControl from '../modules/socket';

exports.game = function (req, res, next) {    
    
    var socketEvent = new socketControl.SocketClass();

    /*
    let appCtrl = new appControl.DatabaseControlNameSpace.ApplicationClass();    
    console.log('@game.ts');    

    for (let item in appCtrl._testArray)
    {
        console.log('@appCtrl._testArray: ' + appCtrl._testArray[item]);
    }
    */
    //késleletett megoldás - működik
    /*
    setTimeout(function () {
        res.render('game.ejs', { test_a: appCtrl._testArray[0], t_array: appCtrl._testArray });
    }, 5000);
    */

    //normál megoldás, azonali render - működik
    //res.render('game.ejs', { test_a: appCtrl._testArray[0], t_array: appCtrl._testArray });

    res.render('game.ejs', {
        program_name: webLabelDAO.WebpageLabelsNameSpace.WebPageLabels.PROGRAM_NAME,
        program_version: webLabelDAO.WebpageLabelsNameSpace.WebPageLabels.PROGRAM_VERSION,
        program_developer: webLabelDAO.WebpageLabelsNameSpace.WebPageLabels.PROGRAM_DEVELOPER       
    });
    
}
