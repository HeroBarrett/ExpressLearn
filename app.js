var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors")

require("dotenv").config();

const adminAuth = require("./middlewares/admin-auth");
const userAuth = require("./middlewares/user-auth");

// 前台路由文件
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var categoriesRouter = require("./routes/categories");
var coursesRouter = require("./routes/courses");
var chaptersRouter = require("./routes/chapters");
var articlesRouter = require("./routes/articles");
var settingsRouter = require("./routes/settings");
var searchRouter = require("./routes/search");
var authRouter = require("./routes/auth");
var likesRouter = require("./routes/likes");
var uploadsRouter = require("./routes/uploads");
var captchaRouter = require("./routes/captcha");

// 后台路由文件
var adminArticlesRouter = require("./routes/admin/articles");
var adminCategoriesRouter = require("./routes/admin/categories");
var adminSettingsRouter = require("./routes/admin/seetings");
var adminUsersRouter = require("./routes/admin/users");
var adminCoursesRouter = require("./routes/admin/courses");
var adminChaptersRouter = require("./routes/admin/chapters");
var adminChartsRouter = require("./routes/admin/charts");
var adminAttachmentsRouter = require("./routes/admin/attachments");

// 登录路由
var adminAuthRouter = require("./routes/admin/auth");

var app = express();

app.use(cors())

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// 前台路由配置
app.use("/", indexRouter);
app.use("/categories", categoriesRouter);
app.use("/courses", coursesRouter);
app.use("/chapters", chaptersRouter);
app.use("/articles", articlesRouter);
app.use("/settings", settingsRouter);
app.use("/search", searchRouter);
app.use("/auth", authRouter);
app.use("/users", userAuth, usersRouter);
app.use("/likes", userAuth, likesRouter);
app.use("/uploads", userAuth, uploadsRouter);
app.use("/captcha", captchaRouter);

// 后台路由配置
app.use("/admin/articles", adminAuth, adminArticlesRouter);
app.use("/admin/categories", adminAuth, adminCategoriesRouter);
app.use("/admin/settings", adminAuth, adminSettingsRouter);
app.use("/admin/users", adminAuth, adminUsersRouter);
app.use("/admin/courses", adminAuth, adminCoursesRouter);
app.use("/admin/chapters", adminAuth, adminChaptersRouter);
app.use("/admin/charts", adminAuth, adminChartsRouter);
app.use("/admin/attachments", adminAuth, adminAttachmentsRouter);

// 登录路由
app.use("/admin/auth", adminAuthRouter);

module.exports = app;
