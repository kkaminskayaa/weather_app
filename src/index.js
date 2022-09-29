function getWeatherEmoji(id){
    const emojis = new Map([
        // Group 2xx: Thunderstorm
        [200, '🌩'],
        [201, '🌩'],
        [202, '🌩'],
        [210, '🌩'],
        [211, '🌩'],
        [212, '🌩'],
        [221, '🌩'],
        [230, '🌩'],
        [231, '🌩'],
        [232, '🌩'],

        // Group 3xx: Drizzle
        [300, '🌦'],
        [301, '🌦'],
        [302, '🌦'],
        [310, '🌦'],
        [311, '🌦'],
        [312, '🌦'],
        [313, '🌦'],
        [314, '🌦'],
        [321, '🌦'],

        // Group 5xx: Rain
        [500, '🌧'],
        [501, '🌧'],
        [502, '🌧'],
        [503, '🌧'],
        [504, '🌧'],
        [511, '🌨️'],
        [520, '🌦'],
        [521, '🌦'],
        [522, '🌦'],
        [531, '🌦'],

        // Group 6xx: Snow
        [600, '❄️'],
        [601, '❄️'],
        [602, '❄️'],
        [611, '❄️'],
        [612, '❄️'],
        [613, '❄️'],
        [615, '❄️'],
        [616, '❄️'],
        [620, '❄️'],
        [621, '❄️'],
        [622, '❄️'],

        // Group 7xx: Atmosphere
        [701, '💨'],
        [711, '💨'],
        [721, '💨'],
        [731, '💨'],
        [741, '💨'],
        [751, '💨'],
        [761, '💨'],
        [762, '💨'],
        [771, '💨'],
        [781, '💨'],

        // Group 800: Clear
        [800, '☀️'],

        // Group 80x: Clouds
        [801, '🌤'],
        [802, '☁️'],
        [803, '⛅️'],
        [804, '🌥'],
    ]);

    return emojis.get(id);
}
function formatDay(timestamp){
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    let days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days[day];
}

function addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
}
let now = new Date();

let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
let month = months[now.getMonth()];
let date = addZero(now.getDate());
let year = now.getFullYear();

let h6 = document.querySelector("h6");
h6.innerHTML = `${month} ${date}, ${year}`;


let hour = addZero(now.getHours());
let minute = addZero(now.getMinutes());

let h8 = document.querySelector(".current-time")
h8.innerHTML = `Current time: ${hour}:${minute}`



function convertFahrenheit(event){
    event.preventDefault();

    let temperature = document.querySelector(".current-temperature");
    if(temperature.innerHTML.slice(-1) === "C"){
        celsius.classList.remove("active");
        fahrenheit.classList.add("active");
        let temp = temperature.innerHTML.slice(0, -3);
        temperature.innerHTML = `${Math.round(temp * 1.8 + 32)} °F`;
    }
}

let celsius = document.querySelector(".celsius");
let fahrenheit = document.querySelector(".fahrenheit");

fahrenheit.addEventListener("click", convertFahrenheit);

function convertCelsius(event){
    event.preventDefault();
    celsius.classList.add("active");
    fahrenheit.classList.remove("active");
    let temperature = document.querySelector(".current-temperature");
    if(temperature.innerHTML.slice(-1) === "F"){
        let temp = temperature.innerHTML.slice(0, -3);
        temperature.innerHTML = `${Math.round((temp -32) /1.8)} °C`;
    }
}

celsius.addEventListener("click", convertCelsius);

let apiKey = "6bfa54f242cbb59343d4e58db578dc61";

function search(event){
    event.preventDefault();

    let searchInput = document.querySelector("#search-text-input");

    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&appid=${apiKey}&&units=metric`;
    axios.get(apiUrl).then(showTemperature);
}
let formElement = document.querySelector("#search-form")
formElement.addEventListener("submit", search);

function getForecast(coordinates){
    console.log(coordinates);
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
    // console.log(apiUrl);
    axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response){

    let forecast = response.data.daily;

    let forecast_days = document.querySelector("#forecast_days");
    let forecast_icons = document.querySelector("#forecast_icons");
    let forecast_temp = document.querySelector("#forecast_temp");

    const removeChilds = function(parent) {
        while (parent.lastChild) {
            parent.removeChild(parent.lastChild);
        }
    };

    removeChilds(forecast_days);
    removeChilds(forecast_icons);
    removeChilds(forecast_temp);

    forecast.forEach(function (forecastDay, index){
        if (index < 6) {
            console.log(forecastDay);

            let day_el = document.createElement('li');
            day_el.className = "list-group-item numeric";
            day_el.innerText = formatDay(forecastDay.dt); // Add DateTime
            forecast_days.appendChild(day_el);

            let icon_el = document.createElement('li');
            icon_el.className = "list-group-item future-emojis";
            icon_el.innerText = getWeatherEmoji(forecastDay.weather[0].id);
            forecast_icons.appendChild(icon_el);

            let temp_el = document.createElement('li');
            temp_el.className = "list-group-item numeric";
            temp_el.innerText = Math.round(forecastDay.temp.day) + "°";
            forecast_temp.appendChild(temp_el);

        }
    })
}

function showTemperature(response){
    console.log(response.data);
    let temperature = Math.round(response.data.main.temp);
    let currentEmoji = document.querySelector("#current-emoji");
    let humidity = response.data.main.humidity;
    let wind = Math.round(response.data.wind.speed);
    let temperatureElement = document.querySelector(".current-temperature");
    let humidityElement = document.querySelector(".humidity-percent");
    let windElement = document.querySelector(".wind-speed");

    let city = document.querySelector("h3");

    city.innerHTML = response.data.name;
    temperatureElement.innerHTML = `${temperature} °C`;
    currentEmoji.innerText = getWeatherEmoji(response.data.weather[0].id);
    humidityElement.innerHTML = `Humidity: ${humidity}%`;
    windElement.innerHTML = `Wind: ${wind} km/h;`;

    getForecast(response.data.coord);
}

function searchCurrent(event){
    event.preventDefault();

    navigator.geolocation.getCurrentPosition(function (position) {
            let lon = position.coords.longitude;
            let lat = position.coords.latitude;
            //console.log(lon, lat);
            let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

            axios.get(`${apiUrl}`).then(showTemperature);
        }
    )
}
let currentButton = document.querySelector("#current-btn")
currentButton.addEventListener("click", searchCurrent);

window.addEventListener("load", searchCurrent);
