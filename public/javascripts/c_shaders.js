//webGL shaders and shader initialization 01/02/2017

var glProgram = null;           //a shadereket tartalmazó program

//-----------------------------------------------------------------------------
//start...
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

//-----------------------------------------------------------------------------
//matrix, animation
var VSHADER_SOURCE_2 =
 'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'uniform vec4 u_Translation;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'void main() {\n' +
    '   gl_Position = u_ModelMatrix * a_Position;// + u_Translation;\n' +    
    '   gl_PointSize = a_PointSize; //10.0;\n' +                       
    '}\n';

//Fragment shader program
var FSHADER_SOURCE_2 =
 'precision mediump float;\n' +
     'uniform vec4 u_FragColor;\n' + 
     'void main() {\n' +
     '  gl_FragColor = u_FragColor;\n' + 
     '}\n';

//-----------------------------------------------------------------------------
//colors and buffer array
var VSHADER_SOURCE_3 =
 'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'uniform vec4 u_Translation;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'attribute vec4 a_Color;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '   gl_Position = a_Position;// + u_Translation;\n' +    
    '   gl_PointSize = a_PointSize; //10.0;\n' +
    '   v_Color = a_Color;\n' +                       
    '}\n';

//Fragment shader program
var FSHADER_SOURCE_3 =
 'precision mediump float;\n' +
     'uniform vec4 u_FragColor;\n' +
     'varying vec4 v_Color;\n' + 
     'void main() {\n' +
     '  gl_FragColor = v_Color;//u_FragColor;\n' + 
     '}\n';

//-----------------------------------------------------------------------------
//texture
var VSHADER_SOURCE_4 =
 'attribute vec4 a_Position;\n' +    
    'attribute vec2 a_TexCoord;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main() {\n' +
    '   gl_Position = a_Position;\n' +    
    '   gl_PointSize = 10.0;\n' +
    '   v_TexCoord = a_TexCoord;\n' +    
    '}\n';

//Fragment shader program
var FSHADER_SOURCE_4 =
 'precision mediump float;\n' +
     'uniform sampler2D u_Sampler;\n' +
     'varying vec2 v_TexCoord;\n' + 
     'void main() {\n' +
     '  gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' + 
     '}\n';

//-----------------------------------------------------------------------------
//user's view, control view, clipping, foreground/background control
var VSHADER_SOURCE_5 =
 'attribute vec4 a_Position;\n' +    
    'uniform vec4 u_Translation;\n' +
    'uniform mat4 u_ProjMatrix;\n' +
    'uniform mat4 u_ViewMatrix;\n' +
    'uniform mat4 u_ModelMatrix;\n' +    
    'attribute float a_PointSize;\n' +
    'attribute vec4 a_Color;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '   gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' +
    '   gl_PointSize = 10.0;\n' +    
    '   v_Color = a_Color;\n' + 
    '}\n';

//Fragment shader program
var FSHADER_SOURCE_5 =
 'precision mediump float;\n' +
     'uniform vec4 u_FragColor;\n' +
     'varying vec4 v_Color;\n' + 
     'void main() {\n' +
     '  gl_FragColor = v_Color;\n' + 
     '}\n';


function wglCanvasInit(shaderNumber) {
    switch (shaderNumber) {
        case 1: c_shaders_initShaders(VSHADER_SOURCE_1, FSHADER_SOURCE_1); break;
        case 2: c_shaders_initShaders(VSHADER_SOURCE_2, FSHADER_SOURCE_2); break;
        case 3: c_shaders_initShaders(VSHADER_SOURCE_3, FSHADER_SOURCE_3); break;
        case 4: c_shaders_initShaders(VSHADER_SOURCE_4, FSHADER_SOURCE_4); break;
        case 5: c_shaders_initShaders(VSHADER_SOURCE_5, FSHADER_SOURCE_5); break;
    }
    //https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    wglCanvasClear();
}

function wglCanvasClear() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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