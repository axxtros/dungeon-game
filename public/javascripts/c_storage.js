//game data storage 23/01/2017

var st_gameMap = null;                 //az éppen aktuális térkép
var st_playerUnitPath = null;

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
    convertGlObject.id = object._id != null ? object._id : 0;
    convertGlObject.name = object._name != null ? object._name : "";
    convertGlObject.group = object._group != null ? object._group : "";    
    
    var tempValues = new Array();
    if (object._vertices != null) {        
        for (var key in object._vertices) {
            tempValues.push(object._vertices[key]);  
        }
        convertGlObject.vertices = new Float32Array(tempValues);        
    }    
    
    tempValues = [];
    if (object._vertexIndices != null) {
        for (var key in object._vertexIndices) {
            tempValues.push(object._vertexIndices[key]);
        }
        convertGlObject.vertexIndices = new Uint8Array(tempValues);
    }
    
    convertGlObject.verticesNumber = object._verticesNumber != null ? object._verticesNumber : 0;    

    return convertGlObject;
}
