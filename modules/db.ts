/*
 * Adatbázis modul.
 * 13/12/2016
 */

//hogyan kell kitenni egy adatbázisból lekérdezett eredményt az async modulból kijebb
//http://stackoverflow.com/questions/38337896/how-to-async-combine-multiple-json-arrays-into-1-with-node-js-javascript
//tönnszörös rekord lekérdezése, és azonnali elhelyezése egy array-ben (ez nem biztos, hogy segít, de nézd át)
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

        getProgramName2(): any {
            var sql = "select value from sys_param sp where	sp.key = 'PROGRAM_NAME'";
            dbase.each(sql, (err, row) => {
                if (err) {
                    return err;
                } else {
                    return row.value;
                }
            });
        }

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
            //var sql = "select value from sys_param sp where	sp.key = 'DEVELOPER'";
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

        getWebPageDatas(callback: any): any {
            var sql = "select sp.id, sp.key, sp.value from sys_param sp";
            //var sql = "select sp.key, sp.value from sys_param sp where	sp.key = 'DEVELOPER'";
            dbase.each(sql, (err, row) => {
                if (err) {
                    console.log('@db err: ' + err);
                    callback(err);
                } else {
                    callback(null, row);
                }
            });
        }

    }

}

