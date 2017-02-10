//webGL tutorial #4 03/02/2017

//user's view, control view, clipping, foreground/background control

/*
 * Nézd át ezeket a turotial-okat, a mátrixokról szól!!!
 * http://www.codinglabs.net/article_world_view_projection_matrix.aspx
 * http://www.opengl-tutorial.org/beginners-tutorials/tutorial-3-matrices/
 * 
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

function wgl7_KeyDownHandler(event) {
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
        angle -= step;
    }
    if (event.keyCode == 68) {	//d
        angle += step;
    }
    wgl7_Draw();
}

function wgl7_Draw() {

    var projMatrix = new Matrix4();
    //projMatrix.setOrtho(-2.0, 2.0, -2.0, 2.0, 10.0, -10.0);
    projMatrix.setPerspective(120, webGLTutorialCanvas.width / webGLTutorialCanvas.height, 1, 20);
    var u_ProjMatrix = gl.getUniformLocation(glProgram, 'u_ProjMatrix');
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

    var viewMatrix = new Matrix4();
    viewMatrix.setLookAt(eyeX, eyeY, eyeZ, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
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
    if (DRAW_2D_SHAPE) {                    //háromszögek
        n = wgl7_InitVertexBuffers(gl);
        gl.drawArrays(gl.TRIANGLES, 0, n);
    } else {                                //kocka
        n = wgl7_InitVertexBuffers_3D_Cube();        
        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);          //összefűzésben így kell rajzolni!!!
    }   
}

function wgl7_InitVertexBuffers() {
    var verticesTexCoords = new Float32Array([
       -0.2, 0.0, 0.0,   0.0, 0.0, 1.0,
        0.2, 0.0, 0.0,   0.0, 0.0, 1.0,
        0.0, 0.4, 0.0,   0.0, 0.0, 1.0,
        
       -0.2, 0.0, -0.2,  0.0, 1.0, 0.0,
        0.2, 0.0, -0.2,  0.0, 1.0, 0.0,
        0.0, 0.4, -0.2,  0.0, 1.0, 0.0,

       -0.2, 0.0, -0.4,  1.0, 0.0, 0.0,
        0.2, 0.0, -0.4,  1.0, 0.0, 0.0,
        0.0, 0.4, -0.4,  1.0, 0.0, 0.0,

        0.2, 0.0, 0.0,   1.0, 0.0, 0.0,
       -0.2, 0.0, 0.0,   1.0, 0.0, 0.0,
        0.0, 0.0, 1.0,   1.0, 0.0, 0.0,

        0.2, 0.0, -0.4,  0.0, 0.0, 1.0,
       -0.2, 0.0, -0.4,  0.0, 0.0, 1.0,                        
        0.0, 0.0, -0.6,  0.0, 0.0, 1.0
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

function wgl7_InitVertexBuffers_3D_Cube() {
    var verticesColors = new Float32Array([
        -1.0,  1.0,  1.0,   1.0, 0.0, 1.0,      /*magenta [0]*/
         1.0,  1.0,  1.0,   1.0, 1.0, 1.0,      /*white   [1]*/
         1.0, -1.0,  1.0,   1.0, 1.0, 0.0,      /*yellow  [2]*/
        -1.0, -1.0,  1.0,   1.0, 0.0, 0.0,      /*red     [3]*/

        -1.0,  1.0, -1.0,   0.0, 0.0, 1.0,      /*blue    [4]*/
         1.0,  1.0, -1.0,   0.0, 1.0, 1.0,      /*cyan    [5]*/
         1.0, -1.0, -1.0,   0.0, 1.0, 0.0,      /*green   [6]*/
        -1.0, -1.0, -1.0,   0.0, 0.0, 0.0       /*black   [7]*/
    ]);        
    var vertexDefNumber = verticesColors.length / 6;            //ha összefűzés van, akkor nem ezzel térünk vissza
    
    var indices = new Uint8Array([
        0, 1, 2,   0, 3, 2,                       /*front*/
        0, 1, 4,   1, 4, 5,                       /*top*/
        7, 6, 2,   7, 2, 3,                       /*bottom*/
        4, 5, 6,   4, 7, 6,                       /*back*/
        0, 7, 3,   0, 4, 7,                       /*left*/
        1, 5, 2,   5, 6, 2                        /*right*/
    ]);
    var indicesLength = indices.length;                         //összefűzésnél az összefüző buffer hossza  a visszatérési érték
    
    //vertexBuffer
    var vertexTexCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);    
    
    //indexbuffer (más a webGL rendszerben a cél: ELEMENT_ARRAY_BUFFER, erre figyelj!!! )
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    
    var FSIZE = verticesColors.BYTES_PER_ELEMENT;
    //vertices
    var a_Position = gl.getAttribLocation(glProgram, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);
    //colors
    var a_Color = gl.getAttribLocation(glProgram, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    return indicesLength;
}