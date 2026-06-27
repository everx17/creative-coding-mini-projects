function LostInSpace()
{
	//vis name
	this.name = "Lost In Space";

	//stars in x alignment
	var starsXY = [];
	//stars in + alignment
	var starsHV = [];

	//planets with their moons
	var planets = [];

	//background stars
	for (var i = 0; i < 50; i++)
	{	//center coordinates relative to canvas size, leave 0.5% margin; size 0.3...0.8%
		starsXY.push({ x: random(0.5,99.5), y: random(0.5,99.5), size: random(0.3,0.8)});
		starsHV.push({ x: random(0.5,99.5), y: random(0.5,99.5), size: random(0.3,0.8)});
	}

	//planet params: type, orbitalOffset, MainCol, SecCol, moonCol
	planets.push(new planet(1, 0,   "#e09119", "#fcdb47", "#90d090"));
	planets.push(new planet(2, 120, "#d0c090", "#a08060", "#d06060"));
	planets.push(new planet(3, 240, "#11357d", "#306e1e", "#d0c090"));

	//draw the scene to the screen
	this.draw = function()
	{
		var spectrum = fourier.analyze();

		push();
		background(0);
		noStroke();
		
		var b = fourier.getEnergy("bass");
		var l = fourier.getEnergy("lowMid");
		var h = fourier.getEnergy("highMid");
		var t = fourier.getEnergy("treble");
		
		//draw stars (draw dimly even without input)
		drawStars(max(t, 32), max(l, 48));

		updatePlanets(b, h);
		//planets and moons orbital positions: x = cos(alpha); y = -sin(alpha);
		//therefore they start at the right, move up (to background) and left
		//at 180 degrees they are leftmost and move to the right in the foreground
		//pass 1: will draw only background (orbital position 0...180 degrees)
		drawPlanets(1);
		//pass 2: will draw the forground (orbital position 180...360 degrees)
		drawPlanets(2);
		pop();
	}

	var drawStars = function(energy1, energy2)
	{
		var xc, yc, rayL, rayW;

		push();

		//base colour white/grey - silver hue
		fill(energy1);
		for (var i = 0; i < starsXY.length; i++)
		{
			xc = starsXY[i].x * width/100;
			yc = starsXY[i].y * height/100;
			//star size is relative to median canvas dimension
			rayL = starsXY[i].size * (width+height)/200;
			//star size varies between 50% and 100% depending on energy
			rayL = map(energy1, 0, 255, rayL/2, rayL);
			rayW = rayL/6;

			triangle(xc-rayW, yc-rayW, xc+rayW, yc+rayW, xc+rayL, yc-rayL);
			triangle(xc-rayW, yc-rayW, xc+rayW, yc+rayW, xc-rayL, yc+rayL);
			triangle(xc-rayW, yc+rayW, xc+rayW, yc-rayW, xc+rayL, yc+rayL);
			triangle(xc-rayW, yc+rayW, xc+rayW, yc-rayW, xc-rayL, yc-rayL);
		}

		//base colour #ffc010 - golden hue
		fill(energy2, energy2*3/4, energy2/16);
		for (var i = 0; i < starsHV.length; i++)
		{
			xc = starsHV[i].x * width/100;
			yc = starsHV[i].y * height/100;
			//star size is relative to median canvas dimension
			rayL = starsHV[i].size * (width+height)/200;
			//star size varies between 50% and 100% depending on energy
			rayL = map(energy2, 0, 255, rayL/2, rayL);
			rayW = rayL/4;

			triangle(xc-rayW, yc, xc+rayW, yc, xc, yc-rayL);
			triangle(xc-rayW, yc, xc+rayW, yc, xc, yc+rayL);
			triangle(xc-rayL, yc, xc, yc-rayW, xc, yc+rayW);
			triangle(xc+rayL, yc, xc, yc-rayW, xc, yc+rayW);
		}
		pop();
	}
	
	var updatePlanets = function(energy1, energy2)
	{
		for(var i = 0; i < planets.length; i++)
		{
			planets[i].update(energy1, energy2);
		}
	}

	var drawPlanets = function(pass)
	{
		push();
		for(var i = 0; i < planets.length; i++)
		{
			planets[i].draw(pass);
		}
		pop();
	}
}
