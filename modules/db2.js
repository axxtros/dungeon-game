

/*
 * Hagymányos JS-es adatbázis kezelés, teszt miatt van bent, amúgy nincs használva.
 */ 

var sqlite3 = require('sqlite3').verbose();
var file = "data.db";
var dbase = new sqlite3.Database(file);

db = module.exports = {
    
    getProgramName : function (callback) {
        var sql = "select value from sys_param sp where	sp.key = 'PROGRAM_NAME'";        
        dbase.each(sql, function (err, row) {            
            if (err) {                
                callback(err);
            } else {                
                callback(null, row.value);
            }
        });
    }

};