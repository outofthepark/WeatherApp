var key = "f387f133fc37f900b68fc9079750f4d3";
var secondKey = "efbf074b535b32b85f02c2ad2fff2d39";
var displayDiv = $('#displayDiv');
var searchBar = $('#searchBar');

searchBar.change(searchForCityForecast);

function searchForCityForecast() {
    var city = $(this).val();
    var apiURL = "https://api.openweathermap.org/data/2.5/forecast?q="+ city + ",us&appid=" + key;
    fetch(apiURL).then(function(response) {
        if (response.ok) {
        response.json().then(function(data) {
            loadUVData(data.city.coord.lat, data.city.coord.lon);
        });
        } else {
        alert('Error: Weather data not found');
        }
    });
}

function loadUVData(lat, lon) {
    var currentApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat + "&lon="+ lon +"&exclude=hourly,minutely&units=imperial&appid=" + secondKey;
    fetch(currentApiUrl).then(function(response) {
        if (response.ok) {
        response.json().then(function(data) {
            displayDiv.data('cityForecast', data);
            displayCityData();
        });
        } else {
        alert('Error: Weather data not found');
        }
    });
}


function displayCityData() {
var cityForecast = displayDiv.data('cityForecast');
console.log(cityForecast);
var currentWindSpeed   = cityForecast.current.wind_speed;
var currentTemp        = cityForecast.current.temp.day;
var currentHumidity    = cityForecast.current.humidity;
var currentWeatherIcon = cityForecast.current.weather[0].icon;
var currentUvi         = cityForecast.current.uvi;

var displayCurrentDiv = $('<div>', {'id': 'displayCurrentDiv'});
displayDiv.append(displayCurrentDiv);
    
    for(var i = 0; i < 6; i++){
        var windSpeed   = cityForecast.daily[i].wind_speed;
        var temp        = cityForecast.daily[i].temp.day;
        var humidity    = cityForecast.daily[i].humidity;
        var weatherIcon = cityForecast.daily[i].weather[0].icon;
        var dt        = cityForecast.daily[i].dt;
        var date = dayjs.unix(dt).format('MM/DD/YYYY');
        console.log(date);
        var iconurl = "http://openweathermap.org/img/w/" + weatherIcon + ".png"
        console.log(iconurl);
        var displayForecastDiv = $('<div>', {'id': 'displayForecastDiv' + i, 'class': 'displayForecastDiv'})
        displayDiv.append(displayForecastDiv);
        displayDiv.append($('<img>', {'src': iconurl}));
    }

}
  

  //5 day forecast - date //list.dt_txt
  //wind list.wind.speed
  //temp list.main.temp
  //humidity list.main.humidity
  //cloudy sunny icon thing -> list.weather.icon
  //lat + lon for second api call city.coord.lat & city.coord.lon
  //for UV index
  //uv index of today current.uvi