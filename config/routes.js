const express = require("express");
const router = express.Router();

// 路由配置...
const adminAuth = require("../middlewares/admin-auth");
const userAuth = require("../middlewares/user-auth");

// 前台路由文件
var indexRouter = require("../routes/index");
var usersRouter = require("../routes/users");
var categoriesRouter = require("../routes/categories");
var coursesRouter = require("../routes/courses");
var chaptersRouter = require("../routes/chapters");
var articlesRouter = require("../routes/articles");
var settingsRouter = require("../routes/settings");
var searchRouter = require("../routes/search");
var authRouter = require("../routes/auth");
var likesRouter = require("../routes/likes");
var uploadsRouter = require("../routes/uploads");
var captchaRouter = require("../routes/captcha");
var membershipsRouter = require("../routes/memberships");
var ordersRouter = require("../routes/orders");

// 后台路由文件
var adminArticlesRouter = require("../routes/admin/articles");
var adminCategoriesRouter = require("../routes/admin/categories");
var adminSettingsRouter = require("../routes/admin/seetings");
var adminUsersRouter = require("../routes/admin/users");
var adminCoursesRouter = require("../routes/admin/courses");
var adminChaptersRouter = require("../routes/admin/chapters");
var adminChartsRouter = require("../routes/admin/charts");
var adminAttachmentsRouter = require("../routes/admin/attachments");
var adminLogsRouter = require("../routes/admin/logs");
var adminMembershipsRouter = require("../routes/admin/memberships");
var adminOrdersRouter = require("../routes/admin/orders");
var adminAuthRouter = require("../routes/admin/auth");

// 前台路由配置
router.use("/", indexRouter);
router.use("/categories", categoriesRouter);
router.use("/courses", coursesRouter);
router.use("/chapters", userAuth, chaptersRouter);
router.use("/articles", articlesRouter);
router.use("/settings", settingsRouter);
router.use("/search", searchRouter);
router.use("/auth", authRouter);
router.use("/users", userAuth, usersRouter);
router.use("/likes", userAuth, likesRouter);
router.use("/uploads", userAuth, uploadsRouter);
router.use("/captcha", captchaRouter);
router.use("/memberships", membershipsRouter);
router.use("/orders", userAuth, ordersRouter);

// 后台路由配置
router.use("/admin/articles", adminAuth, adminArticlesRouter);
router.use("/admin/categories", adminAuth, adminCategoriesRouter);
router.use("/admin/settings", adminAuth, adminSettingsRouter);
router.use("/admin/users", adminAuth, adminUsersRouter);
router.use("/admin/courses", adminAuth, adminCoursesRouter);
router.use("/admin/chapters", adminAuth, adminChaptersRouter);
router.use("/admin/charts", adminAuth, adminChartsRouter);
router.use("/admin/attachments", adminAuth, adminAttachmentsRouter);
router.use("/admin/logs", adminAuth, adminLogsRouter);
router.use("/admin/memberships", adminAuth, adminMembershipsRouter);
router.use("/admin/orders", adminAuth, adminOrdersRouter);
router.use("/admin/auth", adminAuthRouter);

module.exports = router;
