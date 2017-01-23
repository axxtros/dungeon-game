//game socket communications 06/01/2017

//socket url a game-ejs-be. Ez kell a kliens számára, de nem jó, ha statikusan be van írva a localhost
//<script src="http://localhost:3000/socket.io/socket.io.js"></script>  

var host = window.location.hostname;
var socket = new io.connect("ws://" + host + ":3000");

var map;

function sendWelcomMsg() {
    console.log('Welcome message sending!');
    socket.emit('welcome_msg', 'Hello server, I am client!');    
}

function generateNewDungeon() {
    //kb. 10mp a max legenerálása 401x401, 100 szoba
    //ideális: 95x95, 50 szoba
    socket.emit('map_generator', 55, 55, 50, 2);
}

socket.on('map_data_from_server', function (testMsg, map) {
    console.log('Test message from server: ' + testMsg);
    drawMap(map);
})

generateNewDungeon();