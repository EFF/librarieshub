var request = require('request');

module.exports = {
    search: function(query, callback){
        var options = {
            url: 'http://localhost:3000/quebec-city/libraries-catalog',
            qs: query,
            json: true
        };

        request(options, callback);
    }
};
