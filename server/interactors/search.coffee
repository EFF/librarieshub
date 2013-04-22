async = require 'async'
openifyItConnector = require '../connectors/openify'
class SearchInteractor
    constructor: ()->

    search: (options, callback) =>
        functions = [
            openifyItConnector.search.bind openifyItConnector, options
        ]
        async.parallel functions, @_mergeResults.bind(@, callback)
    
    _mergeResults: (callback, err, results) =>
        callback null, results[0].data

module.exports = new SearchInteractor()
