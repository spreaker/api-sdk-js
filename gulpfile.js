var gulp   = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    gzip   = require('gulp-gzip'),
    jshint = require('gulp-jshint');


gulp.task('lint', function() {
    gulp.src('./src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('release', function() {
    gulp.src('./src/*.js')
        // Break on lint errors
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'))

        // Concat + minify + gzip
        .pipe(concat('spreaker.js'))
        .pipe(uglify())
        .pipe(gzip())
        .pipe(gulp.dest('./lib/'));
});
