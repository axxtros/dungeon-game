﻿/******************************************************************************
 *  File:               Dungeon game v.0.1
 *  Version:            0.1
 *  Date:               05/12/2016
 *  Developer:          
 *  Description:        
 *****************************************************************************/

import express = require('express');
import http = require('http');
import path = require('path');
import stylus = require('stylus');
var formidable = require('formidable');
var util = require('util');

var app = express();
var websocketPort = 3000;               //ezen a port-on fut a websocket, ha ez változik, akkor írd át a c_socket.js-ben is kliens oldalon (websocketPort)
var server = http.createServer(app);
//var server = require('http').createServer(app);
var io = require('socket.io')(server);
//var io = require('socket.io').listen(server);
server.listen(websocketPort);

import * as appControl from './modules/application';    //itt csak egy pont kell az url elé :)

var routes = require('./routes');
var gamepage = require('./routes/game');

// all environments
app.set('port', process.env.PORT || 3001);              //ezen a port-on fut a node szerver
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

//websocket init
//typescript-es megoldás ------------------------------------------------------
import * as socketControl from './modules/socket';
var socketCtrl = new socketControl.SocketClass();
socketCtrl.socketEventHandler(io);

//hagyományos module-os megoldás ----------------------------------------------
//var socketEvents = require('./modules/socket.js')(io);
//socketEvents.attachEventHandlers();

//routes init
app.get('/', routes.index);
app.get('/game', gamepage.game);

app.post('/uploadfile', function (req, res) {

    var form = new formidable.IncomingForm();
    form.parse(req);

    form.on('fileBegin', function (name, file) {        
        console.log('file: ' + file.name);
    });    
    
    console.log('uploading end...');    
    res.redirect('/');
});

//start server
http.createServer(app).listen(app.get('port'), function () {
    let appCtrl = new appControl.DatabaseControlNameSpace.ApplicationClass();   //a szerver létrehozása előttre kell minden betöltést (inicializálást) ide betenni
    console.log('Node Express server listening on port: ' + app.get('port'));
    console.log('Websocket server listening on port: ' + websocketPort);
});

//session kezelés
//https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions

//socket tutorials
//http://stackabuse.com/node-js-websocket-examples-with-socket-io/
//http://socket.io/get-started/chat/