var gulp = require('gulp');
var fileinclude = require('gulp-file-include');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var minifyCss = require('gulp-minify-css');

var pkg = require('./package.json');

/*
 * html
 */
gulp.task('clean_html', function () {
    return gulp.src('pages')
        .pipe(clean({force: true}));
});

gulp.task('html', ['clean_html'], function () {
    gulp.src(['_src/pages/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            context: {
                main_title: pkg.name,
                main_keywords: pkg.keywords.join(','),
                main_description: pkg.description,
                main_author: pkg.author,
                page: null
            }
        }))
        .pipe(gulp.dest('pages/'));
});

/*
 * css
 */
gulp.task('clean_css', function () {
    return gulp.src('css')
        .pipe(clean({force: true}));
});

gulp.task('css', ['clean_css'], function () {
    gulp.src('_src/css/docs.css')
        .pipe(rename({suffix: '.min'}))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest("css/"));
});

/*
 * 文件自动监听
 */
gulp.task('watch', ['default'], function () {
    // 监听html模板
    gulp.watch(['_src/pages/**/*.html'], ['html'])
        .on('change', function (event) {
            console.log('html模板文件改变！');
        });

    // 监听css文件
    gulp.watch(['_src/css/**/*.css'], ['css'])
        .on('change', function (event) {
            console.log('css文件改变！');
        });
});

gulp.task('default', ['html', 'css'], function () {
    console.log('build done!');
})
;