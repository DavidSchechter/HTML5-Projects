function polygonPath(centerx, centery, radius, sides, angle) {

  sides = (sides !== undefined) && (sides >= 3) ? sides : 3;
  angle = angle || 0;

  context.beginPath();
  var point = {x: centerx + radius * Math.cos(angle),
               y: centery + radius * Math.sin(angle)};
  context.moveTo(point.x, point.y);

  for (var i = 0; i < sides; ++i) {
    angle += 2*Math.PI / sides;
    point = {x: centerx + radius * Math.cos(angle),
             y: centery + radius * Math.sin(angle)};
    context.lineTo(point.x, point.y);
  }

  context.closePath();
}


function drawColorchartBackground(radius) {
  var centerx = canvas.width / 2,
      centery = canvas.height / 2;

//  polygonPath(centerx, centery, radius, 6, Math.PI/2);
  polygonPath(centerx, centery, radius, 6, 0.5*Math.PI);
  context.fillStyle = "black";
  context.fill();
}
