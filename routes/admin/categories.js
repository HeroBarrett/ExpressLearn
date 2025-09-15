const express = require("express");
const router = express.Router();
const { Category } = require("../../models");
const { Op } = require("sequelize");
const { NotFoundError, success, failure } = require("../../utils/response");

/**
 * 获取所有分类列表
 * GET /admin/categories
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
      // 排序 -》 按照id倒序
      order: [["id", "DESC"]],
      // 分页 -》 从第几条开始，显示多少条
      offset,
      // 每页显示多少条
      limit: pageSize,
    };

    // 模糊查询
    if (query.name) {
      condition.where = {
        name: {
          [Op.like]: `%${query.name}%`,
        },
      };
    }

    // 从数据库获取数据
    const { count, rows } = await Category.findAndCountAll(condition);
    // res.json({ message: "这里是后台的分类列表接口~" });
    success(res, "查询分类列表成功", {
      categories: rows,
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
 * 查询分类详情
 * GET /admin/categories/:id
 */
router.get("/:id", async function (req, res) {
  try {
    const category = await getCategory(req);

    // 响应数据
    success(res, "查询分类详情成功", {
      category,
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 创建分类
 * POST /admin/categories
 */
router.post("/", async function (req, res, next) {
  try {
    // 白名单过滤
    const body = filterBody(req);
    // 插入数据库
    const category = await Category.create(body);
    // 响应数据
    success(res, "创建分类成功", { category }, 201);
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 删除分类
 * Delete /admin/categories/:id
 */
router.delete("/:id", async function (req, res, next) {
  try {
    const category = await getCategory(req);
    // 删除分类
    await category.destroy();
    // 响应数据
    success(res, "删除分类成功");
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 更新分类
 * PUT /admin/categories/:id
 */
router.put("/:id", async function (req, res, next) {
  try {
    const category = await getCategory(req);
    // 白名单过滤
    const body = filterBody(req);
    await category.update(body);
    // 相应数据
    res.json({
      status: true,
      message: "更新分类成功",
      data: {
        category,
      },
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 公共方法：查询当前分类
 */
async function getCategory(req) {
  // 获取分类id
  const { id } = req.params;
  // 查询分类
  const category = await Category.findByPk(id);
  if (!category) {
    throw new NotFoundError("分类不存在");
  }
  return category;
}

/**
 * 公共方法：白名单过滤
 * @param {*} req 
 * @returns {{name: string, rank: number!*}}
 */
function filterBody(req) {
  return {
    name: req.body.name,
    rank: req.body.rank,
  };
}

module.exports = router;
