- a.
运行 npm install 安装依赖
- b.
确保数据库配置正确（在config.json中）
- c.
运行迁移命令 npx sequelize-cli db:migrate 创建数据库表结构
- d.
可选：运行种子命令 npx sequelize-cli db:seed:all 填充测试数据



# Sequelize 使用

| 命令                                                         | 说明                                      |
| ------------------------------------------------------------ | ----------------------------------------- |
| sequelize db:create --charset utf8mb4 --collate utf8mb4_general_ci | 创建数据库-windows会有问题，到navicat创建 |
| sequelize model:generate --name Article --attributes title:string,content:text | 创建模型(表名字单数)-到迁移文件微调       |
| sequelize db:migrate                                         | 运行迁移命令                              |
| sequelize seed:generate --name article                       | 创建种子文件                              |
| sequelize db:seed --seed xxx-article                         | 运行指定种子文件                          |
| sequelize db:seed:all                                        | 慎用，会把种子文件全部执行                |



