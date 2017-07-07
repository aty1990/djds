var gulp = require('gulp');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sh = require('shelljs');
/*var sprity = require('sprity');*/
var replace = require('gulp-replace');
var babel = require('gulp-babel');

var paths = {
  sass: ['./scss/**/*.scss'],
  js: ['./www/js/common/config.js', './www/js/**/*.js',
    '!./www/js/app.js', '!./www/js/app.min.js']
};

gulp.task('default', ['sass', 'js', 'watch']);

gulp.task('sass', function (done) {
  gulp.src('./scss/ionic.app.scss')
      .pipe(sass())
      .on('error', sass.logError)
      .pipe(gulp.dest('./www/css/'))
      .pipe(minifyCss({
        keepSpecialComments: 0
      }))
      .pipe(rename({extname: '.min.css'}))
      .pipe(gulp.dest('./www/css/'))
      .on('end', done);
});

gulp.task('js', function (done) {
  gulp.src(paths.js)
      .pipe(concat('app.js'))
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(gulp.dest('./www/js'))
      .pipe(uglify())
      .pipe(rename({extname: '.min.js'}))
      .pipe(gulp.dest('./www/js'))
      .on('end', done);
});

gulp.task('watch', function () {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['js'])
});

/*gulp.task('sprity', function () {
  return sprity.src({
    src: ['www/img/dj-icon/*.png'],
    cssPath: '../img/',
    style: '_sprite.scss',
    name: 'sprite',
    prefix: 'dj-icon',
    processor: 'sass',
    template: 'sprity.hbs',
    dimension: [{
      ratio: 1, dpi: 72
    }, {
      ratio: 2, dpi: 192
    }]
  }).pipe(gulpif('*.png', gulp.dest('www/img/'), gulp.dest('scss/common/')));
});
*/
gulp.task('install', ['git-check'], function () {
  return bower.commands.install()
      .on('log', function (data) {
        gutil.log('bower', gutil.colors.cyan(data.id), data.message);
      });
});

gulp.task('git-check', function (done) {
  if (!sh.which('git')) {
    console.log(
        '  ' + gutil.colors.red('Git is not installed.'),
        '\n  Git, the version control system, is required to download Ionic.',
        '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
        '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('test-server', function () {
  var urlReg1 = /http:\/\/.*com/g;

  gulp.src(['www/js/Constant.js'])
      .pipe(replace(urlReg1, 'http://jwindex.hngangxin.com'))
      .pipe(gulp.dest('www/js/'));
});

gulp.task('uat-server', function () {
  var urlReg1 = /http:\/\/.*com/g;

  gulp.src(['www/js/Constant.js'])
      .pipe(replace(urlReg1, 'http://jwuat.hngangxin.com'))
      .pipe(gulp.dest('www/js/'));
});
