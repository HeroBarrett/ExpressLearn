const express = require("express");
const router = express.Router();
const { sequelize, User } = require("../../models");
const { Op } = require("sequelize");
const { success, failure } = require("../../utils/responses");
const { NotFound } = require("http-errors");
const { initOrderStream, broadcastOrderCount } = require("../../streams/count-order");

/**
 * 统计用户性别
 * GET /admin/charts/sex
 */
router.get("/sex", async function (req, res) {
  try {
    const [male, female, unknown] = await Promise.all([
      User.count({ where: { sex: 0 } }),
      User.count({ where: { sex: 1 } }),
      User.count({ where: { sex: 2 } }),
    ]);

    const data = [
      { value: male, name: "男性" },
      { value: female, name: "女性" },
      { value: unknown, name: "未选择" },
    ];

    success(res, "查询用户性别成功。", { data });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 统计每月注册用户数量
 * GET /admin/charts/user
 */
router.get("/user", async (req, res, next) => {
  try {
    const count = await User.count();
    const [results] = await sequelize.query(
      'SELECT DATE_FORMAT(`createdAt`, "%Y-%m") AS `month`, COUNT(*) AS `value` FROM `Users` GROUP BY `month` ORDER BY `month` ASC;'
    );

    const data = {
      months: [],
      values: [],
    };

    results.forEach((item) => {
      data.months.push(item.month);
      data.values.push(item.value);
    });

    success(res, "查询每月注册用户数量成功", { data });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * SSE 统计每个月订单数量
 * GET /admin/charts/stream_order
 */
router.get("/stream_order", async (req, res) => {
  try {
    // 初始化连接信息
    initOrderStream(res, req);
    // 推送订单统计数据
    await broadcastOrderCount();
  } catch (error) {
    failure(res, error);
  }
});

module.exports = router;
