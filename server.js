/**
 * Author: @jeansebtr
 * Date: 12 november 2011
 */

// load first for a cute CLI :)
var color   = require('./libs/colors.js'); // colors.js alter global String class
console.log(' >>> '.green+'Starting '+'BookFinder-Api'.green.underline+' on '+'Nodejs'.green.bold+' '+process.version);

var prod = (process.env.NODE_ENV == 'production');

// load libs
var lbl = 'Loading libs';
console.time(lbl);
var http    = require('http'),
    url     = require('url'),
    querystring = require('querystring'),
    path    = require('path'),
    fs      = require('fs'),
    mime    = require('mime'),
    finder  = require('./finder.js'),
    Search  = require('./search.js'),
    Config  = require('./settings.js');
console.timeEnd(lbl);

var api = new finder(Search);
var connectors = fs.readdirSync(path.join(__dirname, 'connectors'));
var connector, i;
console.time('Loading ALL connectors : '+'COMPLETED '.green);
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
console.timeEnd('Loading ALL connectors : '+'COMPLETED '.green);


var headers = Config.headers;
headers['Content-Type'] = 'application/json';

var server = http.createServer(function(req, res){
    var u = url.parse(req.url);
    if(u.pathname.substr(0, 4) == '/api')
    {
        var err400 = function()
        {
            res.writeHead(400, headers);
            res.end(JSON.stringify({success: false, msg: 'Bad request format'}));
        };
        // serve api call
        if(typeof u.query == 'undefined') return err400();
        var query = querystring.parse(u.query);
        if(u.pathname.substr(5, 6) == 'search')
        {
            if(typeof query.s == 'undefined') return err400();
            var oSearch = new Search(query.s);
            return api.search(oSearch, function(err)
            {
                var list = oSearch.list();
                res.writeHead(200, headers);
                res.end(JSON.stringify({success: true, total: list.length, results: list}));
            });
        }
        else if(u.pathname.substr(5, 3) == 'get')
        {
            if(typeof query.isbn == 'undefined')
                return err400();
            return api.get(query.isbn, function(err, book){
                    if(err)
                    {
                        res.writeHead(404, headers);
                        res.end(JSON.stringify({success: false, msg: "Can't find book!"}));
                    }
                    else
                    {
                        res.writeHead(200, headers);
                        res.end(JSON.stringify({success: true, book: book}));
                    }
                });
        }
        else
        {
            return err400();
        }
    }
    
    // An API call would have returned here, serve static files
    if(u.pathname == '/')
        u.pathname = '/index.html';
    var file, f = path.join(__dirname, 'public/public', u.pathname);
    path.exists(f, function(exists){
        if(exists)
        {
            // serve static file
            res.writeHead(200, {'Content-Type': mime.lookup(f)});
            file = fs.createReadStream(f);
            file.pipe(res);
        }
        else
        {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('NOT FOUND !');
        }
    });
}).listen(process.env.PORT, function(){
    console.log('Starting Web server on port '+(process.env.PORT+'').cyan+' ... '+'DONE '.green);
  });

// Cloud9ide seem to crash with long running debug..
if(typeof process.env.C9_SELECTED_FILE != 'undefined')
  setTimeout(function(){ console.warn('WARNING! '.red+'Stoping server..'); process.exit(); }, 600000);

setInterval(function(){
  console.log(' ... '+'heartbeat'.green+' ... ');
  }, 600000);

process.on('exit', function () {
  console.log(' >>> Server shutting down... ');
});
