//constructor function to draw a
function Needles()
{
	//name of the visualisation
	this.name = "Needles";

	//how large is the arc of the needle plot.
	var minAngle = PI + PI / 10;
	var maxAngle = TWO_PI - PI / 10;

	var plotsAcross = 2;
	var plotsDown = 2;
	var pad = width / 20;
	var plotWidth = (width - pad) / plotsAcross;
	var plotHeight = (height - pad) / plotsDown;
	var dialRadius = (plotWidth - pad) / 2 - 5;

	//frquencies used by the energyfunction to retrieve a value
	//for each plot.
	var frequencyBins = ["bass", "lowMid", "highMid", "treble"];

	//resize the plots sizes when the screen is resized.
	this.onResize = function()
	{
		pad = width / 20;
		plotWidth = (width - pad) / plotsAcross;
		plotHeight = (height - pad) / plotsDown;
		// bugfix: dialRadius must depend on both plotWidth and plotHeight
		dialRadius = min(
			(plotWidth - pad) / 2 - 5,
			(plotHeight - pad) - 10);
	};

	//call onResize to set initial values when the object is created
	this.onResize();

	// draw the plots to the screen
	this.draw = function()
	{
		//create an array amplitude values from the fft.
		var spectrum = fourier.analyze();
		//iterator for selecting frequency bin.
		var currentBin = 0;
		push();
		fill('#f0f2d2');
		//nested for loop to place plots in 2*2 grid.
		for (var i = 0; i < plotsDown; i++)
		{
			for (var j = 0; j < plotsAcross; j++)
			{

				//calculate the size of the plots
				var x = pad + j * plotWidth;
				var y = pad + i * plotHeight;
				var w = plotWidth - pad;
				var h = plotHeight - pad;

				//draw a rectangle at that location and size
				rect(x, y, w, h);
				//add on the ticks
				ticks(x + w / 2, y + h, frequencyBins[currentBin]);

				var energy = fourier.getEnergy(frequencyBins[currentBin]);

				//add the needle
				//bugfix: some other modules use DEGREES mode (within push()/pop())
				//however, there's a bug with certain p5.js versions which prevents
				//angleMode from being stored and restored
				//https://github.com/processing/p5.js/issues/5160
				//even if this is fixed in later versions, I explicitly set angleMode
				//to RADIANS to make it compatible with older versions of p5.js
				angleMode(RADIANS);
				needle(energy, x + w / 2, y + h);
				currentBin++;
			}
		}

		pop();
	};

	/*
	 *draws a needle to an individual plot
	 *@param energy: The energy for the current frequency
	 *@param centreX: central x coordinate of the plot rectangle
	 *@param bottomY: The bottom y coordinate of the plot rectangle
	 */
	var needle = function(energy, centreX, bottomY)
	{
		push();
		stroke('#333333');
		//translate so 0 is at the bottom of the needle
		translate(centreX, bottomY);
		//map the energy to the angle for the plot
		theta = map(energy, 0, 255, minAngle, maxAngle);
		//calculate x and y coorindates from angle for the length of needle
		var x = dialRadius * cos(theta);
		var y = dialRadius * sin(theta);
		//draw the needle
		line(0, 0, x, y);
		pop();
	};

	/*
	 *draw the graph ticks on an indivisual plot
	 *@param centreX: central x coordinate of the plot rectangle
	 *@param bottomY: The bottom y coordinate of the plot rectangle
	 *@param freqLabel: Label denoting the frequency of the plot
	 */
	var ticks = function(centreX, bottomY, freqLabel)
	{
		// 8 ticks from pi to 2pi
		var nextTickAngle = minAngle;
		push();
		stroke('#333333');
		fill('#333333');
		translate(centreX, bottomY);
		//draw the semi circle for the botttom of the needle
		arc(0, 0, 20, 20, PI, 2 * PI);
		textAlign(CENTER);
		textSize(12);
		//bugfix: y position of label depends on dialRadius
		text(freqLabel, 0, -(dialRadius / 2));

		for (var i = 0; i < 9; i++)
		{
			//for each tick work out the start and end coordinates of
			//based on its angle from the needle's origin.
			var x = dialRadius * cos(nextTickAngle);
			var x1 = (dialRadius - 5) * cos(nextTickAngle);

			var y = (dialRadius) * sin(nextTickAngle);
			var y1 = (dialRadius - 5) * sin(nextTickAngle);

			line(x, y, x1, y1);
			nextTickAngle += PI / 10;
		}
		pop();
	};

}