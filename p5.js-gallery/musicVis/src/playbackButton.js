//displays and handles clicks on the playback button.
function PlaybackButton()
{
	
	this.x = 20;
	this.y = 20;
	this.width = 20;
	this.height = 20;

	//flag to determine whether to play or pause after button click and
	//to determine which icon to draw
	this.playing = false;

	this.draw = function()
	{
		if(!isReady)
		{	//if the sound is not loaded yet, display "..."
			rect(this.x, this.y, this.width/4, this.width/4);
			rect(this.x + this.width/3, this.y, this.width/4, this.width/4);
			rect(this.x + this.width*2/3, this.y,this.width/4, this.width/4);
		}
		else
		{
			if(this.playing)
			{
				rect(this.x, this.y, this.width/2 - 2, this.height);
				rect(this.x + (this.width/2 + 2), this.y, this.width/2 - 2, this.height);
			}
			else
			{	
				triangle(this.x, this.y, this.x + this.width, this.y + this.height/2, this.x, this.y+this.height);
			}
		}
	};

	//checks for clicks on the button.
	//@returns true if clicked, false otherwise.
	this.hitCheck = function()
	{
		if (mouseX > this.x &&
			mouseX < this.x + this.width &&
			mouseY > this.y &&
			mouseY < this.y + this.height)
		{
  			return true;
		}
		return false;
	};

	//starts or pauses playback if the soundfile finished loading successfully
	this.playPause = function()
	{
		if(!isReady)
		{	//if the sound is not loaded yet, don't attempt to play
			return false;
		}
		if (sound.isPlaying())
		{
			sound.pause();
		}
		else
		{
			sound.loop();
		}
		this.playing = !this.playing;
	}
}