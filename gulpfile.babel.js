'use strict';

// Gulp module imports
import gulp from 'gulp';
import del from 'del';
import livereload from 'gulp-livereload';
import sass from 'gulp-sass';
import minifycss from 'gulp-minify-css';
import jade from 'gulp-jade';
import babel from 'gulp-babel';
import yargs from 'yargs';



// Build Directories
// ----
const dirs = {
  src: 'src',
  dest: 'build'
};



// File Sources
// ----
const sources = {
  styles: {
    src:  `${dirs.src}/**/*.scss`,
    dest: `${dirs.dest}/styles/`,
  },
  views: {
    src:  `${dirs.src}/**/*.jade`,
    dest: `${dirs.dest}/views/`,
  },
  scripts: {
    src:  `${dirs.src}/**/*.js`,
    dest: `${dirs.dest}/scripts/`,
  }
};



// Recognise `--production` argument
let argv = yargs.argv;
const production = !!argv.production;



// Main Tasks
// ----

// Styles 
gulp.task('build:styles', () => {
  return gulp.src(sources.styles.src, { sourcemaps: true })
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(minifycss())
    .pipe(gulp.dest(sources.styles.dest))
    .pipe(livereload());
});

// Views
gulp.task('build:views', () => {
  return gulp.src(sources.views.src)
    .pipe(jade())
    .pipe(gulp.dest(sources.views.dest))
    .pipe(livereload());
});

// Scripts
gulp.task('build:scripts', () => {
  return gulp.src(sources.scripts.src)
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(gulp.dest(sources.scripts.dest))
    .pipe(livereload());
});

// Clean
gulp.task('clean', () => del(['build']));



// Watch Task
gulp.task('watch', () => {
  livereload.listen();
  gulp.watch(sources.styles.src, gulp.series('build:styles'));
  gulp.watch(sources.views.src, gulp.series('build:views'));
  gulp.watch(sources.scripts.src, gulp.series('build:scripts'));
})


// Default Gulp Task
gulp.task(
  'default',
  gulp.series(
    'clean',
    gulp.parallel('build:styles', 'build:views', 'build:scripts'),
    'watch'
  )
);


// Build Task
gulp.task('serve:dist', gulp.series('build:styles', 'build:views', 'build:scripts'));