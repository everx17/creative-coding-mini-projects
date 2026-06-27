var confLocs = [];
var confTheta = [];

var camSlider;
var blocksizeSlider;

function setup()
{
    createCanvas(900, 800, WEBGL);
    angleMode(DEGREES);

    for (var i = 0; i < 200; i++)
    {
        confLocs.push(new createVector(random(-500,500), random(-800,0), random(-500,500)));
        confTheta.push(random(0,360));
    }
    camSlider = createSlider(0, 800, 800);
    camSlider.position(width+10, 10);
    blocksizeSlider = createSlider(110, 500, 200);
    blocksizeSlider.position(width+10, 40);
}

function confetti()
{
    noStroke();    // no stroke for the confetti
    normalMaterial();   // normal material for confetti

    for (var i = 0; i < confLocs.length; i++)
    {
        push();         // handle each confetti individually
        translate(confLocs[i].x, confLocs[i].y, confLocs[i].z);
        rotate(confTheta[i], createVector(1, 1, 1));    // rotate around all 3 axis
        plane(15, 15);
        pop();
        confLocs[i].y += 1;     // fall
        confTheta[i] += 10;     // update rotation
        if (confLocs[i].y > 0)  // reset to top when hitting bottom
        {
            confLocs[i].y = -800;
        }
    }
}

function draw()
{
    background(125);

    // setup as per assignment step 2
    stroke(0);
    strokeWeight(2);
    //normalMaterial();

    // setup for step 7 (further development)
    ambientMaterial(255);               // white ambient material
    directionalLight(255,0,0, 1,0,0);   // red light from left
    directionalLight(255,255,0, 0,0,1); // yellow light from back
    directionalLight(0,255,0, -1,0,0);  // green light from right
    directionalLight(0,0,255, 0,0,-1);  // blue light from front
    directionalLight(255,0,255, 0,1,0); // purple light from top
    
    // camera rotation: in step 1 the assignment says to place
    // the camera at (800, -800, 800), so both x and z are 800
    // for circling, this equals a radius of 800 * sqrt(2)
    // also, rotation is considerably slower than the wave
    // so frameCount should be divided by some constant (using 5)
    var xCam = cos(frameCount/5) * 800 * 1.414;
    var zCam = sin(frameCount/5) * 800 * 1.414;
    
    //camera(xCam, -800, zCam,  0, 0, 0,  0, 1, 0);
    camera(xCam, 0-camSlider.value(), zCam,  0, 0, 0,  0, 1, 0);

    var distance, length;

    for (var xBox = -400; xBox <= 400; xBox += 50)
    {
        for (var zBox = -400; zBox <= 400; zBox += 50)
        {
            push();
            translate(xBox, 0, zBox);
            distance = dist(xBox, 0, zBox, 0, 0, 0);
            // sin = -1...1; *100 = -100...100; +200 = 100...300
            //length = (sin(distance + frameCount) * 100) + 200;
            length = (sin(distance + frameCount) * 100) + blocksizeSlider.value();
            box(50, length, 50);
            pop();
        }
    }

    confetti();
}
