var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;
var mountains;
var trees_x;
var canyons;
var collectables;

var game_score;
var flagpole;
var flag_y;
var lives;
var level;

var jumpSound;
var fallSound;
var enemyhitSound;
var collectSound;
var levelcompleteSound;

//I have chosen to add enemies into my game to make it more challenging.
//I feel that having more interactive elements in my game would help to keep the attention and interest of players.
//Implementing an enemy element is defintely a lot harder than the addition of sound elements.
//As the code is long, an issue I faced was carelessness in writing my code which led to mistakes such as mispelling, preventing my game to run.
//Another issue i faced was collision of codes from other sections which causes clashes and elements to fault.
//This has taught me that I should be more careful and practicing coding more is a good way to do it.

var enemies;

//I have chosen to add sounds to my game to make the environment more immersive and interesting. 
//When we include sounds in our game, we can make mundane tasks like collecting the keys feel more rewarding.
//We can also influence players to feel certain emotions such as surprise when they fall down the canyon.
//The hardest part about implementing this extension was at the start when I was trying to figure out where to place my codes into the template.
//By practicing implementing sounds, I have learnt a new skill of adding assets into my code which will make my work more flavourful.
//I have also learnt to judge and select appropriate sounds to implement at the right instances.

function preload()
{
    soundFormats('mp3','wav');

    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);

	fallSound = loadSound('assets/fall.mp3');
	fallSound.setVolume(1);

	enemyhitSound = loadSound('assets/enemyhit.wav')
	enemyhitSound.setVolume(0.2);

	collectSound = loadSound('assets/collect.mp3');
	collectSound.setVolume(1);

	levelcompleteSound = loadSound('assets/flag.mp3');
	levelcompleteSound.setVolume(0.5);
}

function setup()
{
	createCanvas(1024, 576);
    floorPos_y = height * 3/4;

	lives = 3;
	level = 1;

	startGame();
}

function startGame()
{
	gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    trees_x = [100, 300, 500, 1000, 1100, 1300, 1500, 1700, 1800, 2000, 2100, 2500];
    clouds = [
		{pos_x: 150, pos_y: 150},
		{pos_x: 650, pos_y: 50},
		{pos_x: 850, pos_y: 150},
		{pos_x: 1250, pos_y: 100},
		{pos_x: 1550, pos_y: 150},
		{pos_x: 1950, pos_y: 50},
		{pos_x: 2350, pos_y: 150}
	];
    mountains = [
		{pos_x: 600, height: 432},
		{pos_x: 1300, height: 432},
		{pos_x: 2100, height: 432}
	];
    canyons = [
		{x_pos: 300, width: 100},
		{x_pos: 1300, width: 100},
		{x_pos: 1800, width: 100}
	];
    collectables = [
		{x_pos: 200, y_pos: floorPos_y, size: 50, isFound: false},
		{x_pos: 940, y_pos: floorPos_y, size: 50, isFound: false},
		{x_pos: 1850, y_pos: floorPos_y-50, size: 50, isFound: false}
	];
 
	game_score = 0;

	flagpole = {x_pos: 2450, isReached: false};

	enemies = [];
	enemies.push(new Enemy(150, floorPos_y - 8, 100));	
	enemies.push(new Enemy(850, floorPos_y - 8, 150));	
	enemies.push(new Enemy(1450, floorPos_y - 8, 300));	
}

