
var async = require('async');
var appModule = require('../modules/application');

exports.game = function (req, res) {
    
    let pageDataObj = new appModule.DatabaseControlNameSpace.ApplicationClass();

    for (let entry of pageDataObj.pageData) {
        console.log(entry);
    }

    res.render('game', {        

    });
}