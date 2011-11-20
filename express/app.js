
var express = require('express');
var app = express.createServer();

i18n = require("i18n");

// register helpers for use in templates
app.helpers({
  __: i18n.__
});

// or even a global for use in your app.js
var __= i18n.__;

i18n.configure({
    // setup some locales - other locales default to en silently
    locales:['en', 'fr']
});

i18n.setLocale('fr');

app.set('view engine', 'ejs');
app.use("/stylesheets", express.static(__dirname + '/public/stylesheets'));
app.use("/images", express.static(__dirname + '/public/images'));
app.use("/javascripts", express.static(__dirname + '/public/javascripts'));
//app.use("/javascripts/libs", express.static(__dirname + '/public/javascripts/libs'));

app.configure(function(){
  app.register('.html', require('ejs'));
});


app.get('/', function(req, res){
  res.render('index.html', {
    title : __("Hello")
  });
});

app.get('/api/search', function(req, res){
  if(!req.query["s"]){
    res.send(new Error('Parameter s must be set'));
  }
  else{
    res.send('api' + req.query["s"])
  }
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