function draw()
{
	background(147, 112 ,219); 

	noStroke();
	fill(139, 0, 139);
	rect(0, floorPos_y, width, height/4); 

    push();
    translate(scrollPos,0);

	// Draw clouds.
	drawClouds();

	// Draw mountains.
	drawMountains();

	// Draw trees.
	drawTrees();

	// Draw canyons.
    for(var i = 0; i < canyons.length; i++)
    {
		drawCanyon(canyons[i]);
		checkCanyon(canyons[i]);
	}

	// Draw collectable items.
    for(var i = 0; i < collectables.length; i++)
    {
		if(collectables[i].isFound == false)
		{
			drawCollectable(collectables[i]);
			checkCollectable(collectables[i]);
		}
	}

	// Draw the flagpole.
	renderFlagpole();

	for(var i =0; i < enemies.length; i++)
	{
		enemies[i].draw();

		var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y);

		if(isContact == true && isPlummeting == false)
		{
			enemyhitSound.play();
			gameChar_y = floorPos_y - 50;	// jump up a little upon collision, then plummet
			isPlummeting = true;
		}
	}

	pop();

	// Draw game character.
	if (lives > 0)	// unless it's a ghost
	{
		drawGameChar();
	}

	// Draw the score.
	fill(0);
	noStroke();
	textSize(20);
	text("score: " + game_score, 20, 20);

	//Draw the remaining lives.
	fill(0);
	noStroke();
	textSize(20);
	text("lives: ", 20, 50);
	fill(255, 0, 0);
	noStroke();
	for(var i = 0; i < lives; i++)
	{
		ellipse(30*i + 75, 40, 10);
		ellipse(30*i + 85, 40, 10);
		triangle(30*i+70, 42, 30*i+90, 42, 30*i+80, 52);
	}

	// check for end of game (either game over or flagpole reached)
	if(lives < 1)
	{
		fill(0);
		noStroke();
		textSize(50);
		text("Game over. Press space to continue.", 100, 234);
		return;
	}
	else if(flagpole.isReached)
	{
		isLeft = false;		// actual moving is prevented by the return at the end of this function
		isRight = false;	// however, also set the player character to face the player
		fill(0);
		noStroke();
		textSize(50);
		text("Level complete. Press space to continue.", 60, 234);
		return;
	}

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    if(floorPos_y > gameChar_y)
	{
		gameChar_y += 2;
		isFalling = true
	}
    else
	{
		isFalling = false;
	}

	if(isPlummeting == true)
	{
		isLeft = false;
		isRight = false;
		gameChar_y += 5;
	}

	if(flagpole.isReached == false)
	{
		checkFlagpole();
	}

	checkPlayerDie();

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{
    if(keyCode == 37 && isPlummeting == false && flagpole.isReached == false)
	{
		isLeft = true;	// start moving left, unless the player is plummeting or finished the level
	}
    else if(keyCode == 39 && isPlummeting == false && flagpole.isReached == false)
	{
		isRight = true;	// start moving right, unless the player is plummeting or finished the level
	}
    
    if(keyCode == 32 && gameChar_y == floorPos_y && flagpole.isReached == false)
	{
		gameChar_y -= 100;	// jump if the player is on the ground and he hasn't finished the level
        jumpSound.play();
	}
	else if(keyCode == 32 && lives < 1)
	{
		lives = 3;			// reset the game including lives counter upon Game Over
		level = 1;
		startGame();
	}
	else if(keyCode == 32 && flagpole.isReached)
	{
		level++;			// move on to the next level upon completion
		startGame();
	}
}

