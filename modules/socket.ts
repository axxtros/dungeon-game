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

//hagyományos module-os megoldás ----------------------------------------------

/*
module.exports = function (io) {
    return {
        attachEventHandlers: function () {

            console.log('@websocket Websocket events started.');

            io.sockets.on('connection', function (socket) {

                console.log('@websocket: Client connected!');

                socket.on('welcome_msg', function (data) {
                    console.log('@websocket Welcome message from client: ' + data);                    
                });

            });
            
        }
    }
};
*/

//typescript-es megoldás ------------------------------------------------------

export class SocketClass {
    
    constructor() {
        
    }    

    public socketEventHandler(io: any): void {                

        console.log('@websocket Websocket events started.');

        io.sockets.on('connection', function (socket) {

            console.log('@websocket: Client connected!');

            socket.on('welcome_msg', function (data) {
                console.log('@websocket Welcome message from client: ' + data);
            });

        });        
        
    }

}

//tutorials:
//https://www.codeproject.com/articles/871622/writing-a-chat-server-using-node-js-typescript-and
//https://github.com/daviddoran/typescript-reconnecting-websocket/blob/master/reconnecting-websocket.ts
//http://codular.com/node-web-sockets