
// Listener management -------------------------------------------------- 

var activeListeners = [];

function addCanvasListener(event, functionObj) {
  canvas.addEventListener(event, functionObj);
  activeListeners.push({event: event, func: functionObj});
}

function removeCanvasListeners() {
  activeListeners.forEach(
    function(listener) {
      canvas.removeEventListener(listener.event, listener.func);
    }
  );
  activeListeners = [];
}



// Mode selection --------------------------------------------------

var modeSelect = document.getElementById('modeSelect');

function changeMode(event) { window[modeSelect.value](); }
modeSelect.addEventListener("change", changeMode);
changeMode();


// Graph paper --------------------------------------------------

function drawGraphPaper(units, color) {

  units = units || 20;
  color = color || "cornflowerblue"

  context.save();
  context.strokeStyle = color;
  context.beginPath();

  for (var i = 0.5; i <= canvas.width; i += units) {
    context.moveTo(i, 0.5);
    context.lineTo(i, canvas.height);
  }
  
  for (i = 0.5; i <= canvas.height; i += units) {
    context.moveTo(0.5, i);
    context.lineTo(canvas.width, i);
  }
  
  context.stroke();
  context.restore();
}

// test: draw the graph paper
//drawGraphPaper();


// UIBox --------------------------------------------------

function drawUIBox(x, y, width, height) {  
  context.save();
  context.fillStyle = "white";
  context.strokeStyle = "black";
  context.shadowColor = "black";
  context.shadowOffsetX = 5;
  context.shadowOffsetY = 5;
  context.shadowBlur = 15;
  context.strokeRect(x, y, width, height);
  context.fillRect(x, y, width, height);
  context.restore();
}

// test: drawUIBox
//drawUIBox(10, 470, 100, 20);


// Messages --------------------------------------------------

function showMessage(string) {

  var box = {x: 10, y: 470, width: 180, height: 20};
  
  context.save();
  
  // draw the box exterior
  if (!showMessage.boxDrawn) {
    drawUIBox(box.x, box.y, box.width, box.height);
    showMessage.boxDrawn = true; // prevent redraw of the box
  }
  
  // draw the box contents
  context.fillStyle = "white";
  context.fillRect(box.x, box.y, box.width, box.height);
  context.fillStyle = "black";
  context.font = "14px Arial";
  context.fillText(string, box.x + 7, box.y+ 15);
  context.restore();
}

// test: showMessage
//showMessage("Ready to draw?");


function showCoordinates(x, y) {
  var coordinateString = "mouse location: (" + x + ", " + y + ")";
  showMessage(coordinateString);
}

// test: showCoordinates
//showCoordinates(101, 99);


function mouseAt(event) {
  
  var x = event.clientX - canvas.offsetLeft,
      y = event.clientY - canvas.offsetTop;
  
  showCoordinates(x, y);
};

// text: mouse event handler
canvas.addEventListener("mousemove", mouseAt);


// Default color --------------------------------------------------

function setDefaultShapeColor(r, g, b, a) {
  r = r || 127;
  g = g || 127;
  b = b || 127;
  a = a || 0.2;  
  context.fillStyle =
    "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
  context.strokeStyle =
    "rgb(" + r + ", " + g + ", " + b + ")";
}

setDefaultShapeColor(255, 190, 30, 0.2);



// Rect shapes --------------------------------------------------

function RectShape(x, y, width, height) {
  
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  
  this.angle = 0;
}

RectShape.prototype.path = function() {
  
  context.beginPath();
  if (!this.angle) {
    context.rect(this.x, this.y, this.width, this.height);
  } else {
    context.save()
    center_x = this.x + (this.width / 2);
    center_y = this.y + (this.height / 2);
    context.translate(center_x, center_y);
    context.rotate(this.angle);
    context.rect(this.x-center_x, this.y-center_y, this.width, this.height);
    context.restore();

  }
}

RectShape.prototype.draw = function() {
  context.save();
  this.path();
  context.stroke();
  context.fill();
  context.restore();
}



// Shapes list --------------------------------------------------

var shapes = [];

function drawAllShapes() {
  shapes.forEach(
    function(shape) { shape.draw(); }
  );
}

function clearAndRedraw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawGraphPaper();
  showMessage.boxDrawn = false;
  showMessage("Ready to draw?");
  drawAllShapes();
}



// Draw mode --------------------------------------------------

