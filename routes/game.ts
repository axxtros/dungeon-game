
var async = require('async');
var appModule = require('../modules/application');

exports.game = function (req, res) {
    
    let pageDataObj = new appModule.DatabaseControlNameSpace.ApplicationClass();    

    res.render('game', {        
        
    });
}