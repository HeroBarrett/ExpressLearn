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
| sequelize db:migrate:undo                                    | 回滚迁移(删除表)                          |



# 建表：

![image-20250915212540315](C:\Users\c5106\AppData\Roaming\Typora\typora-user-images\image-20250915212540315.png)

### 建分类表：

sequelize model:generate --name Category --attributes name:string,rank:integer

稍作修改

```js
	id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED // UNSIGNED-无符号
      },
      name: {
        allowNull: false, // 不允许为空
        type: Sequelize.STRING,
      },
      rank: {
        allowNull: false, // 不允许为空
        defaultValue: 1, // 默认值0
        type: Sequelize.INTEGER.UNSIGNED // UNSIGNED-无符号
      },
```

### 建用户表：

sequelize model:generate --name User --attributes email:string,username:string,password:string,nickname:string,sex:tinyint,company:string,introduce:text,role:tinyint

微调

```js
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
```

### 建课程表：

sequelize model:generate --name Course --attributes categoryId:integer,userId:integer,name:string,image:string,recommended:boolean,introductory:boolean,content:text,likesCount:integer,chaptersCount:integer

微调数据

```js
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
```

### 建章节表：

sequelize model:generate --name Chapter --attributes courseId:integer,title:string,content:text,video:string,rank:integer

微调数据

```js
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
```

### 建点赞表：

sequelize model:generate --name Like --attributes courseId:integer,userId:integer

微调

```js
	await queryInterface.createTable('Likes', {
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
      userId: {
        type: Sequelize.INTEGER.UNSIGNED, // 无符号
        allowNull: false, // 不允许为空
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
    await queryInterface.addIndex("Likes", {
      fields: ["courseId"], // 要索引的字段
    });
    // 添加索引
    await queryInterface.addIndex("Likes", {
      fields: ["userId"], // 要索引的字段
    });
```



### 建系统表：

sequelize model:generate --name Setting --attributes name:string,icp:string,copyright:string

微调

```js
	id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED, // 无符号
      },
```

#### 

运行迁移文件：







































