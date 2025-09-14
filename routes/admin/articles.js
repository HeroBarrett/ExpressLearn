const express = require("express");
const router = express.Router();
const { Article } = require("../../models");

/**
 * 获取所有文章列表
 * GET /admin/articles
 */
router.get("/", async function (req, res, next) {
  try {
    // 定义倒序排列
    const condition = {
      order: [["id", "DESC"]],
    };
    // 从数据库获取数据
    const articles = await Article.findAll(condition);
    // res.json({ message: "这里是后台的文章列表接口~" });
    res.json({
      status: true,
      message: "获取文章列表成功",
      data: {
        articles,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "获取文章列表失败",
      error: [error.message],
    });
  }
});

/**
 * 查询文章详情
 * GET /admin/articles/:id
 */
router.get("/:id", async function (req, res) {
  try {
    // 获取文章id
    const{ id } = req.params;
    // 查询文章
    const article = await Article.findByPk(id);
    console.log(article);
    
    // 响应数据
    res.json({
      status: true,
      message: "获取文章详情成功",
      data: {
        article,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "获取文章详情失败",
      error: [error.message],
    })
  }
});

module.exports = router;
