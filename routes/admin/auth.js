const express = require("express");
const router = express.Router();
const { User } = require("../../models");
const { Op } = require("sequelize");
const { success, failure } = require("../../utils/responses");
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} = require("../../utils/errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * 登录
 * POST /admin/auth/sign_in
 */
router.post("/sign_in", async function (req, res, next) {
  try {
    const { login, password } = req.body;

    if (!login) {
      throw new BadRequestError("邮箱/用户名必须填写");
    }

    if (!password) {
      throw new BadRequestError("密码必须填写");
    }

    const condition = {
      where: {
        [Op.or]: [{ email: login }, { username: login }],
      },
    };

    // 通过email或username查询用户是否存在
    const user = await User.findOne(condition);
    if (!user) {
      throw new NotFoundError("用户不存在");
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("密码错误");
    }

    // 验证是不是管理员
    if (user.role !== 100) {
      throw new UnauthorizedError("您没有授权登录管理员后台");
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
