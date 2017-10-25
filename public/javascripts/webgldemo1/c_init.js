//webgldemo1 init.js 10/08/2017

var CURRENT_DEMO_TASK = 1;

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
    init();
    runWebGLDemo(CURRENT_DEMO_TASK);
}

function init() {
    var gamediv = document.getElementById('gamediv');
    gamediv.style.width = GAME_DIV_WIDTH + 'px';
    gamediv.style.height = GAME_DIV_HEIGHT + 'px';
    canvasOffset = gamediv.getBoundingClientRect();        

    webglCanvas = document.getElementById('webglcanvas');
    webglCanvas.style.top = canvasOffset.top + 'px';
    webglCanvas.style.left = canvasOffset.left + 'px';
    webglCanvas.style.width = canvasOffset.width + 'px';
    webglCanvas.style.height = canvasOffset.height + 'px';    

    gl = webglCanvas.getContext("webgl", true) || webglCanvas.getContext("experimental-webgl", true);
    gl.canvas.width = GAME_DIV_WIDTH;
    gl.canvas.height = GAME_DIV_HEIGHT;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);  

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
}

function runWebGLDemo(demoNum) {
    switch (demoNum) {
        case 1:
            webGLDemo1();
            break;
    }
}

function webGLDemo1() {
    initShaders(VSHADER_SOURCE_DEMO_1, FSHADER_SOURCE_DEMO_1);    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, initWebGLDemo1VertexBuffer());   
}

function initWebGLDemo1VertexBuffer() {
    var vertices = new Float32Array([
        -0.5,  0.5, 0.0, 
         0.5,  0.5, 0.0, 
        -0.5, -0.5, 0.0, 
         0.5, -0.5, 0.0
    ]);

    var n = 4;   //vertex number 

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    var a_Position = gl.getAttribLocation(glProgram, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    
    return n;
}