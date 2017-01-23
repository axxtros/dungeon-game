﻿//cleints side javascript

var GAME_DIV_WIDTH = 1000;						//default: 1000
var GAME_DIV_HEIGHT = 800;						//default: 800

var gamediv;

var mapCanvas;
var unitCanvas;
var missileCanvas;
var devCanvas;
var mouseCanvas;

var mapCanvasContext;
var unitcanvasContext;
var missilecanvasContext;
var devcanvasContext;
var mouseCanvasContext;

var canvasOffset;           //ebben van eltárolva, hogy mennyivel vannak eltolva az egyes canvas-ek. ez főleg az egér kurzor lekérdezésénél fontos (c_events.js)

function initCanvasComponents() {    
    //DEBUG_LOG('Initalizate client side HTML components. START!');
    
    //gameDiv
    var gamediv = document.getElementById('gamediv');
    if (gamediv === null || gamediv === 'undefined') {
        DEBUG_LOG('Nof find gamediv element!');
        return;
    }
    gamediv.style.width = GAME_DIV_WIDTH + 'px';
    gamediv.style.height = GAME_DIV_HEIGHT + 'px';
    canvasOffset = gamediv.getBoundingClientRect();  
    
    //mapCanvas
    mapCanvas = document.getElementById('mapcanvas');
    initCanvas(mapCanvas, canvasOffset);    
    
    //unitCanvas
    unitCanvas = document.getElementById('unitcanvas');
    initCanvas(unitCanvas, canvasOffset);
    
    //missileCanvas
    missileCanvas = document.getElementById('missilecanvas');
    initCanvas(missileCanvas, canvasOffset);
    
    //devCanvas    
    devCanvas = document.getElementById('devcanvas');
    if (isDevMode()) {                        
        initCanvas(devCanvas, canvasOffset);
    } else { 
        devCanvas.style.display = 'none';
    }
    
    mouseCanvas = document.getElementById('mousecanvas');
    if (isEnabledMouseEvents()) { 
        initCanvas(mouseCanvas, canvasOffset);
        initMouseEvents(mouseCanvas);
    }
        
    //DEBUG_LOG('Initalizate client side HTML components. SUCCESS END!');
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
        initCanvasContext(mapCanvasContext);        
    }
    if (canvasElement.id === 'unitcanvas') {
        unitcanvasContext = canvasElement.getContext('2d');
        initCanvasContext(unitcanvasContext);
    }
    if (canvasElement.id === 'missilecanvas') {
        missilecanvasContext = canvasElement.getContext('2d');
        initCanvasContext(missilecanvasContext);
    }
    if (canvasElement.id === 'devcanvas') {
        devcanvasContext = canvasElement.getContext('2d');
        initCanvasContext(devcanvasContext);        
        canvasElement.style.border = '1px solid lightgray';
    }
    if (canvasElement.id === 'mousecanvas') {
        mouseCanvasContext = canvasElement.getContext('2d');
        initCanvasContext(mouseCanvasContext);
        if (isDebugMode()) { 
            canvasElement.style.border = '1px solid lightblue';
        }        
    }
}

function initCanvasContext(canvasContext) { 
    canvasContext.canvas.width = GAME_DIV_WIDTH;
    canvasContext.canvas.height = GAME_DIV_HEIGHT;
    canvasContext.scale(1, 1);
}

function initMouseEvents(canvasElement) { 
    canvasElement.addEventListener("mouseup", mouseClickedEvent, false);	
}

function main() { 
    initCanvasComponents();    
}

window.onscroll = function (event) { 
    main();
}

window.onresize = function(event) {
    main();
};

window.onload = function (event) {
    main();
};

