function formatDate(timestamp){
    let date = new Date(timestamp);
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let day = days[date.getDay()];
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


let apiKey = "7d478f69e1b2f5d563653f13f5f91d76";

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
            // console.log(forecastDay);

            let day_el = document.createElement('li');
            day_el.className = "list-group-item numeric";
            day_el.innerText = formatDay(forecastDay.dt); // Add DateTime
            forecast_days.appendChild(day_el);

            let icon_el = document.createElement('li');
            icon_el.className = "list-group-item future-emojis";
            icon_el.innerHTML = `<img src="https://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" alt="" width="40"/>`;   // Add icons
            forecast_icons.appendChild(icon_el);

            let temp_el = document.createElement('li');
            temp_el.className = "list-group-item numeric";
            temp_el.innerText = Math.round(forecastDay.temp.day) + "°";
            forecast_temp.appendChild(temp_el);

        }
    })
}

function showTemperature(response){
   // console.log(response.data);
    let temperature = Math.round(response.data.main.temp);
    let humidity = response.data.main.humidity;
    let wind = Math.round(response.data.wind.speed);
    let description = response.data.weather[0].description;

    let temperatureElement = document.querySelector(".current-temperature");
    let humidityElement = document.querySelector(".humidity-percent");
    let windElement = document.querySelector(".wind-speed");
    let descriptionElement = document.querySelector(".description-element");
    let city = document.querySelector("h3");
    let iconElement = document.querySelector("#icon");

    city.innerHTML = response.data.name;
    temperatureElement.innerHTML = `${temperature} °C`;
    humidityElement.innerHTML = `Humidity: ${humidity}%`;
    windElement.innerHTML = `Wind: ${wind} km/h;`;
    descriptionElement.innerHTML= description;
    iconElement.setAttribute(
        "src",
        `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
    iconElement.setAttribute("alt", response.data.weather[0].description);

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


