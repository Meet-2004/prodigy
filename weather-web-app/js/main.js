let apiKey = "1e3e8f230b6064d27976e41163a82b77";

navigator.geolocation.getCurrentPosition(async function (position) {
  try {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    // Get city name
    let geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`);
    let geoData = await geoRes.json();
    let city = geoData[0].name;

    // Get weather data
    let weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    let weatherData = await weatherRes.json();

    // Display current
    let current = weatherData.list[0];
    document.getElementById("city-name").textContent = weatherData.city.name;
    document.getElementById("metric").textContent = Math.round(current.main.temp) + "°";
    document.getElementById("weather-main").textContent = current.weather[0].description;
    document.getElementById("humidity").textContent = Math.round(current.main.humidity);
    document.getElementById("feels-like").textContent = Math.round(current.main.feels_like);
    document.getElementById("temp-min-today").textContent = Math.round(current.main.temp_min) + "°";
    document.getElementById("temp-max-today").textContent = Math.round(current.main.temp_max) + "°";

    let icon = current.weather[0].main.toLowerCase();
    let iconSrc = getIcon(icon);
    document.querySelector(".weather-icon").src = iconSrc;
    document.querySelector(".weather-icons").src = iconSrc;

    // Forecast
    displayForecast(weatherData);

  } catch (err) {
    console.error("Error:", err);
    alert("Could not load weather data.");
  }
}, () => {
  alert("Please allow location access and refresh the page.");
});

function getIcon(condition) {
  switch (condition) {
    case "rain": return "img/rain.png";
    case "clear":
    case "clear sky": return "img/sun.png";
    case "snow": return "img/snow.png";
    case "clouds":
    case "smoke": return "img/cloud.png";
    case "mist":
    case "fog": return "img/mist.png";
    case "haze": return "img/haze.png";
    case "thunderstorm": return "img/thunderstorm.png";
    default: return "img/sun.png";
  }
}

function displayForecast(data) {
  const forecastBox = document.getElementById("future-forecast-box");
  let forecastHTML = "";
  const daily = {};

  data.list.forEach(item => {
    let date = item.dt_txt.split(" ")[0];
    if (!daily[date]) {
      daily[date] = item;
    }
  });

  const days = Object.keys(daily).slice(1, 7); // skip today
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  days.forEach(date => {
    let item = daily[date];
    let temp = Math.round(item.main.temp) + "°";
    var desc = item.weather[0].description;
    let condition = item.weather[0].main.toLowerCase();
    let img = getIcon(condition);
    let dayName = dayNames[new Date(date).getDay()];
var desc_temp=document.querySelector(".weather-main-today")
desc_temp.innerHTML=`${desc}`
    forecastHTML += `
            <div class="weather-forecast-box">
                <div class="day-weather"><span>${dayName}</span></div>
                <div class="weather-icon-forecast"><img src="${img}" /></div>
                <div class="temp-weather"><span>${temp}</span></div>
                <div class="weather-main-forecast">${desc}</div>
                 
            </div>
        `;
  });

  forecastBox.innerHTML = forecastHTML;
}



() => {
  // Handle location retrieval error
  alert("Please turn on your location and refresh the page");
};
navigator.geolocation.getCurrentPosition(success, error, {
  enableHighAccuracy: true
});
// Detect if browser is Chrome
function isChromeBrowser() {
  const ua = navigator.userAgent;
  const isChromium = ua.includes("Chrome") && !ua.includes("Edg") && !ua.includes("OPR") && !ua.includes("Brave");
  return isChromium;
}

// Show alert if not Chrome
if (!isChromeBrowser()) {
  alert("📍 For better and faster location detection, please use Google Chrome.");
}




