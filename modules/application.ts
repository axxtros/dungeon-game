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
            console.log('@ ApplicationClass constructor');
            this.getPageDatas();
        }

        private getPageDatas(): void {            
            console.log('@ ApplicationClass getPageDatas()');
            //this.pageData = new Array();

            //if (this.testArray === 'undefined') {
                this.testArray = new Array();
                this.testArray.push('b1');
                this.testArray.push('b2');

            //}

            for (let e in this.testArray) {
                console.log('@ggg' + ' ' + this.testArray[e]);
            }

            /*
            async.parallel({

                func_prog_name: function asyncParallalDbGetProgName(callback) {
                    dbCtrl.getProgramName(function getProgramProgNameCallback(err, result) {
                        callback(err, result);
                    });
                },

                func_prog_ver: function asyncParallalDbGetProgName(callback) {
                    dbCtrl.getProgramVersion(function getProgramProgNameCallback(err, result) {
                        callback(err, result);
                    });
                },

            }, function asyncParallalResulthandler(err, results) {
                if (err) {
                    console.log('ERROR');
                } else {
                    //this.pageData.push({ "key": "PROGRAM_NAME", "value": results.func_prog_name });
                    //this.pageData.push({ "key": "PROGRAM_VERSION", "value": results.func_prog_ver });

                    //this.a.push('egy');
                    //this.a.push('kettő');                    

                }
            });
            */
        }

        async function valamitLehoz() {
            try {
                let data = await function asyncParallalDbGetProgName(callback) {
                    dbCtrl.getProgramName(function getProgramProgNameCallback(err, result) {
                        callback(err, result);
                    });
                };
                console.log('@data: ' + data);
            } catch (err) {
                console.log(err);
            }
        }

        public get pageDataArray(): any[] {            
            //this.getPageDatas();

            for (let e in this.pageData) {
                console.log('@mmm' + e.toString() + ' ' + this.pageData[e].key + ' ' + this.pageData[e].value);
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