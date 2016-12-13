/*
 * Adatbázis modul.
 * 13/12/2016
 */

var sqlite3 = require('sqlite3').verbose();
var file = "data.db";
var dbase = new sqlite3.Database(file);


export namespace TestNameSpace {

    export class TestClass {
        x: number;        


        kiir(szam: number): string {
            return "szam: " + szam;
        }

        getProgramName(callback: any): any {
            console.log('@db1 3');
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
            console.log('@db1 3');
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

