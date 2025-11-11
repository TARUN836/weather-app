// DEBUG version of script.js - paste your real API key into apiKey
const apiKey = "d90e52d5eb30dbb50098b7a7c5a428ec"; // <-- replace this

const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const weatherDiv = document.getElementById("weather");

searchBtn.addEventListener("click", getWeather);

function showMessage(html) {
  weatherDiv.innerHTML = html;
}

function getWeather() {
  const city = cityInput.value.trim();
  if (!city) {
    alert("Please enter a city name!");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  console.log("Fetching URL:", url);

  fetch(url)
    .then(response => {
      console.log("Fetch response status:", response.status, response.statusText);
      if (!response.ok) {
        // try to read JSON error body for more info
        return response.json().then(errBody => {
          console.error("API returned non-OK:", errBody);
          // show clearer message to user
          if (errBody && errBody.message) {
            throw new Error(`API error ${response.status}: ${errBody.message}`);
          } else {
            throw new Error(`API error ${response.status}: ${response.statusText}`);
          }
        }).catch(parseErr => {
          // JSON parse failed, throw generic error
          throw new Error(`API error ${response.status}: ${response.statusText}`);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log("API JSON response:", data);
      if (!data || data.cod === "404") {
        showMessage(`<p>City not found: ${city}</p>`);
        return;
      }
      // display normal response
      const html = `
        <h2 id="city-name">${data.name}, ${data.sys && data.sys.country ? data.sys.country : ''}</h2>
        <p id="temp">🌡️ ${data.main.temp}°C</p>
        <p id="desc">☁️ ${data.weather[0].description}</p>
        <p id="humidity">💧 Humidity: ${data.main.humidity}%</p>
      `;
      showMessage(html);
    })
    .catch(err => {
      console.error("Fetch/Processing error:", err);
      showMessage(`<p>Something went wrong! ${err.message}</p>
                   <p>Open console (F12) for details.</p>`);
    });
}
