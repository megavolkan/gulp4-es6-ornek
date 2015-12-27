// Gulp module imports
import {src, dest, watch, parallel, series} from 'gulp';
import del from 'del';
import livereload from 'gulp-livereload';
import sass from 'gulp-sass';
import minifycss from 'gulp-minify-css';
import jade from 'gulp-jade';
import gulpif from 'gulp-if';
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
  styles: `${dirs.src}/**/*.scss`,
  views: `${dirs.src}/**/*.jade`,
  scripts: `${dirs.src}/**/*.js`
};



// Recognise `--production` argument
const argv = yargs.argv;
const production = !!argv.production;



// Main Tasks
// ----

// Styles 
export const buildStyles = () => src(sources.styles)
  .pipe(sass.sync().on('error', sass.logError))
  .pipe(gulpif(production, minifycss()))
  .pipe(dest(dirs.dest))
  .pipe(livereload());

// Views
export const buildViews = () => src(sources.views)
  .pipe(jade())
  .pipe(dest(dirs.dest))
  .pipe(livereload());


// Scripts
export const buildScripts = () => src(sources.scripts)
  .pipe(babel({ presets: ['es2015'] }))
  .pipe(dest(dirs.dest))
  .pipe(livereload());


// Clean
export const clean = () => del(['build']);



// Watch Task
export const devWatch = () => {
  livereload.listen();
  watch(sources.styles, buildStyles);
  watch(sources.views, buildViews);
  watch(sources.scripts, buildScripts);
};


// Development Task
export const dev = series(clean, parallel(buildStyles, buildViews, buildScripts), devWatch);

// Serve Task
export const build = series(clean, parallel(buildStyles, buildViews, buildScripts));

// Default task
export default dev;