var settings = require('../settings.js').amazon;

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
                console.log('Error : '+error);
                search.end();
              }
              else
              {
                  console.dir(results.Items);
                if(results.Items.Request.IsValid == 'True' && results.Items.TotalResults > 0)
                {
                  console.dir(results.Items.Item);
                  
                  var callback = function(item, index, array)
                  {
                    var book = new $this.Book(item.ItemAttributes.EAN, $this.name+':'+item.ItemAttributes.EAN);
                    book.title = item.ItemAttributes.Title;
                    book.author = item.ItemAttributes.Author;
                    book.year = (item.ItemAttributes.PublicationDate)?item.ItemAttributes.PublicationDate.substr(0,4):'';
                    book.publication = item.ItemAttributes.PublicationDate;
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
                    console.log(' >>> find Amazon:'.green);
                    console.dir(book);
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
          /*
          // query == search.s
          var book = new this.Book('9782070612369', "Harry Potter a L'ecole des sorciers");
          book.author = "JOANNE KATHLEEN ROWLING";
          book.year = "2007";
          book.locations = [
                  {name: 'Amazon', price: 5.50, distance: 5.7}
              ];
          
          this.api.addBook(book);
          search.addBook(book);*/
      }
  };
  
  module.exports = Amazon;
}
