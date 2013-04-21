Book = require '../book'

class OpenifyItConnector
    constructor: () ->
        console.log 'OpenifyItConnector:constructor'

    search: (query, callback) =>
        books = new Array()
        books.push new Book('Clean Code')
        callback null, books

module.exports = new OpenifyItConnector()
