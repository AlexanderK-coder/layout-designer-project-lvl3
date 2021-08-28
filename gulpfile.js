const gulp = require('gulp'),
  browserSync = require('browser-sync').create(),
  pug = require('gulp-pug'),
  sass = require('gulp-sass')(require('sass'));

const app = 'app/',
  dist = 'build/';

const config = {
  app: {
    html: app + 'pug/*.pug',
    style: app + 'scss/**/*.*',
    js: app + 'js/**/*.*',
    Img: app + 'images/**/*.*',
  },
  dist: {
    html: dist,
    style: dist + 'css/',
    js: dist + 'js/',
    Img: dist + 'images/',
  },
  watch: {
    html: app + 'pug/*.pug',
    style: app + 'scss/**/*.*',
    js: app + 'js/**/*.*',
    Img: app + 'images/**/*.*',
  }
}

const webServer = () => {
  browserSync.init({
    server: {
      baseDir: dist
    },
    port: 3000,
    host: 'localhost',
    notify: false
  })
}

const pugTask = () => {
  return gulp.src(config.app.html)
    .pipe(pug())
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(config.dist.html))
    .pipe(browserSync.reload({ stream: true }))

}

const scssTask = () => {
  return gulp.src(config.app.style)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(config.dist.html))
    .pipe(browserSync.reload({ stream: true }))

}

const watchFiles = () => {
  gulp.watch([config.watch.html], gulp.series(pugTask))
  gulp.watch([config.watch.style], gulp.series(scssTask))
}

const start = gulp.series(pugTask, scssTask);

exports.default = gulp.parallel(start, watchFiles, webServer);

