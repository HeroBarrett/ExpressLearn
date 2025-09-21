const express = require("express");
const router = express.Router();
const { User } = require("../models");
const { success, failure } = require("../utils/responses");
const { NotFound, BadRequest, Unauthorized } = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const validateCaptcha = require("../middlewares/validate-captcha");
const { delKey } = require("../utils/redis");
const sendMail = require("../utils/mail");

/**
 * 用户注册
 * POST /auth/sign_up
 */
router.post("/sign_up", validateCaptcha, async function (req, res) {
  try {
    const body = {
      email: req.body.email,
      username: req.body.username,
      nickname: req.body.nickname,
      password: req.body.password,
      sex: 2,
      role: 0,
    };

    const user = await User.create(body);
    // 删除密码
    delete user.dataValues.password;

    // 请求成功，删除验证码
    await delKey(req.body.captchaKey);
    // 发送注册成功邮件
    // 发送邮件
    const html = `
      您好，<span style="color: red">${user.nickname}。</span><br><br>
      恭喜，您已成功注册会员！<br><br>
      请访问<a href="https://clwy.cn">「长乐未央」</a>官网，了解更多。<br><br>
      ━━━━━━━━━━━━━━━━<br>
      长乐未央
    `;
    await sendMail(user.email, "注册成功通知", html); 

    success(res, "创建用户成功。", { user }, 201);
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 登录
 * POST /auth/sign_in
 */
router.post("/sign_in", async function (req, res, next) {
  try {
    const { login, password } = req.body;

    if (!login) {
      throw new BadRequest("邮箱/用户名必须填写");
    }

    if (!password) {
      throw new BadRequest("密码必须填写");
    }

    const condition = {
      where: {
        [Op.or]: [{ email: login }, { username: login }],
      },
    };

    // 通过email或username查询用户是否存在
    const user = await User.findOne(condition);
    if (!user) {
      throw new NotFound("用户不存在");
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Unauthorized("密码错误");
    }

    // 生成身份验证令牌
    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.SECRET,
      { expiresIn: "30d" }
    );

    success(res, "登陆成功", { token });
  } catch (error) {
    failure(res, error);
  }
});

module.exports = router;
