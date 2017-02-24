//webGL utility

/**
 * 
 */
function initObject3DElementArrayBuffer(glContext, arrayData, type) {
    try {
        var buffer = glContext.createBuffer();
        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, buffer);
        glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, arrayData, glContext.STATIC_DRAW);
        buffer.type = type;
        return buffer;
    } catch (err) {
        console.log('@WEB_GL_UTIL ERROR: ' + err);
        return null;
    }    
}