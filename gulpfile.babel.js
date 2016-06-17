'use strict';

const bower = require('gulp-bower');
const clean = require('gulp-clean-css');
const colors = require('colors/safe');
const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
const notify = require('gulp-notify');
const prefixer = require('gulp-autoprefixer');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

// colors for our console output
const ok = colors.magenta.bold;
// const err = colors.red.bold;
//
// const partners = [
//   'base',
//   'healthline',
//   'drugs',
//   'livestrong',
// ];

const base = {
  src: 'src',
  bower: 'bower_components',
  dist: 'WebContent/resources',
};

const paths = {
  dist: `${base.dist}/healthline`,
  scriptPath: {
    src: `${base.src}/js/*`,
    bootstrap: `${base.bower}/bootstrap-sass/assets/javascripts/bootstrap.min.js`,
    jquery: `${base.bower}/jquery/dist/jquery.min.js`,
    dist: `${base.dist}/healthline/js`,
  },

  cssPath: {
    src: `${base.src}/css/*`,
    bootstrap: `${base.bower}/bootstrap-sass/assets/stylesheets/`,
    dist: `${base.dist}/healthline/css`,
  },
  imgPath: {
    src: `${base.src}/img/*`,
    dist: `${base.dist}/healthline/img`,
  },
  fontPath: {
    src: `${base.src}/fonts/*`,
    dist: `${base.dist}/healthline/fonts`,
  },
  test: `${base.src}/test/js/*`,
};

gulp.task('watch', () => {
  gulp.watch(paths.cssPath.src, ['sass']);
});

gulp.task('clean', () => {
  return del([paths.dist, base.bower]).then(apaths => {
    gutil.log(ok(`\nRemoved the following:\n ${apaths.join('\n')}`));
  });
});

gulp.task('default', () => {
  runSequence('sass');
});

gulp.task('bower', ['clean'], () => {
  return bower()
    .pipe(gulp.dest(base.bower));
});

// processes and moves our stylesheets.
gulp.task('sass', ['bower'], () => {
  return gulp.src([paths.cssPath.src])
    .pipe(sourcemaps.init())
    .pipe(sass({
  style: 'compressed',
  includePaths: [
    'bower_components/bootstrap-sass/assets/stylesheets/',
    paths.cssPath.src,
  ],
}).on('error', gutil.log))
    .pipe(prefixer())
    .pipe(clean())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.cssPath.dist));
});