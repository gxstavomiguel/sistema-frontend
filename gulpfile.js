const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');

gulp.task('scripts', function() {
  return gulp.src(['lib/angular.min.js', 'src/**/*.js']) 
    .pipe(uglify())
    .pipe(concat('app.min.js')) 
    .pipe(gulp.dest('dist/js')); 
});

gulp.task('global-styles', function() {
  return gulp.src('styles.css') 
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('component-styles', function() {
  return gulp.src('src/componentes/**/*.css') 
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('html-components', function() {
  return gulp.src('src/componentes/**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
});

gulp.task('index', function() {
  return gulp.src('index.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
  return gulp.src('img/**/*') 
    .pipe(imagemin()) 
    .pipe(gulp.dest('dist/img')); 
});

gulp.task('build', gulp.series('scripts', 'global-styles', 'component-styles', 'html-components', 'index', 'images'));
