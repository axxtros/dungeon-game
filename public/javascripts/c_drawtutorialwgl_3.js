//webGL tutorial #3 01/02/2017

//colors and textures
function wgl5_Draw() {
    var n = wgl5_InitVertexBuffers(gl);
    
    var a_PointSize = gl.getAttribLocation(glProgram, 'a_PointSize');
    gl.vertexAttrib1f(a_PointSize, 5.0);
    var u_FragColor = gl.getUniformLocation(glProgram, 'u_FragColor');
    gl.uniform4f(u_FragColor, 0.165, 0.165, 0.165, 1.0);
    
    var u_Translation = gl.getUniformLocation(glProgram, 'u_Translation');
    gl.uniform4f(u_Translation, 0.3, 0.0, 0.0, 0.0);
    
    var modelMatrix = new Matrix4();
    modelMatrix.setRotate(angle, 0, 0, 1);
    modelMatrix.translate(0, 0.5, 0, 1);
    
    var u_ModelMatrix = gl.getUniformLocation(glProgram, 'u_ModelMatrix');
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    
    gl.drawArrays(gl.POINTS, 0, n);
}

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
    
    return verticesNumber;
}