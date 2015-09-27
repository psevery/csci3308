// FR-01 using WebGL context
//

// Generally, mutable global variables
// are a bad thing. However, in the case
// of game programming, I believe they
// result in a more comprehensible program,
// because the lifetime of all of these
// variables is static.
// MUTABLE GLOBAL VARS
var glCanvas;               // HTML5 canvas DOM element, id="canvas"
var gl;                     // WebGL context
var squareVertexBuffer;     // Vertex buffer for drawing squares
var vertexPositionAttribute // For sending vertices to shaders
var shaderProgram;          // Shader program being used

// Mozilla tutorials (and a lot of tutorials in general)
//  embed the shaders as <script> elements in the html,
//  then load them using a separate function, but since
//  ECMAScript 6 allows for creating strings like this,
//  I think it's easier and simple to just write the
//  shader as part of the javascript file.
//  NOTE: All caps vars are considered global constants.
var VERTEX_SHADER_SOURCE = `
    attribute vec3 vpos;

    void main(void) {
        gl_Position = vec4(vpos, 1.0);
    }
`;
var FRAGMENT_SHADER_SOURCE = `
    void main(void) {
        gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);
    }
`;

// USES GLOBAL VARS
//  glCanvas
//  gl
function initWebGLContext() {
    try {
        gl = glCanvas.getContext("experimental-webgl");
        gl.viewportWidth = glCanvas.width;
        gl.viewportHeight = glCanvas.height;

        // Optional clear() call, set canvas to black
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    } catch (e) {
        console.error(e)
    }
    if (!gl) {
        console.error("Failed to initialize WebGL.");
        gl = null;
        return;
    }
}

// PARAMS
//  vertexShaderSource: shader script as string
//  fragmentShaderSource: shader script as string
// USES GLOBAL VARS
//  gl
function initShaderProgram(vertexShaderSource, fragmentShaderSource) {
    // Compile shaders, handle errors
    // The compilation of individual shaders could be split into a
    // separate function, but personally I think it's easier to
    // handle errors like this. I'll leave it up to you guys if you
    // would like to change it.
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error(
            "Error compiling vertex shader: " +
            gl.getShaderInfoLog(vertexShader)
        );
        gl = null;
        return;
    }
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error(
            "Error compiling fragment shader: " +
            gl.getShaderInfoLog(fragmentShader)
        );
        gl = null;
        return;
    }

    // Link shaders into final program
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error("Unable to intialize the shader program.");
        gl = null;
        return;
    }
    gl.useProgram(shaderProgram);

    // Initialize shader globals
    vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vpos");
    gl.enableVertexAttribArray(vertexPositionAttribute);
}

// USES
//  gl
//  squareVertexBuffer
function initBuffers() {
    try {
        squareVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);

        var vertices = [
             1.0,  1.0, 0.0,
            -1.0,  1.0, 0.0,
             1.0, -1.0, 0.0,
            -1.0, -1.0, 0.0,
        ];

        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(vertices),
            gl.STATIC_DRAW
        );
    } catch (e) {
        console.error(e);
        gl = null;
        return;
    }
}

function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);
    gl.vertexAttribPointer(
        vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0
    );
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function start() {
    glCanvas = document.getElementById("canvas");

    initWebGLContext(canvas);
    if (!gl) {
        console.error("Error getting WebGL Context, exiting...");
        return;
    }

    initShaderProgram(VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE);
    if (!gl) {
        console.error("Error compiling shaders, exiting...");
        return;
    }

    initBuffers();
    if (!gl) {
        console.error("Error intializing vertex buffers, exiting...");
        return;
    }

    // Set draw loop
    setInterval(draw, 15);
}
