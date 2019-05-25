var gulp = require("gulp");
// 压缩html
// gulp应用插件  下载插件--》取到插件--》应用插件
var htmlclean = require("gulp-htmlclean");//压缩html
var imagemin = require("gulp-imagemin");//压缩图片
var uglify = require("gulp-uglify");//压缩js文件
// 去掉js中的调试语句
// gulp-strip-debug
var debug = require("gulp-strip-debug");
// 将less转化为css
// gulp-less
var less = require("gulp-less");
// 压缩css
// gulp-clean-css
var cleancss = require("gulp-clean-css");
// gulp-postcss autoprefixer自动给css3添加前缀
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
// 开启服务器
var connect = require("gulp-connect");
var devMod = process.env.NODE_ENV=="development"
console.log(devMod)
// 在node环境中 export NODE_ENV=development设置环境变量
// 
var folder={
    src:"src/",
    dist:"dist/"
}
gulp.task("css",function(){
    var page = gulp.src(folder.src+"css/*")
        .pipe(connect.reload())
        .pipe(less())
        .pipe(postcss([autoprefixer()]))
        if(!devMod){
            page.pipe(cleancss())
        }
        
        page.pipe(gulp.dest(folder.dist+"css/"))
})
gulp.task("js",function(){
    var page = gulp.src(folder.src+"js/*")
        .pipe(connect.reload())
        .pipe(debug())
        if(!devMod){
            page.pipe(uglify())
        }
        
        page.pipe(gulp.dest(folder.dist+"js/"))
})
gulp.task("html",function(){
    // 读取文件
    var page = gulp.src(folder.src+"html/*")
        .pipe(connect.reload())
        // 在管道中 压缩文件
        if(!devMod){
            page.pipe(htmlclean())
        }
        
    // gulp.dest()的写入的意思
    // 先把pipe管道接入给gulp.dest() dest指定写入的位置
        page.pipe(gulp.dest(folder.dist+"html/"))
})
gulp.task("images",function(){
    // 图片需要压缩
    gulp.src(folder.src+"images/*")
        .pipe(connect.reload())
        .pipe(imagemin())
        .pipe(gulp.dest(folder.dist+"images/"))
})

// 开启服务器
gulp.task("server",function(){
    connect.server({
        port:"8080",
        // 服务器自动刷新
        livereload:true,
        // 还要监听task任务中的文件是否变化
        // connect.reload()
    })
})

// 创建监听任务
gulp.task("watch",function(){
    // 第一个参数是监听的路径，第二函数是要执行的方法
    gulp.watch(folder.src+"html/*",["html"])
    gulp.watch(folder.src+"css/*",["css"])
    gulp.watch(folder.src+"js/*",["js"])
})
gulp.task("default",["html","css","js","images","server","watch"])
// gulp 后默认进去default任务，default回去执行html任务
// watch是自动监听文件变化，变化后就更新到dist
//  connect.reload()是在dist文件夹中的该文件变化时，服务器就刷新

// gulp runner Task
// webpack module