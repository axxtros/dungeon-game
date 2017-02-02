//webGL tutorial #3 01/02/2017

//colors and buffer array
function wgl5_Draw() {
    //var n = wgl5_InitVertexBuffers(gl);
    var n = wgl5_InitVertexBuffers_2(gl);
    
    //var a_PointSize = gl.getAttribLocation(glProgram, 'a_PointSize');
    //gl.vertexAttrib1f(a_PointSize, 5.0);

    //var u_FragColor = gl.getUniformLocation(glProgram, 'u_FragColor');
    //gl.uniform4f(u_FragColor, 0.165, 0.165, 0.165, 1.0);
    
    var u_Translation = gl.getUniformLocation(glProgram, 'u_Translation');
    gl.uniform4f(u_Translation, 0.3, 0.0, 0.0, 0.0);
    
    var modelMatrix = new Matrix4();
    modelMatrix.setRotate(angle, 0, 0, 1);
    modelMatrix.translate(0, 0.5, 0, 1);
    
    //var u_ModelMatrix = gl.getUniformLocation(glProgram, 'u_ModelMatrix');
    //gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    
    gl.drawArrays(gl.POINTS, 0, n);
}

//a vertexeket és a vertex méretek két különálló bufferből töltjük fel
function wgl5_InitVertexBuffers() {
    var vertices = new Float32Array([
        -0.1,  0.1,   
         0.1,  0.1, 
        -0.1, -0.1,
         0.1, -0.1
    ]);        

    var verticesNumber = vertices.length / 2;    
    
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(glProgram, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    
    var sizes = new Float32Array([
        10.0,
        20.0,
        30.0,
        40.0
    ]);

    var sizeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
    var a_PointSize = gl.getAttribLocation(glProgram, 'a_PointSize');
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_PointSize);

    return verticesNumber;
}

//közös bufferben a vertices és a sizes
function wgl5_InitVertexBuffers_2() {
    var verticesSize = new Float32Array([
        -0.1,  0.1,   10.0,   0.255, 0.0,   0.0,  
         0.1,  0.1,   20.0,   0.0,   0.255, 0.0,  
        -0.1, -0.1,   30.0,   0.0,   0.0,   0.255,  
         0.1, -0.1,   40.0,   0.165, 0.165, 0.165
    ]);    
    var vertexDefNumber = verticesSize.length / 6;

    var vertexSizeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesSize, gl.STATIC_DRAW);
    
    var FSIZE = verticesSize.BYTES_PER_ELEMENT;
    //vertices
    var a_Position = gl.getAttribLocation(glProgram, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);
    //vertex sizes
    var a_PointSize = gl.getAttribLocation(glProgram, 'a_PointSize');
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 6, FSIZE * 2);
    gl.enableVertexAttribArray(a_PointSize);
    //colors
    var a_Color = gl.getAttribLocation(glProgram, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    return vertexDefNumber;
}