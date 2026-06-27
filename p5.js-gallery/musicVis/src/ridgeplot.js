//draw the waveform to the screen
function RidgePlot()
{
	//vis name
	this.name = "Ridge plot";

	var output = [];
	var startX;
	var endY;
	var startY;
	var spectrumWidth;
	var frames_per_line;
	var speed;
	var num_lines;

	//resize the plot size when the screen is resized.
	this.onResize = function()
	{
		startX = width/5;
		endY = height/5;
		startY = height - endY;
		spectrumWidth = (width/5)*3;
		//to cater to retina displays, speed should be proportional to height
		//however, decimal speeds give poor visual results (blurry lines);
		//set speed = 1 by default, 2 at 1500...2499px height, 3 at 2500...3499
		speed = max(1, Math.round(height / 1000));
		//new line will be created every 12 frames (5 lines/second at 60fps)
		frames_per_line = 12;
		//how many lines will be on the screen as a result of the above
		num_lines = Math.floor((startY - endY) / (frames_per_line * speed));
	}

	// call onResize to set initial values when the object is created
	this.onResize();

	// add new line to the plot at the bottom
	var addWave = function()
	{
		//calculate the waveform from the fft.
		var w = fourier.waveform();
		var output_wave = [];

		//use an integer divider of 1024 as step size
		//also use half of that as start value (sample from middle of block)
		for(var i = 8; i < w.length; i+=16)
		{
			//push raw waveform data (range -1 to 1)
			output_wave.push(w[i]);
		}
		//push one line of raw data (append as new last index)
		output.push(output_wave);
	}

	var deleteWaveTop = function()
	{
		//if there are more lines than fit on the screen at
		//current canvas size, delete the oldest line(s)
		//since new values are pushed (appended), oldest value is
		//at index 0 -> splice excess number of lines starting at 0
		if (output.length > num_lines)
		{
			output.splice(0, output.length-num_lines);
		}
	}

	//draw the wave form to the screen
	this.draw = function()
	{
		//spacing of lines is propotional to speed
		//therefore, scale wave proportional to speed as well
		var smallScale = 3*speed;
		var bigScale = 40*speed;
		var x;
		var y;
		var anim_offset = frameCount % frames_per_line;

		push();
		background(0);
		noFill();
		stroke(255);
		//speed is proportional to screen height [Math.round(height/1000)]
		//to make it look good on Retina displays (prevent too thin lines),
		//male strokeWeight proportional to speed as well
		strokeWeight(2*speed);

		//add a new line every 12 frames
		if(anim_offset == 0)
		{
			addWave();
		}
		//delete excess lines (if any)
		deleteWaveTop();

		//now there are exactly as many lines as fit the screen
		//oldest line is at index 0, newest at index output.length - 1
		//iterate from oldest to newest, draw from bottom upwards
		for (var i = 0; i < output.length; i++)
		{
			var o = output[i];

			//finding the current line's middle y position:
			//starting point is startY (bottom of plot)
			//frames_per_line * speed is the total spacing of lines in pixels
			//line 0 (oldest) should be at the top, last line (newest) at startY
			//so for i = 0, subtract the most, for i = output.length-1 subtract nothing
			//output.length - i - 1 does the required inversion of line index
			var line_y = startY - (output.length - i - 1) * (frames_per_line * speed);

			//lines are placed in correct order and spacing, now adding animation
			//move upwards with each frame, by speed pixels
			//when anim_offset (a modulo of frameCount) is 0, it would jump back down,
			//but in that case a new line was just added prior to entering this loop
			line_y -= anim_offset * speed;

			beginShape();
	
			//iterate through all data points in current line
			for (var j = 0; j < o.length; j++)
			{
				//map x axis to 20%...80% of canvas width
				x = map(j, 0, o.length-1, startX, startX + spectrumWidth);

				//map waveform data, amplitude depending on position along the line
				if(j < o.length * 0.25 || j >= o.length * 0.75)
				{
					y = line_y + map(o[j], -1, 1, -smallScale, smallScale);
				}
				else
				{
					y = line_y + map(o[j], -1, 1, -bigScale, bigScale);
				}
				//bugfix: apply Math.floor to y, since without input the raw waveform
				//data is not exactly 0, but a tiny bit off, which results in a
				//0.1 pixels offset depending on smallScale vs. bigScale mapping,
				//causing an unintended offset at the 25% and 75% line positions
				vertex(x, Math.floor(y));
			}
			endShape();
		}
		pop();
	};
}