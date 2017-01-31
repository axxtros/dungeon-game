//turtorial webgl draw funtcions 30/01/2017

//tutorials:
//https://webglfundamentals.org

var glProgram = null;

//Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'void main() {\n' +
    '   gl_Position = a_Position; //vec4(0.0, 0.0, 0.0, 1.0);\n' +    
    '   gl_PointSize = a_PointSize; //10.0;\n' +                       
    '}\n';

//Fragment shader program
var FSHADER_SOURCE =
     'precision mediump float;\n' +
     'uniform vec4 u_FragColor;\n' + 
     'void main() {\n' +
     '  gl_FragColor = u_FragColor;\n' + 
     '}\n';

function wglCanvasInit() {
    initShaders();
    //https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);    
}

//egy pont középen a shaderek paraméterezve
function wglDraw1() {
    var a_Position = gl.getAttribLocation(glProgram, 'a_Position');
    gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
    var a_PointSize = gl.getAttribLocation(glProgram, 'a_PointSize');
    gl.vertexAttrib1f(a_PointSize, 4.0);
    var u_FragColor = gl.getUniformLocation(glProgram, 'u_FragColor');
    gl.uniform4f(u_FragColor, 0.0, 1.0, 0.0, 1.0);    
    gl.drawArrays(gl.POINTS, 0, 1);
}

//egérrel egy pont a shader-eket felparaméterezi
function wglDraw2(vertexX, vertexY, vertexZ) {
    wglCanvasInit();
    var a_Position = gl.getAttribLocation(glProgram, 'a_Position');
    gl.vertexAttrib3f(a_Position, vertexX, vertexY, vertexZ);
    var a_PointSize = gl.getAttribLocation(glProgram, 'a_PointSize');
    gl.vertexAttrib1f(a_PointSize, 4.0);
    var u_FragColor = gl.getUniformLocation(glProgram, 'u_FragColor');
    gl.uniform4f(u_FragColor, 0.0, 1.0, 0.0, 1.0);
    gl.drawArrays(gl.POINTS, 0, 1);
}

//buffer object használata (több vertex egyidejű átadása)
function wglDraw3() {
    var n = wgl3InitVertexBuffers(gl);
    
    var a_PointSize = gl.getAttribLocation(glProgram, 'a_PointSize');
    gl.vertexAttrib1f(a_PointSize, 5.0);
    var u_FragColor = gl.getUniformLocation(glProgram, 'u_FragColor');
    gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);

    gl.drawArrays(gl.POINTS, 0, n);
}

function wgl3InitVertexBuffers() {
    var vertices = new Float32Array([
        0.0, 0.5,   
       -0.5, 0.0, 
        0.5, 0.0
    ]);
    var verticesNumber = vertices.length / 2;
    
    var vertexBuffer = gl.createBuffer();                           //a webGL rendszerben létre kell hozni egy buffer objektumot, egy tárat, amelyben dolgozhatunk
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);                   //a buffer objektumot hozzá kell kötni a webGL rendszerben található buffer-eket tartalmazó tárolóhoz
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);       //a létrehozott buffer tárolóba beletesszük a vertex adatokat
    var a_Position = gl.getAttribLocation(glProgram, 'a_Position'); //létrehozunk egy vertex shader változót...
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);   //és hozzákötjük ehhez a vertex shader változóhoz a buffer objektumot
    gl.enableVertexAttribArray(a_Position);                         //engedélyezzük a vertex tömb hozzárendelését a változóhoz

    return verticesNumber;                                          //mindig a vertex-ek számával kell visszatérni, amennyiből az grafikus objektum áll
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