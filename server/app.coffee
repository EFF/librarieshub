express = require 'express'
searchInteractor = require './interactors/search'
amazonProductConnector = require './connectors/amazon_product'

app = express()
require('./configurations') app, express

app.get '/', (req, res) ->
    res.render 'index'

app.get '/partials/:name', (req, res) ->
    res.render 'partials/' + req.params.name.replace('.html', '.jade')

app.get '/api/search', (req, res) ->
    searchInteractor.search req.query, (err, results) ->
        if err
            res.json err
        else
            res.json {books: results}

app.get '/api/amazon/:isbn', (req, res) ->
    amazonProductConnector.lookupByISBN req.params.isbn, (err, results) -> 
        if err
            res.json err
        else if results.ItemLookupResponse.Items[0].Item
            res.json results.ItemLookupResponse.Items[0].Item
        else
            res.json {"err": "NOT_FOUND"}

app.listen process.env.PORT || 3000
