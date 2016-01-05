var _ = require('lodash');
var del = require('del');
var bump = require('gulp-bump');
var gulp = require('gulp');
var gulpSequence = require('gulp-sequence').use(gulp);
var KarmaServer = require('karma').Server;
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('default', createTestTask('src/*.js', { singleRun: false }));

gulp.task('clean-build', function() {
	return del(['build'])
});

gulp.task('clean-dist', function() {
	return del(['dist'])
});

gulp.task('test', createTestTask('src/*.js'));

gulp.task('test-build', createTestTask('build/angular-conditional-validation.js'));

gulp.task('test-build-min', createTestTask('build/angular-conditional-validation.js'));

gulp.task('build-dev', function() {
	return gulp
		.src('src/*.js')
		.pipe(gulp.dest('build'));
});

gulp.task('build-min', function() {
	return gulp
		.src('src/*.js')
		.pipe(uglify({
			// ...
		}))
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(gulp.dest('build'));
});

gulp.task('build', gulpSequence('clean-build', ['build-dev', 'build-min'], ['test-build', 'test-build-min']));

gulp.task('copy-build', function () {
	return gulp
		.src('build/*.js')
		.pipe(gulp.dest('dist'));
});

gulp.task('release', gulpSequence(['clean-dist', 'build'], 'copy-build'));

gulp.task('bump', createBumpTask('patch'));

gulp.task('bump-minor', createBumpTask('minor'));

function createTestTask(sourceFiles, extraOptions) {
	return function(done) {
		var files = [
			'node_modules/angular/angular.js',
			'node_modules/angular-mocks/angular-mocks.js',
			'test/*.spec.js',
		].concat(_.isArray(sourceFiles) ? sourceFiles : [sourceFiles]); 

		var config = _.assign({
			configFile: __dirname + '/karma.conf.js',
			singleRun: true,
			files: files
		}, extraOptions || {});

		new KarmaServer(config, done).start();
	}
}

function createBumpTask(type) {
	return function() {
		return gulp
			.src(['package.json', 'bower.json'])
			.pipe(bump({type: type}))
			.pipe(gulp.dest('./'));
	};
}