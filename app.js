
// load first for a cute CLI :)
var color   = require('./libs/colors.js');

console.log('Starting %s Application on Node.js %s', 'Libraries Hub'.green.underline, process.version.green);



var express = require('express');
var app = express.createServer();

// ----------------------------------------------------------------------------
//	Loading libraries
//-----------------------------------------------------------------------------

var lbl = 'Loading libs';
console.time(lbl);
var i18n    = require("i18n");
var path    = require('path');
var fs      = require('fs');
var finder  = require('./finder.js');
var Search  = require('./search.js');

console.timeEnd(lbl);

//Loading configurations
require('./configurations.js')(app, express, i18n);



// ----------------------------------------------------------------------------
//	Loading connectors
//-----------------------------------------------------------------------------


app.api = new finder(Search);
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
    app.api.addConnector(connector);
    console.timeEnd(lbl);
  }
  else
  {
    console.timeEnd(lbl);
    console.log('   ...   %s connector %s', connectors[i].magenta, ' disabled!'.cyan);
  }
}
console.timeEnd(c);

// ----------------------------------------------------------------------------
//	Routing
//-----------------------------------------------------------------------------
//Routing client
require('./routes/index.js')(app, i18n);



app.listen(process.env.PORT);
console.log("Express server listening on port %s in %s mode".green, (app.address().port + "").underline, app.settings.env.underline);


//Heartbeat
setInterval(function(){
  console.log('heartbeat'.green);
}, 1000 * 60);

