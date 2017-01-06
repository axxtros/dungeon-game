//socket control 06/01/2017


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

    constructor() {
        this.socketEventHandler();
    }

    public socketEventHandler(): any {
        return server.on('connection', ws => {

            ws.on('welcome_message', message => {
                try {
                    console.log('Websocket server connection is success! Message: ' + message);
                } catch (err) {
                    console.error(err.message);
                }
            });
            console.log('Websocketserver is running on port', port);          
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