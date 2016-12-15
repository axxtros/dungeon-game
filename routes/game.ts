
import express = require('express');

var router = express.session(); //Router();
var app = express();

var async = require('async');
//var appModule = require('../modules/application');


import * as appControl from "../modules/application";

exports.game = function (req, res, next) {
    
    //var pageDataObj = new appModule.DatabaseControlNameSpace.ApplicationClass();    
    let appCtrl = new appControl.DatabaseControlNameSpace.ApplicationClass();

    console.log('@game.ts');    

    for (let item in appCtrl.aArray)
    {
        console.log('@appCtrl.aArray: ' + appCtrl.aArray[item]);
    }

    /*
    for (let item in appCtrl.pageDataArray) {
        console.log('@appCtrl pageDataArray' + appCtrl.pageDataArray[item].key + ' ' + appCtrl.pageDataArray[item].value);
    }
    */

    res.render('game.ejs', { test_a: appCtrl.aArray[0], t_array: appCtrl.aArray });
    
    
    
}
