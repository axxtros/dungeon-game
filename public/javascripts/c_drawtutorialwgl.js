//turtorial webgl draw funtcions 30/01/2017

//tutorials:
//https://webglfundamentals.org

var glProgram = null;

//Vertex shader program
var VSHADER_SOURCE =
    'void main() {\n' +
    '   gl_Position = vec4(0.0, 0.0, 0.0, 1.0);\n' +   
    '   gl_PointSize = 10.0;\n' +                       
    '}\n';

//Fragment shader program
var FSHADER_SOURCE =
    'void main() {\n' +
    '   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
    '}\n';

function wglCanvasInit() {
    initShaders();
    //https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    wglDraw1();
}

function wglDraw1() {
    gl.drawArrays(gl.POINTS, 0, 1);
}

//shader initializations ------------------------------------------------------
function initShaders() {
    vertexShader = cmpShader(VSHADER_SOURCE, gl.VERTEX_SHADER);
    fragmentShader = cmpShader(FSHADER_SOURCE, gl.FRAGMENT_SHADER);
    
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