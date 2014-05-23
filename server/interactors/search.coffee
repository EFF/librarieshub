async = require 'async'
xtend = require 'xtend'
openifyItConnector = require '../connectors/openify'
amazonProductConnector = require '../connectors/amazon_product'
isbnExtractor = require '../util/isbn_extractor'

class SearchInteractor

    search: (options, callback) =>
        # TODO: Use Amazon Product API to display books not in library
        async.waterfall [
            @_searchDataset.bind @, options
            @_getProductsDetails
        ], callback

    _searchDataset: (options, callback) =>
        openifyItConnector.search options, (err, results) ->
            if err
                callback err
            else if not results.body or not results.body.hits or not results.body.hits.hits
                callback "Erreur lors du traitement de la requête."
            else
                callback null, results.body.hits.hits

    _getProductsDetails: (books, callback) =>
        async.each books, @_getProductDetails, (err) ->
            # We don't care if we got an error b/c this is just
            # to complement the information about a book
            callback null, books

    _getProductDetails: (book, callback) =>
        if book._source.isbn
            isbn = isbnExtractor.extract(book._source.isbn)
            if isbn
                book._source.isbn = isbn
                amazonProductConnector.lookupByISBN(
                    isbn
                    @_complementProductDetails.bind(@, book, callback)
                )
            else
                callback null
        else
            callback null

    _complementProductDetails: (book, callback, err, data) ->
        if not err
            book._source = xtend book._source, data

        callback null

module.exports = new SearchInteractor()
