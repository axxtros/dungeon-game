//game socket communications 06/01/2017

var host = window.location.hostname;
var socket = new io.connect("ws://" + host + ":3000");


function sendWelcomMsg() {
    console.log('Welcome message sending!');
    socket.emit('welcome_msg', 'Hello server, I am client!');
}