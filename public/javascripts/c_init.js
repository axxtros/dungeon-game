//cleints side javascript

var GAME_DIV_WIDTH = 1000;						//default: 1000
var GAME_DIV_HEIGHT = 800;						//default: 800

var gamediv;

var mapCanvas;
var unitCanvas;
var missileCanvas;
var devCanvas;

var mapCanvasContext;
var unitcanvasContext;
var missilecanvasContext;
var devcanvasContext;

function initCanvasComponents() {    
    //log('Initalizate client side HTML components. START!');
    
    //gameDiv
    var gamediv = document.getElementById('gamediv');
    if (gamediv === null || gamediv === 'undefined') {
        log('Nof find gamediv element!');
        return;
    }
    gamediv.style.width = GAME_DIV_WIDTH + 'px';
    gamediv.style.height = GAME_DIV_HEIGHT + 'px';
    var canvasOffset = gamediv.getBoundingClientRect();  
    
    //mapCanvas
    var mapCanvas = document.getElementById('mapcanvas');
    initCanvas(mapCanvas, canvasOffset);
    
    //unitCanvas
    var unitCanvas = document.getElementById('unitcanvas');
    initCanvas(unitCanvas, canvasOffset);
    
    //missileCanvas
    var missileCanvas = document.getElementById('missilecanvas');
    initCanvas(missileCanvas, canvasOffset);
    
    //devCanvas    
    var devCanvas = document.getElementById('devcanvas');
    if (isDevMode()) {                        
        initCanvas(devCanvas, canvasOffset);
    } else { 
        devCanvas.style.display = 'none';
    }
        
    //log('Initalizate client side HTML components. SUCCESS END!');
}

function initCanvas(canvasElement, canvasOffset) {
    if (canvasElement === null || canvasElement === 'undefined') {
        log('Not find ' + canvasElement + ' element!');
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
        canvasElement.style.border = '1px solid darkgray';
    }
}

function initCanvasContext(canvasContext) { 
    canvasContext.canvas.width = GAME_DIV_WIDTH;
    canvasContext.canvas.height = GAME_DIV_HEIGHT;
    canvasContext.scale(1, 1);
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

