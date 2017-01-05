/*
 * Applikációs modul, amely központilag tartalmaz minden adatot, amelyet egy adott weboldaon meg kell jeleníteni.
 * 13/12/2016
 */

import * as databaseControl from "../modules/db";
import * as storage from "../modules/storage";
import * as webLabelDAO from "../modules/webPageLabelsDAO";

export namespace DatabaseControlNameSpace {

    var async = require('async');    
    //var async = require('asyncawait/async');
    //var await = require('asyncawait/await');
    var dbCtrl = new databaseControl.DatabaseControlNameSpace.DBControl();
    //var webPageDbCtrl = new databaseControl.DatabaseControlNameSpace.WebPageDatas();
    var webData = new storage.DataStorageNameSpace.WebPageDataStorage();    

    export class ApplicationClass {                
   
        //private dbCtrl :databaseControl.DatabaseControlNameSpace.DBControl;
        private testArray: Array<string>;   // = ['element 0', 'element 2'];

        //ez most nincs használva
        private pageData: { key: string, value: string }[] = [
            { "key": "-..-", "value": "..-.." }
        ];        

        constructor() {            
            //console.log('@ApplicationClass constructor');
            //this.testArray = new Array();
            //this.pageData.push({ key: 'aaa', value: 'bbb' });
            this.pageDataLoader();
        }

        private pageDataLoader(): void {            
            //console.log('@ApplicationClass pageDataLoader()');                        
            //this.testArray.push('element 1');
            //this.testArray.push('element 2');

            //ez működik
            //for (let i = 3; i != 6; i++) {
            //    this.testArray.push('element ' + i);
            //}
            
            //for (let item in this.testArray) {
            //    console.log('@testArray: ' + ' ' + this.testArray[item]);
            //}

            //ez működik, de a GET után fut le
            //let pr_name = dbCtrl.getProgramName(function getPrName(err, result) {            
            //    console.log('@getProgName: ' + result);
            //    //this.addValue(result);
            //    //this.testArray.push('element' + result);               
            //    //callback(err, result);
            //});

            //console.log('@pr_name: ' + pr_name);

            //async.parallel({
            //    getWebpageStaticDatas: function _getWebpageStaticDatas(callback) {
            //        webPageDbCtrl.getWebPageDatas(function getWebpageDatasCallback(err, result) {
            //            console.log('@ttt async series 1 result: ' + result);
            //            callback(err, result);
            //        });
            //    }
            //}, function asyncResultHandler(err, result) {
            //    if (err) {
            //        console.log('@ttt async series 2 - ERROR');
            //    } else {
            //        console.log('@ttt async series 3 - OK');                                            
            //    }
            //});

            
            //ez működik, de a GET után fut le (series) 
            //https://github.com/caolan/async/blob/v1.5.2/README.md            

            //async.series([
            //    func1,
            //    func2,
            //    func3
            //], cb);

            //function func1(cb) { console.log('#1'); cb(); }
            //function func2(cb) { console.log('#2'); cb(); }
            //function func3(cb) { console.log('#3'); cb(); }
            //function cb() { console.log('#async end!'); }

            try {
                async.series({
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

                    //func_prog_name: function asyncParallalDbGetProgName(callback) {
                    //    dbCtrl.getProgramName(function getProgramProgNameCallback(err, result) {
                    //        console.log('@async 1');
                    //        //callback(err, result);
                    //        setTimeout(function () {
                    //            callback(err, result);
                    //        }, 2000);
                    //    });
                    //},

                    //func_prog_ver: function asyncParallalDbGetProgName(callback) {
                    //    dbCtrl.getProgramVersion(function getProgramProgNameCallback(err, result) {
                    //        console.log('@async 2');
                    //        //callback(err, result);
                    //        setTimeout(function () {
                    //            callback(err, result);
                    //        }, 2000);
                    //    });
                    //},

                    //func_prog_dev: function asyncParallalDbGetProgDev(callback) {
                    //    dbCtrl.getProgramDeveloper(function getProgramProgVerCallback(err, result) {
                    //        console.log('@async 5 result key:' + result.key + ' value: ' + result.value);
                    //        storage.DataStorageNameSpace.BaseClass.addItem(result.key, result.value);
                    //        callback(err, result);
                    //    });
                    //},

                    getWebpageStaticDatas: function _getWebpageStaticDatas(callback) {                        
                        dbCtrl.getWebPageDatas(function getWebpageDatasCallback(err, result) {                            
                            setTimeout(function () {      
                                if (err) {
                                    console.log('@async getWebpageStaticDatas ERROR: ' + err.message);
                                } else {
                                    if (result.length > 0) {
                                        for (var i = 0; i != result.length; i++) {
                                            //console.log('@async getWebpageStaticDatas result key: ' + result[i].key + ' value: ' + result[i].value);
                                            webLabelDAO.WebpageLabelsNameSpace.WebPageLabels.fillPageLabel(result[i].key, result[i].value);
                                            //storage.DataStorageNameSpace.BaseClass.addItem(result[i].key, result[i].value);
                                        }
                                    }                                    
                                }                                
                                callback(err, result);
                            }, 1000);
                        });
                    }

                }, function asyncParallalResulthandler(err, results) {
                    if (err) {
                        console.log('@async 3 - ERROR: ' + err.message);
                    } else {
                        console.log('@async 4 - OK');
                        //console.log('@async 4 : results: ' + results.getWebpageStaticDatas.key);                        
                        //Callback was already called.
                        //this.testArray.push('egy');
                        //this.testArray.push('kettő');
                    }
                })
            } catch (err) {
                console.log('@async CATCH ERROR: ' + err.message);
            }
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