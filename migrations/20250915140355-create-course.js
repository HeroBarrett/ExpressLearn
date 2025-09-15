'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Courses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED, // 无符号
      },
      categoryId: {
        type: Sequelize.INTEGER.UNSIGNED, // 无符号
        allowNull: false, // 不允许为空
      },
      userId: {
        type: Sequelize.INTEGER.UNSIGNED, // 无符号
        allowNull: false, // 不允许为空
      },
      name: {
        allowNull: false, // 不允许为空
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      recommended: {
        type: Sequelize.BOOLEAN
      },
      introductory: {
        allowNull: false, // 不允许为空
        type: Sequelize.BOOLEAN
      },
      content: {
        type: Sequelize.TEXT
      },
      likesCount: {
        allowNull: false, // 不允许为空
        type: Sequelize.INTEGER.UNSIGNED, // 无符号
      },
      chaptersCount: {
        allowNull: false, // 不允许为空
        type: Sequelize.INTEGER.UNSIGNED, // 无符号
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    // 添加索引
    await queryInterface.addIndex("Courses", {
      fields: ["categoryId"], // 要索引的字段
    });
    // 添加索引
    await queryInterface.addIndex("Courses", {
      fields: ["userId"], // 要索引的字段
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Courses');
  }
};