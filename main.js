console.log($)

var weatherInfo = document.querySelector("#weather-info")

var apiKey = "d7b8dba039ce7a0d6f3b304cc2944ae6"
var baseUrl = "https://api.forecast.io/forecast/" + apiKey
var city = document.querySelector('.city')
var todayDisplay = document.querySelector('.today')
var weeklyDisplay = document.querySelector('.weekly')
var hourly = document.querySelector('.hourly')

var latitude = ''
var longitude = ''

function getQuery(keyEvent) {
    var query = keyEvent.srcElement
    if (keyEvent.keyCode === 13) {
        var userCity = query.value
        window.location.hash = userCity
        query.value = ''
    }
}

var week= {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday"
}

var showWeather = function(jsonData) {
    console.log(jsonData)
    var day = new Date()
    var today = day.getDay()
    var cityDiv = document.querySelector(".weatherCity")
    var forecastDiv = document.querySelector(".forecastWeather")
    cityDiv.style.marginLeft= "55px"
    forecastDiv.innerHTML = ''
    cityDiv.innerHTML = ''
    cityDiv.innerHTML = '<div class=""><h1 class="currentTemperature">' + parseInt(jsonData.currently.temperature) + '&deg;F</h1>\
                        <img class="mainIcon" src="images/' + jsonData.currently.icon + '.png"></div>\
                        <div class="daySummary"><h3 class="weekday">' + week[today] + '</h3>' +
                        //'<div class="iconDiv">\
                        '<h3 class="overcast">' + jsonData.currently.summary + '</h3></div>'
    function currentForecast () {
        weatherStyle = {
            marginBottom: 0,
            marginTop: 0
        }
        forecastDiv.innerHTML = ''
        forecastDiv.innerHTML += '<div class="currentForecast">' +
                                '<p>Feels like: ' + parseInt(jsonData.currently.apparentTemperature) + '&deg;F</p>' +
                                '<p>Precipitation: ' + parseInt((jsonData.currently.precipProbability)*100) + '%</p>' +
                                '<p>Wind: ' + jsonData.currently.windSpeed + ' mph</p>' +
                                '<p>Humidity: ' + parseInt((jsonData.currently.humidity)*100) + '%</p>' +
                                '<p>Dew Point: ' + parseInt(jsonData.currently.dewPoint) + '&deg;F</p>' +
                                '<p>Visibility: ' + jsonData.currently.visibility + ' mi.</p>' +
                                '</div>'
        cityDiv.style.marginLeft= "30px"
    }
    todayDisplay.addEventListener("click", currentForecast)
    weeklyDisplay.addEventListener("click", changeView)
}


var citySearch = document.querySelector(".citySearch")
citySearch.addEventListener('keydown',getQuery)

var weeklyView = function (obj){
	console.log(obj)
	var htmlString = ''
	var arrayOfObj = obj.daily.data

	for (var i = 0; i<arrayOfObj.length - 1; i++){
		var day = arrayOfObj[i]
		var time = day.time
		time = time * 1000
		var d = new Date(time);

		var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

		var date = weekday[d.getDay()]
		htmlString += '<div class="weeklyBars"><h1 class="day">'+ date +'</h1> \
					   <h1 class="maxTemp">' + day.temperatureMax + '°</h1>\
                       <img src="images/' + day.icon + '.png"class="description">\
                       <h2 class="minTemp">' + day.temperatureMin + '°</h2>\
					   </div>'
	}
	weatherInfo.innerHTML = htmlString
}


ViewConstructor = function(positionObject, viewHTML) {
  this.el = positionObject
  this.html = viewHTML
  this.getLocation = function(view) {
    var success = function(obj) {
	  var latitude = obj.coords.latitude
	  var longitude = obj.coords.longitude
	  // console.log(this)
	  var fullUrl = baseUrl + '/' + latitude + ',' + longitude + '?callback=?'
	    var promise= $.getJSON(fullUrl)
	    promise.then(this.html.bind(this))
	  }
    var error = function(theError) {
      console.log(theError)
    }
    navigator.geolocation.getCurrentPosition(success.bind(this), error)
  }
}

var todayView = function(obj) {
  // console.log(obj)
  var htmlString = ''
  var currentTemp = obj.currently
  htmlString += '<div id="today"><h2>Right Now</h2>\
			   <h1 class="noMargBottom mt">' + currentTemp.temperature + '°</h1>\
               <img  src="images/' + currentTemp.icon + '.gif" class="description">\
               <h2 class="smt">' + currentTemp.summary + '</h2></div>'

  weatherInfo.innerHTML = htmlString
}

var today = new ViewConstructor(weatherInfo, todayView)
var weekly = new ViewConstructor(weatherInfo, weeklyView)
var hourly = new ViewConstructor(weatherInfo, hourly)

var controller = function () {

	if(location.hash === ''){
      window.location.hash = "Houston, TX"
	}

	else {
      console.log("controller working")
      var newQuery = location.hash.substring(1)
        city.innerHTML = newQuery[0].toUpperCase() + newQuery.substring(1);
        var geoLocationApiKey = 'AIzaSyDoPQ0h-D869qcL-uF6rJBG21cgTfKVy8k'
        var geoLocator = 'https://maps.googleapis.com/maps/api/geocode/json?address='
        var getLocation = $.getJSON(geoLocator + newQuery)
        function showLocation (jsonData) {
            var location = (jsonData.results[0].geometry.location)
            var queryLat = location.lat
            var queryLng = location.lng
            console.log("Longitude: " + queryLng)
            console.log("Lat: " + queryLat)
            var fullUrl = $.getJSON(baseUrl+'/'+queryLat+','+queryLng+ '?callback=?')
            fullUrl.then(showWeather)
        }
        getLocation.then(showLocation)
	}
}

var changeView = function(event) {
}


window.addEventListener("hashchange", controller)


controller()
