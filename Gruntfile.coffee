module.exports = (grunt) ->
    grunt.initConfig(
        'jasmine-node':
            options:
                coffee: true
                verbose: true
            run:
                spec: 'test'
        coffeelint:
            app: ['server/**/*.coffee']
            tests: ['test/server/**/*.coffee']
            options:
                indentation:
                    value: 4
                max_line_length:
                    value: 120
    )

    grunt.loadNpmTasks 'grunt-contrib-jasmine-node'
    grunt.loadNpmTasks 'grunt-coffeelint'

    grunt.registerTask 'default', ['coffeelint', 'jasmine-node']
