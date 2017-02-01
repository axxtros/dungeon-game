﻿//webGL shaders and shader initialization 01/02/2017

var glProgram = null;           //a shadereket tartalmazó program

//Vertex shader program
var VSHADER_SOURCE_1 =
 'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'void main() {\n' +
    '   gl_Position = a_Position; //vec4(0.0, 0.0, 0.0, 1.0);\n' +    
    '   gl_PointSize = a_PointSize; //10.0;\n' +                       
    '}\n';

//Fragment shader program
var FSHADER_SOURCE_1 =
 'precision mediump float;\n' +
     'uniform vec4 u_FragColor;\n' + 
     'void main() {\n' +
     '  gl_FragColor = u_FragColor;\n' + 
     '}\n';

function wglCanvasInit(shaderNumber) {
    switch (shaderNumber) {
        case 1: c_shaders_initShaders(VSHADER_SOURCE_1, FSHADER_SOURCE_1); break;
    }
    //https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

//shader initializations ------------------------------------------------------
function c_shaders_initShaders(v_shader_source, f_shader_source) {
    vertexShader = cmpShader(v_shader_source, gl.VERTEX_SHADER);
    fragmentShader = cmpShader(f_shader_source, gl.FRAGMENT_SHADER);
    
    glProgram = gl.createProgram();
    gl.attachShader(glProgram, vertexShader);
    gl.attachShader(glProgram, fragmentShader);
    gl.linkProgram(glProgram);
    
    if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
        console.log("Unable to initialize the shader program.");
    }
    gl.useProgram(glProgram);
}

function cmpShader(src, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log("Error compiling shader: " + gl.getShaderInfoLog(shader));
    }
    return shader;
}