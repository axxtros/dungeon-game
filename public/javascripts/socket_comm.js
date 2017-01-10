//game socket communications 06/01/2017

var host = window.location.hostname;
var socket = new io.connect("ws://" + host + ":3000");

var map;

function sendWelcomMsg() {
    console.log('Welcome message sending!');
    socket.emit('welcome_msg', 'Hello server, I am client!');
}

function generateNewDungeon() {
    socket.emit('test_data_to_server', 10, 20);
}

socket.on('test_data_from_server', function (map) {
    console.log('Data from server test map[0][0]: ' + map[0][0] + ' map[0][1]: ' + map[0][1]);
})