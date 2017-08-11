//webgldemo1 init.js 10/08/2017

var GAME_DIV_WIDTH = 800;						//default: 1000
var GAME_DIV_HEIGHT = 800;						//default: 800

var webglCanvas;
var gl;
var glProgram;

window.onload = function (event) {
    main();
}

window.onscroll = function (event) {
    main();
}

window.onresize = function (event) {
    main();
}

function main() {
    var gamediv = document.getElementById('gamediv');
    gamediv.style.width = GAME_DIV_WIDTH + 'px';
    gamediv.style.height = GAME_DIV_HEIGHT + 'px';
    canvasOffset = gamediv.getBoundingClientRect();        

    webglCanvas = document.getElementById('webglcanvas');
    //webglCanvas.style.top = canvasOffset.top + 'px';
    //webglCanvas.style.left = canvasOffset.left + 'px';
    //webglCanvas.style.width = canvasOffset.width + 'px';
    //webglCanvas.style.height = canvasOffset.height + 'px';

    gl = webglCanvas.getContext("webgl", true) || webglCanvas.getContext("experimental-webgl", true);
    //gl.canvas.width = 100;//GAME_DIV_WIDTH;
    //gl.canvas.height = 100;//GAME_DIV_HEIGHT;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    webGLDraw(1);
}

function webGLDraw(demoNum) {
    switch (demoNum) {
        case 1:
            demo1();
            break;
    }
}

function demo1() {
    initShaders(VSHADER_SOURCE_DEMO_1, FSHADER_SOURCE_DEMO_1);
    gl.drawArrays(gl.POINTS, 0, 1);   
}