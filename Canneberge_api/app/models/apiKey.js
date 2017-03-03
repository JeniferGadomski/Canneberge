
var apiKey = {};

apiKey.getApiFromReq = function(req) {
    console.log(req.query);
    return req.body.apiKey || req.query.apiKey || req.headers['x-access-token'];
};

module.exports = apiKey;