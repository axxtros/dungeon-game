//cleints side javascript

var GAME_DIV_WIDTH = 800;						//default: 1000
var GAME_DIV_HEIGHT = 800;						//default: 800

var gamediv;

var mapCanvas;
var unitCanvas;
var missileCanvas;
var devCanvas;
var mouseCanvas;
var webGLTutorialCanvas;

var mapCanvasContext;
var unitcanvasContext;
var missilecanvasContext;
var devcanvasContext;
var mouseCanvasContext;
var gl;                     //webGL canvas context

var canvasOffset;           //ebben van eltárolva, hogy mennyivel vannak eltolva az egyes canvas-ek. ez főleg az egér kurzor lekérdezésénél fontos (c_events.js)

var testTextureImage = new Image();

function init2DCanvasComponents() {    
    //DEBUG_LOG('Initalizate client side HTML components. START!');
    
    //gameDiv
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
    
    //mouseCanvas
    mouseCanvas = document.getElementById('mousecanvas');
    if (isEnabledMouseEvents()) { 
        initCanvas(mouseCanvas, canvasOffset);
        initMouseEvents(mouseCanvas);
    }        
    //DEBUG_LOG('Initalizate client side HTML components. SUCCESS END!');
}

function init3DCanvasComponents() {    
    webGLTutorialCanvas = document.getElementById('webgltutorialcanvas');
    initCanvas(webGLTutorialCanvas, canvasOffset);
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
    if (canvasElement.id === 'unitcanvas') {
        unitcanvasContext = canvasElement.getContext('2d');
        initCanvasContext(unitcanvasContext, true);
    }
    if (canvasElement.id === 'missilecanvas') {
        missilecanvasContext = canvasElement.getContext('2d');
        initCanvasContext(missilecanvasContext);
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
    if (canvasElement.id === 'webgltutorialcanvas') {
        gl = webGLTutorialCanvas.getContext("webgl", true) || webGLTutorialCanvas.getContext("experimental-webgl", true);
        if (!gl) {
            console.log('ERROR: Failed init the webGL canvas context!');
            return;
        }
        initCanvasContext(gl, false);
    }
}

function initCanvasContext(canvasContext, isCanvas2D) { 
    canvasContext.canvas.width = GAME_DIV_WIDTH;
    canvasContext.canvas.height = GAME_DIV_HEIGHT;
    if (isCanvas2D) {
        canvasContext.scale(1, 1);                              //mert méretet csak 2D-s canvas-eknél lehet beállítani
    }
}

function initMouseEvents(canvasElement) { 
    canvasElement.addEventListener("mouseup", mouseClickedEvent, false);	
}

function tasks() {
    //generateNewDungeon();
    
    //wglCanvasInit(1);
    //wgl1_Draw();
    //wgl3_Draw();
    
    //wglCanvasInit(2);
    //wgl4_Draw();
    //wgl4_Loop();
    
    //wglCanvasInit(3);
    //wgl5_Draw();

    wglCanvasInit(4);
    wgl6_Draw();
}

function main() {
    init2DCanvasComponents();
    init3DCanvasComponents();
    tasks();        
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

testTextureImage.onload = function () { 
    console.log('testTextureImage load is done...');
}
testTextureImage.src = "/images/sky.jpg";
