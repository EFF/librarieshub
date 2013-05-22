fs = require 'fs'
path = require 'path'

class StubResponses
    get: (filename) ->
        filePath = path.resolve(__dirname, filename + ".json")
        file = fs.readFileSync(filePath)
        return JSON.parse(file)
    
module.exports = new StubResponses()
