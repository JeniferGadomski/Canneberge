/**
 * Created by bhacaz on 08/03/17.
 */
var request = require('request');
var apiKey = require('../models/apiKey');

module.exports = function (req, res, next) {
    var tid = "UA-93251538-1";
    var url = "http://www.google-analytics.com/collect";
    var qs = {
        v : '1',
        tid : tid,
        t : 'pageview',
        dp : req.url,
        ua : req.headers['user-agent'],
        uid : apiKey.getApiFromReq(req),
        dt : 'api'
    };
    request.post({url : url, qs : qs }, function (err, res) {
        if(err) return console.log(err);
        // console.log(res);
    });
    next();
};



