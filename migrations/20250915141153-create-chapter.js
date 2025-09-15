'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Chapters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED, // 无符号
      },
      courseId: {
        type: Sequelize.INTEGER.UNSIGNED, // 无符号
        allowNull: false, // 不允许为空
      },
      title: {
        allowNull: false, // 不允许为空
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.TEXT
      },
      video: {
        type: Sequelize.STRING
      },
      rank: {
        allowNull: false, // 不允许为空
        type: Sequelize.INTEGER.UNSIGNED, // 无符号
        defaultValue: 1, // 默认值1
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
    await queryInterface.addIndex("Chapters", {
      fields: ["courseId"], // 要索引的字段
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Chapters');
  }
};