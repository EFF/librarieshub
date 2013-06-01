module.exports = (grunt) ->
    grunt.initConfig(
        'jasmine-node':
            options:
                coffee: true
                verbose: true
            run:
                spec: 'test'
    )

    grunt.loadNpmTasks 'grunt-contrib-jasmine-node'

    grunt.registerTask 'default', ['jasmine-node']
