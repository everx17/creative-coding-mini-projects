function RotatingBlocksNoiseLine()
{
	//vis name
	this.name = "Rotating blocks and Noise line";

	var noiseStep = 0.025;
	var rotateThresh = 0;
	var seedThresh = 0;
	var rot = 0;
	var prog = 0;

	//for rotate threshold auto calibration
	//roughly half a second and init to max level, so it'll rotate initially
	var rotateThresCalib = new StatisticsTracker(30, 255);
	
	//for seed threshold auto calibration
	//roughly half a second and init to max level, to prevent a chain of
	//consecutive reseeds during the first few frames (start up gracefully)
	var seedThreshCalib = new StatisticsTracker(30, 255);

	//draw the wave form to the screen
	this.draw = function()
	{
		var spectrum = fourier.analyze();

		push();
		background(0);
		fill(255);
		noStroke();
		
		var b = fourier.getEnergy("bass");
		var t = fourier.getEnergy("treble");
		
		rotatingBlocks(t);
		//blendMode ADD to make the blocks shine through the noise line
		blendMode(ADD);
		noiseLine(b,t,frameCount);
		pop();
	}

	var rotatingBlocks = function(energy)
	{
		var num_blocks = 10;
		//auto calibration of rotate threshold: find median and max level
		//within previous time interval (without current sample), rotate only
		//if currently less than median of those 2 values (i.e. < 75% peak level)
		rotateThresh = (rotateThresCalib.getMedian() + rotateThresCalib.getMax()) / 2;
		rotateThresCalib.addValue(energy);
		//require a minimum energy of 50 (~20%) to stop the rotation, though
		//else it'll stop in passages with hardly any signal at all,
		//calibrating to random noise rather than to a useful signal
		rotateThresh = max(50, rotateThresh);

		if(energy < rotateThresh)
		{
			rot += 0.01;
		}
		
		var r = map(energy, 0, 255, 20, width/num_blocks);
		
		push();

		rectMode(CENTER);
		translate(width/2, height/2);
		//bugfix: some other modules use DEGREES mode (within push()/pop())
		//however, there's a bug with certain p5.js versions which prevents
		//angleMode from being stored and restored
		//https://github.com/processing/p5.js/issues/5160
		//even if this is fixed in later versions, I explicitly set angleMode
		//to RADIANS to make it compatible with older versions of p5.js
		angleMode(RADIANS);
		rotate(rot);
		
		var incr = width/(num_blocks - 1);
		
		for(var i = 0; i < num_blocks; i++)
		{	//colour the blocks along a multi-segment gradient of chocolate colours
			fill(multiColourGradient(i, "#3b0000",
									(num_blocks - 1)/4, "#772c2c",
									(num_blocks - 1)/2, "#b34540",
									(num_blocks - 1)*3/4, "#c77c5a",
									(num_blocks - 1), "#f4d6af"));
			rect(i * incr - width/2, 0, r, r);
		}

		pop();
	}
	
	var noiseLine = function(energy, energy2, colouridx)
	{
		push();

		translate(width/2, height/2);
		beginShape();
		noFill();
		// change the colour along different shades of green (first = last)
		stroke(multiColourGradient((colouridx % 512), "#051f20",
									128, "#0b2b26",
									256, "#163832",
									384, "#235347",
									512, "#051f20"));
		strokeWeight(5);
		
		for(var i = 0; i < 100; i++)
		{
			var x = map(noise(i* noiseStep + prog),0,1,-width/2,width/2);
			var y = map(noise(i* noiseStep + prog + 1000),0,1,-height/2,height/2);
			vertex(x,y);
		}
		endShape();
		
		//progress speed is proportional to energy (no threshold)
		prog += map(energy, 0, 255, 0.001, 0.05);
		
		//auto calibration of seed threshold: find maximum level
		//within previous time interval (without current sample)
		//only reseed if currently more than previous maximum
		//this should limit reseeding to once per second
		//(except momentarily for fade-in situations)
		seedThresh = seedThreshCalib.getMax();
		seedThreshCalib.addValue(energy2);

		if(energy2 > seedThresh)
		{
			noiseSeed();
		}
		
		pop();
	}
}
