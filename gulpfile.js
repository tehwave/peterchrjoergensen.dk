var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    rename      = require('gulp-rename'),
    sourcemaps  = require('gulp-sourcemaps');

var sassPath    = 'resources/sass/*.scss',
    cssPath     = 'resources/css';

gulp.task('styles', function(){
    gulp.src(sassPath)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(cssPath));
});

gulp.task('watch', function() {
    gulp.watch(sassPath, ['styles']);
});

gulp.task('default', function() {
    gulp.start('styles');
});


