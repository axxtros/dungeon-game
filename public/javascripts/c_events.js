// game events functions

//http://www.homeandlearn.co.uk/JS/html5_canvas_mouse_events.html
function mouseClickedEvent(event) {    
    var clickedY = event.pageY - canvasOffset.top;
    var clickedX = event.pageX - canvasOffset.left;
    DEBUG_LOG('@mousedown click y: ' + clickedY + ' x:' + clickedX);
}