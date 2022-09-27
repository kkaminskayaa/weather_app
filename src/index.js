
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

function showTemperature(response){
    console.log(response.data);
    let temperature = Math.round(response.data.main.temp);
    let humidity = response.data.main.humidity;
    let wind = Math.round(response.data.wind.speed);
    let temperatureElement = document.querySelector(".current-temperature");
    let humidityElement = document.querySelector(".humidity-percent");
    let windElement = document.querySelector(".wind-speed");

    let city = document.querySelector("h3");

    city.innerHTML = response.data.name;
    temperatureElement.innerHTML = `${temperature} °C`;
    humidityElement.innerHTML = `Humidity: ${humidity}%`;
    windElement.innerHTML = `Wind: ${wind} km/h;`;

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
