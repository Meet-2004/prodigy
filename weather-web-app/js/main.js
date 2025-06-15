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
    let desc = item.weather[0].description;
    let condition = item.weather[0].main.toLowerCase();
    let img = getIcon(condition);
    let dayName = dayNames[new Date(date).getDay()];

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

var first = document.querySelector(".show-metric");
var sec = document.querySelector(".show-humidity")
var third = document.querySelector(".show-feels")
var min_temp = document.querySelector(".temp-min-today")
var max_temp = document.querySelector(".temp-max-today")


async function searchs() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(async (position) => {

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const locRes = await fetch(`https://api-bdc.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
      const locData = await locRes.json();

      const city = locData.locality || locData.city || locData.principalSubdivision || "Unknown";
      const state = locData.principalSubdivision || "Unknown";
      const country = locData.countryName || "Unknown";
      var city_name = document.querySelector(".city_name")
      console.log(city)

      city_name.innerHTML = `${city}`


      let url = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city},&appid=1e3e8f230b6064d27976e41163a82b77`);

      console.log(url)
      if (url.ok) {
        let data = await url.json();
        var result = console.log(data.main.temp);
        var humidity = console.log(data.main.humidity);
        var feel = console.log(data.main.feels_like);
        var min_temp1 = console.log(data.main.temp_min);
        var max_temp1 = console.log(data.main.temp_max);


        console.log(data)
        first.innerHTML = `${data.main.temp}`
        sec.innerHTML = `${data.main.humidity}`
        third.innerHTML = `${data.main.feels_like}`
        min_temp.innerHTML = `${data.main.temp_min}`
        max_temp.innerHTML = `${data.main.temp_max}`
      }
    }
    )
  }
}
searchs()


// const apiKey = "YOUR_API_KEY";           // ← replace with your key

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // 1. Get location using BigDataCloud

    const locRes = await fetch(`https://api-bdc.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    const locData = await locRes.json();

    const city = locData.locality || locData.city || locData.principalSubdivision || "Unknown";
    const state = locData.principalSubdivision || "Unknown";
    const country = locData.countryName || "Unknown";

     console.log("my city is " + city)
    // const city = "Mumbai";

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=0d824075627f3ce05edfe861ab01feac`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log("API response →", data); // <‑‑ see what came back

        if (data.cod !== "200" || !Array.isArray(data.list)) {
          throw new Error(data.message || "Unexpected response structure");
        }

        const tgt = document.getElementById("future-forecast-box");
        tgt.innerHTML = "";

        const seen = new Set();
        for (const entry of data.list) {
          const date = new Date(entry.dt * 1000).toDateString();
          if (seen.has(date)) continue;
          seen.add(date);

          tgt.insertAdjacentHTML("beforeend", `
            <div class="forecast">
              <strong>${date}</strong><br>
              🌡 Temp: ${entry.main.temp} °C<br>
              🌤 ${entry.weather[0].main} (${entry.weather[0].description})
            </div>
          `);
          if (seen.size === 6) break;       // stop after six unique days
        }
      })
      .catch(err => {
        console.error(err);
        document.getElementById("future-forecast-box").innerHTML =
          `<p class="error">Error: ${err.message}</p>`;
      });
  })
}



