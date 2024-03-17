const form = document.querySelector('#form');
const formCity = document.querySelector('#formCity');
const apiKey = 'fc6d2e135db9a7f03442e991e0b72221';
const bl_map = document.querySelector('.bl-map');
const bl_history = document.querySelector('.histoty-list');

form.onsubmit = function (event) {
    event.preventDefault();
    const city = formCity.value.trim();
    // console.log(city);

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
        }
    });
};

function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=ru`;
    return fetch(url)
    .then((response) => response.json());
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
    const html_history = `
     <li>${city}</li>
    `;
    bl_history.insertAdjacentHTML('afterbegin', html_history);
}


// function addToHistory(city) {
//     const html_history = `
//      <li><a class='history_link'>${city}</a></li>
//     `;
//     bl_history.insertAdjacentHTML('afterbegin', html_history);
//     const newElement = bl_history.querySelector('.history_link');
//     newElement.addEventListener('click', myFunction);
//     getWeather(city);
//     removeExtraHistoryItems()
// }




function removeExtraHistoryItems() {
    const items = document.querySelectorAll('li');
    if (items.length > 10) {
        for (let i = 10; i < items.length; i++) {
            items[i].remove();
        }
    }
}