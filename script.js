// OpenWeatherMap API Key
const API_KEY = '1afa2f74658404475cb61ea12a7c9337'; 

// DOM Elements
const cityInput = document.getElementById('cityInput');
const suggestions = document.getElementById('suggestions');
const weatherDiv = document.getElementById('weather');
const errorDiv = document.getElementById('error');

// Fetch weather data
async function getWeather(city) {
  errorDiv.textContent = '';
  weatherDiv.innerHTML = '';
  suggestions.innerHTML = '';

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!res.ok) throw new Error('City not found');
    const data = await res.json();

    const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherDiv.innerHTML = `
      <img src="${icon}" alt="Weather icon" />
      <h2>${data.name}, ${data.sys.country}</h2>
      <p><strong>${data.weather[0].main}</strong> - ${data.weather[0].description}</p>
      <p>🌡️ Temp: ${data.main.temp}°C</p>
      <p>💧 Humidity: ${data.main.humidity}%</p>
      <p>🌬️ Wind: ${data.wind.speed} m/s</p>
    `;
    weatherDiv.style.display = 'block';
  } catch (err) {
    errorDiv.textContent = err.message;
    weatherDiv.style.display = 'none';
  }
}

// Autocomplete City Suggestions
cityInput.addEventListener('input', async function () {
  const query = cityInput.value.trim();
  if (query.length < 2) {
    suggestions.innerHTML = '';
    return;
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
    );
    const cities = await res.json();

    suggestions.innerHTML = '';
    cities.forEach((place) => {
      const li = document.createElement('li');
      li.textContent = `${place.name}, ${place.country}`;
      li.addEventListener('click', () => {
        cityInput.value = place.name;
        suggestions.innerHTML = '';
        getWeather(place.name);
      });
      suggestions.appendChild(li);
    });
  } catch (err) {
    suggestions.innerHTML = '';
  }
});

// Optional: Enter key to fetch weather
cityInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    getWeather(cityInput.value);
  }
});
