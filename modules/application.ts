/*
 * Applikációs modul, amely központilag tartalmaz minden adatot, amelyet egy adott weboldaon meg kell jeleníteni.
 * 13/12/2016
 */

export namespace DatabaseControlNameSpace {

    var async = require('async');
    var dbModule = require('../modules/db');
    var databaseControl = new dbModule.DatabaseControlNameSpace.DBControl();

    var pageData: { key: string, value: string }[] = [
        { "key": "-", "value" : "-"}
    ];

    export class ApplicationClass {        
        
        constructor() {
            console.log('@ ApplicationClass constructor');
            async.parallel({

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
                    console.log('ERROR');
                } else {                    
                    pageData.push({ "key": "PROGRAM_NAME", "value": results.func_prog_name });
                    pageData.push({ "key": "PROGRAM_VERSION", "value": results.func_prog_ver });
                }
            });
        }
        
        get pageData(): any {            
            return this.pageData;            
        }        

    }

}