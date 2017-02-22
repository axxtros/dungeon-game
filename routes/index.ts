
var async = require('async');
var dbModule = require('../modules/db');
//var db2 = require('../modules/db2');
import * as appControl from "../modules/application";
import * as webLabelDAO from "../modules/webPageLabelsDAO";

import * as storage from "../modules/storage";

exports.index = function (req, res) {      

    var databaseControl = new dbModule.DatabaseControlNameSpace.DBControl();
    //let appCtrl = new appControl.DatabaseControlNameSpace.ApplicationClass();

    //console.log('@index.ts');

    //for (let item in appCtrl._testArray) {
    //    console.log('@appCtrl._testArray: ' + appCtrl._testArray[item]);
    //}

    async.parallel({

        //hagyományos js-es megoldás
        /*
        func_prog_name: function asyncParallalDbGetProgName(callback) {            
            db2.getProgramName(function getProgramProgNameCallback(err, result) {
                callback(err, result);
            });
        },
        */

        func_prog_name: function asyncParallalDbGetProgName(callback) {            
            databaseControl.getProgramName(function getProgramProgNameCallback(err, result) {
                callback(err, result);
            });
        },
                
        func_prog_ver: function asyncParallalDbGetProgName(callback) {                        
            databaseControl.getProgramVersion(function getProgramProgNameCallback(err, result) {                
                callback(err, result);
            });
        },

    }, function asyncParallalResulthandler(err, results) {
        if (err) {
            res.send(err);
        } else {    

            setTimeout(function () {

                //res.redirect('/game');      //amíg a fejlesztés tart, hogy ne keljen manuálisan a linkre kattintani, majd szedd ki :) -> (2017.01.05.)

                res.render('index.ejs', {
                    program_name: webLabelDAO.WebpageLabelsNameSpace.WebPageLabels.PROGRAM_NAME,
                    program_version: webLabelDAO.WebpageLabelsNameSpace.WebPageLabels.PROGRAM_VERSION,
                    program_developer: webLabelDAO.WebpageLabelsNameSpace.WebPageLabels.PROGRAM_DEVELOPER
                    //program_name: results.func_prog_name,
                    //program_version: results.func_prog_ver,                                        
                    //test_a: appCtrl._testArray[0],
                    //t_array: appCtrl._testArray,
                    //developer: storage.DataStorageNameSpace.BaseClass.pageData[2].value
                });
                
            }, 1000);

            //setTimeout(function () {
            //    res.redirect('/game');            
            //}, 1000);
        }
    });
    
    //res.render('index', { progName: 'Dungeon Game', szam: v.kiir(1) });
};

