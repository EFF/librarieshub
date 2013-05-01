express = require 'express'
searchInteractor = require './interactors/search'

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

app.listen process.env.PORT || 3000
