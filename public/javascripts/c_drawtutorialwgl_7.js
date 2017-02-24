//webGL tutorial #5 14/02/2017

//shadow

/**
 *  Tutorials:
 *  
 */ 

var triangle;
var backgroundPlane;

function wgl9_KeyDownHandler(event) {
    
}

function wgl9_Draw() {
    gl.drawArrays(gl.TRIANGLES, 0, initVertexBuffersForTriangle());
}

function initVertexBuffersForTriangle() {
    var vertices = new Float32Array([
        -0.1, 0.0, 0.0,
         0.1, 0.0, 0.0,
         0.0, 0.1, 0.0
    ]);
    
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(glProgram, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    var colors = new Float32Array([
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0
    ]);
    
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    var a_Color = gl.getAttribLocation(glProgram, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Color);
    
    return vertices.length / 3;
}