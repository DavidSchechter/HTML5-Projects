
var vertexShaderCode = 
    'attribute vec4 a_Position; \n' +
    'uniform mat4 u_MVPMatrix; \n' +
    'attribute float a_PointSize; \n' +
    'attribute vec4 a_Color; \n' +
    'varying vec4 v_Color; \n' +
    'void main() { \n' +
    '  gl_Position = u_MVPMatrix * a_Position; \n' +
    '  gl_PointSize = a_PointSize; \n' +
    '  v_Color = a_Color; \n' +
    '} \n';

var fragmentShaderCode = 
    'precision mediump float; \n' +
    'varying vec4 v_Color; \n' +
    'void main() { \n' +
    '  gl_FragColor = v_Color; \n' +
    '} \n';


function main() {
  
  var canvas = document.getElementById("canvas");
  var gl = canvas.getContext("webgl");
    console.log("before");
  if (!gl) {
    alert("Cannot get a WebGL context.");
    return;
  }
  
  if (!initShaders(gl, vertexShaderCode, fragmentShaderCode)) {
    alert('Cannot initialize the shaders.');
    return;
  }
    
  
  var nPoints = createVertices(gl);
  if (!nPoints) {
    alert("Unable to create points.");
    return;
  }
  
  var nIndices = createIndices(gl);
  if (!nIndices) {
    alert("Unable to create points.");
    return;
  }
  
  var nFaces = 12,
      nVtxsFace = 3;
  var animate = function() {
    setupView(gl);
    drawFaceLoops(gl, nPoints, nFaces, nVtxsFace);
    window.requestAnimationFrame(animate);
  }
  
  animate();
}