function keyReleased()
{
    if(keyCode == 37)
	{
		isLeft = false;
	}
    else if(keyCode == 39)
	{
		isRight = false;
	}
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
	if(isLeft && isFalling)
	{
		//jumping-left code
		fill(255, 218, 185);
		ellipse(gameChar_x - 12, gameChar_y - 48, 20, 20);
		ellipse(gameChar_x - 8, gameChar_y - 58 , 5, 30);
		ellipse(gameChar_x - 17, gameChar_y - 58, 5, 30);
		ellipse(gameChar_x, gameChar_y - 28, 35, 35);
		ellipse(gameChar_x - 5, gameChar_y - 10, 25, 10);
		
		fill (255, 255, 255);
		ellipse(gameChar_x - 8, gameChar_y - 60, 2, 10);
		ellipse(gameChar_x - 17, gameChar_y - 60, 2, 10);
		ellipse(gameChar_x - 13, gameChar_y - 42, 5, 10);
		ellipse(gameChar_x + 17, gameChar_y - 23, 10, 10);
		
		fill (0, 0, 0);
		ellipse(gameChar_x - 16, gameChar_y - 48, 2, 2);
		
		fill(219,112,147);
		ellipse(gameChar_x - 20, gameChar_y - 45, 4, 2);
	}
    
	else if(isRight && isFalling)
	{
		//jumping-right code
		fill(255, 218, 185);
		ellipse(gameChar_x + 12, gameChar_y - 48, 20, 20);
		ellipse(gameChar_x + 8, gameChar_y - 58 , 5, 30);
		ellipse(gameChar_x + 17, gameChar_y - 58, 5, 30);
		ellipse(gameChar_x, gameChar_y - 28, 35, 35);
		ellipse(gameChar_x + 5, gameChar_y - 10, 25, 10);
		
		fill (255, 255, 255);
		ellipse(gameChar_x + 8, gameChar_y - 60, 2, 10);
		ellipse(gameChar_x + 17, gameChar_y - 60, 2, 10);
		ellipse(gameChar_x + 13, gameChar_y - 42, 5, 10);
		ellipse(gameChar_x - 17, gameChar_y - 23, 10, 10);
		
		fill (0, 0, 0);
		ellipse(gameChar_x + 16, gameChar_y - 48, 2, 2);
		
		fill(219,112,147);
		ellipse(gameChar_x + 20, gameChar_y - 45, 4, 2);
	}
    
	else if(isLeft)
	{
		// add your walking left code
		fill(255, 218, 185);
		ellipse(gameChar_x - 12, gameChar_y - 40, 20, 20);
		ellipse(gameChar_x - 8, gameChar_y - 50 , 5, 30);
		ellipse(gameChar_x - 17, gameChar_y - 50, 5, 30);
		ellipse(gameChar_x, gameChar_y - 20, 35, 35);
		ellipse(gameChar_x - 5, gameChar_y - 2, 25, 10);
		
		fill (255, 255, 255);
		ellipse(gameChar_x - 8, gameChar_y - 52, 2, 10);
		ellipse(gameChar_x - 17, gameChar_y - 52, 2, 10);
		ellipse(gameChar_x - 13, gameChar_y - 20, 5, 10);
		ellipse(gameChar_x + 17, gameChar_y - 15, 10, 10);
		
		fill (0, 0, 0);
		ellipse(gameChar_x - 16, gameChar_y - 40, 2, 2);
		
		fill(219,112,147);
		ellipse(gameChar_x - 20, gameChar_y - 37, 4, 2);
	}
    
	else if(isRight)
	{
		//walking right code
		fill(255, 218, 185);
		ellipse(gameChar_x + 12, gameChar_y - 40, 20, 20);
		ellipse(gameChar_x + 8, gameChar_y - 50 , 5, 30);
		ellipse(gameChar_x + 17, gameChar_y - 50, 5, 30);
		ellipse(gameChar_x, gameChar_y - 20, 35, 35);
		ellipse(gameChar_x + 5, gameChar_y - 2, 25, 10);
		
		fill (255, 255, 255);
		ellipse(gameChar_x + 8, gameChar_y - 52, 2, 10);
		ellipse(gameChar_x + 17, gameChar_y - 52, 2, 10);
		ellipse(gameChar_x + 13, gameChar_y - 20, 5, 10);
		ellipse(gameChar_x - 17, gameChar_y - 15, 10, 10);
		
		fill (0, 0, 0);
		ellipse(gameChar_x + 16, gameChar_y - 40, 2, 2);
		
		fill(219,112,147);
		ellipse(gameChar_x + 20, gameChar_y - 37, 4, 2);
	}
    
	else if(isFalling || isPlummeting)
	{
		//jumping facing forwards code
		fill(255, 218, 185);
		ellipse(gameChar_x, gameChar_y - 10, 35, 10);
		ellipse(gameChar_x, gameChar_y - 28, 35, 35);
		ellipse(gameChar_x, gameChar_y - 50, 20, 20);
		ellipse(gameChar_x - 5, gameChar_y - 58, 5, 30);
		ellipse(gameChar_x + 5, gameChar_y - 58, 5, 30);
		
		fill (255, 255, 255);
		ellipse(gameChar_x - 5, gameChar_y - 63, 2, 10);
		ellipse(gameChar_x + 5, gameChar_y - 63, 2, 10);
		ellipse(gameChar_x + 7, gameChar_y - 45, 5, 10);
		ellipse(gameChar_x - 7, gameChar_y - 45, 5, 10);
		
		fill (0, 0, 0);
		ellipse(gameChar_x - 5, gameChar_y - 50, 2, 2);
		ellipse(gameChar_x + 5, gameChar_y - 50, 2, 2);
		
		fill(219,112,147);
		ellipse(gameChar_x, gameChar_y - 48, 4, 2);
	}
    
	else
	{
		//standing front facing code
		fill(255, 218, 185);
		ellipse(gameChar_x, gameChar_y - 2, 35, 10);
		ellipse(gameChar_x, gameChar_y - 20, 35, 35);
		ellipse(gameChar_x, gameChar_y - 42, 20, 20);
		ellipse(gameChar_x - 5, gameChar_y - 50 , 5, 30);
		ellipse(gameChar_x + 5, gameChar_y - 50, 5, 30);
		
		fill (255, 255, 255);
		ellipse(gameChar_x - 5, gameChar_y - 55 , 2, 10);
		ellipse(gameChar_x + 5, gameChar_y - 55 , 2, 10);
		ellipse(gameChar_x + 7, gameChar_y - 25, 5, 10);
		ellipse(gameChar_x - 7, gameChar_y - 25, 5, 10);
		
		fill (0, 0, 0);
		ellipse(gameChar_x - 5, gameChar_y - 42 , 2, 2);
		ellipse(gameChar_x + 5, gameChar_y - 42 , 2, 2);
		
		fill(219,112,147);
		ellipse(gameChar_x, gameChar_y - 40 , 4, 2);     
	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
    for(var i = 0; i < clouds.length; i++)
    {
		fill (216, 191, 216);
		ellipse(clouds[i].pos_x, clouds[i].pos_y, 80, 80);
		ellipse(clouds[i].pos_x - 40, clouds[i].pos_y + 5, 40, 60);
		ellipse(clouds[i].pos_x - 70, clouds[i].pos_y + 10, 50, 40);
		ellipse(clouds[i].pos_x + 40, clouds[i].pos_y + 10, 50, 50);
		ellipse(clouds[i].pos_x + 65, clouds[i].pos_y + 10, 30, 30);

		fill(0, 0, 0);
		ellipse(clouds[i].pos_x, clouds[i].pos_y, 10, 10);
		ellipse(clouds[i].pos_x + 30, clouds[i].pos_y, 10, 10);
    }
}

// Function to draw mountains objects.
function drawMountains()
{
    for(var i = 0; i < mountains.length; i++)
    {
		//base
		fill(230, 230, 250);
		triangle(
			mountains[i].pos_x, mountains[i].height,
			mountains[i].pos_x + 270, mountains[i].height,
			mountains[i].pos_x + 125, mountains[i].height - 182
			);
		triangle(
			mountains[i].pos_x - 30, mountains[i].height,
			mountains[i].pos_x + 170, mountains[i].height,
			mountains[i].pos_x + 40, mountains[i].height - 82
			);
		//snow
		fill(255, 255, 255);
		triangle(
			mountains[i].pos_x + 45, mountains[i].height - 67,
			mountains[i].pos_x + 220, mountains[i].height -67,
			mountains[i].pos_x + 125, mountains[i].height - 182
			);
		triangle(
			mountains[i].pos_x + 25, mountains[i].height - 67,
			mountains[i].pos_x + 65, mountains[i].height - 67,
			mountains[i].pos_x + 40, mountains[i].height - 82
			);
    }
}

// Function to draw trees objects.
function drawTrees()
{
    for(var i = 0; i < trees_x.length; i++)
    {
		//trunk
		fill(248, 248, 255);
		rect(trees_x[i], floorPos_y - 100, 10, 100);
		//branches
		fill(75, 0, 130);
		triangle(
			trees_x[i] - 30, floorPos_y - 53,
			trees_x[i] + 5, floorPos_y - 105,
			trees_x[i] + 40, floorPos_y - 53
			);
		triangle(
			trees_x[i] - 25, floorPos_y - 73,
			trees_x[i] + 5, floorPos_y - 135,
			trees_x[i] + 35, floorPos_y - 73
			);
		triangle(
			trees_x[i] - 20, floorPos_y - 93,
			trees_x[i] + 5, floorPos_y - 155,
			trees_x[i] + 30, floorPos_y - 93
			);
    }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    fill(0, 0, 0);
	// the main pit
    rect(t_canyon.x_pos, floorPos_y, t_canyon.width, height-floorPos_y);
    
	// spikes on the left
	triangle(
		t_canyon.x_pos, floorPos_y,
		t_canyon.x_pos, floorPos_y+60,
		t_canyon.x_pos -15, floorPos_y+75
		);
    triangle(
		t_canyon.x_pos, floorPos_y+60,
		t_canyon.x_pos, floorPos_y+110,
		t_canyon.x_pos -20, floorPos_y+125
		);
    // spike on the right
	triangle(
		t_canyon.x_pos + t_canyon.width, floorPos_y+10,
		t_canyon.x_pos + t_canyon.width, floorPos_y+70,
		t_canyon.x_pos + t_canyon.width+25, floorPos_y+110
		);
    // lava
    fill(128, 0, 0);
    rect(t_canyon.x_pos, height-30, t_canyon.width, 30);
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
	if((gameChar_world_x > t_canyon.x_pos + 10 &&
		gameChar_world_x < t_canyon.x_pos + t_canyon.width - 10) &&
		gameChar_y == floorPos_y)
	{
		isPlummeting = true;
	}
}

function checkPlayerDie()
{
	if(gameChar_y > height)
	{
		fallSound.play();
		lives -=1;

		if(lives > 0)
		{
			startGame();
		}
	}
}


function renderFlagpole()
{
	push();
	strokeWeight(5);
	stroke(0);
	line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 120);
	fill(100, 149, 237);
	noStroke();

	if(flagpole.isReached)
	{
		flag_y = min(flag_y+2, 120);	// animate the flag towards the top
	}
	else
	{
		flag_y = 10;					// flag stays down
	}
	rect(flagpole.x_pos, floorPos_y - flag_y, 50, 20);

	pop();
}

