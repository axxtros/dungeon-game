﻿//socket control 06/01/2017

///<reference path="../app.ts"/>

'use strict';

import * as dungeonGeneratorModule from '../modules/dungeonGenerator';
import * as pathFinderModule from '../modules/pathFinder';
import * as objFileControl from "../modules/ObjFileControl";
import * as glStorage from "../modules/GLStorage";
import * as globject3D from "../modules/GLObject3D";

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
        //this.dungeonMapGenerator = new dungeonGeneratorModule.DungeonGenerator();
    }    

    public socketEventHandler(io: any): void {                

        var objFileControlClass = new objFileControl.ObjFileControl();
        console.log('@websocket Websocket events started.');        

        io.sockets.on('connection', function (socket) {
            console.log('@websocket: Client connected!');

            socket.on('welcome_msg', function (data) {
                console.log('@websocket Welcome message from client: ' + data);
            });

            socket.on('map_generator', function (mapWidth, mapHeight, roomNumber, doorsPerRoom) {                
                var dungeonGenerator = new dungeonGeneratorModule.DungeonGenerator();                
                var map = dungeonGenerator.generator(mapWidth, mapHeight, roomNumber, doorsPerRoom);
                socket.emit('map_data_from_server', 'Map generated is done! Please look at in the server console.', map);
            });

            socket.on('path_finder', function (map, startCellY, startCellX, targetCellY, targetCellX, reversedPathSearch) {                
                var pathFinder = new pathFinderModule.Pathfinder(map, startCellY, startCellX, targetCellY, targetCellX, reversedPathSearch);
                var path = pathFinder.searchPath();
                socket.emit('path_data_from_server', path);
            });

            socket.on('load_3d_object', function (objectID) {
                objFileControlClass.get3DObject(Number(objectID));
                var loadedGLObject3D = glStorage.GLStorage.getObjectFromStorage(objectID);
                socket.emit('response_3d_object', loadedGLObject3D);
            });

        });
    }

}

//socket tutorials:
//https://www.codeproject.com/articles/871622/writing-a-chat-server-using-node-js-typescript-and
//https://github.com/daviddoran/typescript-reconnecting-websocket/blob/master/reconnecting-websocket.ts
//http://codular.com/node-web-sockets
//http://socket.io/docs/rooms-and-namespaces/
//http://socket.io/download/    //itt van a kliens socket.io src leírása, elérése