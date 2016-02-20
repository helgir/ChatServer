module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            files: [
                '**/*.js',
                '!node_modules/**/*.js',
                '!server/node_modules/**/*.js',
                '!client/bower_components/**/*.js'
            ],
            options: {
                curly: true,
                immed: true,
                newcap: true,
                noarg: true,
                sub: true,
                boss: true,
                eqnull: true,
                node: true,
                undef: true,
                globals: {
                    io: false,
                    alertify: false,
                    angular: false,
                    jQuery: false,
                    prompt: false,
                    moment: false,
                    $: false
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        },
        jsbeautifier: {
            files: [
                '**/*.js',
                '**/*.css',
                '**/*.html',
                '!node_modules/**/*',
                '!server/node_modules/**/*',
                '!client/bower_components/**/*'
            ],
            options: {
                preserveNewlines: false
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint']);
    grunt.loadNpmTasks("grunt-jsbeautifier");

};
