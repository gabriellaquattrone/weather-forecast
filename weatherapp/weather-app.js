"strict mode";
//some code taken from ECS 162 makeRequest.js and the other javascript file

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

  let url = `http://api.openweathermap.org/data/2.5/forecast/hourly?q=${input.value},US&units=imperial&APPID=08f0496b9bf5f4ed7972e757f3df0b47`

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
      console.log(JSON.parse(responseStr));
      //console.log(JSON.stringify(object, undefined, 2));  // print it out as a string, nicely formatted

      for (let a = 0; a < 5; a++){
          console.log(object.list[a].weather[0]);
          updateHourlyForecast(object.list[a].weather[0].icon, a);
          let time = grabTimes(object.list[a].dt_txt);
          document.getElementById("hour" + (a+1)).textContent = time;
      }


  };
  function grabTimes(timeObj){
          // Time Example : 2019-04-17 01:00:00
          let oldTime = `${timeObj[11]}${timeObj[12]}`;
          let oldTimeNumber = Number(oldTime);
          let newTime = -1;
          let newTimeString = "";

          console.log("Old Time: " + oldTime);

          if (oldTimeNumber > 12) { // for example, 17
              newTime = oldTimeNumber - 12;
              newTime = newTime + 17;
              console.log("IF New Time: " + newTime);
          }
          else {
              newTime = oldTimeNumber + 17; // 24 hours - 7 hours = 17 hours
              console.log("New Time: " + newTime);
          }

          if (newTime > 12){
              newTime -= 12;
              console.log("New Time After Subtraction: " + newTime);
              if (newTime < 12){
                  newTimeString = newTime + ":00am";
                  console.log("New Time String: " + newTimeString);
                  return newTimeString;
              }
              else if (newTime === 12){
              newTimeString = newTime + ":00pm";
              console.log("New Time String: " + newTimeString);
              return newTimeString;
              }
              else {
              newTime -= 12;
              newTimeString = newTime + ":00pm";
              console.log("New Time String: " + newTimeString);
              return newTimeString;
            }
          }
          else if (newTime === 12) {
              newTimeString = newTime + ":00am";
          }
          else { // less than 12
              newTimeString = newTime + ":00am";
              console.log("New Time String: " + newTime);
              return newTimeString;
          }
  }
  function updateHourlyForecast(weatherObj, a){
      let pickVariable = "pick"+(a+1);

      if (weatherObj === "01d") {
          console.log('Grabbed a clearsky.');
          let x = document.createElement("IMG");
          x.setAttribute("src", "assets/clearsky.svg");
          document.getElementById(pickVariable).appendChild(x);

      }
      else if (weatherObj === "01n") {
          console.log('Grabbed a clear night.');
          let x = document.createElement("IMG");
          x.setAttribute("src", "assets/clear-night.svg"); //change the source property images to point to one of the other svgs
          document.getElementById(pickVariable).appendChild(x);

      }
      else if (weatherObj === "02d") {
          let x = document.createElement("IMG");
          x.setAttribute("src", "assets/fewclouds-day.svg");
          document.getElementById(pickVariable).appendChild(x);
          console.log('Grabbed a fewclouds-day.');
      }
      else if (weatherObj === "02n") {
          let x = document.createElement("IMG");
          x.setAttribute("src", "assets/fewclouds-night.svg");
          document.getElementById(pickVariable).appendChild(x);
          console.log('Grabbed a fewclouds-night.');
      }
      else if (weatherObj === "03d" || object.weather.icon === "03n"){
          let x = document.createElement("IMG");
          x.setAttribute("src", "assets/scatteredclouds.svg");
          document.getElementById(pickVariable).appendChild(x);
          console.log('Grabbed a scatteredclouds.');
      }
      else if (weatherObj === "04d" || object.weather.icon === "04n"){
          let x = document.createElement("IMG");
          x.setAttribute("src", "assets/brokencloud.svg");
          document.getElementById(pickVariable).appendChild(x);
          console.log('Grabbed a brokencloud.');
      }
      else if (weatherObj === "09n" || object.weather.icon === "09d") {
          let x = document.createElement("IMG");
          x.setAttribute("src", "assets/showerrain.svg");
          document.getElementById(pickVariable).appendChild(x);
          console.log('Grabbed a showerrain.');
      }
      else if (weatherObj === "10d"){
          let x = document.createElement("IMG");
          x.setAttribute("src", "assets/rain-day.svg");
          document.getElementById(pickVariable).appendChild(x);
          console.log('Grabbed a rain-day.');
      }
      else if (object.weather.icon === "10n"){
          let x = document.createElement("IMG");
          x.setAttribute("src", "assets/rain-night.svg");
          document.getElementById(pickVariable).appendChild(x);
          console.log('Grabbed a rain-night.');
      }
      else if (weatherObj === "11d" || object.weather.icon === "11n"){
          let x = document.createElement("IMG");
          x.setAttribute("src", "assets/thunderstorms.svg");
          document.getElementById(pickVariable).appendChild(x);
          console.log('Grabbed a thunderstorms.');
      }
      else if (weatherObj === "13d" || object.weather.icon === "13n"){
          let x = document.createElement("IMG");
          x.setAttribute("src", "assets/snow.svg");
          document.getElementById(pickVariable).appendChild(x);
          console.log('Grabbed a snow.');
      }
      else if (weatherObj === "50d" || object.weather.icon === "50n"){
          let x = document.createElement("IMG");
          x.setAttribute("src", "assets/mist.svg");
          document.getElementById(pickVariable).appendChild(x);
          console.log('Grabbed a mist.');
      }

  }

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
            //call function here to start animation
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
