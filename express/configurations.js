module.exports = function(app, express, i18n){
  i18n.configure({
    locales:['en', 'fr']
  });
  
  app.set('view engine', 'ejs');
  app.use("/stylesheets", express.static(__dirname + '/public/stylesheets'));
  app.use("/images", express.static(__dirname + '/public/images'));
  app.use("/javascripts", express.static(__dirname + '/public/javascripts'));
  
  app.configure(function(){
    console.log('Loading global configurations'.green);
    app.register('.html', require('ejs'));
  });

  app.configure('development', function(){
    console.log('Loading development configurations'.green);
    app.use(express.errorHandler({
      dumpExceptions: true, 
      showStack: true
    }));
  });

  app.configure('production', function(){
    console.log('Loading production configurations'.green);
    app.use(express.errorHandler({
      dumpExceptions: false, 
      showStack: false
    }));
  });
};