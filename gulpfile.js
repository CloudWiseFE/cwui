var gulp = require('gulp');
var requireDir = require('require-dir');

requireDir('gulp', {recurse: true});

gulp.task('default', [
    'less',
    'lib_js'
], function () {
    //gulp.run('watch');
    console.log('default task is end!');

});
gulp.task('watch', function () {
    gulp.watch('./src/css/**/*.{less,css}', ['less']);
});

