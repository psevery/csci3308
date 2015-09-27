// FR-01 using WebGL context
//

// Mozilla tutorials (and a lot of tutorials in general)
//  embed the shaders as <script> elements in the html,
//  then load them using a separate function, but since
//  ECMAScript 6 allows for creating strings like this,
//  I think it's easier and simple to just write the
//  shader as part of the javascript file.

// NOTE: All caps vars are considered global constants.
var VERTEX_SHADER_SOURCE = `
    attribute vec3 vpos;

    void main(void) {
        gl_Position = vec4(vpos, 1.0);
    }
`;

var FRAGMENT_SHADER_SOURCE = `
    void main(void) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
`;

// RETURN VALUE
//  On success, returns an experimental-webgl context
//  object. On failure, returns null and displays an
//  alert message.
function getWebGLContext(canvas) {
    var gl = null;
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
        console.error(e)
    }
    if (!gl) {
        //alert("Failed to initialize WebGL.");
        console.error("Failed to initialize WebGL.");
        gl = null;
    }
    return gl;
}

// RETURN VALUE
//  On success, returns the context passed in
//  with a compiled shader program and initialized
//  attribute arrays. On failure, returns null and
//  displays an alert message.
function compileShaders(gl, vertexShaderSource, fragmentShaderSource) {
    // Compile shaders, handle errors
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        //alert("Error compiling vertex shader: " + gl.getShaderInfoLog(vertexShader));
        console.error("Error compiling vertex shader: " + gl.getShaderInfoLog(vertexShader));
        return null;
    }
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        //alert("Error compiling fragment shader: " + gl.getShaderInfoLog(fragmentShader));
        console.error("Error compiling fragment shader: " + gl.getShaderInfoLog(fragmentShader));
        return null;
    }

    // Link shaders into final program
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        //alert("Unable to intialize the shader program.");
        console.error("Unable to intialize the shader program.");
        return null;
    }
    gl.useProgram(shaderProgram);

    // Initialize shader globals
    vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vpos");
    gl.enableVertexAttribArray(vertexPositionAttribute);

    return gl;
}

function start() {
    var canvas = document.getElementById("canvas");

    gl = getWebGLContext(canvas);
    if (!gl) {
        console.error("Error getting WebGL Context, exiting...");
        return;
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl = compileShaders(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE);
    if (!gl) {
        console.error("Error compiling shaders, exiting...");
        return;
    }
}