function drawFaceLoops(gl, nPoints, nFaces, nVtxsFace) {
  
  // clear and draw the points
  gl.clearColor(0.2, 0.2, 0.2, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
//  gl.drawArrays(gl.POINTS, 0, nPoints);
  
  // draw the face loops
  for (var face = 0; face < nFaces; face++) {
    gl.drawElements(gl.TRIANGLES, nVtxsFace, gl.UNSIGNED_BYTE, face * nVtxsFace);
  }
}


function createVertices(gl) {
  
  // define a block of binary data interpreted as Float32Array
  
//  var vertexPositionsColors = new Float32Array([
//    //positions and colors interleaved
//     0.7,  0.7,  0.7,    1.0, 1.0, 1.0,
//    -0.7,  0.7,  0.7,    0.0, 1.0, 1.0,
//    -0.7, -0.7,  0.7,    0.0, 0.0, 1.0,
//     0.7, -0.7,  0.7,    1.0, 0.0, 1.0,
//    -0.7,  0.7, -0.7,    0.0, 1.0, 0.0,
//     0.7,  0.7, -0.7,    1.0, 1.0, 0.0,
//     0.7, -0.7, -0.7,    1.0, 0.0, 0.0,
//    -0.7, -0.7, -0.7,    0.0, 0.0, 0.0
//  ]);
    
    //                                                      
//              4-------------5                                        
//              |\            |\                        
//              | \           | \                       
//              |  1-------------0                                        
//              |  |          |  |                      
//              |  |          |  |                      
//              7--|----------6  |                                     
//               \ |           \ |                      
//                \|            \|                      
//                 2-------------3  
var vertexPositionsColors = new Float32Array([
    // Front face 1
    -0.7, -0.7,  0.7,   0.75,  0.75,  0.25,
     0.7, -0.7,  0.7,   0.75,  0.75,  0.25,
     0.7,  0.7,  0.7,   0.75,  0.75,  0.25,
//    -0.7,  0.7,  0.7,   1.0,  1.0,  1.0,
    
    // Front face 2
    -0.7, -0.7,  0.7,   1.0,  1.0,  0.5,
     0.7,  0.7,  0.7,   1.0,  1.0,  0.5,
    -0.7,  0.7,  0.7,   1.0,  1.0,  0.5,
    
    // Back face 1
    -0.7, -0.7, -0.7,   1.0,  0.0,  0.0,
    -0.7,  0.7, -0.7,   1.0,  0.0,  0.0,
//     0.7,  0.7, -0.7,   1.0,  0.0,  0.0,
     0.7, -0.7, -0.7,   1.0,  0.0,  0.0,
    
        // Back face 2
//    -0.7, -0.7, -0.7,   1.0,  0.5,  0.0,
    -0.7,  0.7, -0.7,   1.0,  0.5,  0.0,
     0.7,  0.7, -0.7,   1.0,  0.5,  0.0,
     0.7, -0.7, -0.7,   1.0,  0.5,  0.0,
//    
    // Top face 1
    -0.7,  0.7, -0.7,   0.0,  1.0,  0.0,
    -0.7,  0.7,  0.7,   0.0,  1.0,  0.0,
//     0.7,  0.7,  0.7,   0.0,  1.0,  0.0,
     0.7,  0.7, -0.7,   0.0,  1.0,  0.0,
    
    // Top face 2
//    -0.7,  0.7, -0.7,   0.0,  1.0,  0.0,
    -0.7,  0.7,  0.7,   0.5,  1.0,  0.5,
     0.7,  0.7,  0.7,   0.5,  1.0,  0.5,
     0.7,  0.7, -0.7,   0.5,  1.0,  0.5,
//    
    // Bottom face 1
    -0.7, -0.7, -0.7,   0.0,  0.0,  1.0,
     0.7, -0.7, -0.7,   0.0,  0.0,  1.0,
//     0.7, -0.7,  0.7,   0.0,  0.0,  1.0,
    -0.7, -0.7,  0.7,   0.0,  0.0,  1.0,
    
    // Bottom face 2
//    -0.7, -0.7, -0.7,   0.0,  0.0,  1.0,
     0.7, -0.7, -0.7,   0.5,  0.0,  1.0,
     0.7, -0.7,  0.7,   0.5,  0.0,  1.0,
    -0.7, -0.7,  0.7,   0.5,  0.0,  1.0,
        
//    
    // Right face 1
     0.7, -0.7, -0.7,   1.0,  1.0,  0.0,
     0.7,  0.7, -0.7,   1.0,  1.0,  0.0,
//     0.7,  0.7,  0.7,   1.0,  1.0,  0.0,
     0.7, -0.7,  0.7,   1.0,  1.0,  0.0,
    
        // Right face 2
//     0.7, -0.7, -0.7,   1.0,  1.0,  0.5,
     0.7,  0.7, -0.7,   0.75,  1.0,  0.5,
     0.7,  0.7,  0.7,   0.75,  1.0,  0.5,
     0.7, -0.7,  0.7,   0.75,  1.0,  0.5,
//    
    // Left face
    -0.7, -0.7, -0.7,   1.0,  0.0,  1.0,   
    -0.7, -0.7,  0.7,   1.0,  0.0,  1.0,
//    -0.7,  0.7,  0.7,   1.0,  0.0,  1.0,
    -0.7,  0.7, -0.7,    1.0,  0.0,  1.0,
    
        // Left face
//    -0.7, -0.7, -0.7,   1.0,  0.75,  0.25,   
    -0.7, -0.7,  0.7,   1.0,  0.75,  0.25,
    -0.7,  0.7,  0.7,   1.0,  0.75,  0.25,
    -0.7,  0.7, -0.7,    1.0,  0.75,  0.25
  ]);

  var pCoords = 3,  // how many position coords per vertex
      cCoords = 3,  // how many color coords per vertex
      vertexWidth = pCoords + cCoords;

  var floatSize = vertexPositionsColors.BYTES_PER_ELEMENT;
  var stride = vertexWidth * floatSize,   // how many bytes per vertex
      positionOffset = 0 * floatSize,     // starting byte of positions
      colorOffset = pCoords * floatSize;  // starting byte of colors
  
  // create a buffer for the vertex data
  var vBuffer = gl.createBuffer();
  if (!vBuffer) {
    alert("Unable to create vertex buffer.");
    return 0;
  }
  
  // make vBuffer the "current" buffer and copy data into it
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexPositionsColors, gl.STATIC_DRAW);
  
  // tell the vertex shader how to determine positions
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, pCoords, gl.FLOAT, false, 
                         stride, positionOffset);
  gl.enableVertexAttribArray(a_Position);

  // tell the vertex shader how to determine colors
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  gl.vertexAttribPointer(a_Color, cCoords, gl.FLOAT, false,
                         stride, colorOffset);
  gl.enableVertexAttribArray(a_Color);
  
  // tell the vertex shader about the point size
  var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
  gl.vertexAttrib1f(a_PointSize, 10.0);

  // return the number of vertices
  return vertexPositionsColors.length / vertexWidth;
}

//                                                      
//              4-------------5                                        
//              |\            |\                        
//              | \           | \                       
//              |  1-------------0                                        
//              |  |          |  |                      
//              |  |          |  |                      
//              7--|----------6  |                                     
//               \ |           \ |                      
//                \|            \|                      
//                 2-------------3                                        
//  

//                                                      
//              12-------------13                                        
//              |\            |\                        
//              | \           | \                       
//              |  9-------------8                                        
//              |  |          |  |                      
//              |  |          |  |                      
//              15-|----------14 |                                     
//               \ |           \ |                      
//                \|            \|                      
//                 10-------------11                                        
//  

//                                                      
//              20-------------21                                        
//              |\            |\                        
//              | \           | \                       
//              |  17-------------16                                        
//              |  |          |  |                      
//              |  |          |  |                      
//              23-|----------22 |                                     
//               \ |           \ |                      
//                \|            \|                      
//                 18-------------19                                        
//  

