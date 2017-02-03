//webGL tutorial #4 03/02/2017

//user's view, control view, clipping, foreground/background control

function wgl7_Draw() {
            
    var n = wgl7_InitVertexBuffers(gl);    
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function wgl7_InitVertexBuffers() {
    var verticesTexCoords = new Float32Array([
        -0.2,  0.0, 
         0.2,  0.0, 
         0.0,  0.4
    ]);
    var vertexDefNumber = verticesTexCoords.length / 2;
    
    var vertexTexCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
    
    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
    //vertices
    var a_Position = gl.getAttribLocation(glProgram, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 2, 0);
    gl.enableVertexAttribArray(a_Position);

    return vertexDefNumber;
}