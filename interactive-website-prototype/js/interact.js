/* used resources:
https://www.w3schools.com/howto/howto_js_tabs.asp
(concept of hiding/showing elements used in function openStudy, openStudiesPg1, openStudiesPg2, openAllEvents)

https://www.sitepoint.com/get-url-parameters-with-javascript
(to open a specific study when loading the page)

https://stackoverflow.com/questions/19844545/replacing-css-file-on-the-fly-and-apply-the-new-style-to-the-page
https://stackoverflow.com/a/30204425
(function setDarkMode, function setMainMode, function applyStyle)

https://www.w3schools.com/jsref/prop_win_localstorage.asp
(function setDarkMode, function setMainMode, function applyStyle)
*/
"use strict";
// load the saved style from localstorage (if any) and apply it
function applyStyle()
{
	// find the element
	var styleSheetEl = document.getElementById("stylesheet");
	var headerImgEl = document.getElementById("headermainimg");
	var headerSubEl = document.getElementById("headersubimg");
	
	
	if (localStorage.getItem("andarkmode"))	// if it was stored previously...
	{
		styleSheetEl.href = localStorage.getItem("andarkmode");// apply it; otherwise do nothing (keep default)
		if (localStorage.getItem("anheaderimg"))	// nested, only attempt alt images if the style was set
		{
			headerImgEl.src = localStorage.getItem("anheaderimg");	// replace main header image
		}
		if (localStorage.getItem("ansubscrimg"))	// nested, only attempt alt images if the style was set
		{
			headerSubEl.src = localStorage.getItem("ansubscrimg");	// replace subscribe button
		}
	}
}

function setDarkMode(event)
{
	localStorage.setItem("andarkmode", "./css/dark.css");
	localStorage.setItem("anheaderimg", "img/maintitleimagedark.png");
	localStorage.setItem("ansubscrimg", "img/subbuttondark.png");
	applyStyle();
}

function setMainMode(event)
{
	localStorage.setItem("andarkmode", "./css/main.css");
	localStorage.setItem("anheaderimg", "img/maintitleimage.png");
	localStorage.setItem("ansubscrimg", "img/subbutton.png");
	applyStyle();
}

function showAboutUsDiv(event)
{	// show the backdrop and the About Us
	var divAboutUs = document.getElementById('modalaboutus'),
		divShader = document.getElementById('modalshader');
	divShader.style.display = 'block';
	divAboutUs.style.display = 'block';
}

function showPrivacyDiv(event)
{	// show the backdrop and the Privacy
	var divPrivacy = document.getElementById('modalprivacy'),
		divShader = document.getElementById('modalshader');
	divShader.style.display = 'block';
	divPrivacy.style.display = 'block';
}

function showTermsOfUseDiv(event)
{	// show the backdrop and the Terms of use
	var divTermsOfUse = document.getElementById('modaltermsofuse'),
		divShader = document.getElementById('modalshader');
	divShader.style.display = 'block';
	divTermsOfUse.style.display = 'block';
}

function hideModalDivs(event)
{	// hide backdrop and all 3 possibly open modal overlays
	var divAboutUs = document.getElementById('modalaboutus'),
		divPrivacy = document.getElementById('modalprivacy'),
		divTermsOfUse = document.getElementById('modaltermsofuse'),
		divShader = document.getElementById('modalshader');
	divAboutUs.style.display = 'none';
	divPrivacy.style.display = 'none';
	divTermsOfUse.style.display = 'none';
	divShader.style.display = 'none';
}

// show one of the studies when loading the studies page (either parameter or default one)
function initStudies()
{
	// parse URL parameters to show a different tabbed div if required
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	var whichStudy;
	if (urlParams.has('openstudy'))	// used for studies.html
	{
		whichStudy = urlParams.get('openstudy');	// read provided URL parameter
	}
	else
	{
		whichStudy = "study101"		// default to study101
	}
	var assignedButton = whichStudy+"button";	// the button id that would open this study manually
	document.getElementById(assignedButton).click();	// simulate a click on the button element
};

function openStudy(evt, studyID)
{
	// Declare all variables
	var i, studiescontent, studieslinks;
	
	// Get all elements with class="studiescontent" and hide them
	studiescontent = document.getElementsByClassName("studiescontent");
	for (i = 0; i < studiescontent.length; i++)
	{
		studiescontent[i].style.display = "none";
	}
	
	// Get all elements with class="studieslinks" and remove the class "active"
	studieslinks = document.getElementsByClassName("studieslinks");
	for (i = 0; i < studieslinks.length; i++)
	{
		studieslinks[i].className = studieslinks[i].className.replace(" active", "");
	}
	
	// Show the current tab, and add an "active" class to the button that opened the tab
	document.getElementById(studyID).style.display = "block";
	evt.currentTarget.className += " active";
}

function openStudiesPg1(evt)
{	// show page 1, hide page 2
	var divPage1 = document.getElementById('studiespg1'),
		divPage2 = document.getElementById('studiespg2');
	divPage1.style.display = 'flex';
	divPage2.style.display = 'none';
}

function openStudiesPg2(evt)
{	// show page 2, hide page 1
	var divPage1 = document.getElementById('studiespg1'),
		divPage2 = document.getElementById('studiespg2');
	divPage1.style.display = 'none';
	divPage2.style.display = 'flex';
}

function openAllEvents(evt)
{
	var i,
		eventElements = document.getElementsByClassName("pastevt"),
		viewMoreElement = document.getElementById('eventsviewmore');
	// iterate through all past event elements and undo hiding them (display: none)
	for (i = 0; i < eventElements.length; i++)
	{
		eventElements[i].style.display = "initial";
	}
	// therefore, hide the View More button itself
	viewMoreElement.style.display = 'none';
}

function showAudioVoteResult(evt, voteID, yesOrNo)
{
	var voteresults = [72, 63, 84, 67, 83, 79, 74, 81, 64, 85];	// percent of Yes votes for each poll
	var sameresultpercent = 0;
	var voteResultElement = document.getElementsByClassName("audiovoteresult");
	
	// limit the value to the range 1...length (1-based)
	if (voteID < 1)
	{
		voteID = 1;
	}
	if (voteID > voteResultElement.length)
	{
		voteID = voteResultElement.length;
	}
	// get how many people voted Yes on this poll (-1, since array is 0-based)
	sameresultpercent = voteresults[voteID-1];
	// if the user did NOT choose Yes, invert the result by subtracting from 100%
	if (yesOrNo != 1)
	{
		sameresultpercent = 100 - sameresultpercent;
	}
	// update the content of the corresponding div to show the result (-1, since array is 0-based)
	voteResultElement[voteID-1].innerHTML = sameresultpercent + "\% of people got the same result.";
}
