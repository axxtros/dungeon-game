//cleints side javascript

var GAME_DIV_WIDTH = 1000;						//default: 1000
var GAME_DIV_HEIGHT = 800;						//default: 800

var gamediv;
var mapCanvas;
var unitCanvas;
var missileCanvas;
var devCanvas;

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
    canvasInit(mapCanvas, canvasOffset);
    
    //unitCanvas
    var unitCanvas = document.getElementById('unitcanvas');
    canvasInit(unitCanvas, canvasOffset);
    
    //missileCanvas
    var missileCanvas = document.getElementById('missilecanvas');
    canvasInit(missileCanvas, canvasOffset);
    
    //devCanvas    
    var devCanvas = document.getElementById('devcanvas');
    if (isDevMode()) {                        
        canvasInit(devCanvas, canvasOffset);
    } else { 
        devCanvas.style.display = 'none';
    } 
        
    //log('Initalizate client side HTML components. SUCCESS END!');
}

function canvasInit(canvasElement, canvasOffset) {
    if (canvasElement === null || canvasElement === 'undefined') {
        log('Nof find ' + canvasElement + ' element!');
        return;
    }    
    canvasElement.style.top = canvasOffset.top + 'px';
    canvasElement.style.left = canvasOffset.left + 'px';
    canvasElement.style.width = canvasOffset.width + 'px';
    canvasElement.style.height = canvasOffset.height + 'px';
    if (canvasElement.id === 'devcanvas') {
        canvasElement.style.border = '1px solid darkgray';
    }
}

function main() { 
    initCanvasComponents();    
}

window.onresize = function(event) {
    main();
};

window.onload = function (event) {
    main();
};

