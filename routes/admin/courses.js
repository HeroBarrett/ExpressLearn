const express = require("express");
const router = express.Router();
const { Course, Category, User, Chapter } = require("../../models");
const { Op } = require("sequelize");
const { NotFoundError, success, failure } = require("../../utils/response");

/**
 * 获取所有课程列表
 * GET /admin/courses
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
    const condition = getCondition();

    // 模糊查询
    if (query.categoryId) {
      condition.where = {
        categoryId: {
          [Op.eq]: query.categoryId,
        },
      };
    }
    if (query.userId) {
      condition.where = {
        userId: {
          [Op.eq]: query.userId,
        },
      };
    }
    if (query.name) {
      condition.where = {
        name: {
          [Op.like]: `%${query.name}%`,
        },
      };
    }
    if (query.recommended) {
      condition.where = {
        recommended: {
          // 需要转布尔值
          [Op.eq]: query.recommended === "true",
        },
      };
    }
    if (query.introductory) {
      condition.where = {
        introductory: {
          [Op.eq]: query.introductory === "true",
        },
      };
    }

    // 从数据库获取数据
    const { count, rows } = await Course.findAndCountAll(condition);
    // res.json({ message: "这里是后台的课程列表接口~" });
    success(res, "查询课程列表成功", {
      courses: rows,
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
 * 查询课程详情
 * GET /admin/courses/:id
 */
router.get("/:id", async function (req, res) {
  try {
    const course = await getCourse(req);

    // 响应数据
    success(res, "查询课程详情成功", {
      course,
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 创建课程
 * POST /admin/courses
 */
router.post("/", async function (req, res, next) {
  try {
    // 白名单过滤
    const body = filterBody(req);
    // 插入数据库
    const course = await Course.create(body);
    // 响应数据
    success(res, "创建课程成功", { course }, 201);
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 删除课程
 * Delete /admin/courses/:id
 */
router.delete("/:id", async function (req, res, next) {
  try {
    const course = await getCourse(req);

    const count = await Chapter.count({ where: { courseId: course.id } });
    if (count > 0) {
      throw new Error("该课程下存在章节，不能删除");
    }
    await course.destroy();
    success(res, "删除课程成功");
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 更新课程
 * PUT /admin/courses/:id
 */
router.put("/:id", async function (req, res, next) {
  try {
    const course = await getCourse(req);
    // 白名单过滤
    const body = filterBody(req);
    await course.update(body);
    // 相应数据
    res.json({
      status: true,
      message: "更新课程成功",
      data: {
        course,
      },
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 公共方法：查询配置项
 * @returns {Object} 配置项
 */
function getCondition() {
  return {
    attributes: { exclude: ["CategoryId", "UserId"] },
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "name"],
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "username", "avatar"],
      },
    ],
  };
}

/**
 * 公共方法：查询当前课程
 */
async function getCourse(req) {
  // 获取课程id
  const { id } = req.params;
  const condition = getCondition();
  // 查询课程
  const course = await Course.findByPk(id, condition);
  if (!course) {
    throw new NotFoundError("课程不存在");
  }
  return course;
}

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{image: *, name, introductory: (boolean|*), userId: (number|*), categoryId: (number|*), content, recommended: (boolean|*)}}
 */
function filterBody(req) {
  return {
    categoryId: req.body.categoryId,
    userId: req.body.userId,
    name: req.body.name,
    image: req.body.image,
    recommended: req.body.recommended,
    introductory: req.body.introductory,
    content: req.body.content,
  };
}

module.exports = router;
