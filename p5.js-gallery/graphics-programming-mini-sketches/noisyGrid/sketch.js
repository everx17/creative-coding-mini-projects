var stepSize = 20;

function setup()
{
  createCanvas(500, 500);
  angleMode(DEGREES);
}
///////////////////////////////////////////////////////////////////////
function draw()
{
//  background(125);

  colorGrid();
  compassGrid();
}
///////////////////////////////////////////////////////////////////////
function colorGrid()
{
  noStroke();
  // values for original assignment
  // var col1 = color('#ff0000');  // red
	// var col2 = color('#00ff00');  // green

  // values for further development
  var col1 = color('#3060e0');  // blue-ish
	var col2 = color('#602060');  // purple-ish

  for (var x=0; x<25; x++)
  {
    for (var y=0; y<25; y++)
    {
      // create 3D noise
      var n = noise(x/25, y/25, frameCount/(mouseX+100));

      // find colour along gradient
      var mixcol = lerpColor(col1, col2, n);

      fill(mixcol);
      rect(x*stepSize, y*stepSize, stepSize, stepSize);
    }
  }
}
///////////////////////////////////////////////////////////////////////
function compassGrid()
{
  noFill();
  strokeWeight(2);
  stroke(0);

   for (var x=0; x<25; x++)
  {
    for (var y=0; y<25; y++)
    {
      var n = noise(x/25, y/25, frameCount/(mouseX+100));
      var theta = map(n, 0, 1, 0, 720);

      push();
      translate(x*stepSize + stepSize/2, y*stepSize + stepSize/2);
      rotate(theta);

      // for original assignment:
      // line(0, 0, 0, stepSize);

      //for further development:
      stroke(255*n);
      line(0, 0, 0, stepSize * 2*n);

      pop();
    }
  }
}
