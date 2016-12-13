/*
 * Adatbázis modul.
 * 13/12/2016
 */

export namespace DatabaseControlNameSpace {    

    var sqlite3 = require('sqlite3').verbose();
    var file = "data.db";
    var dbase = new sqlite3.Database(file);

    export class DBControl {        

        constructor() { }

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

    }

}

