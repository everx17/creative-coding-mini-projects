function Spectrum()
{
	this.name = "Spectrum";
	//how far to zoom into the lower end at most (if high-end bands are all at 0)
	var maxZoom = 4;
	//the resulting minimum number of freq bands visible
	var minBands = 1024/maxZoom;

	//an instance of the statistics tracker to keep track of the number of freq bands
	//that are contained in the input; monitor for 5 seconds and init with the value
	//that reperesents max zoom, since zoom out happens instantly and zoom in is delayed
	var bandsCalib = new StatisticsTracker(300, minBands);

	this.draw = function()
	{
		var spectrum = fourier.analyze();
		var numUsedBands = minBands;
		push();
		noStroke();

		//find the number of used bands in this sample
		for(var i = spectrum.length - 1; i >= minBands; i--)
		{
			if(spectrum[i] >= 1)
			{
				numUsedBands = i+1;
				break;
			}
		}
		
		//find the max number of used bands (including this sample, so add first)
		//this way it'll zoom out immediately if needed and zoom in after ~5 seconds
		bandsCalib.addValue(numUsedBands);
		numUsedBands = bandsCalib.getMax();

		for(var i = 0; i < numUsedBands; i++)
		{
			//colour is based on level, mapped to a multi-segment colour gradient
			fill(multiColourGradient(spectrum[i], "#2be7e4",
											50,  "#271a64",									
											100, "#7b2e88",
											160, "#fb90cc",
											255, "#ec2482"));
	
			//draw each bin as a rectangle from the bottom of the screen
			var x = map(i, 0, numUsedBands, 0, width);
			var y = map(spectrum[i], 0, 255, height, 0);
			rect(x, y, width/numUsedBands, height-y);
		}  		
		pop();
	};
}
