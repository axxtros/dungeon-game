﻿/*
 * Applikációs modul, amely központilag tartalmaz minden adatot, amelyet egy adott weboldaon meg kell jeleníteni.
 * 13/12/2016
 */

import * as databaseControl from "../modules/db";

export namespace DatabaseControlNameSpace {

    var async = require('async');    
    //var async = require('asyncawait/async');
    //var await = require('asyncawait/await');
    var dbCtrl = new databaseControl.DatabaseControlNameSpace.DBControl();

    export class ApplicationClass {                
   
        //private dbCtrl :databaseControl.DatabaseControlNameSpace.DBControl;
        private testArray: Array<string>;   // = ['element 0', 'element 2'];

        //ez most nincs használva
        private pageData: { key: string, value: string }[] = [
            { "key": "-..-", "value": "..-.." }
        ];        

        constructor() {            
            console.log('@ApplicationClass constructor');
            this.testArray = new Array();
            this.pageDataLoader();
        }

        private pageDataLoader(): void {            
            console.log('@ApplicationClass pageDataLoader()');                        
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
                //this.addValue(result);
                //this.testArray.push('element' + result);               
                //callback(err, result);
            });

            console.log('@pr_name: ' + pr_name);

            //ez működik, de a GET után fut le
            async.parallel({                
                /*
                init: function asyncParallalDbGetProgName(callback) {
                    setTimeout(function () {
                        let testArray2: Array<string>;
                        testArray2 = new Array();
                        testArray2.push('egy');
                        console.log('@async 0_1: ' + testArray2[0]);
                        callback();
                    }, 2000);
                },
                */
                func_prog_name: function asyncParallalDbGetProgName(callback) {
                    dbCtrl.getProgramName(function getProgramProgNameCallback(err, result) {
                        console.log('@async 1');
                        //callback(err, result);
                        setTimeout(function () {
                            callback(err, result);
                        }, 2000);
                    });
                },

                func_prog_ver: function asyncParallalDbGetProgName(callback) {
                    dbCtrl.getProgramVersion(function getProgramProgNameCallback(err, result) {
                        console.log('@async 2');
                        //callback(err, result);
                        setTimeout(function () {                            
                            callback(err, result);
                        }, 2000);
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

        private addValue(svalue: string): void {
            this.testArray.push(svalue);
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