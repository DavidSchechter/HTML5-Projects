function fillCircle(x, y, radius) {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI*2);
  context.fill();
}

function drawColorchartPrimary(radius) {
  var centerx = canvas.width / 2,
      centery = canvas.height / 2,
      spotRadius = radius / 2;

  var dx = Math.sqrt(3) * spotRadius,
      dy = spotRadius;

  drawColorchartBackground(radius);

    //drawing the upper two quadrants
    var diagnoalShift=0;
    for (j = 10; j >= 0; j=j-2) {
        for (i = 0; i < 6; i++) {
            var rowNumber=(10-j)/2*51;
            var columNumber=i*51;
            var color="rgb(255,"+rowNumber+","+columNumber+")";
            context.fillStyle = color;      
            fillCircle(centerx + (i-(1*diagnoalShift))*dx, centery - (j-i+1*diagnoalShift)*dy, spotRadius);
         }
        diagnoalShift++;
    }
    //drawing the buttom left quadrant
    diagnoalShift=1;
    for (j = 8; j >= 0; j=j-2) {
        for (i = 0; i < 6; i++) {
            var rowNumber=255-(10-j)/2*51;
            var columNumber=i*51;
            var color="rgb("+rowNumber+",255,"+columNumber+")";
            context.fillStyle = color;   
            //console.log(color);
           // alert("break");
            fillCircle(centerx - (5-i)*dx, centery - (j/2-i-diagnoalShift)*dy, spotRadius);
         }
        diagnoalShift++;
    }
    //drawing the buttom right quadrant
    diagnoalShift=1;
    for (j = 8; j >= 0; j=j-2) {
        for (i = 0; i < 6; i++) {
            var rowNumber=255-(10-j)/2*51;
            var columNumber=i*51;
            var color="rgb("+columNumber+","+rowNumber+",255)";
            context.fillStyle = color;   
            //console.log(color);
           // alert("break");
            fillCircle(centerx + diagnoalShift*dx, centery + (j+diagnoalShift-i*2)*dy, spotRadius);
         }
        diagnoalShift++;
    }
}
