var settings = require(process.env.CONFIG_FILE).amazon;

if(settings.assocId == '')// don't load Amazon dependencies if no settings
{
  console.warn('Warning!'.red+' You must config the Amazon connector to use it.');
}
else
{
  var OperationHelper = require('apac').OperationHelper;
  var opHelper = new OperationHelper(settings);
  
  var Amazon = function(api, Book)
  {
      this.name = 'Amazon';
      this.api = api;
      this.Book = Book;
  };
  
  Amazon.prototype = {
      search: function(search)
      {
        var $this = this;
        console.log('Amazon search : '+search.s);
          opHelper.execute('ItemSearch', {
              'SearchIndex': 'Books',
              'Keywords': search.s,
              'ResponseGroup': 'ItemAttributes,Offers'
          }, function(error, results) {
              if(error)
              {
                console.log('Error : '.red+error);
                search.end();
              }
              else
              {
                if(results.Items.Request.IsValid == 'True' && results.Items.TotalResults > 0)
                {
                  var callback = function(item, index, array)
                  {
                    if(typeof item.ItemAttributes.EAN == 'undefined')
                      return;
                    var book = new $this.Book(item.ItemAttributes.EAN, $this.name+':'+item.ItemAttributes.EAN);
                    book.isbn = item.ItemAttributes.ISBN
                    book.title = item.ItemAttributes.Title;
                    book.author = item.ItemAttributes.Author;
                    book.year = (item.ItemAttributes.PublicationDate)?item.ItemAttributes.PublicationDate.substr(0,4):'';
                    book.publication = item.ItemAttributes.PublicationDate;
                    
                    //TODO mettre quelque chose d'autre
                    book.description = "N/D";
                    
                    book.locations = [{
                      type: 'webStore',
                      name: 'Amazon',
                      price: (item.ItemAttributes.ListPrice)?
                        {
                        amount: item.ItemAttributes.ListPrice.Amount,
                        currency: item.ItemAttributes.ListPrice.CurrencyCode
                        }:
                        {
                        amount: 0,
                        currency: 'CAD'
                        },
                      link: item.DetailPageURL}];
                    $this.api.addBook(book);
                    search.addBook(book);
                  };
                  
                  if(results.Items.TotalResults == 1)
                  {
                    callback(results.Items.Item, 0, []);
                  }
                  else
                    results.Items.Item.forEach(callback);
                }
                search.end();
              }
          });
      }
  };
  
  module.exports = Amazon;
}