/*drawing methods:
    startRubberband - save first point clicked and creates empty rectangle
    moveRubberband - save second poiint clikced and starts drawing a rectangle while the mouse is
                    down
    endRubberband - save second poiint clikced and draws final a rectangle when the mouse is up
*/

var firstPoint = undefined,
    secondPoint = undefined;

var rect=undefined;
var draggingMouse=false;

function startRubberband()
{
    draggingMouse=true;
    firstPoint = {x: event.clientX - canvas.offsetLeft,
                  y: event.clientY - canvas.offsetTop};
    shapes.push(new RectShape(firstPoint.x,firstPoint.y, 0, 0));
}

function endRubberband(event)
{
    if (draggingMouse) {
        draggingMouse = false;
        secondPoint = {x: event.clientX - canvas.offsetLeft,
                       y: event.clientY - canvas.offsetTop};
        shapes.pop();
        temp_rect=new RectShape(firstPoint.x,firstPoint.y,secondPoint.x - firstPoint.x,secondPoint.y - firstPoint.y)
        shapes.push(temp_rect);
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawGraphPaper();
        showMessage.boxDrawn = false;
        showCoordinates(secondPoint.x, secondPoint.y);
        drawAllShapes();
    }
}

function moveRubberband(event)
{
  if (draggingMouse) {
    //draggingMouse = false;
    secondPoint = {x: event.clientX - canvas.offsetLeft,
                   y: event.clientY - canvas.offsetTop};
    shapes.pop();
    temp_rect=new RectShape(firstPoint.x,firstPoint.y,secondPoint.x - firstPoint.x,secondPoint.y - firstPoint.y)
    shapes.push(temp_rect);
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawGraphPaper();
      showMessage.boxDrawn = false;
    drawAllShapes();
      
    
  }
}

function drawMode() {
  removeCanvasListeners();
  addCanvasListener("mousedown", startRubberband);
  addCanvasListener("mousemove", moveRubberband);
  addCanvasListener("mouseup", endRubberband);
  addCanvasListener("mousemove", mouseAt);
  canvas.style.cursor = 'crosshair';
}



// Hit mode --------------------------------------------------

/*hit test methods:
    doHitTests - checks if a poitn in in a rectangle's path
*/

function doHitTests(event) {
		var x=event.clientX - canvas.offsetLeft;
        var y=event.clientY - canvas.offsetTop;
		for (i = 0; i < shapes.length; i++) {
            shapes[i].path();
            if (context.isPointInPath(x,y))
            {
                alert("hit shape "+i);
            }
        }
}

function hitMode() {
  removeCanvasListeners();
  addCanvasListener("click", doHitTests);
  addCanvasListener("mousemove", mouseAt);
  canvas.style.cursor = 'default';
}



// Delete mode --------------------------------------------------

/*delete methods:
    doDeleteHit - find the rectangle that was clicked in
    deleteMode - deletes rectangle from memory and redraws all shapes
*/

