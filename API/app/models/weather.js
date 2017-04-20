/**
 * Created by bhacaz on 24/02/17.
 */
var request = require('request');
var config = require('../config/config');

var Weather = {};

Weather.getWeatherByLatLng = function (lat, lng, simple, next){
    if(lat === null || lng === null){return next({message : 'not lnt lng set'})}
    var coord = lat.toString() + "," + lng.toString();
    var weatherRequest = {};
    var weather = {};
    var weatherJsonUrl = "http://api.wunderground.com/api/" + config.wu_key +"/forecast/q/" + coord + ".json";
    weatherRequest.forecast = request.get(weatherJsonUrl, function(err, httpResponse, body){
        if(err){
            return console.error(err);
        }
        weather['forecast'] = JSON.parse(body).forecast;
        if(!weather.forecast) return next({success : false, message : 'Bad coordinates'});
        if(!simple){
            weatherJsonUrl = "http://api.wunderground.com/api/" + config.wu_key +"/conditions/q/" + coord + ".json";
            weatherRequest.conditions = request.get(weatherJsonUrl, function(err, httpResponse, body){
                if(err){
                    return console.error(err);
                }
                weather['current_observation'] = JSON.parse(body).current_observation;
                next(weather);
            });
        }
        else{
            var simpleForecast = [];
            weather.forecast.simpleforecast.forecastday.forEach(function (f) {
                simpleForecast.push({
                    yday : f.date.yday,
                    day : f.date.day,
                    month : f.date.month,
                    year : f.date.year,
                    tmp_high : f.high.celsius,
                    tmp_low : f.low.celsius,
                    pop : f.pop,
                    qpf_allday : f.qpf_allday.mm,
                    ave_wind_speed : f.avewind.kph,
                    ave_wind_dir : f.avewind.dir,
                    max_wind_speed : f.maxwind.kph,
                    max_wind_dir : f.maxwind.dir,
                    ave_humidity : f.avehumidity
                })
            });
            next(simpleForecast);
        }
    });
};

module.exports = Weather;