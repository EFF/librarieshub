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

    //error handling omitted
    pg.connect(conString, function(err, client) {
      var sql = "select * from documents d, authors a where (to_tsvector(isbn) || d.title_tsv || d.subject_tsv) @@ plainto_tsquery($1) and a.id = d.author_id";
      var params = [search.s];
      
      client.query(sql, params, function(err, result) {
        console.log("Row count: %d",result.rows.length);
        
        for(var i=0; i < result.rows.length ; i++){
          var book = new self.Book(result.rows[i].isbn, self.name+':'+result.rows[i].isbn);
          book.title = result.rows[i].title;
          book.year = (result.rows[i].years != null) ? result.rows[i].years : "";
          book.author = (result.rows[i].author != null) ? result.rows[i].author : "";
          book.locations = [
          {
            type: 'library',
            name: 'St-Albert',
            price: 0,
            distance: 5.7
          }
          ];
          
          self.api.addBook(book);
          search.addBook(book);
        }
        search.end();
      });
    });
  }
};



module.exports = Postgres;
