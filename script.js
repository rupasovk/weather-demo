// Cities API settings
const CitiesApiUrl = "http://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
const CitiesApiToken = '64db37e72e4f5b085e2d1ded3a4c41a54a53a316';

// Weather API settings
const WeatherApiUrl = 'https://api.gismeteo.net/v2/weather/current/?latitude=54.35&longitude=52.52/?lang=en';
const WeatherApiToken = '56b30cb255.3443075';

let lat = 40.730610;
let lon = -73.935242;
const apiKey = 'c367b3615320315b72bbc2528580d679';

// Get Elements
const cityInput = document.getElementById('city-input');
const autocompleteList = document.getElementById('autocomplete-list');
const searchBtn = document.getElementById('search-btn');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const minTemperature = document.getElementById('min-temperature');
const maxTemperature = document.getElementById('max-temperature');
const humidity = document.getElementById('humidity');
const pressure = document.getElementById('pressure');
const windSpeed = document.getElementById('wind-speed');

// Set Events
cityInput.addEventListener('input', () => getCitiesByNamePart(cityInput.value));
searchBtn.addEventListener('click', async () => {
    const city = cityInput.value.trim();
    if (city) {
        const weatherData = await getWeatherData(city);
        displayWeatherInfo(weatherData);
    }
});

// Function to get cities
async function getCitiesByNamePart(cityNamePart)
{
    var url = CitiesApiUrl;
    var token = CitiesApiToken;
    var query = cityNamePart;

    var options = {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Token " + token
        },
        body: JSON.stringify({query: query})
    }

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data);

        displayAutocompleteList(data.suggestions);
    } catch (error) {
        console.error("Error:", error);
    }
}

// Display Autocomplete list
function displayAutocompleteList(suggestions) {
    autocompleteList.innerHTML = '';

    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.textContent = suggestion.value;
        item.addEventListener('click', () => {
            cityInput.value = suggestion.value;
            lat = suggestion.data.geo_lat;
            lon = suggestion.data.geo_lon;
            autocompleteList.innerHTML = '';
        });
        autocompleteList.appendChild(item);
    });
}

// Function to get weather data
async function getWeatherData(city) {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
      if (response.ok) {
        const data = await response.json();
        displayWeatherInfo(data);
      } else {
        console.error('Error fetching weather data:', response.status, response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  }

// Function to display weather information
function displayWeatherInfo(weatherData) {
    console.log(weatherData)
    
    if (weatherData.main) {
        cityName.textContent = `Текущая температура в ${weatherData.name}`;
        temperature.textContent = `• Температура: ${(weatherData.main.temp - 273.15).toFixed(2)}°C`;
        minTemperature.textContent = `• Минимальная температура: ${(weatherData.main.temp_min - 273.15).toFixed(2)}°C`;
        maxTemperature.textContent = `• Максимальная температура: ${(weatherData.main.temp_max - 273.15).toFixed(2)}°C`;
        humidity.textContent = `• Влажность: ${weatherData.main.humidity}%`;
        pressure.textContent = `• Давление: ${weatherData.main.pressure}`;
        windSpeed.textContent = `• Скорость ветра: ${weatherData.wind.speed} m/s`;
    } else {
        cityName.textContent = 'Не удалось получить данные температуры';
        temperature.textContent = '';
        minTemperature.textContent = '';
        maxTemperature.textContent = '';
        humidity.textContent = '';
        pressure.textContent = '';
        windSpeed.textContent = '';
    }
}