var key = "f387f133fc37f900b68fc9079750f4d3";
var secondKey = "efbf074b535b32b85f02c2ad2fff2d39";
var displayDiv = $('#displayDiv');
var searchDiv = $('#searchDiv');

$('#searchBar').change( function() {searchForCity($(this).val());} );
$('#searchButton').click( function() {searchForCity($(this).val());} );

displayStoredSearches();

function displayStoredSearches()
{
    var storedSearchDiv = $('<div>', {'id': 'storedSearchDiv'});
    searchDiv.append(storedSearchDiv);
    var clearSearchDiv = $('<div>', {'id': 'clearSearchDiv'});
    searchDiv.append(clearSearchDiv);
    if(localStorage.length){
        Object.keys(localStorage).forEach((key) => {
                storedSearchDiv.append($('<button>', {'class': 'searchHistoryButton'}).text(localStorage[key]).click( function() { searchForCity(localStorage[key]); } ));
        });
        clearSearchDiv.append($('<button>', {'id': 'clearSearchHistory'}).text('Clear Search History').click( clearSearchHistory ));
    }
}

function clearSearchHistory()
{
    localStorage.clear();
    $('#storedSearchDiv').empty();
    $('#clearSearchDiv').empty();
    displayStoredSearches();
}

//The geographical key is the string '{latitude},{longitude}' with no spaces
function storeNewSearch(geographicalKey, newCityName){
    //If there's already local storage, check to make sure this city hasn't already been stored
    if(localStorage.length){
        var previousSearch = false;
        //Loop through local storage looking for this city search
        Object.keys(localStorage).forEach((key) => {
            if( key == geographicalKey ){
                previousSearch = true;
            }
        });
        if(!previousSearch)
        {
            localStorage.setItem(geographicalKey, newCityName);
            $('#storedSearchDiv').append($('<button>', {'class': 'searchHistoryButton'}).text(newCityName).click( function() { searchForCity(newCityName); } ));
        }
    }else{
        localStorage.setItem(geographicalKey, newCityName);
        $('#storedSearchDiv').append($('<button>', {'class': 'searchHistoryButton'}).text(newCityName).click( function() { searchForCity(newCityName); } ));
        $('#clearSearchDiv').append($('<button>', {'id': 'clearSearchHistory'}).text('Clear Search History').click( clearSearchHistory ));
    }
}

function searchForCity(city)
{
    if(city != ''){
        displayDiv.empty();
        var apiURL = "https://api.openweathermap.org/data/2.5/forecast?q="+ city + ",us&appid=" + key;
        fetch(apiURL).then(function(response) {
            if (response.ok) {
            response.json().then(function(data) {
                getWeatherData(data.city.coord.lat, data.city.coord.lon);
                city = city.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
                displayDiv.data('city', city);
                storeNewSearch(data.city.coord.lat + ',' + data.city.coord.lon, city);
            });
            } else {
            alert('Error: Weather data not found');
            }
        });
    }
}

function getWeatherData(lat, lon)
{
    var currentApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat + "&lon="+ lon +"&exclude=hourly,minutely&units=imperial&appid=" + secondKey;
    fetch(currentApiUrl).then(function(response) {
        if (response.ok) {
        response.json().then(function(data) {
            displayDiv.data('weatherData', data);
            displayCityData();
        });
        } else {
        alert('Error: Weather data not found');
        }
    });
}


function displayCityData()
{
    var weatherData       = displayDiv.data('weatherData');
    var city               = displayDiv.data('city');
    var currentWindSpeed   = weatherData.current.wind_speed;
    var currentTemp        = weatherData.current.temp;
    var currentHumidity    = weatherData.current.humidity;
    var currentUvi         = weatherData.current.uvi;
    var currentdt          = weatherData.current.dt;
    var currentDate        = dayjs.unix(currentdt).format('MM/DD/YYYY');
    var currentWeatherIcon = weatherData.current.weather[0].icon;
    var currentIconurl     = "http://openweathermap.org/img/w/" + currentWeatherIcon + ".png";

    console.log(currentUvi);
    var currentUviClass;
    if      (currentUvi < 2) { currentUviClass = 'green';  }
    else if (currentUvi < 5) { currentUviClass = 'yellow'; }
    else if (currentUvi < 8) { currentUviClass = 'orange'; }
    else                     { currentUviClass = 'red';    }

    if(currentUvi < 8)
    {
        console.log('less than 8');
    }

    var displayCurrentDiv = $('<div>', {'id': 'displayCurrentDiv'});
    displayDiv.append(displayCurrentDiv);
    displayCurrentDiv.append($('<h2>', {'class': 'currentHeader'}).text(city + ' (' +currentDate + ')')).append($('<img>', {'src': currentIconurl, 'id': 'currentIcon'})).append($('<p>', {'class': 'currentTemp'}).text('Temp: ' + currentTemp + '\u00B0 F')).append($('<p>', {'class': 'currentWindSpeed'}).text('Wind: ' + currentWindSpeed + 'mph')).append($('<p>', {'class': 'currentHumidity'}).text('Humidity: ' + currentHumidity + '\u0025')).append($('<p>', {'class': currentUviClass}).text('Current UVI: ' + currentUvi));


    var displayForecastDiv = $('<div>', {'id': 'displayForecastDiv'});
    displayDiv.append(displayForecastDiv);
    for(var i = 1; i < 6; i++)
    {
        var windSpeed   = weatherData.daily[i].wind_speed;
        var temp        = weatherData.daily[i].temp.day;
        var humidity    = weatherData.daily[i].humidity;
        var weatherIcon = weatherData.daily[i].weather[0].icon;
        var dt          = weatherData.daily[i].dt;
        var date        = dayjs.unix(dt).format('MM/DD/YYYY');
        var iconurl     = "http://openweathermap.org/img/w/" + weatherIcon + ".png"
        
        var thisForecastDiv = $('<div>', {'class': 'forecastDiv'});
        if(i == 1 ){ thisForecastDiv.addClass('outerLeft'); }else if(i == 5){ thisForecastDiv.addClass('outerRight'); }
        displayForecastDiv.append(thisForecastDiv);
        thisForecastDiv.append($('<p>', {'class': 'forecastDate'}).text(date)).append($('<img>', {'src': iconurl})).append($('<p>', {'class': 'forecastTemp'}).text('Temp: ' + temp + '\u00B0 F')).append($('<p>', {'class': 'forecastWindSpeed'}).text('Wind: ' + windSpeed + 'mph')).append($('<p>', {'class': 'forecastHumidity'}).text('Humidity: ' + humidity + '\u0025'));
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