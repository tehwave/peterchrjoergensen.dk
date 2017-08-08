const gulp        = require('gulp'),
      sass        = require('gulp-sass'),
      rename      = require('gulp-rename'),
      imagemin    = require('gulp-imagemin'),
      sourcemaps  = require('gulp-sourcemaps');

const srcPath     = 'resources/src',
      imgPath     = 'resources/img',
      cssPath     = 'resources/css',
      sassPath    = 'resources/sass/*.scss';

gulp.task('stylesheets', function() {
    gulp.src(sassPath)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(cssPath));
});

gulp.task('images', function() {
    gulp.src(srcPath + '/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest(imgPath))
});

gulp.task('watch', function() {
    gulp.watch(sassPath, ['stylesheets']);
});

gulp.task('default', function() {
    gulp.start('stylesheets', 'images');
});
