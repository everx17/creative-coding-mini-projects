/* used resources:
https://www.w3schools.com/howto/howto_js_slideshow.asp
-analyzed how this works and added comments
-used without major modifications
*/
"use strict";
var slideIndex = 1;	// counts 1 to n (1-based)

// show the initial page of the thumb slider
function initSlideshow()
{
	showSlides(slideIndex);
}

// Next/previous controls
function plusSlides(n)
{	// call with 1 for next slide or -1 for previous, actually any number works except 0
	showSlides(slideIndex += n);	// shortcut to modify variable and then call function with new value
}

// Thumbnail image controls
function currentSlide(n)
{	// set the current slide directly (when clicking on the dots below)
	showSlides(slideIndex = n);	// shortcut to modify variable and then call function with new value
}

function showSlides(n)
{
	var i;
	// returns an array of all slides
	var slides = document.getElementsByClassName("mySlides");
	// returns an array of all dots
	var dots = document.getElementsByClassName("dot");
	// range check: if selected index is too high, show first slide instead (wraparound)
	if (n > slides.length)
	{
		slideIndex = 1;
	}
	// range check: if selected index is too low, show last slide instead (wraparound)
	if (n < 1)
	{
		slideIndex = slides.length;	// length = total number of slides
	}								// this works because slideIndex is 1-based
	// hide all slides
	for (i = 0; i < slides.length; i++)
	{	// count from 0 to one less than length, since array index is 0-based
		slides[i].style.display = "none";
	}
	// inactivate all dots
	for (i = 0; i < dots.length; i++)
	{	// again, 0-based
		dots[i].className = dots[i].className.replace(" active", "");
	}
	//lastly, show the selected slide and show the corresponding dot as active
	slides[slideIndex-1].style.display = "block";	// the -1 is required to convert from
	dots[slideIndex-1].className += " active";		// 1-based slideIndex to 0-based array index
} 
