
//demo1 -----------------------------------------------------------------------
var VSHADER_SOURCE_DEMO_1 =
    'attribute vec4 a_Position;\n' +
    'void main() {\n' +
    ' //gl_Position = vec4(0.0, 0.0, 0.0, 1.0);\n' +
    ' gl_Position = a_Position;\n' +
    ' gl_PointSize = 10.0;\n' +
    '}\n';

var FSHADER_SOURCE_DEMO_1 =
    'void main() {\n' +
    ' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
    '}\n';

//-----------------------------------------------------------------------------