module.exports = function(app, express, i18n){
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
};