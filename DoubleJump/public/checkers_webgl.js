// Anatomy of the WebGL rendering process
// 1. Create a canvas element
// 2. Obtain a rendering context for the canvas element
// 3. Initialize the viewport which you will render into
// 4. Create one or more buffers containing the data to be rendered (vertices)
// 5. Create one or more matrices to transform the vertex data to pixel locations
// 6. Create one or more shaders to implement the rendering algorithm
// 7. Initialize the shaders with their data parameters
// 8. Render the data to the screen

var VSHADER_SRC = `
    precision highp float;
    attribute vec2      a_position;
    attribute vec2      a_texCoord;
    uniform vec2        u_resolution;
    varying vec2        v_texCoord;

    void main() {
        vec2 clipSpacePos = a_position / u_resolution * 2.0 - 1.0;
        gl_Position = vec4(clipSpacePos * vec2(1.0, -1.0), 0.0, 1.0);
        v_texCoord = a_texCoord;
    }
`;

var FSHADER_SRC = `
    precision highp float;
    uniform sampler2D   u_image;
    varying vec2        v_texCoord;

    void main() {
        //gl_FragColor = vec4(color, 1.0);
        gl_FragColor = texture2D(u_image, v_texCoord);
    }
`;

function start() {
    var image = new Image();
    image.src = "images/checker_images.png";
    image.onload = function() {
        main(image);
    }
}

function main(image) {
    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("experimental-webgl");
    if (!gl) {
        return;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);

    var vshader = loadShader(gl, VSHADER_SRC, gl.VERTEX_SHADER);
    var fshader = loadShader(gl, FSHADER_SRC, gl.FRAGMENT_SHADER);
    var program = loadProgram(gl, [vshader, fshader]);
    gl.useProgram(program);

    var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0,
        ]),
        gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
    var texture = loadTexture(gl);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

    var positionLocation = gl.getAttribLocation(program, "a_position");
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    loadQuad(gl, 0, 0, image.width, image.height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function loadQuad(gl, x, y, width, height) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            x, y,
            x + width, y,
            x, y + height,
            x, y + height,
            x + width, y,
            x + width, y + height,
        ]),
        gl.STATIC_DRAW
    );
}

function loadTexture(gl) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    return texture;
}

function loadShader(gl, shaderSource, shaderType) {
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var error = gl.getShaderInfoLog(shader);
        console.error("Error compiling shader: " + error);
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}
function loadProgram(gl, shaders, opt_attribs, opt_locations) {
    var program = gl.createProgram();
    for (var i = 0; i < shaders.length; ++i) {
        gl.attachShader(program, shaders[i]);
    }
    if (opt_attribs) {
        for (var i = 0; i < opt_attribs.length; ++i) {
            gl.bindAttribLocation(
                program,
                opt_locations ? opt_locations[i] : i,
                opt_attribs[i]
            );
        }
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        var error = gl.getProgramInfoLog(program);
        console.error("Error in program linking:" + error);
        gl.deleteProgram(program);
        return null;
    }
    return program;
}
