async = require 'async'
openifyItConnector = require '../connectors/openify'
class SearchInteractor
    constructor: ()->

    search: (query, callback) =>
        functions = [
            openifyItConnector.search.bind openifyItConnector, query
        ]
        async.parallel functions, @_mergeResults.bind(@, callback)
    
    _mergeResults: (callback, err, results) =>
        callback null, results[0]

module.exports = new SearchInteractor()
