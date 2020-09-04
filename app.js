const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const ejs = require('ejs');
const axios = require('axios');

// 引入ejs模块
let indexRouter = require('./routes/index/index');
let dataRouter = require('./routes/common/data');
let screenRouter = require('./routes/index/screen');
let analysisRouter = require('./routes/index/analysis');
let fill_ip_Router = require('./routes/common/fill_ip'); // 填ip数据用的

//在express中加载webpack模块
let webpack = require('webpack');
//webpack的配置文件
let webpackConfig = require('./webpack.config.js');
//启动webpack的方法webpack(配置文件对象，回调)
let compiler = webpack(webpackConfig, function(err, stats) {
    console.log(stats.toString({
        colors: true
    }));
    compiler.watch({
        aggregateTimeout: 300,
        poll: undefined
    }, function(err, stats) {

    })
});

let app = express();

// 注册html模板引擎
app.engine("html", ejs.__express);

// 设置模板文件存放目录
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/data', dataRouter);
app.use('/screen', screenRouter);
app.use('/analysis', analysisRouter);
app.use('/fillip', fill_ip_Router);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('common/error');
});

module.exports = app;