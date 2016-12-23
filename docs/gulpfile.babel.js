import gulp from 'gulp';
import fileinclude from 'gulp-file-include';
import clean from 'gulp-clean';
import rename from 'gulp-rename';
import minifyCss from 'gulp-minify-css';
import pkg from './package.json';

const paths = {
    src: './_src',
    dest: '.',
};
/*
 * html
 */
gulp.task('clean_html', ()=> {
    return gulp.src('pages')
        .pipe(clean({force: true}));
});

gulp.task('html', ['clean_html'], ()=> {
    gulp.src([`${paths.src}/pages/*.html`])
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
        .pipe(gulp.dest(`${paths.dest}/pages/`));
});

/*
 * css
 */
gulp.task('clean_css', ()=> {
    return gulp.src(`${paths.dest}/css`)
        .pipe(clean({force: true}));
});

gulp.task('css', ['clean_css'], ()=> {
    gulp.src(`${paths.src}/css/docs.css`)
        .pipe(rename({suffix: '.min'}))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest(`${paths.dest}/css/`));
});

/*
 * 文件自动监听
 */
gulp.task('watch', ['default'], ()=> {
    // 监听html模板
    gulp.watch([`${paths.src}/pages/**/*.html`], ['html'])
        .on('change', function (event) {
            console.log('html模板文件改变！');
        });

    // 监听css文件
    gulp.watch([`${paths.src}/css/**/*.css`], ['css'])
        .on('change', (event)=> {
            console.log('css文件改变！');
        });
});

gulp.task('default', ['html', 'css'], ()=> {
    console.log('build done!');
});