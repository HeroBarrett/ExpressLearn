var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const adminAuth = require('./middlewares/admin-auth');
require('dotenv').config();


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// 后台路由文件
var adminArticlesRouter = require('./routes/admin/articles');
var adminCategoriesRouter = require('./routes/admin/categories');
var adminSettingsRouter = require('./routes/admin/seetings');
var adminUsersRouter = require('./routes/admin/users');
var adminCoursesRouter = require('./routes/admin/courses');
var adminChaptersRouter = require('./routes/admin/chapters');
var adminChartsRouter = require('./routes/admin/charts');
// 登录路由
var adminAuthRouter = require('./routes/admin/auth');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// 后台路由配置
app.use('/admin/articles', adminAuth, adminArticlesRouter);
app.use('/admin/categories', adminAuth, adminCategoriesRouter);
app.use('/admin/settings', adminAuth, adminSettingsRouter);
app.use('/admin/users', adminAuth, adminUsersRouter);
app.use('/admin/courses', adminAuth, adminCoursesRouter);
app.use('/admin/chapters', adminAuth, adminChaptersRouter);
app.use('/admin/charts', adminAuth, adminChartsRouter);
// 登录路由
app.use('/admin/auth', adminAuthRouter);


module.exports = app;
