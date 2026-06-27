//constructor function to draw stage lights
function Stagelights()
{
	//name of the visualisation
	this.name = "Stage Lights";

	var stagelights = [];
	//parameters: isLaser, freq, xPos%, minW%, maxW%, lightCol, IdleBrightness%, hasMirror
	stagelights.push(new stagelight(false, "bass",    20,  5, 20, "#DA3A34", 100, true));
	stagelights.push(new stagelight(false, "lowMid",  35, 12, 15, "#FFC759",  30, true));
	stagelights.push(new stagelight(true,  "treble",   5,  8, 10, "#084B60", 100, true));

	noiseSeed();

	// draw the light beams to the screen
	this.draw = function()
	{
		var spectrum = fourier.analyze();
		for(var i = 0; i < stagelights.length; i++)
		{
			stagelights[i].draw();
		}
	}
}
