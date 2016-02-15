$(document).ready(function() {
  // Call getLocation function
  getLocation();

  function getLocation() {
    // Get clients longitude and latitude through freegeoip.net
    $.ajax({
      url: 'http://freegeoip.net/json/?callback=?',
      data: {
        format: 'json'
      },
      dataType: 'json',
      success:  function(location) {
        
        // Set the headline and add it to the DOM with the City, Country names.
        $('.city').append('The weather in ' + location.city + ", " + location.country_name);
        // Check for unit, Celsius or Fahrenheit based on country.
        var unit = getUnit(location.country_code);
        
        // Send longitude and latitude and the unit to the getWeather function
        getWeather(location.latitude, location.longitude, unit);
      }
    });
  }

  function getWeather(latitude, longitude, unit) {
    // Assign long and lat and weatherAPI url
    var lat = latitude;
    var long = longitude;
    var weatherApiUrl =
      'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&units=' + unit + '&appid=92a0005dc260689c48f556405c2a3047';

    // Get the weather at the longitude and latitude from the weater API
    $.ajax({
      url: weatherApiUrl,
      data: {
        format: 'json'
      },
      dataType: 'json',
      success: function(weather) {
        // Assign temperature and declare unitLabel
        var temperature = weather.main.temp;
        var unitLabel;

        //Change label based on if the country uses metric or imperial system
        if (unit === "imperial") {
          unitLabel = "F";
        } else {
          unitLabel = "C";
        }
        // Make temperature a decimal number with 2 decimals
        temperature = parseFloat((temperature).toFixed(2));
        
        // Add the temperature and the unitlabel to the dom based on if its
        // celsius or fahrenheit and change the button text accordingly
        $('.degrees').append(temperature + " &deg;" + unitLabel);
        if (unitLabel === "C") {
          $('.celfahr').text("Change to Fahrenheit");
        } else {
          $('.celfahr').text("Change to Celcius");
        }
        
        // When pressing the change to ... button do some math and change the text
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
        
        // Get the weatherIcon and the weathercondition
        var openWeatherLink = 'http://openweathermap.org/img/w/';
        var weatherIcon = weather.weather[0].icon;
        var weatherCondition = weather.weather[0].description;
        
        // Add icon and condition to DOM
        $('#weather_icon').attr('src', openWeatherLink + weatherIcon + ".png");
        $('.weather').text(weatherCondition);
      }
    });

  }
  // Unit function to see if the country uses metric (celsius)
  // or imperial (fahrenheit) system
  function getUnit(country) {
    var imperialCountries = ['US', 'BS', 'BZ', 'KY', 'PW'];

    if (imperialCountries.indexOf(country) === -1) {
      var unit = 'metric';
    } else {
      unit = 'imperial';
    }

    return unit;
  }
});