"use strict";

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pngquant = require('imagemin-pngquant');
var del = require('del');
var reload = browserSync.reload;


// ===== Build folder delete ====== //
gulp.task('clean', function(cb) {
  return del('build', cb);
});


// ===== HTML ====== //
gulp.task('html', function() {
  return gulp.src('app/html/**/*.html')
  .pipe($.plumber({errorHandler: $.notify.onError('<%= error.message %>')}))
  .pipe(gulp.dest('build/'))
  .pipe(reload({stream: true}));
});


// ===== Sass compile  ====== //
gulp.task('sass', function() {
  return gulp.src('app/sass/**/*.scss')
  .pipe($.plumber({errorHandler: $.notify.onError('<%= error.message %>')}))
  .pipe($.sass())
  .pipe($.pleeease({
    autoprefixer: ['last 2 versions'],
    minifier: false
  }))
  .pipe($.concat('common.css'))
  .pipe(gulp.dest('build/css/'))
  .pipe(reload({stream: true}));
});


// ===== CSS Plugin concat  ====== //
gulp.task('cssLib', function() {
  return gulp.src('app/sass/lib/*.css')
  .pipe($.plumber())
  .pipe($.concat('lib.css'))
  .pipe(gulp.dest('build/css/'))
  .pipe(reload({stream: true}))
});


// ===== JavaScript optimaize  ====== //
gulp.task('js', function() {
  return gulp.src('app/js/*.js')
  .pipe($.plumber({errorHandler: $.notify.onError('<%= error.message %>')}))
  .pipe($.concat('common.js'))
  .pipe($.uglify())
  .pipe(gulp.dest('build/js/'))
  .pipe(reload({stream: true}));
});


// ===== JavaScript plugin concat  ====== //
gulp.task('jsLib', function() {
  return gulp.src('app/js/lib/*.js')
  .pipe($.concat('lib.js'))
  .pipe($.uglify())
  .pipe(gulp.dest('build/js/'))
  .pipe(reload({stream: true}));
});


// ===== Font Copy  ====== //
gulp.task('copyFont', function() {
  return gulp.src('app/fonts/*.*')
  .pipe(gulp.dest('build/fonts/'))
  .pipe(reload({stream: true}));
});


// ===== Image optimize ====== //
gulp.task('images', function() {
  return gulp.src(['app/images/*.*', 'app/images/*/*.*'])
  .pipe($.cache($.imagemin({
    progressive: true,
    interlaced: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  })))
  .pipe(gulp.dest('build/images/'))
  .pipe(reload({stream: true}));
});


// ===== Image cache clear ====== //
gulp.task('clear', function (done) {
  return $.cache.clearAll(done);
});


// ===== Local server ====== //
gulp.task('bs', function() {
  return browserSync.init(null, {
    server: {
      baseDir: 'build'
    },
    ghostMode: false,
    notify: false
  });
});


// ===== File watch ====== //
gulp.task('watch', function() {
  gulp.watch('app/html/**/*.html', ['html']);
  gulp.watch('app/sass/**/*.scss', ['sass']);
  gulp.watch('app/js/*.js', ['js']);
  gulp.watch('app/js/lib/*.js', ['lib']);
  gulp.watch('app/images/*', ['images']);
});


// ===== Default Build ====== //
gulp.task('default', function() {
  runSequence(['images', 'html', 'sass', 'cssLib', 'js', 'jsLib', 'copyFont'], 'bs', 'watch');
});

gulp.task('build', function() {
  runSequence('clean', 'clear', ['images', 'html', 'sass', 'cssLib', 'js', 'jsLib', 'copyFont'], 'bs', 'watch');
});