function createIndices(gl) {
  var indices = new Uint8Array([
   0,1,2,
      3,4,5,
    6,7,8,
  9,10,11,
    12,13,14,
    15,16,17,
    18,19,20,
    21,22,23,
    24,25,26,
    27,28,29,
      30,31,32,
      33,34,35
  ]);
    
//  var indices = new Uint8Array([
//    0, 1, 2, 3,
//      8,9,10,11,
//      16,17,18,19,
//    2,0,3,1
//      15,14,12,13,
//      23,22,20,21,
//    4, 5, 6, 7,
//      12,13,14,15,
//      20,21,22,23,
//    2,3,0,1,
//      10,11,8,9,
//      18,19,16,17,
//    5, 0, 3, 6,
//      13,8,11,14,
//      21,16,19,22,
//    7, 6, 5, 4,
//      15,14,13,12,
//      23,22,21,20,
//    1, 4, 7, 2,
//      9,12,15,10,
//      17,20,23,18,
//    2, 1, 7, 4,
//      10,9,13,12,
//      18,17,21,20,
//    5, 4, 1, 0,
//      13,12,9,8,
//      21,20,17,16,
//    3, 2, 7, 6,
//      11,10,15,14,
//      19,18,23,22
//  ]);
//    
    
//                                                      
//              4-------------5                                        
//              |\            |\                        
//              | \           | \                       
//              |  1-------------0                                        
//              |  |          |  |                      
//              |  |          |  |                      
//              7--|----------6  |                                     
//               \ |           \ |                      
//                \|            \|                      
//                 2-------------3                                        
//  
    
//  var indices = new Uint8Array([
//   0,  1,  2,      0,  2,  3,    // front
//    4,  5,  6,      4,  6,  7,    // back
//    8,  9,  10,     8,  10, 11,   // top
//    12, 13, 14,     12, 14, 15,   // bottom
//    16, 17, 18,     16, 18, 19,   // right
//    20, 21, 22,     20, 22, 23    // left
//    
//  ]);
//    
    
  
  // create a buffer for the indices
  var iBuffer = gl.createBuffer();
  if (!iBuffer) {
    alert("Unable to create index buffer.");
    return 0;
  }
  
  // make iBuffer the "current" buffer and copy data into it
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  
  // return the number of vertices
  return indices.length;
}


function setupView(gl) {
  
  var angleStep = 45.0; // rotation angle per second
  
  if (!setupView.time) { // initialize static variables
    setupView.angle = 0.0;
    setupView.time = Date.now(); // current time in ms
  }
  
  // Update the time
  var now = Date.now();
  var elapsed = now - setupView.time;
  setupView.time = now;
  
  // Update the angle adjusted by elapsed time
  setupView.angle += (angleStep * elapsed) / 1000.0;
  setupView.angle %= 360;
  
  
  // using the gl-matrix.js library  (http://glmatrix.net)
  
  var mvpMatrix = mat4.create();
  
  var modelMatrix = mat4.create();
  var thetaDegrees = setupView.angle,  // 10,
      theta = glMatrix.toRadian(thetaDegrees);
  mat4.rotateX(modelMatrix, mat4.create(), theta);
  mat4.rotateY(modelMatrix, modelMatrix, theta);
  mat4.multiply(mvpMatrix, modelMatrix, mvpMatrix);
  
  var viewMatrix = mat4.create();
  var eye = [0.2, -0.2, 0.5],
      center = [0.0, 0.0, 0.0],
      up = [0.0, 1.0, 0.0];
  mat4.lookAt(viewMatrix, eye, center, up);
  mat4.multiply(mvpMatrix, viewMatrix, mvpMatrix);

  var projectionMatrix = mat4.create();
  var left = -3.0,
      right = 3.0,
      bottom = -3.0,
      top = 3.0,
      near = -5.0,
      far = 1000.0;
  mat4.ortho(projectionMatrix, left, right, bottom, top, near, far);
  mat4.multiply(mvpMatrix, projectionMatrix, mvpMatrix);
  
  // set the transform matrix in the vertex shader
  var u_MVPMatrix = gl.getUniformLocation(gl.program, 'u_MVPMatrix');
  gl.uniformMatrix4fv(u_MVPMatrix, false, mvpMatrix);
}


// Init shaders -----------------------------------------------

function initShaders(gl, vshader, fshader) {
  
  var program = createProgram(gl, vshader, fshader);
  if (!program) {
    alert('Failed to create program');
    return false;
  }

  gl.useProgram(program);
  gl.program = program;
  return true;
}


function createProgram(gl, vshader, fshader) {
  
  // Create and compile the shader objects
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vshader);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fshader);
  if (!vertexShader || !fragmentShader) return null;

  // Create a program object
  var program = gl.createProgram();
  if (!program) return null;

  // Attach the shader objects
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // Link the program object
  gl.linkProgram(program);

  // Check the result of linking
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    alert('Failed to link program: ' + gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }
  
  return program;
}


function createShader(gl, type, source) {
  
  // Create a shader object
  var shader = gl.createShader(type);
  if (shader == null) {
    alert('Unable to create shader');
    return null;
  }

  // Set the shader source and compile it
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  // Check the result of compilation
  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    alert('Failed to compile shader: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
