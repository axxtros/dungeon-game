//game draws functions and controls 13/01/2017

var MAP_ELEMENT_SIZE = 10;

function drawMap(map) {
    var mapElementX = 0;
    var mapElementY = 0;
    if (map !== null && map !== 'undefined') {
        mapCanvasContext.clearRect(0, 0, mapCanvasContext.canvas.width, mapCanvasContext.canvas.height);
        for (var y = 0; y != map.length; y++) {
            for (var x = 0; x != map[y].length; x++) {
                if (map[y][x] === 1) {
                    mapCanvasContext.beginPath();
                    mapCanvasContext.rect(mapElementX, mapElementY, MAP_ELEMENT_SIZE, MAP_ELEMENT_SIZE);
                    mapCanvasContext.fillStyle = 'grey';
                    mapCanvasContext.fill();                    
                }
                mapElementX += MAP_ELEMENT_SIZE;
            }
            mapElementX = 0;
            mapElementY += MAP_ELEMENT_SIZE;
        }
    } else { 
        log('Map is null or undefined!');
    }
}