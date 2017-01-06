//game socket communications 06/01/2017

var host = window.location.hostname;
var socket = io.connect('http://' + window.document.location.host + '/game:1337');
//var socket = new WebSocket('ws://' + window.location.hostname + '/game:1337', 'echo-protocol');
//var socket = new WebSocket("ws://localhost:1337");

socket.onmessage = function (message) {
    console.log('Connection 1', message.data);
};

console.log('@socket client is ready');