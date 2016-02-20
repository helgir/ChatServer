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
        concat: {
          options: {
            // define a string to put between each file in the concatenated output
            separator: ';'
          },
          dist: {
            // the files to concatenate
            src: ['client/js/*.js'],
            // the location of the resulting JS file
            dest: 'client/built/concat.js',
          },
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
    grunt.loadNpmTasks("grunt-contrib-concat");

};
