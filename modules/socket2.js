var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

module.exports = function (io) {
    return {
        attachEventHandlers: function () {
            
            io.sockets.on('connection', function (socket) {
                
                console.log('client connected');
                
                socket.on('welcome_msg', function (data) {
                    console.log('socket sockets.js welcome_msg');                    
                });

            });
            
            console.log('events attached');
        }
    }
};