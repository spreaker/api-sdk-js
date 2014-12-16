var gulp   = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    gzip   = require('gulp-gzip'),
    jshint = require('gulp-jshint'),
    browserify = require('gulp-browserify');


gulp.task('lint', function() {
    return gulp.src(['./src/*.js', './test/unit/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('build', function() {
    return gulp.src('./src/SDK.js')
        .pipe(browserify({ debug: false }))
        .pipe(concat('spreaker.js'))
        .pipe(gulp.dest('./lib/'));
});

gulp.task('package', ['lint', 'build'], function() {
    return gulp.src('./lib/spreaker.js')
        .pipe(uglify())
        .pipe(gulp.dest('./lib/'));
});

gulp.task('gzip', ['package'], function() {
    return gulp.src('./lib/spreaker.js')
        .pipe(gzip())
        .pipe(gulp.dest('./lib/'));
});

gulp.task('release', ['lint', 'package', 'gzip']);
