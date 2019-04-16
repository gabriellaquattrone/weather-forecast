"strict mode";
//Code copied from ECS 162 makeRequest.js
// Do a CORS request to get Davis weather hourly forecast

// Create the XHR object.
function createCORSRequest(method, url) {
  let xhr = new XMLHttpRequest();
  xhr.open(method, url, true);  // call its open method
  return xhr;
}

function showImage() {

}
// Make the actual CORS request.
function makeCorsRequest() {
  input = document.getElementById('myInput');
  let url = `http://api.openweathermap.org/data/2.5/forecast/hourly?q=${input},US&units=imperial&APPID=08f0496b9bf5f4ed7972e757f3df0b47`

  let xhr = createCORSRequest('GET', url);

  // checking if browser does CORS
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Load some functions into response handlers.
  xhr.onload = function() {
      let responseStr = xhr.responseText;  // get the JSON string
      let object = JSON.parse(responseStr);  // turn it into an object
      console.log(JSON.stringify(object, undefined, 2));  // print it out as a string, nicely formatted
      if (object.weather.main === "Clouds"){
          var x = document.createElement("IMG");
          x.setAttribute("src", "brokencloud.svg");
          document.body.appendChild(x);
      }
      else if (object.weather.main === "Rain") {

      }
      else if (object.weather.main === "Clear") {

      }
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  // Actually send request to server
  xhr.send();
}

// run this code to make request when this script file gets executed
makeCorsRequest();

////DOPPLER IMAGES Code
let imageArray = []  // global variable to hold stack of images for animation
let count = 0;          // global var


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


function tryToGetImage(dateObj) {
	let dateStr = dateObj.getUTCFullYear();
	dateStr += String(dateObj.getUTCMonth() + 1).padStart(2, '0'); //January is 0!
	dateStr += String(dateObj.getUTCDate()).padStart(2, '0');

	let timeStr = String(dateObj.getUTCHours()).padStart(2,'0')
	timeStr += String(dateObj.getUTCMinutes()).padStart(2,'0');

	let filename = "DAX_"+dateStr+"_"+timeStr+"_N0R.gif";
	let newImage = new Image();
	newImage.onload = function () {
		// console.log("got image "+filename);
		addToArray(newImage);
	}
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

getTenImages();
