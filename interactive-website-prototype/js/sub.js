/* Acknowledgement:
a modified version of the provided Coursework Javascript form verification sample code
Changes:
-output error or confirmation message to div elements on the site
-adapted ids of elements that need to be verified and colored
-removed debug alert messages
-renamed local instance of errorMessage within checkSubTopicCheckBoxes() to avoid confusion
*/
"use strict";

function checkFormData()
{
	var errorMessage = checkCompulsoryFieldsValues();

	if (errorMessage.length > 0)
	{
		var errMsgElement = document.getElementById ("formerrormsg");	// error ourput element above the submit button
		errMsgElement.innerHTML = errorMessage;		// print the error message to the div
		errMsgElement.style.display = 'initial';	// ant thenunhide the div (undo display: none;)
	}
	else
	{
		var fnameElement = document.getElementById ("sub_fname");	// get first name
		var lnameElement = document.getElementById ("sub_lname");	// get last name

		var confirmationMessage  = "Dear " + fnameElement.value + " " + lnameElement.value + ", <br><br>";
			confirmationMessage += "Thank you for signing up with us!          <br><br>";
			confirmationMessage += "You will receive an email from us shortly. Please follow the rest of the instructions in the email to confirm your registration.<br><br>";
			confirmationMessage += "Have a nice day!<br><br>";
			confirmationMessage += "Return to <a href=\"index.html\">ASMRnews Home Page</a>.<br>";
		var confirmMsgElement = document.getElementById ("modalconfirmmsg"),	// find outer div to unhide
			confirmMsgContent = document.getElementById ("confirmmsgcontent");	// find inner div to fill
		confirmMsgContent.innerHTML = confirmationMessage;
		confirmMsgElement.style.display = 'block';	// confirmation msg is modal, so display as block
	}
}

// ------------------------------------------

function checkCompulsoryFieldsValues()
{
	var fnameElement = document.getElementById ("sub_fname");
	var lnameElement = document.getElementById ("sub_lname");
	var emailElement = document.getElementById ("sub_email");

	var errorMessage = "";
  
	if (fnameElement.value.trim().length <= 0)
	{
		errorMessage += "Please specify your first name above!<br>";
		fnameElement.style.background = "pink";
	}
	else
	{
		fnameElement.style.background = "white";
	}
	
	if (lnameElement.value.trim().length <= 0)
	{
		errorMessage += "Please specify your last name above!<br>";
		lnameElement.style.background = "pink";
	}
	else
    {
		lnameElement.style.background = "white";
	}
	var emailAsString = emailElement.value.trim();

	if (emailAsString.length <= 0 || !isValidEmailFormat (emailAsString))
	{
		errorMessage += "Please specify a valid email address above!<br>";
		emailElement.style.background = "pink";
	}
	else
    {
		emailElement.style.background = "white";
	}

	errorMessage += checkSubTopicCheckBoxes ();

	// newsletter frequency dropdown only has 2 valid options and no 'empty' option
	// so no check is required for that one
	
	return (errorMessage);
}

// ------------------------------------------
/*
To check for proper email format : example@organization.com, need to use regular expression.
However regular expression is beyond the scope of our course!

Below function isValidEmailFormat() is just an example of checking email format for your reference. You should not use it as it is not taught in CM1040 !!!

Acknowledgement : https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
*/
// ------------------------------------------

function isValidEmailFormat (value) 
{
	var regularExpression = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	if (regularExpression.test(value))
	{
		return (true);
	}
	else
	{
		return (false);
	}
}

// ------------------------------------------

function checkSubTopicCheckBoxes ()
{
	var checkBoxesArray = document.getElementsByClassName ("SUB-TOPIC-AREA");
	var checkBoxesField = document.getElementsByClassName ("subtopicopt");

	var atLeastOneCheckboxTicked = false;

	for (var i=0; i<checkBoxesArray.length; i++)
	{
		if (checkBoxesArray[i].checked == true)
		{
			atLeastOneCheckboxTicked = true;
		}
	}

	var localerrorMsg = "";

	if (atLeastOneCheckboxTicked == false)
	{
		for (var i=0; i<checkBoxesField.length; i++)
		{
			checkBoxesField[i].style.backgroundColor = "lightpink";
		}
		localerrorMsg += "Please tick at least 1 checkbox for the topics you wish to be informed about!<br>";
	}
	else
	{
		for (var i=0; i<checkBoxesField.length; i++)
		{
			checkBoxesField[i].style.backgroundColor = "white";
		}
	}
	return (localerrorMsg);

}

// ------------------------------------------

function resetFormData()
{
	// below code causes web-page to refresh/reload itself ...
	location = window.location.href;
}





