var gulp   = require('gulp'),
    concat = require('gulp-concat');

gulp.task('release', function() {
    gulp.src('./src/*.js')
        .pipe(concat('spreaker.js'))
        .pipe(gulp.dest('./lib/'));
});
