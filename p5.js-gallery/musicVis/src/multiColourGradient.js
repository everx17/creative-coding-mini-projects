//maps input level into a colour gradient with multiple pivots
//(max 4 gradients between 5 points)
//inputs: current value, colour at zero,
//4 pairs of threshold and colour at that threshold
//returns: colour at specified current value
function multiColourGradient(val, c0, t1, c1, t2, c2, t3, c3, t4, c4)
{
	var val = val;
	var col0 = color(c0);
	var col1 = color(c1);
	var col2 = color(c2);
	var col3 = color(c3);
	var col4 = color(c4);
	var thresh1 = t1;
	var thresh2 = t2;
	var thresh3 = t3;
	var thresh4 = t4;
	
	if (val < thresh1)
	{
		if (thresh1 == 0)
		{	//prevent division by zero
			return col1;
		}
		else
		{
			return lerpColor(col0, col1, val/thresh1);
		}
	}
	else if (val < thresh2)
	{
		if (thresh2 == thresh1)
		{	//prevent division by zero
			return col2;
		}
		else
		{
			return lerpColor(col1, col2, (val - thresh1)/(thresh2 - thresh1));
		}
	}
	else if (val < thresh3)
	{
		if (thresh3 == thresh2)
		{	//prevent division by zero
			return col3;
		}
		else
		{
			return lerpColor(col2, col3, (val - thresh2)/(thresh3 - thresh2));
		}
	}
	else if (val < thresh4)
	{
		if (thresh4 == thresh3)
		{	//prevent division by zero
			return col4;
		}
		else
		{
			return lerpColor(col3, col4, (val - thresh3)/(thresh4 - thresh3));
		}
	}
	else
	{	//>= threshold 4, return colour for threshold 4
		return col4;
	}
}
