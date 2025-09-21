const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { Unauthorized } = require("http-errors");
const { success, failure } = require("../utils/responses");

module.exports = async (req, res, next) => {
  try {
    // 判断 Token 是否存在
    const { token } = req.headers;
    if (!token) {
      throw new Unauthorized("当前接口需要认证才能访问。");
    }
    // 验证token是否正确
    const decoded = jwt.verify(token, process.env.SECRET);

    // 验证通过，将userId对象挂载到req.user上，方便后续中间件或路由使用
    req.user = decoded.userId;
    next();
  } catch (error) {
    failure(res, error);
  }
};
