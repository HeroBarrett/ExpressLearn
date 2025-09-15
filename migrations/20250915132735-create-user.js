"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED, // 无符号
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false, // 不允许为空
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false, // 不允许为空
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false, // 不允许为空
      },
      nickname: {
        type: Sequelize.STRING,
        allowNull: false, // 不允许为空
      },
      sex: {
        type: Sequelize.TINYINT,
        allowNull: false, // 不允许为空
      },
      company: {
        type: Sequelize.STRING,
      },
      introduce: {
        type: Sequelize.TEXT,
      },
      role: {
        type: Sequelize.TINYINT.UNSIGNED, // 无符号
        allowNull: false, // 不允许为空
        defaultValue: 0, // 默认值0
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
    // 添加索引
    await queryInterface.addIndex("Users", {
      fields: ["email"], // 要索引的字段
      unique: true, // 唯一索引
    });
    // 添加索引
    await queryInterface.addIndex("Users", {
      fields: ["username"], // 要索引的字段
      unique: true, // 唯一索引
    });
    // 添加索引
    await queryInterface.addIndex("Users", {
      fields: ["role"], // 要索引的字段
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
