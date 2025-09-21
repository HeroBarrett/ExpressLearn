"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "Categories",
      [
        { name: "前端开发", rank: 1, createdAt: new Date(), updatedAt: new Date() },
        { name: "后端开发", rank: 2, createdAt: new Date(), updatedAt: new Date() },
        { name: "数据库", rank: 3, createdAt: new Date(), updatedAt: new Date() },
        { name: "运维", rank: 4, createdAt: new Date(), updatedAt: new Date() },
        { name: "测试", rank: 5, createdAt: new Date(), updatedAt: new Date() },
        { name: "移动开发", rank: 6, createdAt: new Date(), updatedAt: new Date() },
        { name: "UI/UX设计", rank: 7, createdAt: new Date(), updatedAt: new Date() },
        { name: "产品经理", rank: 8, createdAt: new Date(), updatedAt: new Date() },
        { name: "数据分析师", rank: 9, createdAt: new Date(), updatedAt: new Date() },
        { name: "数据科学家", rank: 10, createdAt: new Date(), updatedAt: new Date() },
        { name: "数据工程师", rank: 11, createdAt: new Date(), updatedAt: new Date() },
        { name: "数据架构师", rank: 12, createdAt: new Date(), updatedAt: new Date() },
        { name: "数据运维", rank: 13, createdAt: new Date(), updatedAt: new Date() },
        { name: "数据安全", rank: 14, createdAt: new Date(), updatedAt: new Date() },
        { name: "数据质量", rank: 15, createdAt: new Date(), updatedAt: new Date() },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
