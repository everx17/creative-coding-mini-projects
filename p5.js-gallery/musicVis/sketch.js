//global for the controls and input 
var controls = null;
//store visualisations in a container
var vis = null;
//variable for the p5 sound object
var sound = null;
//variable for p5 fast fourier transform
var fourier;
//variable to store whether the sound has completed loading
var isReady = false;

function preload()
{
	sound = loadSound('assets/stomper_reggae_bit.mp3', onSoundLoaded, onSoundError);
}

function setup()
{
	//bugfix for annoying scroll bars both in windowed and fullscreen mode
	//it's an issue with inline elements having a border in almost every
	//browser, so an inline canvas of window size won't fit; more info:
	//https://github.com/processing/p5.js/issues/2619
	//https://github.com/processing/p5.js/wiki/Positioning-your-canvas#making-the-canvas-fill-the-window
	//the Canvas object of version 0.6.0 of p5.js that came with the template
	//did not have the required style() method, so p5.min.js had to be updated
	var cnv = createCanvas(windowWidth, windowHeight);
	cnv.style('display', 'block');

	background(0);
	controls = new ControlsAndInput();

	//instantiate the fft object
	fourier = new p5.FFT();

	//create a new visualisation container and add visualisations
	vis = new Visualisations();
	vis.add(new Spectrum());
	vis.add(new WavePattern());
	vis.add(new Needles());
	vis.add(new RidgePlot());
	vis.add(new RotatingBlocksNoiseLine());
	vis.add(new Stagelights());
	vis.add(new LostInSpace());

	//for statistics module: last 60 values = past 1 second
	frameRate(60);
}

function draw()
{
	background(0);
	//draw the selected visualisation
	vis.selectedVisual.draw();
	//draw the controls on top.
	controls.draw();
}

function onSoundLoaded()
{
	isReady = true;
}

function onSoundError(errtext)
{
	alert("Couldn't load sound file:\n"+errtext);
}

function mouseClicked()
{
	//after I found the bug in windowResized() below, I tested controls for
	//the same vulnerability; indeed, clicking the mouse wildly while the
	//app is still loading would cause a null pointer access, added a check
	if (controls != null)
	{
		controls.mousePressed();
	}
}

function keyPressed()
{
	//pressing random keys quickly while the app is starting would cause an
	//attempt to dereference the null pointer, so check if it's initialized
	if (controls != null)
	{
		controls.keyPressed(keyCode);
	}
}

//when the window has been resized. Resize canvas to fit 
//if the visualisation needs to be resized call its onResize method
function windowResized()
{
	resizeCanvas(windowWidth, windowHeight);

	//in testing I saw some "vis is null" errors when opening the console immediately
	//while the app was still loading, causing a canvas resize while vis was still null;
	//to prevent this type of race condition, added checks for vis having been initialized
	//and an extension having been set as the selectedVisual as well
	if(vis != null)
	{
		if(vis.selectedVisual != null)
		{
			if(vis.selectedVisual.hasOwnProperty('onResize'))
			{
				vis.selectedVisual.onResize();
			}
		}
	}
}
