/// <binding BeforeBuild='react' ProjectOpened='default' />
var gulp = require("gulp");
var react = require("gulp-react");

var jsxSources = "React/**/*.jsx";
var jsxDest = "wwwroot/script/";

gulp.task('react', function () {
    gulp.src(jsxSources)
        .pipe(react())
        .on("error", swallowError)
        .pipe(gulp.dest(jsxDest));
});

gulp.task('watch', function () {
    gulp.watch(jsxSources, ['react']);
});

gulp.task('default', ['watch']);


// #region Helper Functions

function swallowError(error) {
    var msg = error.message.replace(process.cwd(), "");
    console.error(msg);
    this.emit('end);')
}

// #endregion