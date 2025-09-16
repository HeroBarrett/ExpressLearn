const express = require("express");
const router = express.Router();
const { Article } = require("../../models");
const { Op } = require("sequelize");
const { NotFoundError, success, failure } = require("../../utils/response");

/**
 * 获取所有文章列表
 * GET /admin/articles
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
      // where: {
      //   title: {
      //     [Op.like]: `%${query.title}%`,
      //   },
      // },
    };

    // 模糊查询
    if (query.title) {
      condition.where = {
        title: {
          [Op.like]: `%${query.title}%`,
        },
      };
    }

    // 从数据库获取数据
    const { count, rows } = await Article.findAndCountAll(condition);
    // res.json({ message: "这里是后台的文章列表接口~" });
    success(res, "查询文章列表成功", {
      articles: rows,
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
 * 查询文章详情
 * GET /admin/articles/:id
 */
router.get("/:id", async function (req, res) {
  try {
    const article = await getArticle(req);

    // 响应数据
    success(res, "查询文章详情成功", {
      article,
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 创建文章
 * POST /admin/articles
 */
router.post("/", async function (req, res, next) {
  try {
    // 白名单过滤
    const body = filterBody(req);
    // 插入数据库
    const article = await Article.create(body);
    // 响应数据
    success(res, "创建文章成功", { article }, 201);
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 删除文章
 * Delete /admin/articles/:id
 */
router.delete("/:id", async function (req, res, next) {
  try {
    const article = await getArticle(req);
    // 删除文章
    await article.destroy();
    // 响应数据
    success(res, "删除文章成功");
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 更新文章
 * PUT /admin/articles/:id
 */
router.put("/:id", async function (req, res, next) {
  try {
    const article = await getArticle(req);
    // 白名单过滤
    const body = filterBody(req);
    await article.update(body);
    // 相应数据
    res.json({
      status: true,
      message: "更新文章成功",
      data: {
        article,
      },
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 公共方法：查询当前文章
 */
async function getArticle(req) {
  // 获取文章id
  const { id } = req.params;
  // 查询文章
  const article = await Article.findByPk(id);
  if (!article) {
    throw new NotFoundError("文章不存在");
  }
  return article;
}

/**
 * 公共方法：白名单过滤
 * @param erq
 * @returns {{}}
 */
function filterBody(req) {
  return {
    title: req.body.title,
    content: req.body.content,
  };
}

module.exports = router;
