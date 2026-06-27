function stagelight(isLaser, freq, xPos, minW, maxW, lightCol, idleBrt, hasMirror)
{
	//create an array amplitude values from the fft.
	var energy;
	var noiseStep = 0.0025;
	var noiseProg = random(1000);
	var isLaser = isLaser;
	var freq = freq;
	var xPos = xPos;
	var minW = minW;
	var maxW = maxW;
	var lightCol = color(lightCol);
	var idleBrt = idleBrt;
	//find idle colour along a gradient between black and lightCol
	var idleCol = lerpColor(color("#000000"), lightCol, idleBrt/100);
	var hasMirror = hasMirror;
	var alpha = 0;
	var groundX = width/2;
	var groundY = height*3/4;

	this.draw = function()
	{
		var actCol, w;
		energy = fourier.getEnergy(freq);

		push();
		noiseProg += noiseStep;	// slow movement without input
		noiseProg += map(energy, 0, 255, 0, noiseStep*2);	//speed up depending on input
		if (hasMirror)
		{
			//mostly stay in the left half, but with a chance of overlap with mirror
			groundX = map(noise(noiseProg), 0, 1, 0, 5*width/8);
		}
		else
		{
			//utilize full width
			groundX = map(noise(noiseProg), 0, 1, 0, width);
		}
		//imagined floor is in the bottom 25% of the screen
		groundY = map(noise(noiseProg + 1000), 0, 1, 3*height/4, height);

		blendMode(ADD);
		noStroke();

		//find floor spot colour along gradient between idleCol and lightCol
		actCol = lerpColor(idleCol, lightCol, map(energy, 0, 255, 0, 1));
		w = map(energy, 0, 255, width * minW/100, width * maxW/100);
		if(isLaser)
		{
			alpha += 0.5;	// slow rotation without any input
			alpha += map(energy, 0, 255, 0, 12);	// speed up based on energy
			if(alpha >= 60)
			{	//reset after 1 beam worth of rotation
				alpha -= 60;
			}
			angleMode(DEGREES);
			strokeWeight(max(1, width/500));
			stroke(actCol);
			noFill();
			for (var i=0; i<6; i++)
			{
				line(width * xPos/100, 0,
						groundX - w/2 * cos(alpha+60*i),
						groundY + w/6 * sin(alpha+60*i));
				if(hasMirror)
				{
					line(width - width * xPos/100, 0,
						width - groundX + w/2 * cos(alpha+60*i),
						groundY + w/6 * sin(alpha+60*i));
				}
			}
		}
		else
		{
			//the beam colour is exactly half of the floor spot colour
			var beamCol = lerpColor(color("#000000"), actCol, 0.5);
			fill(beamCol);
			beginShape();
			vertex(width * (xPos-0.5)/100, 0);
			vertex(width * (xPos+0.5)/100, 0);
			vertex(groundX+w/2, groundY);
			vertex(groundX-w/2, groundY);
			endShape();
			//in the top half of the ellipse, the beam and ellipse overlap
			//therefore keep half brightness, since blendMode=ADD will duplicate it
			arc(groundX, groundY, w, w/3, 180, 360);
			//lower half of the ellipse gets the set colour directly
			fill(actCol);
			arc(groundX, groundY, w, w/3, 0, 180);
			if(hasMirror)
			{
				fill(beamCol);
				beginShape();
				vertex(width - width * (xPos-0.5)/100, 0);
				vertex(width - width * (xPos+0.5)/100, 0);
				vertex(width - groundX-w/2, groundY);
				vertex(width - groundX+w/2, groundY);
				endShape();
				arc(width - groundX, groundY, w, w/3, 180, 360);
				fill(actCol);
				arc(width - groundX, groundY, w, w/3, 0, 180);
				}
		}
		pop();
	}
};
