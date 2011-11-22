var Search = function(s)
{
    console.log('New search : %s'.cyan, s);
    this.s = s;
    this.books = [];
};

Search.prototype = {
    addBook: function(book)
    {
        if(this.books.indexOf(book.isbn) == -1)
            this.books.push(book.isbn);
    },
    list: function()
    {
        var i;
        var books = [];
        for(i = 0; i < this.books.length; i++)
        {
            books.push(this.api.books[this.books[i]]);
        }
        return books;
    },
    callback: function(n, callback)
    {
        this.callback = callback;
        this.nbConnector = n;
    },
    end: function()
    {
        this.nbConnector--;
        console.log('remaining search %s', this.nbConnector);

        	if(this.nbConnector == 0){
				this.callback();
			}
            
    }
    
};

module.exports = Search;
