//game socket communications 06/01/2017

var host = window.location.hostname;
//var socket = io.connect('http://' + window.document.location.host + '/game:3000');
//var socket = new WebSocket('ws://' + window.location.hostname + '/game:1337', 'echo-protocol');

var socket = new WebSocket("ws://" + host + ":3000");
//var socket = io.connect('http://localhost:3000');

socket.onmessage = function (event) {
    console.log('Client connection message: ', message.data);

    var msg = JSON.parse(event.data);

    switch (msg.type) {
        case "welcome_message":
            console.log('from server side: ' + msg);
            break;
    }


};


//console.log('@socket client is ready');