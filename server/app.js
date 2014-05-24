var express = require('express');
var searchInteractor = require('./interactors/search');

var app = express();

require('./configurations')(app, express);

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/partials/:name', function (req, res) {
    res.render('partials/' + req.params.name.replace('.html', '.jade'));
});

app.get('/api/search', function (req, res) {
    searchInteractor.search(req.query, function (err, results) {
        if (err) {
            res.json(err);
        } else {
            res.json({
                books: results
            });
        }
    });
});

app.listen(process.env.PORT || 3000);
