//webGL tutorial #4 02/02/2017

//texture
function wgl6_Draw() {
    var n = wgl6_InitVertexBuffers(gl);
    gl.drawArrays(gl.POINTS, 0, n);
}

function wgl6_InitVertexBuffers() {
    var verticesSize = new Float32Array([
        -0.1, 0.1, 10.0, 0.255, 0.0, 0.0,  
        0.1, 0.1, 20.0, 0.0, 0.255, 0.0,  
        -0.1, -0.1, 30.0, 0.0, 0.0, 0.255,  
        0.1, -0.1, 40.0, 0.165, 0.165, 0.165
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