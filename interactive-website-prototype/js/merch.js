/* used resources:
https://www.w3schools.com/howto/howto_js_tabs.asp
(function openMerchCat)
*/
"use strict";
var numCartItems = 0;
var cartSum = 0;

function initMerch()
{	// simulate a click on the button with this id to display a merch category upon loading the page
	document.getElementById("initialmerchcat").click();
}

function openMerchCat(evt, categoryID)
{
	// Declare all variables
	var i, merchcontent, merchcategory;
	
	// Get all elements with class="merchcontent" and hide them
	merchcontent = document.getElementsByClassName("merchcontent");
	for (i = 0; i < merchcontent.length; i++)
	{
		merchcontent[i].style.display = "none";
	}
	
	// Get all elements with class="merchcategory" and remove the class "active"
	merchcategory = document.getElementsByClassName("merchcategory");
	for (i = 0; i < merchcategory.length; i++)
	{
		merchcategory[i].className = merchcategory[i].className.replace(" active", "");
	}
	
	// Show the current tab, and add an "active" class to the button that opened the tab
	document.getElementById(categoryID).style.display = "block";
	evt.currentTarget.className += " active";
}

function addItemToCart(name, price)
{
	if(numCartItems >= 20)
	{
		alert("Sorry, the cart can only hold 20 items maximum.\n");
		return false;
	}
	var freeSlots = document.getElementsByClassName("cartslot");
	var cartSumEl = document.getElementsByClassName("cartsumtext");
	var cartAmtEl = document.getElementsByClassName("cartsumamt");
	// There are 20 slots in total. Whenever a slot is filled, it's switched to class cartitem.
	// So always use the first element of class cartslot, as this is the next free slot.
	freeSlots[0].children[0].innerHTML = name;	// first child element = item name
	freeSlots[0].children[1].innerHTML = "$"+price+".00 SGD";	// second child element = price
	freeSlots[0].className = freeSlots[0].className.replace("cartslot", "cartitem");	// make it visible
	numCartItems++;	// remember how many items are now in the cart
	cartSum += price;	// and add the price to the sum
	
	if(numCartItems == 1)
	{	// exception for exactly 1 'item'
		cartSumEl[0].innerHTML = "Total: "+numCartItems+" item";
	}
	else
	{	// otherwise 'items'
		cartSumEl[0].innerHTML = "Total: "+numCartItems+" items";
	}
	cartAmtEl[0].innerHTML = "$"+cartSum+".00 SGD";
}

function checkOutCart()
{
	alert("Sorry, the shop backend is not available.\n");	// end of the demo version
}