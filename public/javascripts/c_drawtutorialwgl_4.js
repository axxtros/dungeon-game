//webGL tutorial #4 02/02/2017

//texture
function wgl6_Draw() {
    var n = wgl6_InitVertexBuffers(gl);
    wgl6_InitTexture();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}

function wgl6_InitVertexBuffers() {
    var verticesTexCoords = new Float32Array([
        -0.5,  0.5,   0.0, 1.0,
        -0.5, -0.5,   0.0, 0.0,
         0.5,  0.5,   1.0, 1.0,
         0.5, -0.5,   1.0, 0.0
    ]);
    var vertexDefNumber = verticesTexCoords.length / 4;
    
    var vertexTexCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
    
    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
    //vertices
    var a_Position = gl.getAttribLocation(glProgram, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);
    //textures
    var a_TexCoord = gl.getAttribLocation(glProgram, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    return vertexDefNumber;
}

function wgl6_InitTexture() {
    var texture = gl.createTexture();                                                       //új textúra objektum létrehozása a webGL rendszerben (törlés: gl.deleteTexture(texture))
        
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);                                              //textúra megfordítása y tengely mentén, hogy helyesen legyen felfeszíve a felületre

    gl.activeTexture(gl.TEXTURE0);                                                          //texture unit aktiválása, a webGL-ben ebből alapértelmezetten 0..7 van
    gl.bindTexture(gl.TEXTURE_2D, texture);                                                 //a textúra objektum hozzákötése a textúra unit-hoz + textúra típus megadása (2D) [a textura unit-on belüli aktív slot-hoz]
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);                      //a textúra paramétereinek megadása
                                                                                            //175.old az egyes paraméterek pontos definíciója    
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, testTextureImage);    //a textúra kép összerendelése a textúra objektummal
    
    var u_Sampler = gl.getUniformLocation(glProgram, 'u_Sampler');      
    gl.uniform1i(u_Sampler, 0);                                                             //a fenti textúra objektum átadása a webGL rendszernek (a második paramétere a kiválasztott texture unit number)
}