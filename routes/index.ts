
var async = require('async');
var dbModule = require('../modules/db');
//var db2 = require('../modules/db2');


exports.index = function (req, res) {      

    let databaseControl = new dbModule.DatabaseControlNameSpace.DBControl();

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
            res.render('index', {
                program_name: results.func_prog_name,
                program_version: results.func_prog_ver

            });
        }
    });
    
    //res.render('index', { progName: 'Dungeon Game', szam: v.kiir(1) });
};

