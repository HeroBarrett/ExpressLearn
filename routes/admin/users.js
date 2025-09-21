const express = require("express");
const router = express.Router();
const { User } = require("../../models");
const { Op } = require("sequelize");
const { success, failure } = require("../../utils/responses");
const { NotFound } = require("http-errors");
const { delKey } = require("../../utils/redis");

/**
 * 获取所有用户列表
 * GET /admin/users
 */
router.get("/", async function (req, res, next) {
  try {
    // 拿到模糊查询的数据
    const query = req.query;
    // 获取分页所需的参数
    // 当前第几页，默认第一页
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    // 每页显示多少条，默认10条
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    // 计算offset -> 在数据库中从第几条开始
    const offset = (currentPage - 1) * pageSize;

    // 配置项
    const condition = {
      where: {},
      // 排序 -》 按照id倒序
      order: [["id", "DESC"]],
      // 分页 -》 从第几条开始，显示多少条
      offset,
      // 每页显示多少条
      limit: pageSize,
    };

    // 模糊查询
    if (query.email) {
      condition.where.email = query.email;
    }

    if (query.username) {
      condition.where.username = query.username;
    }

    if (query.nickname) {
      condition.where.nickname = {
        [Op.like]: `%${query.nickname}%`,
      };
    }

    if (query.role) {
      condition.where.role = query.role;
    }

    // 从数据库获取数据
    const { count, rows } = await User.findAndCountAll(condition);
    // res.json({ message: "这里是后台的用户列表接口~" });
    success(res, "查询用户列表成功", {
      users: rows,
      pagination: {
        total: count, // 总条数
        currentPage, // 当前第几页
        pageSize, // 每页显示多少条
      },
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 查询当前登录的用户详情
 * GET /admin/users/me
 */
router.get("/me", async function (req, res) {
  try {
    const user = req.user;
    success(res, "查询当前用户信息成功。", { user });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 查询用户详情
 * GET /admin/users/:id
 */
router.get("/:id", async function (req, res) {
  try {
    const user = await getUser(req);

    // 响应数据
    success(res, "查询用户详情成功", {
      user,
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 创建用户
 * POST /admin/users
 */
router.post("/", async function (req, res, next) {
  try {
    // 白名单过滤
    const body = filterBody(req);
    // 插入数据库
    const user = await User.create(body);
    // 响应数据
    success(res, "创建用户成功", { user }, 201);
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 更新用户
 * PUT /admin/users/:id
 */
router.put("/:id", async function (req, res, next) {
  try {
    const user = await getUser(req);
    // 白名单过滤
    const body = filterBody(req);
    await user.update(body);
    // 清除缓存
    await clearCache(user);
    // 相应数据
    success(res, "更新用户成功", { user });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 公共方法：查询当前用户
 */
async function getUser(req) {
  // 获取用户id
  const { id } = req.params;
  // 查询用户
  const user = await User.findByPk(id);
  if (!user) {
    throw new NotFound("用户不存在");
  }
  return user;
}

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{}}
 */
function filterBody(req) {
  return {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    nickname: req.body.nickname,
    sex: req.body.sex,
    company: req.body.company,
    introduce: req.body.introduce,
    role: req.body.role,
    avatar: req.body.avatar,
  };
}

/**
 * 清除缓存
 * @param user
 * @returns {Promise<void>}
 */
async function clearCache(user) {
  await delKey(`user:${user.id}`);
}

module.exports = router;
