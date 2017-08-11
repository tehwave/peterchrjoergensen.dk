const gulp         = require('gulp'),
      rev          = require('gulp-rev'),
      sass         = require('gulp-sass'),
      rename       = require('gulp-rename'),
      postcss      = require('gulp-postcss'),
      autoprefixer = require('autoprefixer'),
      imagemin     = require('gulp-imagemin'),
      sourcemaps   = require('gulp-sourcemaps');

const srcPath     = 'resources/src',
      imgPath     = 'resources/img',
      cssPath     = 'resources/css',
      sassPath    = 'resources/sass/*.scss';

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
        .pipe(gulp.dest(srcPath + '/css/'));
});

gulp.task('revision-stylesheets', function () {
  gulp.src(srcPath + '/css/*')
      .pipe(gulp.dest(cssPath))
      .pipe(rev())
      .pipe(gulp.dest(cssPath))
      .pipe(rev.manifest())
      .pipe(gulp.dest('resources'));
});

gulp.task('images', function() {
    gulp.src(srcPath + '/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest(srcPath))
});

gulp.task('revision-images', function () {
  gulp.src(srcPath + '/img/*')
      .pipe(gulp.dest(imgPath))
      .pipe(rev())
      .pipe(gulp.dest(imgPath))
      .pipe(rev.manifest())
      .pipe(gulp.dest('resources'));
});

/// Scripts

gulp.task('watch', function() {
    gulp.watch(sassPath, ['stylesheets']);
    gulp.watch(srcPath, ['images']);
});

gulp.task('default', function() {
    gulp.start('stylesheets', 'images', 'revision-stylesheets', 'revision-images');
});
