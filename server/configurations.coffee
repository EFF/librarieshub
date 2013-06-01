stylus = require 'stylus'
path = require 'path'
nib = require 'nib'

module.exports = (app, express) ->

    compileStylus = (str, path) ->
        return stylus(str)
            .set('filename', path)
            .set('compress', true)
            .use(nib())
            .import('nib')
    
    app.configure () ->

        publicDirectory = path.join __dirname, '../public'
        app.locals.isDev = (app.settings.env == "development")

        app.set 'views', __dirname + '/views'
        app.set 'view engine', 'jade'

        app.disable 'x-powered-by'
        
        app.use express.favicon("#{publicDirectory}/images/favicon32.png")
        app.use express.bodyParser()
        app.use express.methodOverride()
        app.use app.router
        app.use stylus.middleware(
            src : publicDirectory
            compile : compileStylus
        )
        app.use express.static(publicDirectory)

    app.configure 'development', () ->
        app.use express.logger('dev')
        app.use express.errorHandler(
            dumpExceptions: true
            showStack: true
        )
        closureDirectory = path.join __dirname,
            '../vendors/closure-library/closure/goog'
        app.use('/closure', express.static(closureDirectory))
