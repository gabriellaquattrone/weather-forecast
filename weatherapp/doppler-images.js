////DOPPLER IMAGES Code
let imageArray = []  // global variable to hold stack of images for animation
let count = 0;       // global var counts images added to imageArray

const RADAR  = document.getElementById("radar");
const CITIES = document.getElementById("cities");

// Populating imageArray to create animation
function addToArray(newImage) {
	if (count < 10) {
		newImage.id = "doppler_"+count;
		newImage.style.display = "none";
		imageArray.push(newImage);
		count = count+1;
		if (count >= 10) {
			console.log("Got 10 doppler images");
		}
	}
}

// try to get image; if successfully loads, image is added to imageArray
function tryToGetImage(dateObj) {
	let dateStr = dateObj.getUTCFullYear();
	dateStr += String(dateObj.getUTCMonth() + 1).padStart(2, '0'); //January is 0!
	dateStr += String(dateObj.getUTCDate()).padStart(2, '0');

	let timeStr = String(dateObj.getUTCHours()).padStart(2,'0')
	timeStr += String(dateObj.getUTCMinutes()).padStart(2,'0');

	let filename = "DAX_"+dateStr+"_"+timeStr+"_N0R.gif";
	let newImage = new Image();

    // When all goes well
	newImage.onload = function() {
        // console.log("got image "+filename);
		addToArray(newImage);
	}
    // If there is a problem
	newImage.onerror = function() {
		// console.log("failed to load "+filename);
	}
    newImage.src = "http://radar.weather.gov/ridge/RadarImg/N0R/DAX/"+filename;
}

function getTenImages() {
	let dateObj = new Date();  // defaults to current date and time
	// if we try 150 images, and get one out of every 10, we should get enough
	for (let i = 0; i < 150; i++) {
		newImage = tryToGetImage(dateObj);
		dateObj.setMinutes( dateObj.getMinutes()-1 ); // back in time one minute
	}
}

/* Create animation */
function loadImg(){
    getTenImages();
    runDop();
    setTimeout(print_src, 5000);
}

/* Cycles through images to create animation */
function runDop(){
    console.log(imageArray); // for debugging
    let i = 0;
    // loop through array
    let dopInterval = setInterval(function(){
        // change image
        RADAR.src = imageArray[i].src;
        i++;

        if(i >= 10) {
            i = 0;
        }
    }, 80);
    return dopInterval;
}

loadImg();
