const express = require("express");
const router = express.Router();
const { Setting } = require("../../models");
const { success, failure } = require("../../utils/responses");
const { NotFound } = require("http-errors")


/**
 * 查询系统设置详情
 * GET /admin/settings
 */
router.get("/", async function (req, res) {
  try {
    const setting = await getSetting();

    // 响应数据
    success(res, "查询系统设置详情成功", {
      setting,
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 更新系统设置
 * PUT /admin/settings
 */
router.put("/", async function (req, res, next) {
  try {
    const setting = await getSetting();
    // 白名单过滤
    const body = filterBody(req);
    await setting.update(body);
    // 相应数据
    res.json({
      status: true,
      message: "更新系统设置成功",
      data: {
        setting,
      },
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 公共方法：查询当前系统设置
 */
async function getSetting() {
  // 查询系统设置
  const setting = await Setting.findOne();
  if (!setting) {
    throw new NotFound("系统设置不存在");
  }
  return setting;
}

/**
 * 公共方法：白名单过滤
 * @param erq
 * @returns {{}}
 */
function filterBody(req) {
  return {
    name: req.body.name,
    icp: req.body.icp,
    copyright: req.body.copyright,
  };
}

module.exports = router;
