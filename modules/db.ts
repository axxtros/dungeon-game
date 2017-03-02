/*
 * Adatbázis modul.
 * 13/12/2016
 */

import * as object3d from "../modules/Object3D";

//hogyan kell kitenni egy adatbázisból lekérdezett eredményt az async modulból kijebb
//http://stackoverflow.com/questions/38337896/how-to-async-combine-multiple-json-arrays-into-1-with-node-js-javascript
//többszörös rekord lekérdezése, és azonnali elhelyezése egy array-ben (ez nem biztos, hogy segít, de nézd át)
//http://stackoverflow.com/questions/18395743/building-json-with-node-js-with-multiple-queries

export namespace DatabaseControlNameSpace {

    var sqlite3 = require('sqlite3').verbose();
    var file = "data.db";
    var dbase = new sqlite3.Database(file);

    export class WebPageDatas {

        constructor() { }

        getWebPageDatas(callback: any): any {
            var sql = " select	sp.id, \
                                sp.key, \
                                sp.value \
                        from		sys_param sp \
                        order by sp.id asc";
            dbase.each(sql, (err, rows) => {
                if (err) {
                    return err;
                } else {
                    return rows;
                }
            });
        }
    }

    export class DBControl {        

        constructor() { }        

        //getProgramName2(): any {
        //    var sql = "select value from sys_param sp where	sp.key = 'PROGRAM_NAME'";
        //    dbase.each(sql, (err, row) => {
        //        if (err) {
        //            return err;
        //        } else {
        //            return row.value;
        //        }
        //    });
        //}

        getProgramName(callback: any): any {            
            var sql = "select value from sys_param sp where	sp.key = 'PROGRAM_NAME'";
            dbase.each(sql, (err, row) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, row.value);
                }
            });
        }

        getProgramVersion(callback : any): any {            
            var sql = "select value from sys_param sp where	sp.key = 'PROGRAM_VERSION'";
            dbase.each(sql, (err, row) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, row.value);
                }
            });        
        }

        getProgramDeveloper(callback: any): any {            
            var sql = "select sp.key, sp.value from sys_param sp where	sp.key = 'DEVELOPER'";
            dbase.each(sql, (err, row) => {
                if (err) {
                    callback(err);
                } else {
                    console.log('@db developer key: ' + row.key + ' value: ' + row.value);
                    callback(null, row);
                }
            });
        }

        getPrDevName(cb: any): any {
            var sql = "select sp.id, sp.key, sp.value from sys_param sp where sp.key = 'DEVELOPER'";
            dbase.each(sql, (err, row) => {
                if (err) {
                    console.log('@getPrDevName ERROR: ' + err.message);
                    cb(err);
                } else {
                    console.log('@getPrDevName key: ' + row.key + ' value: ' + row.value);
                    cb(row);
                }
            });
        }

        //dbase.all-t kell használni, akkor kéri le egyben mindent, és Array-ban adja vissza (SELECT-nél all kell!!!)
        //https://codeforgeek.com/2014/07/node-sqlite-tutorial/
        //https://www.npmjs.com/package/sqlite3
        //http://www.w3resource.com/node.js/nodejs-sqlite.php
        getWebPageDatas(callback: any): any {
            var sql = "select sp.id, sp.key, sp.value from sys_param sp";
            //var sql = "select sp.id, sp.key, sp.value from sys_param sp where sp.key = 'DEVELOPER'";
            dbase.all(sql, function (err, rows) {
                if (err) {
                    console.log('@db err: ' + err);
                    callback(err, null);
                } else {
                    //console.log('@db rows id: ' + rows.id + ' rows key: ' + rows.key + ' rows value: ' + rows.value);
                    callback(null, rows);
                }
            });
        }

        saveObject3D(savedObject3D: object3d.Object3D): any {
            var parameters = {
                $id: null,
                $objectname: savedObject3D.objectname,
                $groupname: savedObject3D.groupname,
                $geomteryVertices: savedObject3D.geomteryVertices
            };
            var sql = "INSERT INTO dat_object3d (id, objectname, groupname, geomteryVertices) VALUES ($id, $objectname, $groupname, $geomteryVertices)";
            var st = dbase.prepare(sql);
            st.run(parameters, function (err) {
                if (err) {
                    console.log(err);
                    //callback(false);
                } else {
                    console.log(this);
                }
            });
        }

    }

}

//tutorials
//(saját)
//https://prog.hu/tudastar/192946/node-js-async-muveletek-sorrendisege
//https://prog.hu/tudastar/195497/node-js-adatok-osszegyujtese-response-elott