Book = require '../book'
Client = require('nodejs-api-client').OpenifyItClient

class OpenifyItConnector
    constructor: () ->
        @client = new Client('api-staging.openify.it', 80, process.env.API_KEY, process.env.SECRET_KEY)

    search: (options, callback) =>
        params = 
            q: options.q || ''
            limit: options.limit || 10
            offset: options.offset || 0
        @client.path 'GET', "/datasets/#{process.env.DATASET_ID}/search", params, {}, {}, callback

module.exports = new OpenifyItConnector()
