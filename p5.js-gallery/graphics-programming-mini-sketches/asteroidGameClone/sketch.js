var spaceship;
var asteroids;
var atmosphereLoc;
var atmosphereSize;
var earthLoc;
var earthSize;
var starLocs = [];
var score = 0;

//////////////////////////////////////////////////
function setup()
{
  createCanvas(1200,800);
  spaceship = new Spaceship();
  asteroids = new AsteroidSystem();

  //location and size of earth and its atmosphere
  atmosphereLoc = new createVector(width/2, height*2.9);
  atmosphereSize = new createVector(width*3, width*3);
  earthLoc = new createVector(width/2, height*3.1);
  earthSize = new createVector(width*3, width*3);
}

//////////////////////////////////////////////////
function draw()
{
  background(0);
  sky();

  spaceship.run();
  asteroids.run();

  drawEarth();

  drawScore();

  checkCollisions(spaceship, asteroids); // function that checks collision between various elements
}

//////////////////////////////////////////////////
//draws earth and atmosphere
function drawEarth()
{
  noStroke();
  //draw atmosphere
  fill(137, 193, 248, 50);
  ellipse(atmosphereLoc.x, atmosphereLoc.y, atmosphereSize.x,  atmosphereSize.y);
  //draw earth
  fill(38, 78, 117);
  ellipse(earthLoc.x, earthLoc.y, earthSize.x, earthSize.y);
}

//////////////////////////////////////////////////
//draws the score counter
function drawScore()
{
  textSize(32);
  fill(255);
  text("Score: "+score, 10, 30);
}

//////////////////////////////////////////////////
//checks collisions between all types of bodies
function checkCollisions(spaceship, asteroids)
{
  //spaceship-2-asteroid collisions
  for (var i = 0; i < asteroids.locations.length; i++)
  {
    if(isInside(spaceship.location, spaceship.size, asteroids.locations[i], asteroids.diams[i]))
      gameOver();
  }

  //asteroid-2-earth collisions
  for (var i = 0; i < asteroids.locations.length; i++)
  {
    if(isInside(earthLoc, earthSize.y, asteroids.locations[i], asteroids.diams[i]))
      gameOver();
  }

  //spaceship-2-earth
  if(isInside(spaceship.location, spaceship.size, earthLoc, earthSize.y))
    gameOver();

  if(isInside(spaceship.location, spaceship.size, atmosphereLoc, atmosphereSize.y))
    spaceship.setNearEarth();

  //bullet collisions
  for (var i = 0; i < asteroids.locations.length; i++)
  {
    for (var j = 0; j < spaceship.bulletSys.bullets.length; j++)
    {
      if(isInside(spaceship.bulletSys.bullets[j], spaceship.bulletSys.diam,
                  asteroids.locations[i], asteroids.diams[i]))
      {
        asteroids.destroy(i);
        score++;
        i--;
        break; // skip rest of inner loop, as outer loop's asteroid was annihilated
      }
    }
  }
}

//////////////////////////////////////////////////
//helper function checking if there's collision between object A and object B
function isInside(locA, sizeA, locB, sizeB)
{
  // distance of centers compared to sum or both radii
  var objDist = dist(locA.x, locA.y, locB.x, locB.y);
  var radiusSum = (sizeA + sizeB) / 2;  // diameters -> radii
  if (objDist < radiusSum)
    return true;
  return false;
}

//////////////////////////////////////////////////
function keyPressed()
{
  if (keyIsPressed && keyCode === 32)
  { // if spacebar is pressed, fire!
    spaceship.fire();
  }
}

//////////////////////////////////////////////////
// function that ends the game by stopping the loops and displaying "Game Over"
function gameOver()
{
  fill(255);
  textSize(80);
  textAlign(CENTER);
  text("GAME OVER", width/2, height/2)
  noLoop();
}

//////////////////////////////////////////////////
// function that creates a star lit sky
function sky()
{
  push();
  while (starLocs.length<300)
  {
    starLocs.push(new createVector(random(width), random(height)));
  }
  fill(255);
  for (var i=0; i<starLocs.length; i++)
  {
    rect(starLocs[i].x, starLocs[i].y,2,2);
  }

  if (random(1)<0.3)
    starLocs.splice(int(random(starLocs.length)),1);
  pop();
}
