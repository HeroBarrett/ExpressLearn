"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Categories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED, // UNSIGNED-无符号
      },
      name: {
        allowNull: false, // 不允许为空
        type: Sequelize.STRING,
      },
      rank: {
        allowNull: false, // 不允许为空
        defaultValue: 1, // 默认值0
        type: Sequelize.INTEGER.UNSIGNED, // UNSIGNED-无符号
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Categories");
  },
};
