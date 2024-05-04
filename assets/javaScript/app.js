//getting loaction of the user using the geoLocation in latitudues and longitudes
//has to pass the input to the weather API as eg: 34.879,67.982
let Town = document.getElementById("location");
let Country = document.getElementById("country");
const Tempreture = document.getElementById("tempretute");
const API = "4f8e562b71244ddf87a50751240104";

const weatherIcon = document.getElementById("weather_icon");
const hourleyDiv = document.getElementById("hourly_forcast");
// const daysDiv = document.getElementById("days_items");
const weatherType = document.getElementById("weather_type");
const date = document.getElementById("date");

let isDarkMode = false;

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};


function success(pos) {
  const crd = pos.coords;
  
  // console.log("Your current position is:");

  // // use these to pass the API get get weather data of the current position of the user
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  // console.log(`More or less ${crd.accuracy} meters.`);
  //Location = `${crd.latitude},${crd.longitude}`
  return `${crd.latitude},${crd.longitude}`;

}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

function getlocation(){
  navigator.geolocation.getCurrentPosition((position) => {
    getUserLocationWeather(position.coords.latitude, position.coords.longitude);
    console.log(position.coords.latitude, position.coords.longitude);
    
  });
 
}



//getting  current weather data from API to current location
function getUserLocationWeather(latitude,longitude) {

  fetch(`https://api.weatherapi.com/v1/current.json?key=${API}&q=${latitude},${longitude}&aqi=yes`)
  .then(response => response.json())
  .then(data =>{
    displayWeather(data);
  })
  .catch(error =>{
      console.error('Error fetching current data', error);
      alert('Error Fetching data please try again');

    });

  
  fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API}&q=${latitude},${longitude}&days=3&aqi=yes&alerts=yes`)
  .then(response => response.json())
  .then(data => {
      displayHourleyData(data)
  })
  .catch(error =>{
    console.error('Error fetching hourley data', error);
    alert('Error Fetching data please try again');

  }); 
}

// getting wather data for any other location that the user has typed
function getUserTypedWeather() {
  const city = document.getElementById("txtSearch").value;
  if(!city){
    alert("Please Enter a City");
    return;
  }

  fetch(`https://api.weatherapi.com/v1/current.json?key=${API}&q=${city}&aqi=yes`)
  .then(response => response.json())
  .then(data =>{
    displayWeather(data);
  })
  .catch(error =>{
      console.error('Error fetching current data', error);
      alert('Error Fetching data please try again');

    });

  
  fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API}&q=${city}&days=3&aqi=yes&alerts=yes`)
  .then(response => response.json())
  .then(data => {
      displayHourleyData(data)
  })
  .catch(error =>{
    console.error('Error fetching hourley data', error);
    alert('Error Fetching data please try again');

  }); 
}

function displayWeather(data){

  //clear previous data 
  
  hourleyDiv.innerHTML = '';
  Tempreture.innerHTML = '';
  
  if(data.cod == '404'){
    console.log("error");
  }else{
    Town.innerHTML = data.location.name+" , "+data.location.region;
    Country.innerHTML = data.location.country; 
    const time = formatDate(data.location.localtime);
    date.innerHTML = time;
    Tempreture.innerHTML = Math.round(data.current.temp_c);
    const icon = data.current.condition.icon;
    const condition = data.current.condition.text;
    const code = data.current.condition.code;
    weatherIcon.src = icon;
    weatherIcon.style.display = 'block';
    weatherType.innerHTML = condition;
    backgroundChange(code);
  }

}


function displayHourleyData(data){

  
  // hourleyDiv.innerHTML = '';
  // Tempreture.innerHTML = '';

  if(data.cod == '404'){
    console.log("error");
  }else{
    data.forecast.forecastday.forEach(element =>{
      //  // Convert date string to a Date object
      //  const date = new Date(element.date);
      //  // Get the day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
      //  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      //  const maxtemp = element.day.maxtemp_c;
      //  const mintemp = element.day.mintemp_c;
      //  const maxWind = element.day.maxwind_mph;
      //  const condition = element.day.condition.text;
      //  const icon = element.day.condition.icon;
      //  const humidity = element.day.humidity;
      //  const feelsLike = element.day.feelslike_c;

      //  const bodyhtml = `

      //   <div id = "days_items">
      //   <span>${dayOfWeek}</span>
      //   <img src = "${icon}" alt="Daily_Weather_Img" >
      //   <span>${condition}</span>
      //   <span>${maxtemp}°C</span>
      //   <span>${mintemp}°C</span>
      //   <span>${humidity}</span>
      //   <span>${maxWind}Kmh</span>
      //   <span>${feelsLike}°C</span>
      //   </div>

      //  `
      //  daysDiv.innerHTML += bodyhtml;

       element.hour.forEach(subelement =>{
        const time = formatDate(subelement.time);
        const temp = Math.round(subelement.temp_c);
        const condition = subelement.condition.text;
        const icon = subelement.condition.icon;
        const windspeed = subelement.wind_kph;
        const feelsLike = subelement.feelslike_c;
        const chanceOfRain = subelement.chance_of_rain;
        const humidity = subelement.humidity;
        
        const hourleyhtml = `
          <div id = "hourly_items" >
          <span>${time}</span>
          <img src = "${icon}" alt="Hourlry_Weather_Img" >
          <span>${temp}°C</span>
          <span>${condition}</span>
          <span>Wind Speed: ${windspeed}</span>
          <span>Feels Like: ${feelsLike}</span>
          <span>Chance Of Rain: ${chanceOfRain}</span>
          <span>Humidity: ${humidity}</span>
          </div>

        `;
        hourleyDiv.innerHTML += hourleyhtml;
       });
       
    });
    
    
  }

}

function formatDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const options = { weekday: 'long', hour: 'numeric', minute: 'numeric' };
  const todayOptions = {hour: 'numeric', minute: 'numeric' };

  if (date.toDateString() === today.toDateString()) {
      return "Today " + date.toLocaleTimeString('en-US', todayOptions);
  } else {
      return date.toLocaleDateString('en-US', options);
  }
}

function backgroundChange(code){
  
  if (isDarkMode === false) {
    const rainyValues = [1240,1189,1063,1195,1009];
    const snowValues = [1117,1114,1204,1225,1255,1009,1030,1147,1198,1210,1066];
    if (rainyValues.includes(code)) {
      document.body.style.backgroundImage = "url('assets/CSS/Rain.mp4')";
      document.body.style.backgroundSize = "100% 100%";
    }else if (snowValues.includes(code)) {
      document.body.style.backgroundImage = "url('assets/CSS/Snow.mp4')";
      document.body.style.backgroundSize = "100% 100%"
    }else{
      document.body.style.backgroundImage = "url('assets/CSS/SunnySky.mp4')";
      document.body.style.backgroundSize = "100% 100%";
    }
    
  }

}


function ChangeMode() { 
  // Obtains an array of all <link> 
  // elements. 
  // Select your element using indexing. 
  var theme = document.getElementsByTagName('link')[0]; 

  // Change the value of href attribute  
  // to change the css sheet. 
  if (theme.getAttribute('href') == 'assets/CSS/lightTheme.css') {
      isDarkMode = true; 
      theme.setAttribute('href', 'assets/CSS/darkTheme.css');
      document.body.style.backgroundImage = "url('assets/CSS/DarkTheme.mp4')";
      document.body.style.backgroundSize = "100% 100%"; 
  } else { 
      isDarkMode = false;
      theme.setAttribute('href','assets/CSS/lightTheme.css'); 
      document.body.style.backgroundImage = "url('assets/CSS/SunnySky.mp4')";
      document.body.style.backgroundSize = "100% 100%"; 
  } 
} 


//auto calling the location when logging  the account
Window.onload = getlocation();





