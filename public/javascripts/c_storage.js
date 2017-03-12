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
    convertGlObject.id = object._id;
    convertGlObject.name = object._name;
    convertGlObject.group = object._group;    
    
    var tempValues = new Array();        
    if (object._vertices != null) {        
        for (var key in object._vertices) {
            tempValues.push(object._vertices[key]);  
        }
        convertGlObject.vertices = new Float32Array(tempValues);        
    }    
    
    

    return convertGlObject;
}
