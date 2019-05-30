const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const spritesmith = require('gulp.spritesmith');

gulp.task('sass', function () {
	return gulp.src('src/scss/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded',
			indentType: 'tab',
			indentWidth: 1
		})
		.on('error', sass.logError))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('public/'));
});

gulp.task('sprite', function(){
	var spriteData = gulp.src('src/img/sprite/*.png')
		.pipe(spritesmith({
			imgName: '../img/sprite.png',
			cssName: '_sprite.scss'
		}));
	var imgStream = new Promise(function(resolve) {
		spriteData.img
			.pipe(gulp.dest('public/img'))
			.on('end',resolve);
	});

	var cssStream = new Promise(function(resolve) {
		spriteData.css
			.pipe(gulp.dest('src/scss/sprite'))
			.on('end',resolve);
	});
	return Promise.all([imgStream, cssStream]);
})
gulp.task('watch',function(){
	gulp.watch('src/scss/*.scss',['sass']);
});
