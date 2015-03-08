
var gulp       = require('gulp');
var sass       = require('gulp-sass');
var concat     = require('gulp-concat');
var markdown   = require('gulp-markdown');
var livereload = require('gulp-livereload');
var wrap       = require("gulp-wrap");


// # HTML
gulp.task('html', function() {
  gulp.src('md/*.md')
    .pipe(concat('index.html'))
    .pipe(markdown())
    .pipe(wrap({src: 'assets/template.html'}))
    .pipe(gulp.dest('./'))
    .pipe(livereload());
});


// # Sass
gulp.task('sass', function() {
  gulp.src('assets/sass/style.sass')
    .pipe(sass({ indentedSyntax: true, outputStyle: 'compressed' }))
    .on('error', function(err){ console.log(err.message) })
    .pipe(gulp.dest('assets/css/'))
    .pipe(livereload());
});


// # Watch
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('md/*.md', ['html']);
  gulp.watch('assets/template.html', ['html']);
  gulp.watch('assets/sass/style.sass', ['sass']);
});


// # Default task
gulp.task('default', ['watch']);
