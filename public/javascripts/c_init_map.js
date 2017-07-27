
var GAME_DIV_WIDTH = 800;						//default: 1000
var GAME_DIV_HEIGHT = 800;						//default: 800

var gamediv;

var mapCanvas;
var devCanvas;
var mouseCanvas;

var mapCanvasContext;
var devcanvasContext;
var mouseCanvasContext;

var canvasOffset;           //ebben van eltárolva, hogy mennyivel vannak eltolva az egyes canvas-ek. ez főleg az egér kurzor lekérdezésénél fontos (c_events.js)

function init2DCanvasComponents() {
    var gamediv = document.getElementById('gamediv');
    if (gamediv === null || gamediv === 'undefined') {
        DEBUG_LOG('Not find gamediv element!');
        return;
    }
    gamediv.style.width = GAME_DIV_WIDTH + 'px';
    gamediv.style.height = GAME_DIV_HEIGHT + 'px';
    canvasOffset = gamediv.getBoundingClientRect();
    
    //mapCanvas
    mapCanvas = document.getElementById('mapcanvas');
    initCanvas(mapCanvas, canvasOffset);
    //devCanvas    
    devCanvas = document.getElementById('devcanvas');
    if (isDevMode()) {
        initCanvas(devCanvas, canvasOffset);
    } else {
        devCanvas.style.display = 'none';
    }    
    //mouseCanvas
    mouseCanvas = document.getElementById('mousecanvas');
    if (isEnabledMouseEvents()) {
        initCanvas(mouseCanvas, canvasOffset);
        initMouseEvents(mouseCanvas);
    }
}

function initCanvas(canvasElement, canvasOffset) {
    if (canvasElement === null || canvasElement === 'undefined') {
        DEBUG_LOG('Not find ' + canvasElement + ' element!');
        return;
    }
    canvasElement.style.top = canvasOffset.top + 'px';
    canvasElement.style.left = canvasOffset.left + 'px';
    canvasElement.style.width = canvasOffset.width + 'px';
    canvasElement.style.height = canvasOffset.height + 'px';
    if (canvasElement.id === 'mapcanvas') {
        mapCanvasContext = canvasElement.getContext('2d');
        initCanvasContext(mapCanvasContext, true);
    }    
    if (canvasElement.id === 'devcanvas') {
        devcanvasContext = canvasElement.getContext('2d');
        initCanvasContext(devcanvasContext, true);
        canvasElement.style.border = '1px solid lightgray';
    }
    if (canvasElement.id === 'mousecanvas') {
        mouseCanvasContext = canvasElement.getContext('2d');
        initCanvasContext(mouseCanvasContext, true);
        if (isDebugMode()) {
            canvasElement.style.border = '1px solid lightblue';
        }
    }    
}

function initCanvasContext(canvasContext, isCanvas2D) {
    canvasContext.canvas.width = GAME_DIV_WIDTH;
    canvasContext.canvas.height = GAME_DIV_HEIGHT;    
    canvasContext.scale(1, 1);    
}

function initMouseEvents(canvasElement) {
    canvasElement.addEventListener("mouseup", mouseClickedEvent, false);
}

function main() { 
    init2DCanvasComponents();
}

window.onload = function (event) { 
    main();
}