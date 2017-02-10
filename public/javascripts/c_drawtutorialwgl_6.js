﻿//webGL tutorial #5 10/02/2017

//normals, light and shadow

/*
 * Tutorials: 
 * 
 */

var DRAW_2D_SHAPE = false;

var eyeX = 0.0;
var eyeY = 0.0;
var eyeZ = 5.0;
var translateX = 0.0;
var translateY = 0.0;
var translateZ = 0.0;

var step = 1.0;
var px = 0.0;
var py = 0.0;
var pz = 0.0;

var angle = 0.0;
var plusAngle = 5.0;

function wgl8_KeyDownHandler(event) {
    console.log('key code: ' + event.keyCode);
    if (event.keyCode == 38) {	//up
        eyeY = eyeY + step;
    }
    if (event.keyCode == 40) {	//down	
        eyeY = eyeY - step;
    }
    if (event.keyCode == 37) {	//left
        eyeX = eyeX - step;
    }
    if (event.keyCode == 39) {	//right
        eyeX = eyeX + step;
    }
    if (event.keyCode == 87) {	//w
        eyeZ = eyeZ - step;
    }
    if (event.keyCode == 83) {	//s
        eyeZ = eyeZ + step;
    }
    if (event.keyCode == 81) {	//q
        translateX -= step;
    }
    if (event.keyCode == 69) {	//e
        translateX += step;
    }
    if (event.keyCode == 65) {	//a
        angle -= plusAngle;
    }
    if (event.keyCode == 68) {	//d
        angle += plusAngle;
    }
    wgl8_Draw();
}

function wgl8_Draw() {
    
    //light
    var u_LightColor = gl.getUniformLocation(glProgram, 'u_LightColor');
    var u_LightDirection = gl.getUniformLocation(glProgram, 'u_LightDirection');
    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    var lightDirection = new Vector3([0.5, 3.0, 4.0]);
    lightDirection.normalize();
    gl.uniform3fv(u_LightDirection, lightDirection.elements);

    var projMatrix = new Matrix4();
    //projMatrix.setOrtho(-2.0, 2.0, -2.0, 2.0, 10.0, -10.0);
    //projMatrix.setPerspective(70, webGLTutorialCanvas.width / webGLTutorialCanvas.height, 1, 100);    
    projMatrix.setPerspective(60, webGLTutorialCanvas.width / webGLTutorialCanvas.height, 1, 100);    
    var u_ProjMatrix = gl.getUniformLocation(glProgram, 'u_ProjMatrix');
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
    
    var viewMatrix = new Matrix4();
    viewMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
    //viewMatrix.setLookAt(eyeX, eyeY, eyeZ, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
    //viewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0);        
    var u_ViewMatrix = gl.getUniformLocation(glProgram, 'u_ViewMatrix');
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    
    var modelMatrix = new Matrix4();
    modelMatrix.setTranslate(translateX, translateY, translateZ);
    modelMatrix.setRotate(angle, 0, 1, 0);
    var u_ModelMatrix = gl.getUniformLocation(glProgram, 'u_ModelMatrix');
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    
    gl.enable(gl.DEPTH_TEST);
    wglCanvasClear();
    //gl.enable(gl.POLYGON_OFFSET_FILL);
    
    var n = null;
    n = wgl8_InitVertexBuffers_3D_Cube();
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);          //összefűzésben így kell rajzolni!!!    
}

function wgl8_InitVertexBuffers_3D_Cube() {
    var vertices = new Float32Array([   // Coordinates
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, // v0-v1-v2-v3 front
        1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, // v0-v3-v4-v5 right
        1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, // v1-v6-v7-v2 left
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, // v7-v4-v3-v2 down
        1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0  // v4-v7-v6-v5 back
    ]);
    
    
    var colors = new Float32Array([    // Colors
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,     // v0-v1-v2-v3 front
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,     // v0-v3-v4-v5 right
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,     // v0-v5-v6-v1 up
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,     // v1-v6-v7-v2 left
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,     // v7-v4-v3-v2 down
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0　    // v4-v7-v6-v5 back
    ]);
    
    
    var normals = new Float32Array([    // Normal
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,  // v7-v4-v3-v2 down
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0   // v4-v7-v6-v5 back
    ]);

    // Indices of the vertices
    var indices = new Uint8Array([
        0, 1, 2, 0, 2, 3,    // front
        4, 5, 6, 4, 6, 7,    // right
        8, 9, 10, 8, 10, 11,    // up
        12, 13, 14, 12, 14, 15,    // left
        16, 17, 18, 16, 18, 19,    // down
        20, 21, 22, 20, 22, 23     // back
    ]);

    // Write the vertex property to buffers (coordinates, colors and normals)
    if (!initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT)) return -1;
    if (!initArrayBuffer(gl, 'a_Color', colors, 3, gl.FLOAT)) return -1;
    if (!initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT)) return -1;
    
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    
    return indices.length;
}

function initArrayBuffer(gl, attribute, data, num, type) {
    // Create a buffer object
    var buffer = gl.createBuffer();
    if (!buffer) {
        console.log('Failed to create the buffer object');
        return false;
    }
    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    // Assign the buffer object to the attribute variable
    var a_attribute = gl.getAttribLocation(glProgram, attribute);
    if (a_attribute < 0) {
        console.log('Failed to get the storage location of ' + attribute);
        return false;
    }
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    // Enable the assignment of the buffer object to the attribute variable
    gl.enableVertexAttribArray(a_attribute);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    return true;
}