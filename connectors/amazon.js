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
                if(results.Items.Request.IsValid == 'True' && results.Items.Item.length > 0)
                {
                  console.dir(results.Items.Item[0]);
                  /*var i, item = results.Items.Item;
                  for(i in item)
                  {
                    var book = new this.Book(item[i].ItemAttributes.EAN, item[i].ItemAttributes.EAN);
                    book.author = item[i].ItemAttributes.Author;
                    book.year = item[i].ItemAttributes.PublicationDate.substr(0,4);
                    book.publication = item[i].ItemAttributes.PublicationDate;
                    book.locations = [{
                      type: 'webStore',
                      name: 'Amazon',
                      price: {
                        amount: item[i].ItemAttributes.ListPrice.Amount,
                        currency: item[i].ItemAttributes.ListPrice.CurrencyCode
                        },
                      link: item[i].DetailPageURL}];
                  }*/
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