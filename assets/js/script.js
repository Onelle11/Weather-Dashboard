
var APIKey = "622fa2a3fad6cc197b2128f3f3b1d819";

function getWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city +  "&cnt=5&units=metric&appid=" + APIKey;
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&cnt=5&appid=" + APIKey;
    var currentWeather = fetch(queryURL).then(response => response.json());
    var forecastWeather = fetch(forecastURL).then(response => response.json());
    return Promise.all([currentWeather, forecastWeather]);
}

function displayData(data) {
    document.getElementById('city').innerHTML = data[0].name;
    document.getElementById('date').innerHTML = new Date().toLocaleDateString("en-US")
    document.getElementById('temp').innerHTML = data[0].main.temp + " C";
    document.getElementById('wind').innerHTML = data[0].wind.speed + " kph";
    document.getElementById('humid').innerHTML = data[0].main.humidity + " %";

    var forecast = data [1].list;
    forecast.forEach((weather, index) => {
        document.getElementById('date-' + index).innerHTML = new Date(weather.dt_txt).toLocaleDateString("en-US")
        document.getElementById('temp-' + index).innerHTML = weather.main.temp + " C";
        document.getElementById('wind-' + index).innerHTML = weather.wind.speed + " kph";
        document.getElementById('humid-' + index).innerHTML = weather.main.humidity + " %";
        document.getElementById('icon-' + index).innerHTML = '<img src="https://openweathermap.org/img/wn/' + weather.weather[0].icon + '@2x.png"/>';
    })
}

function createSearchItem(city) { 
    var listEl = document.createElement('li');
    var listBtn = document.createElement('button');
    var listText = document.createTextNode(city);

    listBtn.addEventListener('click', function(e) {

        getWeather(e.target.textContent || e.target.innerText).then((json) => {
            displayData(json);
        })
     })

    listBtn.appendChild(listText);
    listEl.appendChild(listBtn);
    searchHistory.appendChild(listEl);
}

function addToLocalStorage(city) {
    var searchHistoryItems = localStorage.getItem("search-History");

    if (searchHistoryItems != null) {
        var parseItems = JSON.parse(searchHistoryItems);
        parseItems.push(city);
        localStorage.setItem("search-History", JSON.stringify(parseItems));
    } else {
        localStorage.setItem("search-History", JSON.stringify([city]));
    }
}

getWeather("Toronto").then((json) => {
    displayData(json);
})

var input = document.getElementById('search-input');
var searchBtn = document.getElementById('searchBtn');
var searchHistory = document.getElementById('search-history');

var searchHistoryItems = localStorage.getItem("search-History");

if (searchHistoryItems != null) {
    var parseItems = JSON.parse(searchHistoryItems);
    parseItems.forEach(createSearchItem);
}

searchBtn.addEventListener('click', function() {
    var city = input.value;
    getWeather(city).then((json) => {
       createSearchItem(json[0].name);
       displayData(json);

       addToLocalStorage(json[0].name);
    
    })
})