function doDeleteHit(event) {
		var x=event.clientX - canvas.offsetLeft;
        var y=event.clientY - canvas.offsetTop;
        var hits=[]
		for (i = 0; i < shapes.length; i++) {
            shapes[i].path();
            if (context.isPointInPath(x,y))
            {
                hits.push(i);
            }
        }
        for (i = 0; i < hits.length; i++) {
            console.log("deleting cell in place "+hits[i]);
            shapes.splice(hits[i]-i,1);
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawGraphPaper();
        showMessage.boxDrawn = false;
        drawAllShapes();
}

function deleteMode() {
  removeCanvasListeners();
  addCanvasListener("click", doDeleteHit);
  addCanvasListener("mousemove", mouseAt);
  canvas.style.cursor = 'default';
}



// Move mode --------------------------------------------------

/*delete methods:
    doMoveHit - find the rectangle that was clicked in and save where we clicked first inside it.
    doMoveDrag - moves the reactangle to a new position while the mouse is down
    doMoveDone - sets the reactangle to a new position when the mouse is up
*/

var shapeNumberToMove=-1;
var movingShape=false;
var clickedInRectangleX=0;
var clickedInRectangleY=0;

function doMoveHit(event) {
		var x=event.clientX - canvas.offsetLeft;
        var y=event.clientY - canvas.offsetTop;
		for (i = 0; i < shapes.length; i++) {
            shapes[i].path();
            if (context.isPointInPath(x,y))
            {
                shapeNumberToMove=i;
                movingShape=true;
                clickedInRectangleX = x - shapes[i].x;
				clickedInRectangleY = y - shapes[i].y;
                return;
            }
        }
}

function doMoveDrag(event)
{
  if (movingShape) {
    //draggingMouse = false;
    var x = event.clientX - canvas.offsetLeft;
    var y = event.clientY - canvas.offsetTop;
      
    var dx= x-clickedInRectangleX;
    var dy= y-clickedInRectangleY;
    shapes[shapeNumberToMove].x=dx;
    shapes[shapeNumberToMove].y=dy;
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawGraphPaper();
    showMessage.boxDrawn = false;
    drawAllShapes();  
  }
}

function doMoveDone(event)
{
    if (movingShape) {
        movingShape=false;
        var x = event.clientX - canvas.offsetLeft;
        var y = event.clientY - canvas.offsetTop;
        var dx= x-clickedInRectangleX;
        var dy= y-clickedInRectangleY;
        shapes[shapeNumberToMove].x=dx;
        shapes[shapeNumberToMove].y=dy;
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawGraphPaper();
        showMessage.boxDrawn = false;
        drawAllShapes();
    }
}

function moveMode() {
  removeCanvasListeners();
  addCanvasListener("mousedown", doMoveHit);
  addCanvasListener("mousemove", doMoveDrag);
  addCanvasListener("mouseup", doMoveDone);
  addCanvasListener("mousemove", mouseAt);
  canvas.style.cursor = 'move';
}



// Rotate mode --------------------------------------------------

/*delete methods:
    doRotateHit - find the rectangle that was clicked in.
    doRotateDrag - rotates rectangle around center while the mouse is down
    doRotateDone - sets the reactangle to a new angle when the mouse is up
*/

var shapeNumberToRotate=-1;
var rotatingShape=false;
var originalAngle=0;

function doRotateHit(event) {
		var x=event.clientX - canvas.offsetLeft;
        var y=event.clientY - canvas.offsetTop;
		for (i = 0; i < shapes.length; i++) {
            shapes[i].path();
            if (context.isPointInPath(x,y))
            {
                shapeNumberToRotate=i;
                rotatingShape=true;
                var center_x = shapes[shapeNumberToRotate].x + (shapes[shapeNumberToRotate].width / 2);
                var center_y = shapes[shapeNumberToRotate].y + (shapes[shapeNumberToRotate].height / 2);
                var dx= x-center_x;
                var dy= y-center_y;
                originalAngle=Math.atan2(dy,dx)-shapes[shapeNumberToRotate].angle;
                return;
            }
        }
}

function doRotateDrag(event)
{
  if (rotatingShape) {
    //draggingMouse = false;
    var x = event.clientX - canvas.offsetLeft;
    var y = event.clientY - canvas.offsetTop;
    var center_x = shapes[shapeNumberToRotate].x + (shapes[shapeNumberToRotate].width / 2);
    var center_y = shapes[shapeNumberToRotate].y + (shapes[shapeNumberToRotate].height / 2);
    var dx= x-center_x;
    var dy= y-center_y;
    var temp_angle=Math.atan2(dy,dx);
    shapes[shapeNumberToRotate].angle=temp_angle-originalAngle;
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawGraphPaper();
    showMessage.boxDrawn = false;
    drawAllShapes();  
  }
}

function doRotateDone(event)
{
    if (rotatingShape) {
        rotatingShape=false;
        var x = event.clientX - canvas.offsetLeft;
        var y = event.clientY - canvas.offsetTop;
        var center_x = shapes[shapeNumberToRotate].x + (shapes[shapeNumberToRotate].width / 2);
        var center_y = shapes[shapeNumberToRotate].y + (shapes[shapeNumberToRotate].height / 2);
        var dx= x-center_x;
        var dy= y-center_y;
        var temp_angle=Math.atan2(dy,dx);
    shapes[shapeNumberToRotate].angle=temp_angle-originalAngle;
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawGraphPaper();
        showMessage.boxDrawn = false;
        drawAllShapes();
    }
}

function rotateMode() {
  removeCanvasListeners();
  addCanvasListener("mousedown", doRotateHit);
  addCanvasListener("mousemove", doRotateDrag);
  addCanvasListener("mouseup", doRotateDone);
  addCanvasListener("mousemove", mouseAt);
  canvas.style.cursor = 'alias';
}



// Initialize app --------------------------------------------------

function initApp() {
  clearAndRedraw();
}

// and away we go...
initApp();


