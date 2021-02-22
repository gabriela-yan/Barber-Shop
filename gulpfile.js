const { src, dest, watch , parallel } = require('gulp');
const sass = require('gulp-dart-sass');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const cache = require('gulp-cache');
const webp = require('gulp-webp');

const autoprefixer = require('autoprefixer');
const postcss    = require('gulp-postcss')
const sourcemaps = require('gulp-sourcemaps')
const cssnano = require('cssnano');

const terser = require('gulp-terser-js');
const rename = require('gulp-rename');

const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    images: 'src/img/**/*'
}

function css() {
    return src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe( dest('./build/css') );
}

function javascript() {
    return src(paths.js)
      .pipe(sourcemaps.init())
      .pipe(concat('bundle.js')) // final output file name
      .pipe(terser())
      .pipe(sourcemaps.write('.'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(dest('./build/js'))
}

function imagesMin() {
    return src(paths.images)
        // .pipe(cache(imagemin({ optimizationLevel: 3})))
        .pipe(imagemin())
        .pipe(dest('./build/img'))
        .pipe(notify({ message: 'Minify Image'}));
}

function versionWebp() {
    return src(paths.images)
        .pipe( webp() )
        .pipe(dest('./build/img'))
        .pipe(notify({ message: 'Image Webp'}));
}

function watchFiles() {
    watch( paths.scss, css );
    watch( paths.js, javascript );
    watch( paths.images, imagesMin );
    watch( paths.images, versionWebp );
}
  
exports.css = css;
exports.imagesMin = imagesMin;
exports.watchArchivos = watchFiles;
exports.default = parallel(css, javascript, imagesMin, versionWebp, watchFiles ); 