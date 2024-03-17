const form = document.querySelector('#form');
const formCity = document.querySelector('#formCity');
const apiKey = 'fc6d2e135db9a7f03442e991e0b72221';
const bl_map = document.querySelector('.bl-map');
const bl_history = document.querySelector('.histoty-list');

form.onsubmit = function (event) {
    event.preventDefault();
    const city = formCity.value.trim();

    getWeather(city)
    .then((data) => {
        if (data.cod === '404') {
            removeWeatherCard();
            createErrorCard(city);
        } else {
            removeWeatherCard();
            createWeatherCard(data);
            addToHistory(data.name);
            removeExtraHistoryItems();
            success(data);
        }
    });
};

function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=ru`;
    return fetch(url)
    .then((response) => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    });
}

function removeWeatherCard() {
    const exCard = document.querySelector('.bl-weather');
    if (exCard) exCard.remove();
}

function createErrorCard(city) {
    const html_weather = `
        <div class="bl-weather">
            <div class="weather__temp">Город <b>${city}</b> не найден. Уточните название города.</div>
        </div>
    `;
    bl_map.insertAdjacentHTML('afterend', html_weather);
}

function createWeatherCard(data) {
    const html_weather = `
        <div class="bl-weather">
            <div class="weather__temp">${data.name}</div>
            <div class="weather__city">${Math.round(parseFloat(data.main.temp) - 273.15)} °C</div>
        </div>
    `;
    bl_map.insertAdjacentHTML('afterend', html_weather);
}

function addToHistory(city) {
    if (!bl_history.innerHTML.includes(city)) {
        const html_history = `
            <li>${city}</li>
        `;
        bl_history.insertAdjacentHTML('afterbegin', html_history);
    }
}

function removeExtraHistoryItems() {
    const items = document.querySelectorAll('li');
    if (items.length > 10) {
        for (let i = 10; i < items.length; i++) {
            items[i].remove();
        }
    }
}

const map = document.querySelector('iframe');
function success(data) {
    map.src = `https://www.openstreetmap.org/export/embed.html?bbox=${data.coord.lon}%2C${data.coord.lat}&amp;layer=mapnik`;
}

document.getElementById("history-list").addEventListener("click", function(event) {
    if (event.target.tagName === 'LI') {
        const city = event.target.textContent;
        getWeather(city)
        .then((data) => {
            removeWeatherCard();
            createWeatherCard(data);
            console.log(city)
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    findLocation();

    function findLocation() {
        const map = document.getElementById('map');
        const status = document.getElementById('status');

        if (!navigator.geolocation) {
            status.textContent = 'Ваш браузер не дружит с геолокацией...';
        } else {
            navigator.geolocation.getCurrentPosition(success, error);
        }

        function success(position) {
            const { longitude, latitude } = position.coords;
            const map = document.querySelector('iframe');
            map.src = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude}%2C${latitude}&amp;layer=mapnik`;
            console.log(navigator.geolocation);
            getWeatherlon('Moscow', latitude, longitude)
                .then(data => {
                    createWeatherCard(data);
                })
                .catch(error => {
                    console.error('Ошибка получения данных о погоде:', error);
                });
        }

        function error() {
            status.textContent = 'Не получается определить вашу геолокацию :(';
        }
    }

    function createWeatherCard(data) {
        const html_weather = `
        <div class="bl-weather">
            <div class="weather__temp">${data.name}</div>
            <div class="weather__city">${Math.round(parseFloat(data.main.temp) - 273.15)} °C</div>
        </div>
    `;
    bl_map.insertAdjacentHTML('afterend', html_weather);
    }

    function getWeatherlon(city, latitude, longitude) {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&lang=ru`;
                   
        return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
            
        });
    }
});