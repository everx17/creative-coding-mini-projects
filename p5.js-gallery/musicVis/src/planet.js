function planet(type, orbitalOffs, planetMainCol, planetSecCol, moonCol)
{
	var type = type;
	var orbitalPos = orbitalOffs;
	var moonPos = orbitalOffs;
	var moonCol = moonCol;
	var planetMainCol = planetMainCol;
	var planetSecCol = planetSecCol;

	this.update = function(energy1, energy2)
	{
		orbitalPos += 0.25;	// slow rotation without any input
		orbitalPos += map(energy1, 0, 255, 0, 1.75);	// speed up based on energy
		if (orbitalPos >= 360)
		{
			orbitalPos -= 360;
		}

		moonPos += 1;	// slow rotation without any input
		moonPos += map(energy2, 0, 255, 0, 11);	// speed up based on energy
		if (moonPos >= 360)
		{
			moonPos -= 360;
		};
	}

	this.draw = function(pass)
	{	//only draw background (0...180 degress) in pass 1, the rest in pass 2
		if(((pass == 1) && orbitalPos < 180) ||
			((pass == 2) && orbitalPos >= 180))
		{
			push();
			angleMode(DEGREES);

			var planetX = width/2 + width * cos(orbitalPos) / 3;
			var planetY = height/2 - height * sin(orbitalPos) / 5;
			var planetSize = (width+height)/20 * (1 - sin(orbitalPos) / 4);
			var moonX = planetX + planetSize * cos(moonPos);
			var moonY = planetY - planetSize * sin(moonPos) / 2;
			var moonSize = (planetSize / 5) * (1 - sin(moonPos) / 5);

			//draw moon first if behind planet
			if(moonPos < 180)
			{
				noStroke();
				fill(moonCol);
				ellipse(moonX, moonY, moonSize);
			}

			//draw planet depending on its type
			if(type == 1)
			{
				var bandPos = 15 + 5*sin(frameCount % 360);
				var arcPos = 60;
				var arcSize = planetSize * cos(bandPos);

				noStroke();
				//planet body (will be painted over except for center band)
				fill(planetSecCol);
				ellipse(planetX, planetY, planetSize);
				//north and south pole areas (creating a straight edge of the center band)
				fill(planetMainCol);
				arc(planetX, planetY, planetSize, planetSize, bandPos, 180-bandPos, OPEN);
				arc(planetX, planetY, planetSize, planetSize, 180+bandPos, 360-bandPos, OPEN);
				//add waves to center band - cutting into band top right
				//bugfix: for all 4 arcs, the odd start and end angles draw the arc
				//1 degree (outside) or 2 degrees (inside) further than should be required
				//this is a workaround for the problem of a visible line where the arcs
				//meets the central band, probably caused by rounding/anti-aliasing
				arc(planetX + arcSize/4,
					planetY - arcSize/2 * sin(arcPos) - planetSize/2 * sin(bandPos),
					arcSize, arcSize, arcPos-1, 182-arcPos, OPEN);
				//add waves to center band - cutting into band bottom left
				arc(planetX - arcSize/4,
					planetY + arcSize/2 * sin(arcPos) + planetSize/2 * sin(bandPos),
					arcSize, arcSize, 179+arcPos, 362-arcPos, OPEN);
				//add waves to center band - adding to band top left
				fill(planetSecCol);
				arc(planetX - arcSize/4,
					planetY + arcSize/2 * sin(arcPos) - planetSize/2 * sin(bandPos),
					arcSize, arcSize, 179+arcPos, 362-arcPos, OPEN);
				//add waves to center band - adding to band bottom right
				arc(planetX + arcSize/4,
					planetY - arcSize/2 * sin(arcPos) + planetSize/2 * sin(bandPos),
					arcSize, arcSize, arcPos-1, 182-arcPos, OPEN);
			}
			if(type == 2)
			{
				//draw the upper half of the planet's ring (behind the planet)
				noFill();
				stroke(planetSecCol);
				strokeWeight(planetSize / 8);
				//(2 arcs of same height, diff. width = strokeWeight in perspective)
				arc(planetX, planetY, planetSize*4/3, planetSize/2, 180, 360);
				arc(planetX, planetY, planetSize*3/2, planetSize/2, 180, 360);
				//draw the planet itself
				noStroke();
				fill(planetMainCol);
				ellipse(planetX, planetY, planetSize);
				//draw the lower half of the planet's ring (in front of the planet)
				noFill();
				stroke(planetSecCol);
				arc(planetX, planetY, planetSize*4/3, planetSize/2, 0, 180);
				arc(planetX, planetY, planetSize*3/2, planetSize/2, 0, 180);
			}
			if(type == 3)
			{
				noStroke();
				fill(planetMainCol);
				ellipse(planetX, planetY, planetSize);
				fill(planetSecCol);
				//first continent (-1 and +1 are to prevent a visible line between arc and curve)
				arc(planetX, planetY, planetSize, planetSize, 40 - 1, 120 + 1, OPEN);
				beginShape();
				curveVertex(planetX + planetSize/2*cos(40), planetY + planetSize/2*sin(40));
				curveVertex(planetX + planetSize/2*cos(40), planetY + planetSize/2*sin(40));
				curveVertex(planetX + planetSize*0.3, planetY + planetSize*0.33);
				curveVertex(planetX + planetSize*0.2, planetY + planetSize*0.3);
				curveVertex(planetX + planetSize*0.1, planetY + planetSize*0.28);
				curveVertex(planetX, planetY + planetSize*0.22);
				curveVertex(planetX - planetSize*0.1, planetY + planetSize*0.14);
				curveVertex(planetX - planetSize*0.2, planetY + planetSize*0.2);
				curveVertex(planetX - planetSize*0.27, planetY + planetSize*0.3);
				curveVertex(planetX + planetSize/2*cos(120), planetY + planetSize/2*sin(120));
				curveVertex(planetX + planetSize/2*cos(120), planetY + planetSize/2*sin(120));
				endShape();
				//second continent
				arc(planetX, planetY, planetSize, planetSize, 160 - 1, 210 + 1, OPEN);
				beginShape();
				curveVertex(planetX + planetSize/2*cos(160), planetY + planetSize/2*sin(160));
				curveVertex(planetX + planetSize/2*cos(160), planetY + planetSize/2*sin(160));
				curveVertex(planetX - planetSize*0.38, planetY + planetSize*0.1);
				curveVertex(planetX - planetSize*0.33, planetY);
				curveVertex(planetX - planetSize*0.32, planetY - planetSize*0.1);
				curveVertex(planetX - planetSize*0.35, planetY - planetSize*0.2);
				curveVertex(planetX + planetSize/2*cos(210), planetY + planetSize/2*sin(210));
				curveVertex(planetX + planetSize/2*cos(210), planetY + planetSize/2*sin(210));
				endShape();
				//third continent
				arc(planetX, planetY, planetSize, planetSize, 270 - 1, 360 + 1, OPEN);
				beginShape();
				curveVertex(planetX + planetSize/2*cos(270), planetY + planetSize/2*sin(270));
				curveVertex(planetX + planetSize/2*cos(270), planetY + planetSize/2*sin(270));
				curveVertex(planetX - planetSize*0.05, planetY - planetSize*0.4);
				curveVertex(planetX - planetSize*0.1, planetY - planetSize*0.36);
				curveVertex(planetX - planetSize*0.14, planetY - planetSize*0.3);
				curveVertex(planetX - planetSize*0.1, planetY - planetSize*0.21);
				curveVertex(planetX - planetSize*0.05, planetY - planetSize*0.15);
				curveVertex(planetX, planetY - planetSize*0.12);
				curveVertex(planetX + planetSize*0.02, planetY - planetSize*0.1);
				curveVertex(planetX + planetSize*0.02, planetY);
				curveVertex(planetX + planetSize*0.05, planetY + planetSize*0.02);
				curveVertex(planetX + planetSize*0.1, planetY + planetSize*0.02);
				curveVertex(planetX + planetSize*0.2, planetY - planetSize*0.05);
				curveVertex(planetX + planetSize*0.28, planetY - planetSize*0.1);
				curveVertex(planetX + planetSize*0.35, planetY - planetSize*0.05);
				curveVertex(planetX + planetSize*0.33, planetY + planetSize*0.02);
				curveVertex(planetX + planetSize*0.4, planetY + planetSize*0.1);
				curveVertex(planetX + planetSize*0.45, planetY + planetSize*0.05);
				curveVertex(planetX + planetSize/2*cos(360), planetY + planetSize/2*sin(360));
				curveVertex(planetX + planetSize/2*cos(360), planetY + planetSize/2*sin(360));
				endShape();
			}

			//draw moon last if in foreground of planet
			if(moonPos >= 180)
			{
				noStroke();
				fill(moonCol);
				ellipse(moonX, moonY, moonSize);
			}
			pop();
		}
	}
}
