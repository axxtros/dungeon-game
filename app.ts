import express = require('express');
var app = express();
var port = 3000;
var server = require('http').createServer(app);
var io = require('socket.io')(server);
//server.listen(port);

//import user = require('./routes/user');
import path = require('path');
import http = require('http');


import * as appControl from './modules/application';    //itt csak egy pont kell az url elé :)


//var server = require('http').createServer(app);

var routes = require('./routes');
var gamepage = require('./routes/game');

// all environments
app.set('port', process.env.PORT || 3000);
//app.set('websocket_port', '3000');

var io = require('socket.io').listen(server);
//server.listen(app.get('websocket_port'));

app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

import stylus = require('stylus');
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

//var socketEvents = require('./modules/socket');
import * as socketControl from './modules/socket';
var socketEv = new socketControl.SocketClass(io);
socketEv.socketEventHandler(io);


app.get('/', routes.index);
app.get('/game', gamepage.game);

http.createServer(app).listen(app.get('port'), function () {
    let appCtrl = new appControl.DatabaseControlNameSpace.ApplicationClass();   //a szerver létrehozása előttre kell minden betöltést (inicializálást) ide betenni
    console.log('Express server listening on port ' + app.get('port'));
});

//session kezelés
//https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions

//socket tutorials
//http://stackabuse.com/node-js-websocket-examples-with-socket-io/
//http://socket.io/get-started/chat/