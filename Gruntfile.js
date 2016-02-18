module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            files: [
                '**.js',
                '**.css',
                '**.html',
                '!node_modules/**',
                '!server/node_modules/**',
                '!client/bower_component/**'
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
                    angular: false,
                    jQuery: false,
                    $: false,
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        },
        jsbeautifier: {
            files: ['**.js', '!node_modules/**', '!client/bower_component/**', "!server/node_modules/**"],
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
