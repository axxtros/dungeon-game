//webGL tutorial #2 01/02/2017

//moving, rotating, scaling
function wgl4_Draw() {
    var n = wgl4_InitVertexBuffers(gl);

    var a_PointSize = gl.getAttribLocation(glProgram, 'a_PointSize');
    gl.vertexAttrib1f(a_PointSize, 5.0);
    var u_FragColor = gl.getUniformLocation(glProgram, 'u_FragColor');
    gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);

    gl.drawArrays(gl.POINTS, 0, n);
}

function wgl4_InitVertexBuffers() {
    var vertices = new Float32Array([
        0.0, 0.5,   
        -0.5, 0.0, 
        0.5, 0.0
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