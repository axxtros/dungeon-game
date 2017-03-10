//webGL tutorial #5 14/02/2017

//loading object



function wgl9_KeyDownHandler(event) {
    
}

//ez a c_socket.js-ből hívódik meg, mert rajzolás előtt meg kell várni, amíg a 3D-s object le nem jön a szerverről
function wgl9_Draw() {    
    console.log('@wgl9_Draw ' + glObjectStorage[0]._id);
}

function initVertexBuffersForTriangle() {
    
}