var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    beautify = require('gulp-jsbeautifier');

gulp.task('build', function () {
   return gulp.src(['client/js/*.js'])
	.pipe(jshint({ 
            curly:  true,
            immed:  true,
            newcap: true,
            noarg:  true,
            sub:    true,
            boss:   true,
            eqnull: true,
            node:   true,
            undef:  true,
            eqeqeq: true,
            predef: [
                'angular',
                'io',
                '$',
                'alertify',
                'moment'
            ],
            globals: [
                '_',
                'jQuery',
                'moment',
                'angular',
                'console',
                '$',
                'io'
            ]
        }))
	.pipe(jshint.reporter('default'))
	.pipe(beautify({mode: 'VERIFY_AND_WRITE', logSuccess: true, indentSize: 4}))
	.pipe(concat('all.min.js', {newLine: ';'}))
	.pipe(uglify())
	.pipe(gulp.dest('client/build'));
});

gulp.task('default', function () {
	return gulp.src('client/js/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter('default'))
});

gulp.task('beautify', function() {
  gulp.src(['!node_modules/**/*'], ['!server/node_modules/**/*'], ['!client/bower_components/**/*'], ['**/*.js'])
    .pipe(beautify({indentSize: 4}))
});