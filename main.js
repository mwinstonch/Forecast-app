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
                   <img  src="images/' + currentTemp.icon + '.png" class="description">\
                   <h2 class="smt">' + currentTemp.summary + '</h2></div>'

    weatherInfo.innerHTML = htmlString
}

var today = new ViewConstructor(weatherInfo, todayView)
var weekly = new ViewConstructor(weatherInfo, weeklyView)
var hourly = new ViewConstructor(weatherInfo, hourly)

var controller = function () {
	if(location.hash === '#weekly'){

		weekly.getLocation()
	}

	else {
		today.getLocation()

	}
}

var changeView = function(event) {
        var buttonEl = event.target
        location.hash = buttonEl.value
        console.log(location.hash)
}


window.addEventListener("hashchange", controller)

todayDisplay.addEventListener("click", changeView)
weeklyDisplay.addEventListener("click", changeView)

controller()
