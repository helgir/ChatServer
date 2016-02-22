var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    beautify = require('gulp-jsbeautifier');

gulp.task('build', function () {
   return gulp.src('client/js/**/*.js')
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
	.pipe(uglify())
	.pipe(concat('all.min.js'))
	.pipe(gulp.dest('client/build'));
});

gulp.task('beautify', function() {
  return gulp.src(['client/js/**/*.js'])
    .pipe(beautify({indentSize: 4}))
    .pipe(gulp.dest('client/js/'))
});

gulp.task('default', ['beautify', 'build']);
