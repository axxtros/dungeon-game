
import express = require('express');

var router = express.session(); //Router();
var app = express();

var async = require('async');
//var appModule = require('../modules/application');


import * as appControl from "../modules/application";

exports.game = function (req, res, next) {
    
    //var pageDataObj = new appModule.DatabaseControlNameSpace.ApplicationClass();    
    let appCtrl = new appControl.DatabaseControlNameSpace.ApplicationClass();

    console.log('@bbb');

    for (let e in appCtrl.pageDataArray) {
        console.log('@hhh' + e.toString() + ' ' + appCtrl.pageDataArray[e].key + ' ' + appCtrl.pageDataArray[e].value);
    }

    for (let a in appCtrl.aArray)
    {
        console.log('@ooo' + appCtrl.aArray[a]);
    }

    res.render('game.ejs', { test_a: appCtrl.aArray[0] });

    
}
