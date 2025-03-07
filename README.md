# Remote Falcon Viewer Page Scripts

1. [Script Guidelines](#script-guidelines)
   1. [The Rules](#the-rules)
   2. [The Process](#the-process)
3. [The Scripts](#the-scripts)
   1. [Make It Snow](#make-it-snow)
   2. [Christmas Countdown](#christmas-countdown)
   3. [Dynamic Menu](#dynamic-menu)
# Script Guidelines
Before submitting your scripts for use with Remote Falcon, there are some general
guidelines that need to be followed. If not followed properly, it could result in the 
script not being added or not working.

## The Rules

### Don't Use Minified Javascript
Minified Javascript is difficult to maintain and edit. When creating a script in this
repo, just use regular non-minified Javascript.

### Don't Use Arguments
Because these scripts are being serviced statically via CDN they cannot contain arguments. 
That means you'll have to design your scripts to do without.

### Check For Null Elements
Not everyone will use every script, so it's important to make sure you do null checks on any
elements to ensure they exists prior to updating the elements attributes. Here's an example from the
christmasCountdown script
```
if(document.querySelector('#to-christmas-days') != null) {
    document.querySelector('#to-christmas-days').textContent = d;
}
```

This check ensures there is actually an element with an ID of `to-christmas-days`.

### Test Locally
Be sure to test your script locally before pushing.

## The Process
Once you're ready to submit your script for review, here's what you'll need to do:
1. Fork the repository to your own GitHub.
    - Not going to go into details on how to do this since it's outside the scope of this README, so 
   I'll leave it to you to research how to do this if you don't already know.
2. Do your development stuff
    - All scripts should be added to the base path and use camel case (i.e. `someScript.js`).
    - `scripts.json` should be updated with your script name. If your script is not added to this list 
   it will not be pulled in by Remote Falcon.
    - This README must be updated with any documentation needed to use your script. If there is no 
   documentation, it will not be added.
    - Screenshots are a bonus. Add any relevant screenshots to the `img` directory to use in your 
   documentation.
3. PR your changes to the main branch in this repo.
    - Again, not going into details on this. Just know that any merge to this repo requires a Pull Request 
   to be reviewed and approved.

# The Scripts
Below are the scripts available to use in Remote Falcon.

## Make It Snow
This script will make it snow on your viewer page!
Nothing special needs to be done to use this script.
There is a toggle on Remote Falcon Settings -> Viewer Page that will enable and disable this script.

## Christmas Countdown
Adds a snazzy countdown to Christmas Day to your viewer page.

![christmasCountdown](/img/christmasCountdown.png)

In order to use this, you will need to add a few elements to your page HTML.
There are four elements used in this script; one for Days, one for Hours, one for Minutes, and one for Seconds
(as seen in the screenshot). You can choose to have all or just one of these (although just seconds might be 
confusing).

The elements can be whatever you want (i.e. span, div, paragraph, table data, etc.), but must have the following 
IDs:
```
to-christmas-days
to-christmas-hours
to-christmas-minutes
to-christmas-seconds
```

Below is the code used (along with style) for the screenshot above. Feel free to steal it.
```
.countdownContainer {
   margin: 0 auto;
   text-align: center;
   padding: 20px;
   border-radius: 5px;
}

.christmas {
   font-size: 4rem;
}
.counter {
   font-size: 4rem;
}
    
<div style="padding-top:5em">
    <h1>
        <table class="countdownContainer">
          <tr class="christmas">
            <td colspan="4">Countdown to Christmas!</td>
          </tr>
          <tr class="counter">
            <td id="to-christmas-days"></td>
            <td id="to-christmas-hours"></td>
            <td id="to-christmas-minutes"></td>
            <td id="to-christmas-seconds"></td>
          </tr>
          <tr>
            <td>Days</td>
            <td>Hours</td>
            <td>Minutes</td>
            <td>Seconds</td>
          </tr>
      </table>
    </h1>
</div>
```

## Dynamic Menu

Implements a UI to make your page more mobile friendly.

![dynamicMenu](/img/dynamicMenu.png)

In order to use this script you will need to add CSS and HTML to your viewer page.

Add the below to your <head> section
```
<style>
	:root {
	  --bgColorMenu: #1d1d27;
	  --duration: 0.7s;
	}

	html {
		box-sizing: border-box;
		
	}

	body {
		margin: 0;
		height: 100vh;
		overflow: hidden;
		background-color: #1d1d27;
		-webkit-tap-highlight-color: transparent;
	}
	
	/*******************************
		Content Section
	*******************************/
	
	.content-container {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 3.5em; /* Height of the menu */
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: flex-end;
	}
	
	
	/* Main Window */
	.content__body {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		padding: 1em;
		overflow-y: auto;  /* Ensure scrolling is enabled */
		background-color: var(--bgColorItem);
		opacity: 0;
		transition: opacity var(--duration) ease, transform var(--duration) ease;
		font-family: 'Comfortaa', sans-serif;
		background: linear-gradient(135deg, var(--bgColorItem), #333333);
		max-height: 100%;  /* Prevent overflow above scrollable area */
		height: calc(100vh - 3.5em); /* Ensure body fits within available space */
		text-align: center;
	}
	
	
	.content__body.active {
		display: flex;
		opacity: 1;
		z-index: 1;
	}
	
	.content__body h1, .content__body h2, .content__body p {
		margin: 0.5em 0;
		text-align: center;
		color: white; /* Ensure text contrast */
	}
	
	.content__body a {
		text-decoration: none;
		color: #ffd700; /* Highlighted text color (gold) */
		font-weight: bold;
		transition: color 0.3s ease;
	}
	
	.content__body a:hover {
		color: #ff4500; /* Add hover effect for links (orange-red) */
	}
	
	.content__body img {
		max-width: 80%; /* Make images responsive */
		height: auto;
		margin: 1em 0;
		border-radius: 10px; /* Slightly rounded edges for images */
	}
	
	.content__body .rf-titles {
		font-size: 1.5em;
		font-weight: bold;
		margin-bottom: 0.5em;
		color: white;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); /* Subtle text shadow */
	}
	
	.content__body .tune-to {
		font-size: 4em;
		font-weight: bold;
		margin-bottom: 0.5em;
		color: white;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); /* Subtle text shadow */
	}
	.content__body .playing-now {
		font-size: 1.2em;
		color: #d4edff; /* Light blue text */
		margin: 1em 0;
	}
	
	.content__body .jukebox-queue-container {
		width: 100%;
		max-width: 600px;
		padding: 1em;
		background: rgba(255, 255, 255, 0.1); /* Semi-transparent background */
		border-radius: 10px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		overflow-y: auto;
		max-height: 200px; /* Prevent it from taking too much space */
	}
	
	.content__body strong {
		font-size: 1.2em;
		color: #ffd700;
		display: block;
		margin: 1em 0;
	}
	.content__subitem {
		display: flex;  
		align-items: center;  
		width: 100%;
		flex-direction: column;
	}
	
	
	
	/*Bottom Menu*/
	.rf_menu {
		margin: 0;
		display: flex;
		width: 100%;
		font-size: 1.5em;
		padding: 0;
		position: fixed;
		bottom: 0;
		align-items: center;
		justify-content: space-around;
		background-color: var(--bgColorMenu);
		z-index: 100;
		height: 0.5em; /* Adjust height as needed */
	}

   .rf_menu__item {
		all: unset;
		flex-grow: 1;
		z-index: 100;
		display: flex;
		cursor: pointer;
		position: relative;
		border-radius: 50%;
		align-items: center;
		justify-content: center;
		padding: 0.0em 0 1.5em;
		transition: transform var(--duration);
	}

	.rf_menu__item::before {
		content: "";
		z-index: -1;
		width: 2.2em;
		height: 2.2em;
		border-radius: 50%;
		position: absolute;
		transform: scale(0);
		transition: background-color var(--duration), transform var(--duration);
	}

	.rf_menu__item.active {
		transform: translate3d(0, -0.5em, 0);
	}

	.rf_menu__item.active::before {
		transform: scale(1);
		background-color: var(--bgColorItem);
	}


	.icon {
		width: 2.6em;
		height: 2.6em;
		stroke: white;
		fill: transparent;
		stroke-width: 1pt;
		stroke-miterlimit: 10;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-dasharray: 400;
	}

   

	@keyframes strok {
		100% {
			stroke-dashoffset: 400;
		}
	}

	.rf_menu__border {
		left: 0;
		bottom: 99%;
		width: 10.9em;
		height: 3.4em;
		position: absolute;
		clip-path: url(#menu);
		will-change: transform;
		background-color: var(--bgColorMenu);
		transition: transform 0.4s;
	}

	.svg-container {
		width: 0;
		height: 0;
	}

	/* Responsive settings */
	@media screen and (max-width: 50em) {
		.menu {
			font-size: 0.8em;
		}
	}
	#
	
</style>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
```

Next inside the <body> tag will be the below HTML.  
All of your page content will be inside the "content__body" tags.  You can add/remove as many tabs as you'd reasonably want, but suggest staying at 3-5 tabs total.
You may need to buffer the bottom of some tabs with extra lines to prevent the menu from overlapping when scrolling.
```
<div class="content-container">
	<div class="content__body active" style="--bgColorItem: #C41E3A;">
		<!-- Tab 1 -->
	</div>
	<div class="content__body" style="--bgColorItem: #008000;">
		<!-- Tab 2 -->
	</div>
	<div class="content__body" style="--bgColorItem: #4343f5;">
		<!-- Tab 3 -->
	</div>
	<div class="content__body" style="--bgColorItem: #e0b115;">
		<!-- Tab 4 -->
		<!-- you may need to buffer the bottom of some tabs with <br /> -->
	</div>
</div>
<menu class="rf_menu">
<!-- You can Add/Remove as many buttons as you want but make sure you match the number of "content__body" containers-->
	
	
	<button class="rf_menu__item active" style="--bgColorItem: #C41E3A;">
		<i class="fa-solid fa-house fa" style="color: #ffffff;"></i>
	</button>
	<button class="rf_menu__item" style="--bgColorItem: #008000;-">
		<i class="fa-solid fa-music fa" style="color: #ffffff;"></i>
	</button>
	<button class="rf_menu__item" style="--bgColorItem: #4343f5;">
		<i class="fas fa-hand-holding-heart fa" style="color: #ffffff;"></i>
	</button>
	<button class="rf_menu__item" style="--bgColorItem: #e0b115;">
		 <svg class="icon" viewBox="0 0 24 24">
			<path d="M5.8,7h12.4"/>
			<path d="M18.2,12H5.8"/>
			<path d="M5.8,17h12.4"/>
		</svg>
	</button>
	<div class="rf_menu__border" />
</menu>




<div class="svg-container">
	<!-- Do Not Modify -->
	<svg viewBox="0 0 202.9 45.5">
		<clipPath id="menu" clipPathUnits="objectBoundingBox" transform="scale(0.0049285362247413 0.021978021978022)">
			<path d="M6.7,45.5c5.7,0.1,14.1-0.4,23.3-4c5.7-2.3,9.9-5,18.1-10.5c10.7-7.1,11.8-9.2,20.6-14.3c5-2.9,9.2-5.2,15.2-7
		c7.1-2.1,13.3-2.3,17.6-2.1c4.2-0.2,10.5,0.1,17.6,2.1c6.1,1.8,10.2,4.1,15.2,7c8.8,5,9.9,7.1,20.6,14.3c8.3,5.5,12.4,8.2,18.1,10.5
		c9.2,3.6,17.6,4.2,23.3,4H6.7z"/>
		</clipPath>
	</svg>
</div>

```