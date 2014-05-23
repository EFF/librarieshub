Client = require('nodejs-api-client')

class OpenifyItConnector
    constructor: () ->
        host = process.env.API_HOST || 'api.openify.it'
        port = process.env.API_PORT || 80
        #@client = new Client(host, port, process.env.API_KEY, process.env.SECRET_KEY)

    search: (options, callback) =>
        params =
            json: true
            qs:
                q: options.q || ''
                limit: options.limit || 10
                offset: options.offset || 0
        @client.path 'GET', "/v0/datasets/#{process.env.DATASET_ID}/data", params, callback

module.exports = new OpenifyItConnector()
