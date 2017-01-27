//game draws functions and controls 13/01/2017

var MAP_ELEMENT_SIZE = 10;

var MAZE = 0;                           //folyosó (egységek által járható cellák)
var WALL = 1;                           //fal (egységek által nem járható cellák)
var MBRD = 2;                           //térkép határ (MBRD = map border) (nem járható, és ide semmilyen más specifikus cella nem generálható)
var ROOM = 3;                           //szoba (egységek által járható cellák)    
var DOOR = 4;                           //ajtó
var TEST_POSS_DOOR = 5;                 //lehetséges ajtók (teszt miatt)
var OKCELL = 6;                         //cella bejárva (teszt miatt)

var MAZE_COLOR = 'white';
var WALL_COLOR = '#A4A4A4';
var MAP_BORDER_COLOR = '#848484';
var ROOM_COLOR = '#6E6E6E';
var DOOR_COLOR = '#FAAC58';
var POSSIBLE_DOOR_COLOR = '#F4FA58';
var OKCELL_COLOR = '#81BEF7';
var PATH_COLOR = '#81F781';
var TEST_TARGET_CELL_COLOR = '#FF001F';

var testTargetY = 50;
var testTargetX = 50;

function drawMap(map) {
    var mapElementX = 0;
    var mapElementY = 0;
    if (map !== null && map !== 'undefined') {
        mapCanvasContext.clearRect(0, 0, mapCanvasContext.canvas.width, mapCanvasContext.canvas.height);
        for (var y = 0; y != map.length; y++) {
            for (var x = 0; x != map[y].length; x++) {
                mapCanvasContext.beginPath();
                mapCanvasContext.rect(mapElementX, mapElementY, MAP_ELEMENT_SIZE, MAP_ELEMENT_SIZE);
                if (map[y][x] === MAZE) {                      //MAZE
                    mapCanvasContext.fillStyle = MAZE_COLOR;
                } else if (map[y][x] === WALL) {               //WALL        
                    mapCanvasContext.fillStyle = WALL_COLOR;                    
                } else if (map[y][x] === MBRD) {               //MBRD
                    mapCanvasContext.fillStyle = MAP_BORDER_COLOR;
                } else if (map[y][x] === ROOM) {               //ROOM
                    mapCanvasContext.fillStyle = ROOM_COLOR;
                } else if (map[y][x] === DOOR) {               //DOOR
                    mapCanvasContext.fillStyle = DOOR_COLOR;
                } else if (map[y][x] === TEST_POSS_DOOR) {     //PDOR
                    mapCanvasContext.fillStyle = POSSIBLE_DOOR_COLOR;
                } else if (map[y][x] === OKCELL) {             //OKCELL
                    mapCanvasContext.fillStyle = OKCELL_COLOR;
                }
                mapCanvasContext.fill();                    
                mapElementX += MAP_ELEMENT_SIZE;
            }
            mapElementX = 0;
            mapElementY += MAP_ELEMENT_SIZE;
        }
        drawCell(testTargetY, testTargetX);        
    } else { 
        log('Map is null or undefined!');
    }
}

function drawPath(path) {
    if (path !== null) { 
        for (var i = 0; i != path.length; i += 2) {
            mapCanvasContext.beginPath();
            mapCanvasContext.rect(path[i + 1] * MAP_ELEMENT_SIZE, path[i] * MAP_ELEMENT_SIZE, MAP_ELEMENT_SIZE, MAP_ELEMENT_SIZE);
            mapCanvasContext.fillStyle = PATH_COLOR;
            mapCanvasContext.fill();
        }
    }
}

function drawCell(cellY, cellX) {    
    mapCanvasContext.beginPath();
    mapCanvasContext.rect(cellX * MAP_ELEMENT_SIZE, cellY * MAP_ELEMENT_SIZE, MAP_ELEMENT_SIZE, MAP_ELEMENT_SIZE);
    mapCanvasContext.fillStyle = TEST_TARGET_CELL_COLOR;
    mapCanvasContext.fill();  
}