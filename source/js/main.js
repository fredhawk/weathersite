$(document).ready(function() {
  getLocation();  
  function getLocation() {
    $.get('http://freegeoip.net/json/?callback=?', function (location) {
      getWeather(location);
      console.log(location);
      
      $('.city').append('The weather in ' + location.city + ", " + location.country_name);
      
      var unit = getUnit(location.country_code);
      getWeather(location.latitude, location.longitude, unit);
    }, "jsonp");
  }
  
  function getWeather(latitude, longitude, unit) {
    var lat = latitude;
    var long = longitude;
    console.log(lat + ", " + long);
    
    var weatherApiUrl = 
    'http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+long+'&units='+unit+'&appid=92a0005dc260689c48f556405c2a3047';
  
    $.get(weatherApiUrl, function(weather) {
      var temperature = weather.main.temp;
      var unitLabel;
      console.log(weather);
      
      //Change label based on if the country uses metric or imperial system
      if (unit === "imperial") {
        unitLabel = "F";
      } else {
        unitLabel = "C";
      }
      temperature = parseFloat((temperature).toFixed(2));
      
      console.log(temperature);
      $('.degrees').append(temperature + " &deg;" + unitLabel);
      if (unitLabel === "C") {
        $('.celfahr').text("Change to Fahrenheit");
      } else {
        $('.celfahr').text("Change to Celcius");
      }
      
      $('.celfahr').on('click', function() {
        if (unitLabel == "C") {
          var fahrenheit = (temperature * 9 / 5 + 32).toFixed(2); 
          unitLabel = "F"; 
          $(".degrees").text(fahrenheit).append(" &deg;" + unitLabel);
          $('.celfahr').text("Change to Celcius");
          temperature = fahrenheit;
        } else {
          var celsius = ((temperature - 32) * 5 / 9).toFixed(2);
          unitLabel = "C"
          $(".degrees").text(celsius).append(" &deg;" + unitLabel);
          $('.celfahr').text("Change to Fahrenheit");
          temperature = celsius;
        }
      });
      
    }, "jsonp");
  
  }
  function getUnit(country) {
    var imperialCountries = ['US', 'BS', 'BZ', 'KY', 'PW'];

    if (imperialCountries.indexOf(country) === -1) {
      var unit = 'metric';
    } else {
      unit = 'imperial';
    }

    //console.log(country, unit);
    return unit;
  }
  

});