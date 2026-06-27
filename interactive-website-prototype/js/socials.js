/* used resources:
https://www.w3schools.com/howto/howto_js_tabs.asp
(function showSocialPg)

https://www.sitepoint.com/get-url-parameters-with-javascript
(to open a specific video when loading the page)
*/
"use strict";
var videoIndex = 1;	// counts 1 to n (1-based)
var socPostsPg = 1;	// counts 1 to n (1-based)

// show the initial page of Social posts and initialize the video player
function initSocialVideo()
{
	showSocialPg(socPostsPg);	// show the initial social posts page

	// parse URL parameters to show a specific video if requested
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	var video = document.getElementById('socialvideo');

	if (urlParams.has('openvideo'))	// if there is a matching parameter
	{
		videoIndex = urlParams.get('openvideo');
	};
	openVideo(videoIndex);
}

function openVideo(videoidx)
{
	var i;
	var videoElement = document.getElementById('socialvideo');
	var descrElement = document.getElementsByClassName("videoinfocontainer");
	var videofiles = [
		"video/mechanic.mp4",
		"video/stars.mp4",
		"video/jar.mp4",
		"video/wharf.mp4",
		"video/aquarius.mp4",
		"video/chicken.mp4",
		"video/sleepy.mp4",
		"video/zen.mp4",
		"video/lights.mp4",
		"video/tapping.mp4",
		"video/fruit.mp4"
	];

	// limit the value to the range 1...length (1-based)
	if (videoidx < 1)
	{
		videoidx = 1;
	}
	if (videoidx > videofiles.length)
	{
		videoidx = videofiles.length;
	}
	videoIndex = videoidx;	// this now contains a verified value

	// update the description area - first hide all
	for (i = 0; i < descrElement.length; i++)
	{
		descrElement[i].style.display = "none";
	}
	// then show the selected one (minus 1 because array is 0-based)
	descrElement[videoIndex-1].style.display = "block";
	// get path to the video file from array
	var videopath = videofiles[videoIndex-1];

	videoElement.pause();				// stop the video
	videoElement.setAttribute('src', videopath); 	// set new source path
	videoElement.load();				// load the new file
	videoElement.play();				// and play it
}

function seekVideoToTime(timecode)
{
	var videoElement = document.getElementById('socialvideo');	// find the player element
	videoElement.currentTime = timecode;	// and set the new timecode
}

// Next/previous controls
function plusSocialPg(n)
{	// call with 1 for next posts page or -1 for previous, actually any number works except 0
	showSocialPg(socPostsPg += n);
}

// numbers controls
function currentSocialPg(n)
{	// set the current page directly (when clicking on the numbers)
	showSocialPg(socPostsPg = n);
}

function showSocialPg(n)
{
	var i;
	// returns an array of all pages
	var postpages = document.getElementsByClassName("socialpostscontainer");
	// returns an array of all page numbers in the nav bar
	var pagebtns = document.getElementsByClassName("socialpagenum");
	// range check: if selected index is too high, show first page instead (wraparound)
	if (n > postpages.length)
	{
		socPostsPg = 1;
	}
	// range check: if selected index is too low, show last page instead (wraparound)
	if (n < 1)
	{
		socPostsPg = postpages.length;	// length = total number of postpages
	}									// this works because socPostsPg is 1-based
	// hide all postpages
	for (i = 0; i < postpages.length; i++)
	{	// count from 0 to one less than length, since array index is 0-based
		postpages[i].style.display = "none";
	}
	// inactivate all page numbers in nav bar
	for (i = 0; i < pagebtns.length; i++)
	{	// again, 0-based
		pagebtns[i].className = pagebtns[i].className.replace(" currpage", "");
	}
	//lastly, show the selected page and show the corresponding page number as active
	postpages[socPostsPg-1].style.display = "block";	// the -1 is required to convert from
	pagebtns[socPostsPg-1].className += " currpage";	// 1-based socPostsPg to 0-based array index
} 
