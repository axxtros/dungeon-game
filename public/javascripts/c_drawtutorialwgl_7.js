//webGL tutorial #5 14/02/2017

//loading object



function wgl9_KeyDownHandler(event) {
    
}

//ez a c_socket.js-ből hívódik meg, mert rajzolás előtt meg kell várni, amíg a 3D-s object le nem jön a szerverről
function wgl9_Draw() {    
    if (glObjectStorage[0] != null) {
        //console.log('@wgl9_Draw ID: ' + glObjectStorage[0].id);
        
        var u_FragColor = gl.getUniformLocation(glProgram, 'a_Color');
        gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 0.0);

        var modelMatrix = new Matrix4();
        modelMatrix.setRotate(45, 0, 0, 1);
        var u_ModelMatrix = gl.getUniformLocation(glProgram, 'u_ModelMatrix');
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

        gl.enable(gl.DEPTH_TEST);
        wglCanvasClear();
        n = initGLObject(glObjectStorage[0]);
        //gl.drawArrays(gl.POINTS, 0, n);
        

        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);        
    } else { 
        console.log('ERROR: No draw!');
    }
}

function initGLObject(glObject) {
    if (glObject != null) {
        initArrayBuffer('a_Position', glObject.vertices, 3, gl.FLOAT);                        
        var indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, glObject.vertexIndices, gl.STATIC_DRAW);
        return (glObject.vertices.length - 1) / 3;
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