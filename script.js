

// 1. weather dashboard with form inputs and search city option using bootstrap 
//1a. search city presented with current and future conditions for city and using local storage info is added to search history
        //1b. search input that stores searches (city name)

//2. current weather conditions for city includes city name, date, icon representing weather conditions, temp, humidity, wind speed, and uv index
        //2a. openweather api key obtains data that provides us with 
                // 2b. name: name
                // 2c. date: dt 
                // weather conditions: weather[0].main or weather[0].description
                // 2d. icon representing weather conditions: weather[0].icon
                // 2e. temp: main.temp
                    // make sure units are in API call
                // 2f. humidity: main.humidity
                // 2g. wind speed: wind.speed

                //lat for second call:coord.lat
                //lon for second call:coord.lon

                // seperate API call
                // one call https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&appid={API key}

                // 2h. uv index: current.uvi

//3. when viewing uv index presented with a color that indicates weather conditions are favorable, moderate, or severe
       //3a. uv index conected to 3 colors representing favorable, moderate, or severe

//4. when vewing future weather conditions for city presented with a 5-day forecast that displays date, an icon representation of weather conditions, the temperature, and the humidity 
    //4a. 5-day forecast
    //4b. date
    //4c. icon representation of weather conditions
    //4d. tempeture 
    //4e. humidity 

//5. when clicking on a city from search history presented again with the current and future conditions for that city
var cityList = [];



function displayDate(dt) {
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] 
    var display = days[dt.getDay()] + " " + dt.getMonth() + "/" + dt.getDate() + "/" + dt.getFullYear();
    return display;
}

function searchCity() {
    var city = $("#city-input").val();
    city = city.trim();
    cityList[cityList.length] = city;
    $(".list-group").append('<button type="button" class="list-group-item list-group-item-action" value=' + city + '>' + city + '</button>')
    getAPI(city);
}

function getAPI(city){
var key  = "5aaddce0a20519b43b343a4c741a385a";

var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + key;
var lat ;
var lon ;


fetch(requestUrl)
    .then(function (response) {
        if (response.status !== 200) {
            alert("Search is not valid, please enter city name.");
        }
        return response.json();
    })
    .then(function (data) {
       console.log(data);
       $("#date").text(displayDate(new Date(data.dt*1000)));
        $("#city-name").text(data.name); 
        $("#weather-condition").text(data.weather[0].main);
        $("#weather-icon").attr("src", "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
        $("#temprature").text(data.main.temp);
        $("#humidity").text(data.main.humidity);
        $("#wind-speed").text(data.wind.speed);
        lat = data.coord.lat;
        lon = data.coord.lon;
        var requestUrl1 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + key;
        return fetch(requestUrl1)
        .then(function (response) {
            if (response.status !== 200) {
                alert("Search is not valid, please enter city name.");
            }
            return response.json();
        })
        .then(function (data) {
           console.log(data);
           $("#uv-index").text(data.current.uvi); 
           uviColor(data.current.uvi);  
           for (let i = 1; i < 6; i++){
           
           
        $("#date" + i).text(displayDate(new Date(data.daily[i].dt*1000)));
        $("#weather-icon" + i).attr("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png");    
        $("#temperature" + i).text(data.daily[i].temp.day);   
        $("#humidity" + i).text(data.daily[i].humidity); 
        }   
        localStorage.setItem("city", JSON.stringify(cityList));
        return data;
        });
    })
}


// function for uvi with if statment for color range

function uviColor(uvi) {
if (uvi < 3) {
    $("#uv-index").css("background-color", "green")
}
else if (uvi >= 7) {
    $("#uv-index").css("background-color", "red")
}
else {
    $("#uv-index").css("background-color", "yellow")
}
}

function loadData() {
    if(localStorage.getItem("city") === null) {}
    else {
        cityList = JSON.parse(localStorage.getItem("city"));
        for (let i = 0; i < cityList.length; i++) {
            $(".list-group").append('<button type="button" class="list-group-item list-group-item-action" value=' + cityList[i] + '>' + cityList[i] + '</button>')
        }
    }
}

function saveCity () {
    getAPI(this.value);
}
// runtime
loadData()
$("#search-btn").on("click", searchCity);
$(document).on("click", ".list-group-item", saveCity);

