
import express = require('express');

var router = express.session(); //Router();
var app = express();
var async = require('async');
//var appModule = require('../modules/application');

//import * as appControl from "../modules/application";
import * as storage from "../modules/storage";

exports.game = function (req, res, next) {

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

    res.render('game.ejs', { GAME_PAGE: 'GAME PAGE', pr_developer: storage.DataStorageNameSpace.BaseClass.pageData[0] });
    
}
