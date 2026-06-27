//tracking medians and maximums of levels over a time window
function StatisticsTracker(num, initfill)
{
	var num = num;
	var initialfill = initfill;

	var levels = [];
	//sanitise input to prevent a division by zero later on
	if ((num == 0) || (num == undefined))
	{
		num = 30;
	}
	if (initialfill == undefined)
	{
		initialfill = 0;
	}

	for (var i = 0; i < num; i++)
	{
		levels.push(initialfill);
	}

	//add a new value to the tracker, discarding the oldest value
	this.addValue = function(currentlevel)
	{
		levels.splice(0, 1);
		levels.push(currentlevel);
	}
	
	//returns median of all values
	this.getMedian = function()
	{
		var sum = 0;

		for (var i = 0; i < num; i++)
		{
			sum += levels[i];
		}
		return sum / num;
	}
	
	//returns maximum of all values
	this.getMax = function()
	{
		var max = 0;
		for (var i = 0; i < num; i++)
		{
			if(levels[i] > max)
			{
				max = levels[i];
			}
		}
		return max;
	}
}
