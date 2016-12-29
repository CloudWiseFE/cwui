var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minifyJs = require('gulp-uglify');
var clean = require('gulp-clean');
gulp.task('clean_script', function () {
    return gulp.src('./dist/js')
        .pipe(clean({force: true}));
});
//压缩依赖javascript
gulp.task('lib_js',['clean_script'], function () {
    return gulp.src('./src/js/**/*.js')
        .pipe(concat('cw.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifyJs())
        .pipe(gulp.dest('./dist/js'));
});
