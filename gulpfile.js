

var gulp = require('gulp');
var uglify = require('gulp-uglify'); //压缩
var concat = require('gulp-concat');//合并
var babel = require('gulp-babel');
gulp.task('compressJS', function () {
  return gulp.src(["js/src/*.js"])//原路径
  	.pipe(babel()) //转换ES6代码
    .pipe(concat("excel-preview.min.js"))//合并
    .pipe(uglify({compress:true}))//压缩
    .pipe(gulp.dest("js/dist"));//目标路径
});
