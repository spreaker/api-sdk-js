var gulp   = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

gulp.task('release', function() {
    gulp.src('./src/*.js')
        .pipe(concat('spreaker.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./lib/'));
});
