
var finder = function(Search){
    this.Search = Search;
    this.books = {};
    this.connectors = [];
};

finder.prototype = {
    search: function(s, callback){
            var i;
            s.api = this;
            s.callback(this.connectors.length, callback);
            for(i in this.connectors)
            {
                this.connectors[i].search(s);
            }
        },
        
    get: function(isbn, callback){
            if(typeof this.books[isbn] == 'undefined')
            {
                var oSearch = new this.Search(isbn);
                this.search(oSearch, function(err)
                {
                    var books = oSearch.list();
                    callback(err, books[0]);
                });
            }
            else
                callback(false, this.books[isbn]);
        },
        
    addBook: function(book){
        if(!(this.books[book.isbn] instanceof finder.Book))
        {
            this.books[book.isbn] = book;
        }
        else
        {
          this.books[book.isbn].merge(book);
        }
    },
    addConnector: function(connector){
      var oConnect = new connector(this, finder.Book);
      this.connectors.push(oConnect);
    }
    
};


finder.Book = function(isbn, src)
{
    this.isbn = isbn;
    Object.defineProperty(this, 'source', {value : src, enumerable:false });
    this.sources = [src];
    this.locations = [];
    //Object.defineProperty(this, 'refCpt', {value : 0, enumerable:false });
};

finder.Book.prototype = {
  merge:  function(book)
  {
    // don't merge the same book multiple times
    if(!(book instanceof finder.Book) || this.sources.indexOf(book.source) != -1)
      return;
    
    this.sources.push(book.source);
    var i;
    for(i in book)
    {
      if(i == 'locations')
      {
        this.locations = this.locations.concat(book.locations);
      }
      else if(typeof this[i] == 'undefined')
        this[i] = book[i];
    }
  }
};

module.exports = finder;






