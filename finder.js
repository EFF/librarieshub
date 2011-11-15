
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
        if(typeof this.books[book.isbn] != 'Book')
        {
            this.books[book.isbn] = book;
        }
        else
        {
            var i;
            for(i in book)
            {
                if(i == 'locations')
                {
                    this.books[book.isbn][i] = this.books[book.isbn][i].concat(book[i]);
                }
                else if(typeof this.books[book.isbn][i] == 'undefined')
                    this.books[book.isbn][i] = book[i];
            }
        }
    },
    addConnector: function(connector){
      var oConnect = new connector(this, finder.Book);
      console.log(' >> init connector '.red+oConnect.name);
      console.dir(finder.Book);
      this.connectors.push(oConnect);
    }
    
};


finder.Book = function(isbn, title)
{
    this.isbn = isbn;
    this.title = title;
    this.locations = [];
    //Object.defineProperty(this, 'refCpt', {value : 0, enumerable:false });
};

module.exports = finder;






