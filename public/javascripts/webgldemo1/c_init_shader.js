//shader initializations ------------------------------------------------------
function initShaders(v_shader_source, f_shader_source) {
    vertexShader = cmpShader(v_shader_source, gl.VERTEX_SHADER);
    fragmentShader = cmpShader(f_shader_source, gl.FRAGMENT_SHADER);
    
    var glProgram = gl.createProgram();
    gl.attachShader(glProgram, vertexShader);
    gl.attachShader(glProgram, fragmentShader);
    gl.linkProgram(glProgram);
    
    if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
        console.log("Unable to initialize the shader program.");
    }
    gl.useProgram(glProgram);
}

function cmpShader(src, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log("Error compiling shader: " + gl.getShaderInfoLog(shader));
    }
    return shader;
}