const express = require("express");
const router = express.Router();
const { success, failure } = require("../utils/responses");
const svgCaptcha = require("svg-captcha");
const { setKey } = require("../utils/redis");
const { v4: uuidv4 } = require("uuid");

/**
 * 获取验证码
 * GET /captcha
 */
router.get("/", async (req, res) => {
  try {
    const captcha = svgCaptcha.createMathExpr({
      size: 4, // 验证码长度
      ignoreChars: "0O1Il9quv", // 验证码字符中排除 0O1Il9quv
      noise: 2, // 干扰线条数量
      color: true, // 是否有颜色，
      width: 100, // 宽
      height: 40, // 高
    });

    const captchaKey = `captcha:${uuidv4()}`;
    await setKey(captchaKey, captcha.text, 60 * 5); // 5分钟有效期

    // 直接输出图片
    // res.type("svg");
    // res.status(200).send(captcha.data);
    success(res, '获取验证码成功', {
      captchaKey,
      captchaData: captcha.data,
    })
  } catch (error) {
    failure(res, error);
  }
});

module.exports = router;
