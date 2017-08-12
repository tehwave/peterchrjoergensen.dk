// Gulp
const gulp         = require('gulp'),
      del          = require('del'),
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
gulp.task('stylesheets:clean', function() {
  del([cssPath + '/**/*']);
});

gulp.task('stylesheets:process', function() {
  return gulp.src(sassPath)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['vendor/twbs/bootstrap/scss']
    }).on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(srcPath + '/sass/'))
    .pipe(gulp.dest(srcPath + '/css/'));
});

gulp.task('stylesheets:copy', function() {
  return gulp.src(srcPath + '/css/**/*')
    .pipe(gulp.dest(cssPath));
});

gulp.task('stylesheets:revision', function () {
  return gulp.src(srcPath + '/sass/*.css')
    .pipe(rev())
    .pipe(gulp.dest(cssPath))
    .pipe(rev.manifest())
    .pipe(gulp.dest('resources'));
});

gulp.task('images', function() {
  return gulp.src(srcPath + '/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest(imgPath));
});


// Scripts
gulp.task('default', function() {
    gulp.start('stylesheets:clean', ['stylesheets:copy', 'stylesheets:process', 'stylesheets:revision', 'images']);
});
