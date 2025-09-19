const express = require("express");
const router = express.Router();
const { Category, Course } = require("../../models");
const { Op } = require("sequelize");
const { success, failure } = require("../../utils/responses");
const { NotFound, Conflict } = require("http-errors");

/**
 * 获取所有分类列表
 * GET /admin/categories
 */
router.get("/", async function (req, res, next) {
  /**
   * 查询分类列表
   * GET /admin/categories
   */
  router.get("/", async function (req, res) {
    try {
      const query = req.query;

      const condition = {
        where: {},
        order: [
          ["rank", "ASC"],
          ["id", "ASC"],
        ],
      };

      if (query.name) {
        condition.where.name = {
          [Op.like]: `%${query.name}%`,
        };
      }

      const categories = await Category.findAll(condition);
      success(res, "查询分类列表成功。", {
        categories: categories,
      });
    } catch (error) {
      failure(res, error);
    }
  });
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

    const count = await Course.count({ where: { categoryId: req.params.id } });
    if (count > 0) {
      throw new Conflict("该分类下有课程，不能删除");
    }
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
    throw new NotFound("分类不存在");
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
