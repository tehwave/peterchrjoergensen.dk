// Gulp
const gulp         = require('gulp'),
      rev          = require('gulp-rev'),
      sass         = require('gulp-sass'),
      rename       = require('gulp-rename'),
      postcss      = require('gulp-postcss'),
      autoprefixer = require('autoprefixer'),
      imagemin     = require('gulp-imagemin'),
      sourcemaps   = require('gulp-sourcemaps');


// Variables
const srcPath     = 'resources/src',
      imgPath     = 'resources/img',
      cssPath     = 'resources/css',
      sassPath    = 'resources/sass/*.scss';


// Tasks
gulp.task('stylesheets', function() {
    gulp.src(sassPath)
        .pipe(sourcemaps.init())
        .pipe(sass({
          outputStyle: 'compressed',
          includePaths: ['vendor/twbs/bootstrap/scss']
         }).on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(cssPath))
        .pipe(gulp.dest(srcPath + '/css/'));
});

gulp.task('images', function() {
    gulp.src(srcPath + '/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest(imgPath));
});

gulp.task('revision', function () {
  gulp.src(srcPath + '/css/**/*.css')
      .pipe(rev())
      .pipe(gulp.dest(cssPath))
      .pipe(rev.manifest())
      .pipe(gulp.dest('resources'));
});


// Scripts
gulp.task('watch', function() {
    gulp.watch(sassPath, ['stylesheets']);
    gulp.watch(srcPath, ['images']);
});

gulp.task('default', function() {
    gulp.start('stylesheets', 'images', 'revision');
});
