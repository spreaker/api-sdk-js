var gulp   = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    gzip   = require('gulp-gzip'),
    jshint = require('gulp-jshint'),
    browserify = require('gulp-browserify');


gulp.task('lint', function() {
    gulp.src(['./src/*.js', './test/unit/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('package', function() {
    return gulp.src('./src/SDK.js')
        // Break on lint errors
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'))

        // Browserify
        .pipe(browserify({ debug: false }))

        // Concat + minify
        .pipe(concat('spreaker.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./lib/'));
});

gulp.task('gzip', ['package'], function() {
    return gulp.src('./lib/spreaker.js')
        .pipe(gzip())
        .pipe(gulp.dest('./lib/'));
});

gulp.task('release', ['package', 'gzip']);
