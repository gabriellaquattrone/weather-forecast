"strict mode";
//some code taken from ECS 162 makeRequest.js and the other javascript file

// Do a CORS request to get Davis weather hourly forecast

// Create the XHR object.
function createCORSRequest(method, url) {
  let xhr = new XMLHttpRequest();
  xhr.open(method, url, true);  // call its open method
  return xhr;
}

// Make the actual CORS request.
function makeCorsRequest(url) {

  let xhr = createCORSRequest('GET', url);

  // checking if browser does CORS
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Load some functions into response handlers.
  xhr.onload = function() {
      // console.log(JSON.parse(responseStr));
      //console.log(JSON.stringify(object, undefined, 2));  // print it out as a string, nicely formatted
      let responseStr = xhr.responseText;  // get the JSON string
      let object = JSON.parse(responseStr);  // turn it into an object
      let latSac = 38.5816;
      let lonSac = -121.4944;
      let lat = object["city"]["coord"].lat;
      // console.log("Latitude: " + lat);
      let lon = object["city"]["coord"].lon;
      // console.log("Longitude: " + lon);
      let distance = getDistance(latSac, lonSac, lat, lon);
      if (distance > 150){
          document.getElementById("notFound").style.display = "inline";
          document.getElementById("notFound").textContent = "Not Found";
          document.getElementById("current").style.display = "none";
          console.log("Not Found");
          for (let a = 0; a < 6; a++){
              document.getElementById("temp" + a).textContent = "";
              document.getElementById("hour" + a).textContent = "";
              document.getElementById("pick" + a).style.display = "none";
          }
      }
      else {
          document.getElementById("notFound").style.display = "none";
          document.getElementById("notFound").textContent = "";
          document.getElementById("current").style.display = "inline";

          for (let a = 0; a < 6; a++){
              // console.log(object.list[a].weather[0]);
              updateHourlyForecast(object.list[a].weather[0].icon, a);
              // console.log(object.list[a].weather[0].icon);
              let time = grabTimes(object.list[a].dt_txt);
              document.getElementById("temp" + a).textContent = Math.round(Number(object.list[a].main.temp)) + "°";
              if (a === 0){
                  //fix this for cases like 7 pm and 10 pm (two versus one)
                   let clockTime = `${time[0]}${time[1]}`;
                   if (time[1]===":"){
                       document.getElementById("hour" + a).textContent = `${time[0]}${time[5]}${time[6]}`.toUpperCase(); // 7:00pm
                   }
                   else {
                        document.getElementById("hour" + a).textContent = `${time[0]}${time[1]}${time[6]}${time[7]}`.toUpperCase();
                   }
              }
              else {
                  document.getElementById("hour" + a).textContent = time;
              }
          }
      }
  };
function getDistance(latSac,lonSac,lat,lon) { // https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
      let R = 6371; // Radius of the earth in km
      let dLat = deg2rad(lat-latSac);  // deg2rad below
      let dLon = deg2rad(lon-lonSac);
      let a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat)) * Math.cos(deg2rad(latSac)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      let d = R * c; // Distance in km
      let converter = d * 0.621371;
      return converter;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}
  function grabTimes(timeObj){
          // Time Example : 2019-04-17 01:00:00

         let date = new Date(timeObj + " UTC");
         // console.log(date);

         currentDate = date.toString();
         currentTime = Number(`${currentDate[16]}${currentDate[17]}`);
         // console.log("Current Time: ", currentTime);

         if (currentTime === 0) {
             return "12:00 am";
         }
         else if (currentTime < 12){
             return currentTime + ":00 am";
         }
         else if (currentTime === 12) {
             return "12:00 pm";
         }
         else if (currentTime >= 12){
             return (currentTime - 12) + ":00 pm";
         }

  }
  function updateHourlyForecast(weatherObj, a){
      let pickVariable = "pick" + a;
      let x = document.getElementById("pictureNode" + a);
      document.getElementById("pick" + a).style.display = "inline";
      if (weatherObj === "01d") {
          // console.log('Grabbed a clearsky.');
          x.setAttribute("src", "assets/clearsky.svg");
      }
      else if (weatherObj === "01n") {
          // console.log('Grabbed a clear night.');
          x.setAttribute("src", "assets/clear-night.svg"); //change the source property images to point to one of the other svgs
      }
      else if (weatherObj === "02d") {
          x.setAttribute("src", "assets/fewclouds-day.svg");
          // console.log('Grabbed a fewclouds-day.');
      }
      else if (weatherObj === "02n") {
          x.setAttribute("src", "assets/fewclouds-night.svg");
          // console.log('Grabbed a fewclouds-night.');
      }
      else if (weatherObj === "03d" || weatherObj === "03n"){
          x.setAttribute("src", "assets/scatteredclouds.svg");
          // console.log('Grabbed a scatteredclouds.');
      }
      else if (weatherObj === "04d" || weatherObj === "04n"){
          x.setAttribute("src", "assets/brokencloud.svg");
          // console.log('Grabbed a brokencloud.');
      }
      else if (weatherObj === "09n" || weatherObj === "09d") {
          x.setAttribute("src", "assets/showerrain.svg");
          // console.log('Grabbed a showerrain.');
      }
      else if (weatherObj === "10d"){
          x.setAttribute("src", "assets/rain-day.svg");
          // console.log('Grabbed a rain-day.');
      }
      else if (object.weather.icon === "10n"){
          x.setAttribute("src", "assets/rain-night.svg");
          // console.log('Grabbed a rain-night.');
      }
      else if (weatherObj === "11d" || weatherObj === "11n"){
          x.setAttribute("src", "assets/thunderstorms.svg");
          // console.log('Grabbed a thunderstorms.');
      }
      else if (weatherObj === "13d" || weatherObj === "13n"){
          x.setAttribute("src", "assets/snow.svg");
          // console.log('Grabbed a snow.');
      }
      else if (weatherObj === "50d" || weatherObj === "50n"){
          x.setAttribute("src", "assets/mist.svg");
          // console.log('Grabbed a mist.');
      }

  }

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  // Actually send request to server
  xhr.send();
}

function whenClicked(){
    input = document.getElementById('myInput'); // ${input.value} put in the URL for searching
    let url = "";
    if (input.value) {
        url = `http://api.openweathermap.org/data/2.5/forecast/hourly?q=${input.value},US&units=imperial&APPID=08f0496b9bf5f4ed7972e757f3df0b47`
    }
    else {
        url = `http://api.openweathermap.org/data/2.5/forecast/hourly?q=Davis,CA,US&units=imperial&APPID=08f0496b9bf5f4ed7972e757f3df0b47`
    }
    // run this code to make request when this script file gets executed
    makeCorsRequest(url);
}
whenClicked();

// let up = document.getElementsByClassName("dailyforecast");
// let down = document.getElementsByClassName("localweatherbackground");
let initial_class = document.getElementById("bottom");
function slideup(){
    // up.style.display = "none"; this didn't work, unfortunately
    // down.style.display = "inline";
    initial_class.classList.add("up");
    initial_class.classList.remove("down");

    // lower.style.display = "inline";    // console.log("Click!");
}
function slidedown(){
    // window.alert("clicked");
    // up.style.display = "inline";
    // down.style.display = "none";
    initial_class.classList.add("down");
    initial_class.classList.remove("up");

}
