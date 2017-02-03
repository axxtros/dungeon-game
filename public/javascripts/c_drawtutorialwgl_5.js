//webGL tutorial #4 03/02/2017

//user's view, control view, clipping, foreground/background control

function wgl7_Draw() {
            
    var n = wgl7_InitVertexBuffers(gl);
    
    var modelMatrix = new Matrix4();
    modelMatrix.setRotate(0, 0, 0, 1);

    var u_ModelMatrix = gl.getUniformLocation(glProgram, 'u_ModelMatrix');
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
        
    var viewMatrix = new Matrix4();    
    viewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0);    
    
    var u_ViewMatrix = gl.getUniformLocation(glProgram, 'u_ViewMatrix');
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);    
    
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function wgl7_InitVertexBuffers() {
    var verticesTexCoords = new Float32Array([
        -0.2, 0.0, -0.4,  1.0, 0.0, 0.0,
         0.2, 0.0, -0.4,  1.0, 0.0, 0.0,
         0.0, 0.4, -0.4,  1.0, 0.0, 0.0,

        -0.2, 0.0, -0.2,  0.0, 1.0, 0.0,
         0.2, 0.0, -0.2,  0.0, 1.0, 0.0,
         0.0, 0.4, -0.2,  0.0, 1.0, 0.0,

       - 0.2, 0.0,  0.0,  0.0, 0.0, 1.0,
         0.2, 0.0,  0.0,  0.0, 0.0, 1.0,
         0.0, 0.4,  0.0,  0.0, 0.0, 1.0
    ]);
    var vertexDefNumber = verticesTexCoords.length / 6;
    
    var vertexTexCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
    
    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
    //vertices
    var a_Position = gl.getAttribLocation(glProgram, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);
    //colors
    var a_Color = gl.getAttribLocation(glProgram, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    return vertexDefNumber;
}