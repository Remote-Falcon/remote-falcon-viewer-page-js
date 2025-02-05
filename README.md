# Remote Falcon Viewer Page Scripts

1. [Script Guidelines](#script-guidelines)
   1. [The Rules](#the-rules)
   2. [The Process](#the-process)
3. [The Scripts](#the-scripts)
   1. [Make It Snow](#make-it-snow)
   2. [Christmas Countdown](#christmas-countdown)

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