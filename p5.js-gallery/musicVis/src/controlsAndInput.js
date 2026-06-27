//Constructor function to handle the onscreen menu, keyboard and mouse
//controls
function ControlsAndInput()
{
	
	this.menuDisplayed = false;
	
	//playback button displayed in the top left of the screen
	this.playbackButton = new PlaybackButton();

	//play/pause or make the window fullscreen or revert to windowed
	this.mousePressed = function()
	{
		if(this.playbackButton.hitCheck())
		{
			this.playbackButton.playPause();
		}
		else
		{
			var fs = fullscreen();
			fullscreen(!fs);
		}
	};

	//responds to keyboard presses
	//@param keycode the ascii code of the keypressed
	this.keyPressed = function(keycode)
	{
		//space bar or p for play/pause
		if((keycode == 32) || (keycode == 80))
		{
			this.playbackButton.playPause();
		}

		//h or m for help menu
		if((keycode == 72) || (keycode == 77))
		{
			this.menuDisplayed = !this.menuDisplayed;
		}

		//f for full screen
		if(keycode == 70)
		{
			var fs = fullscreen();
			fullscreen(!fs);
		}

		//number keys to select a visual
		if(keycode > 48 && keycode < 58)
		{
			var visNumber = keycode - 49;
			if (visNumber < vis.visuals.length)
			{
				vis.selectVisual(vis.visuals[visNumber].name);
			}
		}
	};

	//draws the playback button and potentially the menu
	this.draw = function()
	{
		push();
		fill("white");
		stroke("black");
		strokeWeight(2);
		textSize(24);

		//playback button 
		this.playbackButton.draw();
		//only draw the menu if menu displayed is set to true.
		if(this.menuDisplayed)
		{

			text("Click Play, press H to toggle help.", 60, 30);
			text("Use number key to select:", 60, 62);
			this.menu();
		}	
		else if (frameCount < 255)
		{
			fill(255-frameCount);
			text("Press H for help.", 60, 30);
		}
		pop();

	};

	this.menu = function()
	{
		//draw out menu items for each visualisation
		for(var i = 0; i < vis.visuals.length; i++)
		{
			var yLoc = 94 + i*32;
			text((i+1) + ":  " +vis.visuals[i].name, 60, yLoc);
		}
	};
}


