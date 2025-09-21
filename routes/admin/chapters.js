const express = require("express");
const router = express.Router();
const { Chapter, Course } = require("../../models");
const { Op } = require("sequelize");
const { success, failure } = require("../../utils/responses");
const { NotFound, BadRequest } = require("http-errors");
const { delKey } = require("../../utils/redis");

/**
 * 获取所有章节列表
 * GET /admin/chapters
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

    if (!query.courseId) {
      throw new BadRequest("获取章节列表失败，课程ID不能为空");
    }

    // 配置项
    const condition = {
      ...getCondition(),
      where: {},
      order: [
        ["rank", "ASC"],
        ["id", "ASC"],
      ],
      limit: pageSize,
      offset: offset,
    };

    condition.where.courseId = query.courseId;

    if (query.title) {
      condition.where.title = {
        [Op.like]: `%${query.title}%`,
      };
    }

    // 从数据库获取数据
    const { count, rows } = await Chapter.findAndCountAll(condition);
    // res.json({ message: "这里是后台的章节列表接口~" });
    success(res, "查询章节列表成功", {
      chapters: rows,
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
 * 查询章节详情
 * GET /admin/chapters/:id
 */
router.get("/:id", async function (req, res) {
  try {
    const chapter = await getChapter(req);

    // 响应数据
    success(res, "查询章节详情成功", {
      chapter,
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 创建章节
 * POST /admin/chapters
 */
router.post("/", async function (req, res, next) {
  try {
    // 白名单过滤
    const body = filterBody(req);
    // 插入数据库
    const chapter = await Chapter.create(body);
    // 课程章节数 +1
    await Course.increment("chaptersCount", {
      where: { id: chapter.courseId },
    });
    // 清除缓存
    await clearCache(chapter);
    // 响应数据
    success(res, "创建章节成功", { chapter }, 201);
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 删除章节
 * Delete /admin/chapters/:id
 */
router.delete("/:id", async function (req, res, next) {
  try {
    const chapter = await getChapter(req);
    // 删除章节
    await chapter.destroy();
    // 清除缓存
    await clearCache(chapter);
    // 响应数据
    success(res, "删除章节成功");
    // 课程章节数 -1
    await Course.decrement("chaptersCount", {
      where: { id: chapter.courseId },
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 更新章节
 * PUT /admin/chapters/:id
 */
router.put("/:id", async function (req, res, next) {
  try {
    const chapter = await getChapter(req);
    // 白名单过滤
    const body = filterBody(req);
    await chapter.update(body);
    // 清除缓存
    await clearCache(chapter);
    // 相应数据
    success(res, "更新章节成功", { chapter });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 公共方法：关联课程数据
 * @returns {{include: [{as: string, model, attributes: string[]}], attributes: {exclude: string[]}}}
 */
function getCondition() {
  return {
    attributes: { exclude: ["CourseId"] },
    include: [
      {
        model: Course,
        as: "course",
        attributes: ["id", "name"],
      },
    ],
  };
}

/**
 * 公共方法：查询当前章节
 */
async function getChapter(req) {
  // 获取章节id
  const { id } = req.params;
  const condition = getCondition();
  // 查询章节
  const chapter = await Chapter.findByPk(id, condition);
  if (!chapter) {
    throw new NotFound("章节不存在");
  }
  return chapter;
}

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{rank: (number|*), video: (string|boolean|MediaTrackConstraints|VideoConfiguration|*), title, courseId: (number|*), content}}
 */
function filterBody(req) {
  return {
    courseId: req.body.courseId,
    title: req.body.title,
    content: req.body.content,
    video: req.body.video,
    rank: req.body.rank,
  };
}

/**
 * 清除缓存
 * @param chapter
 * @returns {Promise<void>}
 */
async function clearCache(chapter) {
  await delKey(`chapters:${chapter.courseId}`);
  await delKey(`chapter:${chapter.id}`);
}

module.exports = router;
