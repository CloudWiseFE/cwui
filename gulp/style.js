var gulp = require('gulp');
var less = require('gulp-less');
var rename = require('gulp-rename');
var minifyCss = require('gulp-minify-css');
var clean = require('gulp-clean');
// 清空
gulp.task('clean_style', function () {
    return gulp.src('./dist/css')
        .pipe(clean({force: true}));
});

gulp.task('less', ['clean_style'], function () {
    return gulp.src('./src/css/cw.less')
        .pipe(less(/*{compress: true}*/))
        .pipe(gulp.dest('./dist/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('./dist/css/'));
});
