
// load first for a cute CLI :)
var color   = require('./libs/colors.js');

console.log('Starting %s Application on Node.js %s', 'Libraries Hub'.green.underline, process.version.green);



var express = require('express');
var app = express.createServer();

var lbl = 'Loading libs';
console.time(lbl);
var i18n    = require("i18n");
var path    = require('path');
var fs      = require('fs');
var finder  = require('./finder.js');
var Search  = require('./search.js');

var prod = (process.env.NODE_ENV == 'production');

//TODO intŽgrer les settings dans les configs de express
process.env.CONFIG_FILE = (prod)?path.join(__dirname, 'settings.prod.js'):path.join(__dirname, 'settings.js');

console.timeEnd(lbl);



var api = new finder(Search);
var connectors = fs.readdirSync(path.join(__dirname, 'connectors'));
var connector, i;

var c = 'Loading ALL connectors : '+'COMPLETED '.green;
console.time(c);
for(i in connectors)
{
  lbl = 'Loading connector '+connectors[i].magenta;
  console.time(lbl);
  connector = require(path.join(__dirname, 'connectors', connectors[i]));
  if(typeof connector == 'function')
  {
    api.addConnector(connector);
    console.timeEnd(lbl);
  }
  else
  {
    console.timeEnd(lbl);
    console.log('   ...   '+connectors[i].magenta+' connector '+'disabled!'.cyan);
  }
}
console.timeEnd(c);



// register helpers for use in templates
app.helpers({
  __: i18n.__
});

// or even a global for use in your app.js
var __= i18n.__;

require('./configurations.js')(app, express, i18n);
require('./routes.js')(app, express, i18n);





app.get('/api/search', function(req, res){
  if(!req.query["s"]){
    res.send(new Error('Parameter s must be set'));
  }
  else{
    var oSearch = new Search(req.query["s"]);
    return api.search(oSearch, function(err)
    {
      var list = oSearch.list();
      res.send(JSON.stringify({
        success: true, 
        total: list.length, 
        results: list
      }));
    });
  }
});

app.get('/api/get', function(req, res){
  if(!req.query["isbn"]){
    res.send(new Error('Parameter isbn must be set'));
  }
  else{
    return api.get(req.query["isbn"], function(err, book){
      if(err)
      {
        res.send(JSON.stringify({
          success: false, 
          msg: "Can't find book!"
        }));
      }
      else
      {
        res.send(JSON.stringify({
          success: true, 
          book: book
        }));
      }
    });
  }
});










app.listen(process.env.PORT);
console.log("Express server listening on port %s in %s mode".green, (app.address().port + "").underline, app.settings.env.underline);

process.on('exit', function () {
  console.log(' >>> Server shutting down... ');
});

setInterval(function(){
  console.log('heartbeat'.green);
}, 1000 * 60);