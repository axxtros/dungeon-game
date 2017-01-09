//socket control 06/01/2017

///<reference path="../app.ts"/>

'use strict';

//import WebSocket = require('ws');

/*
var port: number = process.env.PORT || 3000;
var WebSocketServer = WebSocket.Server;
var server = new WebSocketServer({ port: port });
*/


import express = require('express');
var WebSocket = require('ws');
var port: number = process.env.PORT || 3000;
var WebSocketServer = WebSocket.Server;
var server = new WebSocketServer({ port: port });


/*
var app = express();
var websocket = require('http').createServer(app); 
var io = require('socket.io')(websocket);
var WebSocketServer = websocket.Server;
var port: number = process.env.PORT || 3000;
var server = new WebSocketServer({ port: port });
*/


export class SocketClass {    

    /*
    WebSocket = require('ws');
    port: number = process.env.PORT || 3000;
    WebSocketServer = WebSocket.Server;
    socket = new WebSocketServer({ port: port });
    */


    constructor(io: any) {
        //this.socketEventHandler(io);
    }

    public socketEventHandler(io: any): void {

        console.log('Websocketserver is running on port', io);          


        io.sockets.on('connection', ws => {

            io.socket.on('welcome_message', message => {
                try {
                    console.log('Websocket server connection is success! Message: ' + message);
                } catch (err) {
                    console.error(err.message);
                }
            });

            io.socket.emit('done_msg', 'Server OK!');

            console.log('Websocketserver is running on port', io.socket.port);          
        })        
    }

}


//module.exports = function () {
//    return {        
                                          
//    }
//}

//tutorials:
//https://www.codeproject.com/articles/871622/writing-a-chat-server-using-node-js-typescript-and
//https://github.com/daviddoran/typescript-reconnecting-websocket/blob/master/reconnecting-websocket.ts
//http://codular.com/node-web-sockets