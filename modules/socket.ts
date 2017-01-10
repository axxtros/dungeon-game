//socket control 06/01/2017

///<reference path="../app.ts"/>

'use strict';

/*
import express = require('express');
var WebSocket = require('ws');
var port: number = 3000;
var WebSocketServer = WebSocket.Server;
var server = new WebSocketServer({ port: port });
*/

module.exports = function (io) {
    return {
        attachEventHandlers: function () {

            io.sockets.on('connection', function (socket) {

                console.log('@websocket: Client connected!');

                socket.on('welcome_msg', function (data) {
                    console.log('@websocket Welcome message from client: ' + data);                    
                });

            });

            console.log('events attached');
        }
    }
};

/*
server.on('connection', ws => {

    console.log('@ws: ' + ws);

    ws.on('message', message => {
        try {
            console.log('@ws message' + message);
        } catch (e) {
            console.error(e.message);
        }
    });

});
*/

/*
export class SocketClass {
    
    constructor(io: any) {
        //this.socketEventHandler(io);
    }    

    public socketEventHandler(io: any): void {                

        io.sockets.on('connection', io => {

            io.socket.on('welcome_message', message => {
                try {
                    console.log('Websocket server connection is success! Message: ' + message);
                } catch (err) {
                    console.error(err.message);
                }
            });

            io.socket.emit('done_msg', 'Server OK!');

            console.log('websocketserver is running on port', io.socket.port);          
        })
        
    }

}
*/

//tutorials:
//https://www.codeproject.com/articles/871622/writing-a-chat-server-using-node-js-typescript-and
//https://github.com/daviddoran/typescript-reconnecting-websocket/blob/master/reconnecting-websocket.ts
//http://codular.com/node-web-sockets