var Search  = require('../search.js');

module.exports = function(app, i18n){
  app.get('/', function(req, res){
    //TODO verifier si une valeur de lang est dans le cookie
    res.redirect('/fr');
  });

  app.get('/fr', function(req, res){
    i18n.setLocale('fr');
    res.render('index.html', {
      title : i18n.__("Hello")
    });
  });

  app.get('/en', function(req, res){
    i18n.setLocale('en');
    res.render('index.html', {
      title : i18n.__("Hello")
    });
  });
  
  //Routing API
  app.get('/api/search', function(req, res){
    if(!req.query["s"]){
      res.send(new Error('Parameter s must be set'));
    }
    else{
      var oSearch = new Search(req.query["s"]);
      return app.api.search(oSearch, function(err)
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
      return app.api.get(req.query["isbn"], function(err, book){
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
};