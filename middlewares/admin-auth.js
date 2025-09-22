const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { Unauthorized } = require("http-errors");
const { success, failure } = require("../utils/responses");

module.exports = async (req, res, next) => {
  try {
    // 判断 Token 是否存在
    const token = req.headers.token || req.query.token;
    
    if (!token) {
      throw new Unauthorized("当前接口需要认证才能访问。");
    }
    // 验证token是否正确
    const decoded = jwt.verify(token, process.env.SECRET);
    // 从数据库中查询用户
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      throw new Unauthorized("用户不存在。");
    }

    // 验证当前用户是不是管理员
    if (user.role !== 100) {
      throw new Unauthorized("您没有权限使用当前接口");
    }
    // 验证通过，将user对象挂载到req.user上，方便后续中间件或路由使用
    req.user = user;
    next();
  } catch (error) {
    failure(res, error);
  }
};
