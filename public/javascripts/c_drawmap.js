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
var DOOR_COLOR = '#000000';
var POSSIBLE_DOOR_COLOR = '#F4FA58';
var OKCELL_COLOR = '#81BEF7';
var PATH_COLOR = '#81F781';
var TEST_START_PATH_CELL_COLOR = '#EE230B';
var TEST_END_PATH_CELL_COLOR = '#33B5FF';

var testStartY = 2;
var testStartX = 3;

function clearMapPath() { 
    drawMap(st_gameMap, false);
}

function drawMap(map, isGenerateNewTestPathCell) {
    var mapElementX = 0;
    var mapElementY = 0;
    if (map !== null && map !== 'undefined') {
        mapCanvasContext.clearRect(0, 0, mapCanvasContext.canvas.width, mapCanvasContext.canvas.height);
        for (var y = 0; y != map.length; y++) {
            for (var x = 0; x != map[y].length; x++) {                
                if (map[y][x] === MAZE) {                      //MAZE                    
                    drawMapCell(mapElementX, mapElementY, MAZE_COLOR, true);
                } else if (map[y][x] === WALL) {               //WALL                            
                    drawMapCell(mapElementX, mapElementY, WALL_COLOR, true);          
                } else if (map[y][x] === MBRD) {               //MBRD                    
                    drawMapCell(mapElementX, mapElementY, MAP_BORDER_COLOR, true);
                } else if (map[y][x] === ROOM) {               //ROOM                    
                    drawMapCell(mapElementX, mapElementY, ROOM_COLOR, true);
                } else if (map[y][x] === DOOR) {               //DOOR                    
                    drawMapCell(mapElementX, mapElementY, DOOR_COLOR, true);
                } else if (map[y][x] === TEST_POSS_DOOR) {     //PDOR                    
                    drawMapCell(mapElementX, mapElementY, MAZE_COLOR, true);
                } else if (map[y][x] === OKCELL) {             //OKCELL                    
                    drawMapCell(mapElementX, mapElementY, OKCELL_COLOR, true);
                }                
                mapElementX += MAP_ELEMENT_SIZE;
            }
            mapElementX = 0;
            mapElementY += MAP_ELEMENT_SIZE;
        }
        if (isGenerateNewTestPathCell) { 
            generateRandomTestPathStartCell(map);            
        }
        drawMapCell(testStartX, testStartY, TEST_START_PATH_CELL_COLOR, false);             //útvonal kereső start mező (beégetett, csak teszt miatt!!!)
    } else { 
        log('Map is null or undefined!');
    }
}

function generateRandomTestPathStartCell(map) {
    if (map !== null && map !== 'undefined') {
        isDone = false;
        var randX = 0;
        var randY = 0;
        while (!isDone) {
            randX = Math.floor(Math.random() * map[0].length) + 1;
            randY = Math.floor(Math.random() * map.length) + 1;
            if (map[randY][randX]== MAZE ||
                map[randY][randX] == ROOM ||
                map[randY][randX] == DOOR) { 
                isDone = true;
            }
        }
        testStartY = randY;
        testStartX = randX;
    }
}

function drawPath(path) {
    if (path !== null) {
        for (var i = 0; i != path.length; i += 2) {           
            drawMapCell(path[i + 1], path[i], (i !== path.length - 2) ? PATH_COLOR : TEST_END_PATH_CELL_COLOR, false);
        }
    }
}

function drawMapCell(cellX, cellY, color, isMapElement) {
    mapCanvasContext.beginPath();
    if (isMapElement) {     //map 
        mapCanvasContext.rect(cellX, cellY, MAP_ELEMENT_SIZE, MAP_ELEMENT_SIZE);
    } else {                //path
        mapCanvasContext.rect(cellX * MAP_ELEMENT_SIZE, cellY * MAP_ELEMENT_SIZE, MAP_ELEMENT_SIZE, MAP_ELEMENT_SIZE);
    }    
    mapCanvasContext.fillStyle = color;
    mapCanvasContext.fill();  
}