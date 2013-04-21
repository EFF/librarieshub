require('coffee-script');
var path = require('path');
var express = require('express');
var stylus = require('stylus');
var nib = require('nib');
var searchInteractor = require('./interactors/search');
var app = express();

var compileStylus = function(str, path){
    return stylus(str)
        .set('filename', path)
        .set('compress', true)
        .use(nib())
        .import('nib');
};

app.configure(function(){
    app.disable('x-powered-by');
    app.set('view engine', 'jade');
    app.set('views', __dirname + '/views');
    app.use(app.router);
    app.use(stylus.middleware({src: path.join(__dirname, '../public'), compile: compileStylus}));
    app.use(express.static(path.join(__dirname, '../public')));
});

app.get('/', function(req, res){
    res.render('index');
});

app.get('/api/search', function(req, res){
    searchInteractor.search(req.query.q, function(err, results){
        if(err){
            res.json(err);
        }
        else{
            res.json({books: results});
        }
    });
});

app.listen(process.env.PORT || 3000);
