const apiKey = 'd1bf4957e9f33928a1bfa79366306a2f';
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const forecastContainer = document.getElementById('forecast');
const historyContainer = document.getElementById('history');

// Get saved search history from localStorage
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

// Event listener for search button
searchBtn.addEventListener('click', function () {
    const city = cityInput.value;
    getWeather(city);
    addToHistory(city);
});

// Get weather data
function getWeather(city) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => displayCurrentWeather(data));

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => displayForecast(data));
}

// Display current weather
function displayCurrentWeather(data) {
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('date').textContent = new Date().toLocaleDateString();
    document.getElementById('temp').textContent = `Temp: ${data.main.temp} °C`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('wind').textContent = `Wind: ${data.wind.speed} m/s`;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
}

// Display 5-day forecast
function displayForecast(data) {
    forecastContainer.innerHTML = ''; // Clear previous forecast
    for (let i = 0; i < data.list.length; i += 8) { // 8 * 3-hour intervals = 1 day
        const forecast = data.list[i];
        const forecastCard = document.createElement('div');
        forecastCard.classList.add('forecast-card');

        forecastCard.innerHTML = `
            <p>${new Date(forecast.dt_txt).toLocaleDateString()}</p>
            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="Weather Icon">
            <p>Temp: ${forecast.main.temp} °C</p>
            <p>Wind: ${forecast.wind.speed} m/s</p>
            <p>Humidity: ${forecast.main.humidity}%</p>
        `;

        forecastContainer.appendChild(forecastCard);
    }
}

// Add search to history and save to localStorage
function addToHistory(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        updateHistory();
    }
}

// Update the history section
function updateHistory() {
    historyContainer.innerHTML = '';
    searchHistory.forEach(city => {
        const historyItem = document.createElement('li');
        historyItem.textContent = city;
        historyItem.addEventListener('click', function () {
            getWeather(city);
        });
        historyContainer.appendChild(historyItem);
    });
}

// Load search history on page load
updateHistory();
