﻿// game events functions 23/01/2017

//http://www.homeandlearn.co.uk/JS/html5_canvas_mouse_events.html
function mouseClickedEvent(event) {    
    var clickedY = event.pageY - canvasOffset.top;
    var clickedX = event.pageX - canvasOffset.left;
    DEBUG_LOG('@mousedown click y: ' + clickedY + ' x:' + clickedX);

    var cellY = Math.floor(clickedY / MAP_ELEMENT_SIZE);
    var cellX = Math.floor(clickedX / MAP_ELEMENT_SIZE);
    if (st_gameMap !== null) { 
        DEBUG_LOG('@mousedown click cellY: ' + cellY + ' cellX:' + cellX + ' map cell type: ' + st_gameMap[cellY][cellX]);        
    }    

    if (event.button === 0) {   //bal egérgomb
        DEBUG_LOG('@mousedown click left mouse button');        
        //searchUnitPath(testStartY, testStartX, cellY, cellX, false);       
        
        var coords3D = c_util_convertMouseClickedCoordTo3DCoord(event, webGLTutorialCanvas);
        wgl2_Draw(coords3D.x, coords3D.y, 0.0);
    }
    if (event.button === 1) {   //középső egérgomb
        DEBUG_LOG('@mousedown click middle mouse button');        
    }
    if (event.button === 2) {   //jobb egérgomb
        DEBUG_LOG('@mousedown click right mouse button');
        searchUnitPath(testStartY, testStartX, cellY, cellX, true);
    }
}