function checkFlagpole()
{
	var d = abs(gameChar_world_x - flagpole.x_pos);

	if(d < 15)
	{
		flagpole.isReached = true;
		levelcompleteSound.play();
	}
}

function Enemy(x, y, range)
{
	this.x = x;
	this.y = y;
	this.range = range;

	this.currentX = x;
	this.inc = 0.75 + 0.25 * level;	// start with increment 1, increase by 0.25 for each level
	this.update = function()
	{
		this.currentX += this.inc;
		if(this.currentX >= this.x + this.range)
		{
			this.inc = -0.75 - 0.25 * level;
		}
		else if(this.currentX < this.x)
		{
			this.inc = 0.75 + 0.25 * level;
		}
	}
	
	this.draw = function()
	{
		this.update();
		fill(0, 0, 0);
		ellipse(this.currentX, this.y, 20, 20);
		ellipse(this.currentX + 5, this.y - 10, 20, 20);
		ellipse(this.currentX + 10, this.y, 20, 20);
		fill(255, 255, 255);
		ellipse(this.currentX, this.y, 5, 5);
		ellipse(this.currentX + 10, this.y, 5, 5);
		fill(255, 0, 0);
		triangle(this.currentX, this.y - 8, this.currentX - 8, this.y - 8, this.currentX - 4, this.y - 20)
		triangle(this.currentX + 10, this.y - 8, this.currentX + 18, this.y - 8, this.currentX + 14, this.y - 20)
	}

	this.checkContact = function(gameChar_x, gameChar_y)
	{
		var d = dist(gameChar_x, gameChar_y, this.currentX, this.y)
		if(d < 20)
		{
			return true;
		}
		return false;
	}

}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    //key
    fill(255, 215, 0);
    rect(t_collectable.x_pos - 2.5, t_collectable.y_pos - 18, t_collectable.size - 45, t_collectable.size - 28);
    ellipse(t_collectable.x_pos, t_collectable.y_pos - 18, t_collectable.size - 35, t_collectable.size - 35);
    rect(t_collectable.x_pos + 2.5, t_collectable.y_pos - 6, t_collectable.size - 44, t_collectable.size - 47);
    rect(t_collectable.x_pos + 2.5, t_collectable.y_pos, t_collectable.size - 44, t_collectable.size - 47);
    //hole
    fill(147, 112, 219);
    ellipse(t_collectable.x_pos, t_collectable.y_pos - 18, t_collectable.size - 40, t_collectable.size - 40);
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 20)
	{
		t_collectable.isFound = true;
		game_score +=1;
		collectSound.play();
	}
}

