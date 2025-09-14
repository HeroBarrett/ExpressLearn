- a.
运行 npm install 安装依赖
- b.
确保数据库配置正确（在config.json中）
- c.
运行迁移命令 npx sequelize-cli db:migrate 创建数据库表结构
- d.
可选：运行种子命令 npx sequelize-cli db:seed:all 填充测试数据