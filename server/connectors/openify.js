var util = require('util');
var request = require('request');

module.exports = {
    search: function (query, callback) {
        var url = util.format('%s/%s/%s/%s', process.env.API_HOST, process.env.API_VERSION, process.env.API_INDEX, process.env.API_TYPE);
        var options = {
            url: url,
            qs: query,
            json: true
        };

        request(options, callback);
    }
};
