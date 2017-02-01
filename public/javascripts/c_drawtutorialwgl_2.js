//webGL tutorial #2 01/02/2017

var then = Date.now();
var interval = 1000 / 200;
var angle = 0;

//moving, rotating, scaling
function wgl4_Draw() {
    var n = wgl4_InitVertexBuffers(gl);    

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

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}

function wgl4_Loop() {
    requestAnimationFrame(wgl4_Loop);        
    
    now = Date.now();
    delta = now - then;
    
    if (delta > interval) {
        wgl4_Draw(angle);
        angle++;
        if (angle === 360) {
            angle = 0;
        }
        then = now - (delta % interval);
    }
}

function wgl4_InitVertexBuffers() {
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