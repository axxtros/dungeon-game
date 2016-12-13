
var async = require('async');
var db = require('../modules/db');
var db2 = require('../modules/db2');


exports.index = function (req, res) {      


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
            let dbObject = new db.TestNameSpace.TestClass();
            dbObject.getProgramName(function getProgramProgNameCallback(err, result) {
                callback(err, result);
            });
        },
        
        
        func_prog_ver: function asyncParallalDbGetProgName(callback) {
            console.log('@db1 1');
            let dbObject = new db.TestNameSpace.TestClass();
            dbObject.getProgramVersion(function getProgramProgNameCallback(err, result) {
                console.log('@db1 2');
                callback(err, result);
            });
        },
                

    }, function asyncParallalResulthandler(err, results) {
        if (err) {
            res.send(err);
        } else {
            let v = new db.TestNameSpace.TestClass();
            res.render('index', { progName: results.func_prog_name, version: results.func_prog_ver });
        }
    });


    //let v = new db.TestNameSpace.TestClass();
    //res.render('index', { progName: 'Dungeon Game', szam: v.kiir(1) });
};

