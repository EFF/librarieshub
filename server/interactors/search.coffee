async = require 'async'
openifyItConnector = require '../connectors/openify'
amazonProductConnector = require '../connectors/amazon_product'
isbnExtractor = require '../util/isbn_extractor'

class SearchInteractor

    search: (options, callback) =>
        # TODO: Idea: Use Amazon Product API to display other books too (not in library)
        async.waterfall [
            @_searchDataset.bind @, options
            @_getProductsDetails
        ], callback

    _searchDataset: (options, callback) =>
        openifyItConnector.search options, (err, results) ->
            callback err, results.data

    _getProductsDetails: (books, callback) =>
        async.each books, @_getProductDetails, (err) ->
            # We don't care if we got an error b/c this is just 
            # to complement the information about a book
            callback null, books

    _getProductDetails: (book, callback) =>
        if book._source.isbn
            isbn = isbnExtractor.extract(book._source.isbn)
            if isbn
                # TODO: Remove try catch
                try
                    amazonProductConnector.lookupByISBN isbn, @_complementProductDetails.bind(@, book, callback)
                catch err
                    callback null
            else
                callback null
        else
            callback null

    _complementProductDetails: (book, callback, err, data) ->
        if not err
            if data.ItemLookupResponse and data.ItemLookupResponse.Items and data.ItemLookupResponse.Items[0].Item
                item = data.ItemLookupResponse.Items[0].Item[0]

                if item.DetailPageURL
                    book._source.amazon_link = item.DetailPageURL[0]
                if item.ItemAttributes
                    attributes = item.ItemAttributes[0]
                    if attributes.Author
                        book._source.auteur = attributes.Author.join(', ')
                    if attributes.Publisher
                        book._source.editeur = attributes.Publisher.join(', ')
                    if attributes.Title
                        book._source.titre = attributes.Title.join(', ')
                if item.ImageSets and item.ImageSets[0].ImageSet and item.ImageSets[0].ImageSet[0].TinyImage and item.ImageSets[0].ImageSet[0].TinyImage[0].URL
                    book._source.thumbnail = item.ImageSets[0].ImageSet[0].TinyImage[0].URL[0]
        
        callback null

module.exports = new SearchInteractor()
