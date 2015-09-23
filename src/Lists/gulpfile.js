/// <binding BeforeBuild='react' ProjectOpened='default' />
var gulp = require("gulp");
var react = require("gulp-react");

var jsxSources = "React/**/*.jsx";
var jsxDest = "wwwroot/script/";

gulp.task('react', function () {
    gulp.src(jsxSources)
        .pipe(react())
        .pipe(gulp.dest(jsxDest));
});

gulp.task('watch', function () {
    gulp.watch(jsxSources, ['react']);
});

gulp.task('default', ['watch']);
