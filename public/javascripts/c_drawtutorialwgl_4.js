﻿//webGL tutorial #4 02/02/2017

//texture
function wgl6_Draw() {
    var n = wgl6_InitVertexBuffers(gl);
    gl.drawArrays(gl.POINTS, 0, n);
}

function wgl6_InitVertexBuffers() {
    var verticesSize = new Float32Array([
        -0.1,  0.1, 
         0.1,  0.1, 
        -0.1, -0.1, 
         0.1, -0.1, 
    ]);
    var vertexDefNumber = verticesSize.length / 2;
    
    var vertexSizeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesSize, gl.STATIC_DRAW);
    
    var FSIZE = verticesSize.BYTES_PER_ELEMENT;
    //vertices
    var a_Position = gl.getAttribLocation(glProgram, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 2, 0);
    gl.enableVertexAttribArray(a_Position);    
    
    return vertexDefNumber;
}