var gulp   = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    gzip   = require('gulp-gzip');

gulp.task('release', function() {
    gulp.src('./src/*.js')
        .pipe(concat('spreaker.js'))
        .pipe(uglify())
        .pipe(gzip())
        .pipe(gulp.dest('./lib/'));
});
