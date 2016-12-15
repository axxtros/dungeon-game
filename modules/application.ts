/*
 * Applikációs modul, amely központilag tartalmaz minden adatot, amelyet egy adott weboldaon meg kell jeleníteni.
 * 13/12/2016
 */

//import * as _ from '../modules/db';
import * as databaseControl from "../modules/db";

export namespace DatabaseControlNameSpace {

    var async = require('async');
    //var dbModule = require('../modules/db');    
    //var databaseControl = new dbModule.DatabaseControlNameSpace.DBControl();
    var dbCtrl = new databaseControl.DatabaseControlNameSpace.DBControl();

    /*
    var pageData: { key: string, value: string }[] = [
        { "key": "-", "value": "-" }
    ];
    */

    export class ApplicationClass {                

        //private dbModule = require('../modules/db');    
        private dbCtrl :databaseControl.DatabaseControlNameSpace.DBControl;

        private testArray: Array<string> = ['a1', 'a2'];

        private pageData: { key: string, value: string }[] = [
            { "key": "-..-", "value": "..-.." }
        ];        

        constructor() {
            //this.dbCtrl = new databaseControl.DatabaseControlNameSpace.DBControl();
            console.log('@ApplicationClass constructor');
            this.dataDownloader();
        }

        private dataDownloader(): void {            
            console.log('@ApplicationClass dataDownloader()');
            
            this.testArray = new Array();
            this.testArray.push('element1');
            this.testArray.push('element2');
            
            for (let item in this.testArray) {
                console.log('@testArray: ' + ' ' + this.testArray[item]);
            }

            async.parallel({                
                func_prog_name: function asyncParallalDbGetProgName(callback) {
                    dbCtrl.getProgramName(function getProgramProgNameCallback(err, result) {
                        console.log('@async 1');
                        callback(err, result);
                    });
                },

                func_prog_ver: function asyncParallalDbGetProgName(callback) {
                    dbCtrl.getProgramVersion(function getProgramProgNameCallback(err, result) {
                        console.log('@async 2');
                        callback(err, result);
                    });
                },

            }, function asyncParallalResulthandler(err, results) {
                if (err) {
                    console.log('@async 3 - ERROR');                    
                } else {
                    console.log('@async 4 - OK');
                    //this.pageData.push({ "key": "PROGRAM_NAME", "value": results.func_prog_name });
                    //this.pageData.push({ "key": "PROGRAM_VERSION", "value": results.func_prog_ver });
                    //this.a.push('egy');
                    //this.a.push('kettő');
                }
            });
            
        }

        public valamitLehoz(): void {
            try {
                
            } catch (err) {
                console.log(err);
            }
        }

        public get pageDataArray(): any[] {            
            console.log('@ApplicationClass pageDataArray()');            

            for (let item in this.pageData) {
                console.log('@pageData: ' + this.pageData[item].key + ' ' + this.pageData[item].value);
            }

            return this.pageData;            
        }

        public set aArray(_a: string[]) {
            this.testArray = _a;
        }

        public get aArray(): string[] {
            return this.testArray;
        }

    }

}