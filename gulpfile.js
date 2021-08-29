const gulp = require('gulp'),
  browserSync = require('browser-sync').create(),
  pug = require('gulp-pug'),
  sass = require('gulp-sass')(require('sass')),
  concat = require('gulp-concat');
const del = require('del');
const { src, dest } = require('gulp');

// const sourcemaps = require('gulp-sourcemaps');

// const autoprefixer = require('gulp-autoprefixer');
// const svgSprite = require('gulp-svg-sprite');
// const imagemin = require('gulp-imagemin');

const app = 'app/',
  dist = 'build/';

const config = {
  app: {
    html: app + 'pug/*.pug',
    style: app + 'scss/**/*.*',
    // js: app + 'js/**/*.*',
    Img: app + 'images/**/*.*',
  },
  dist: {
    html: dist,
    style: dist + 'css/styles',
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

const cleanDist = () => del('build/**/*', { force: true });

const scripts = () => {
  return src([
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/bootstrap/dist/js/bootstrap.min.js',
    './node_modules/popper.js/dist/popper.js',
  ])
    .pipe(dest('./build/js/'))
};

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
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(gulp.dest(config.dist.style))
    .pipe(concat('app.css'))
    .pipe(browserSync.reload({ stream: true }))

}

const watchFiles = () => {
  gulp.watch([config.watch.html], gulp.series(pugTask))
  gulp.watch([config.watch.style], gulp.series(scssTask))
}

const start = gulp.series(cleanDist, pugTask, scssTask, scripts);

exports.default = gulp.parallel(start, watchFiles, webServer);

// exports.default = series(parallel(buildSvg, buildImages));

