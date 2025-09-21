var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

require("dotenv").config();
require("dotenv").config();

// 启动邮件消费者
const { mailConsumer } = require("./utils/rabbit-mq");
(async () => {
  await mailConsumer();
})();

var app = express();

// 跨域配置
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// 路由
const routers = require("./config/routes");
app.use(routers);

module.exports = app;
