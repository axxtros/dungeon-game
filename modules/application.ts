/*
 * Applikációs modul, amely központilag tartalmaz minden adatot, amelyet egy adott weboldaon meg kell jeleníteni.
 * 13/12/2016
 */

import * as databaseControl from "../modules/db";

export namespace DatabaseControlNameSpace {

    var async = require('async');    
    var dbCtrl = new databaseControl.DatabaseControlNameSpace.DBControl();


    export class ApplicationClass {                
   
        private dbCtrl :databaseControl.DatabaseControlNameSpace.DBControl;
        private testArray: Array<string>;   // = ['element 0', 'element 2'];

        //ez most nincs használva
        private pageData: { key: string, value: string }[] = [
            { "key": "-..-", "value": "..-.." }
        ];        

        constructor() {            
            console.log('@ApplicationClass constructor');
            this.pageDataLoader();
        }

        private pageDataLoader(): void {            
            console.log('@ApplicationClass pageDataLoader()');            
            this.testArray = new Array();
            this.testArray.push('element 1');
            this.testArray.push('element 2');

            //ez működik
            for (let i = 3; i != 6; i++) {
                this.testArray.push('element ' + i);
            }
            
            for (let item in this.testArray) {
                console.log('@testArray: ' + ' ' + this.testArray[item]);
            }

            //ez működik, de a GET után fut le
            let pr_name = dbCtrl.getProgramName(function getPrName(err, result) {            
                console.log('@getProgName: ' + result);
                //this.testArray.push('element' + result);               
            });            
            
            //ez működik, de a GET után fut le
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
                    //this.testArray.push('egy');
                    //this.testArray.push('kettő');
                }
            });            
        }                

        //getters/setters

        public set _testArray(_a: string[]) {
            this.testArray = _a;
        }

        public get _testArray(): string[] {
            return this.testArray;
        }

    }
}