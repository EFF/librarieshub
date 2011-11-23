var pg       = require('pg');
var conString = require(process.env.CONFIG_FILE).pg.url;

var Postgres = function(api, Book) {
  this.name = 'Postgres';
  this.api = api;
  this.Book = Book;
};

Postgres.prototype = {
  search: function(search) {
    var self = this;


    this.cb = function(ids, books){
      
      pg.connect(conString, function(err,client){
        var sql = "select * from libraries l inner join libraries_documents ld on l.id = ld.library_id where ld.document_id in ("+ids.join()+")";
        client.query(sql, function(err, results){
          
          if(err){
            console.log("ERROR".red);
            console.dir(err);
          }
          else{
            for(book in books){
              for(var i=0; i < results.rows.length ; i++){
                if(books[book].id == results.rows[i].document_id){
                  books[book].locations.push({
                    type: 'library', 
                    name: results.rows[i].name,
                    distance: 5.7, 
                    price: 0
                  });
                }
              }
              self.api.addBook(books[book]);
              search.addBook(books[book]);
            }
          }
          search.end();
        });
        
      });
    }
    
    //error handling omitted
    pg.connect(conString, function(err, client) {
      var sql = "select * from documents d, authors a where (to_tsvector(isbn) || d.title_tsv || d.subject_tsv) @@ plainto_tsquery($1) and a.id = d.author_id";
      var params = [search.s];
      console.log('Postgres search : %s', search.s);
      
      client.query(sql, params, function(err, result) {
        console.log("Postgres row count: %d",result.rows.length);
        
        var ids = new Array();
        var books = new Array();
        for(var i=0; i < result.rows.length ; i++){
          var book = new self.Book(result.rows[i].ena, self.name+':'+result.rows[i].ena);
          
          ids.push(result.rows[i].id);
          book.id = result.rows[i].id;
          book.title = result.rows[i].title;
          book.year = (result.rows[i].years != null) ? result.rows[i].years : "";
          book.author = (result.rows[i].author != null) ? result.rows[i].author : "";
          book.locations = [];
          
          //TODO ne plus hardcoder cela lorsque nous aurons reglŽ le problme avec MTL
          book.locations.push({
            type: 'library', 
            name: "Inconnu",
            distance: 1000, 
            price: 0
          });
          
          books.push(book);
        }
        self.cb(ids, books);
      });
    });
  }
};



module.exports = Postgres;
