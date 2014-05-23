module.exports = (grunt) ->
    grunt.initConfig(
        jasmine_node:
            options:
                coffee: true
                verbose: true
            run:
                spec: 'test'
            executable: './node_modules/.bin/jasmine-node'
        coffeelint:
            app: ['server/**/*.coffee']
            tests: ['test/server/**/*.coffee']
            options:
                indentation:
                    value: 4
                max_line_length:
                    value: 120
    )

    grunt.loadNpmTasks 'grunt-jasmine-node'
    grunt.loadNpmTasks 'grunt-coffeelint'

    grunt.registerTask 'default', ['coffeelint', 'jasmine_node']
