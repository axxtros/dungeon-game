//webGL tutorial #5 14/02/2017

//loading object



function wgl9_KeyDownHandler(event) {
    
}

//ez a c_socket.js-ből hívódik meg, mert rajzolás előtt meg kell várni, amíg a 3D-s object le nem jön a szerverről
function wgl9_Draw() {
    console.log('@wgl9_Draw ' + glObjectStorage[0]._id);

    n = initGLObject(glTestObject);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initGLObject(glObject) {
    if (glObject != null) {
        initArrayBuffer('a_Position', glObject._vertices, 3, gl.FLOAT);
        
        var u_FragColor = gl.getUniformLocation(glProgram, 'u_FragColor');
        gl.uniform4f(u_FragColor, 0.0, 1.0, 0.0, 0.0);

        var indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, glObject._vertexIndices, gl.STATIC_DRAW);
        
        return glObject._vertexIndices.length;
    }
    return 0;
}

function initArrayBuffer(attribute, data, num, type) {    
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    var a_attribute = gl.getAttribLocation(glProgram, attribute);
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);
}