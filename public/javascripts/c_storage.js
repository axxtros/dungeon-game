//game data storage 23/01/2017

var st_gameMap = null;                 //az éppen aktuális térkép
var st_playerUnitPath = null;

var glObject = {
    id: 0,
    name : "",
    group : "",


};

var glObjectStorage = new Array();

function addNewGameMap(map) {
    st_gameMap = map;
}

function addPath(path) { 
    st_playerUnitPath = path;
}

function addGLObject(object) {
    if (object != null) {
        glObjectStorage.push(convertObjectToGLObject(object));
    }    
}

function convertObjectToGLObject(object) {
    var convertGlObject = new Object();
    convertGlObject.id = object._id;
    convertGlObject.name = object._name;
    convertGlObject.group = object._group;
    convertGlObject.vertices = new Float32Array(10);
    
    var idx = 0;
    for (var key in object._vertices) {
        convertGlObject.vertices[idx] = object._vertices[key];
        idx++;
        //console.log(key, data[key]);
    }

    return convertGlObject;
}
