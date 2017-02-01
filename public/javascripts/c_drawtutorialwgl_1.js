//turtorial webgl draw funtcions 30/01/2017
//webGL tutorial #1

//tutorials:
//https://webglfundamentals.org

//-----------------------------------------------------------------------------
//egy pont középen a shaderek paraméterezve
function wgl1_Draw() {
    var a_Position = gl.getAttribLocation(glProgram, 'a_Position');
    gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
    var a_PointSize = gl.getAttribLocation(glProgram, 'a_PointSize');
    gl.vertexAttrib1f(a_PointSize, 4.0);
    var u_FragColor = gl.getUniformLocation(glProgram, 'u_FragColor');
    gl.uniform4f(u_FragColor, 0.0, 1.0, 0.0, 1.0);    
    gl.drawArrays(gl.POINTS, 0, 1);
}

//-----------------------------------------------------------------------------
//egérrel egy pont a shader-eket felparaméterezi
function wgl2_Draw(vertexX, vertexY, vertexZ) {
    wglCanvasInit();
    var a_Position = gl.getAttribLocation(glProgram, 'a_Position');
    gl.vertexAttrib3f(a_Position, vertexX, vertexY, vertexZ);
    var a_PointSize = gl.getAttribLocation(glProgram, 'a_PointSize');
    gl.vertexAttrib1f(a_PointSize, 4.0);
    var u_FragColor = gl.getUniformLocation(glProgram, 'u_FragColor');
    gl.uniform4f(u_FragColor, 0.0, 1.0, 0.0, 1.0);
    gl.drawArrays(gl.POINTS, 0, 1);
}

//-----------------------------------------------------------------------------
//buffer object használata (több vertex egyidejű átadása)
function wgl3_Draw() {
    var n = wgl3_InitVertexBuffers(gl);
    
    var a_PointSize = gl.getAttribLocation(glProgram, 'a_PointSize');
    gl.vertexAttrib1f(a_PointSize, 5.0);
    var u_FragColor = gl.getUniformLocation(glProgram, 'u_FragColor');
    gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);

    gl.drawArrays(gl.POINTS, 0, n);
}

function wgl3_InitVertexBuffers() {
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