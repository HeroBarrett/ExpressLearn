# NodeJS后端Express框架的使用学习

# 项目介绍

项目使用了 Node.js + Express + MySQL + Sequelize ORM 开发。

让我们一起从零基础开始，学习接口开发。先从最基础的项目搭建、数据库的入门，再到完整的真实项目开发，一步步的和大家一起完成一个真实的项目。

## 配置环境变量

将`.env.example`文件拷贝为`.env`文件，并修改配置。

```txt
NODE_ENV=development
PORT=3000
SECRET=你的密钥

ALIYUN_ACCESS_KEY_ID=阿里云的 AccessKey ID
ALIYUN_ACCESS_KEY_SECRET=阿里云的 AccessKey Secret
ALIYUN_BUCKET=阿里云 OSS 的 Bucket 名称
ALIYUN_REGION=阿里云 OSS Bucket 所在地域名称

MAILER_HOST=邮件服务器地址
MAILER_PORT=邮件服务器端口
MAILER_SECURE=465端口填写：true，否则填写：false
MAILER_USER=你的邮箱地址
MAILER_PASS=你的邮箱授权码或密码
```

- `NODE_ENV`配置为开发环境，如部署在生产环境可改为`production`。
- `PORT`配置为服务端口。
- `SECRET`配置为密钥。
- `ALIYUN`开头的配置，均为阿里云的配置。请注册阿里云云账号，创建存储空间，并创建`Access Key`。
- `MAILER`开头的配置，为邮件服务器的配置。



## 生成秘钥

在命令行中运行

```shell
node
```

进入交互模式后，运行

```shell
const crypto = require('crypto');
console.log(crypto.randomBytes(32).toString('hex'));
```

复制得到的秘钥，并填写到`.env`文件中的`SECRET`配置。

> PS：可以使用 `ctrl + c` 退出交互模式。

## 配置数据库

项目使用 Docker 容器运行 MySQL 数据库。安装好 Docker 后，可直接启动 MySQL。

```shell
docker-compose up -d
```

如需使用自行安装的 MySQL，需要修改`config/config.json`文件中的数据库用户名与密码。

```json
{
  "development": {
    "username": "您的数据库用户名",
    "password": "您的数据库密码"
  }
}
```

## 安装与运行

```shell
# 安装项目依赖包

npm i

# 创建数据库。如创建失败，可以手动建库。

npx sequelize-cli db:create --charset utf8mb4 --collate utf8mb4_general_ci

# 运行迁移，自动建表。

npx sequelize-cli db:migrate

# 运行种子，填充初始数据。

npx sequelize-cli db:seed:all

# 启动服务

npm start
```

访问地址：[http://localhost:3000](http://localhost:3000)，详情请看接口文档。

## 初始管理员账号

```txt
账号：admin
密码: 123123
```









# 一、express的使用

## 01-nvm 安装 Node.js

使用nvm可以安装多个不同版本的`Node.js`，并且根据需要随意的切换所需版本。



​	查看node的所有版本

```
nvm list available
```

​	安装指定版本的node

```
nvm install 22.19.0
```

​	查看node版本

```
node -v
```

​	查看所有安装过的版本

```
nvm list
```

​	使用别的版本的node

```
nvm use 18.20.2
```



## 02-安装Express脚手架



​	安装express-generator工具脚本

```
npm i -g express-generator@4

# 注意：Windows有可能碰到提示：npm : 无法加载文件 C:\Program Files\nodejs\npm.ps1，因为在此系统上禁止运行脚本。
# 如果碰到这个错误，需要用`管理员身份`打开PowerShell，然后运行：
Set-ExecutionPolicy RemoteSigned
```

​	创建项目

```
express --no-view 【项目名】
```



项目是专门开发接口的，而接口所需要的是`json`格式，而不是直接输出`HTML`。

所以项目输出需要修改为json格式

```js
router.get('/', function (req, res, next) {
  res.json({ message: 'Hello Node.js' });
});
```



​	使用nodemon监听项目(热更新)

```
npm i nodemon
```

​	然后打开项目根目录下的`package.json`，将`start`这里修改为

```js
"scripts": {
  "start": "nodemon ./bin/www"
},
```



## 03-使用 Sequelize ORM

在项目中我们使用`Sequelize ORM`来操作数据库

第一步，安装`sequelize`的命令行工具，需要全局安装，这样更方便使用

```
npm i -g sequelize-cli
```

第二步，安装当前项目所依赖的`sequelize`包和对数据库支持依赖的`mysql2`

```
npm i sequelize mysql2
```

第三步，初始化项目

```
sequelize init
```

可以看到，提示我们，创建了一个`config`配置文件和三个目录，这些就是`sequelize`所需要的东西了。

| 文件或目录         | 说明           |
| ------------------ | -------------- |
| config/config.json | 数据库连接配置 |
| migrations         | 迁移文件       |
| models             | 模型文件       |
| seeders            | 种子文件       |



## 04-Sequelize 使用

| 命令行                                                       | 说明                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| sequelize db:create --charset utf8mb4 --collate utf8mb4_general_ci | 创建数据库-windows会有问题，到navicat创建                    |
| sequelize model:generate --name Article --attributes title:string,content:text | 创建模型(表名字单数)-到迁移文件微调                          |
| sequelize db:migrate                                         | 运行迁移命令                                                 |
| sequelize seed:generate --name article                       | 创建种子文件                                                 |
| sequelize db:seed --seed xxx-article                         | 运行指定种子文件                                             |
| sequelize db:seed:all                                        | 慎用，会把种子文件全部执行                                   |
| sequelize db:migrate:undo                                    | 回滚迁移(删除表)                                             |
|                                                              |                                                              |
| ---------模型操作命令-----------                             | ------------说明-----------                                  |
| 模型.findAll()                                               | 查找全部数据                                                 |
| 模型.findByPk(id)                                            | 根据住建（id）查找                                           |
| 模型.create(body)                                            | 创建一条数据                                                 |
| 模型.destroy()                                               | 不需要传参，先把模型.findByPk(id)找到后再删除                |
| 模型.update(body);                                           | 修改一条数据，先把模型.findByPk(id)找到后再修改              |
| 模型.findAndCountAll(condition)                              | 分页查找,count 是查询到的数据的总数，rows 中才是最终查询到的数据 |
| 模型.count({ where: { categoryId: req.params.id } })         | 查询有几条记录                                               |



## 05-发送请求的配置

### 实现倒序

因为文章是id最后的开始。先来定义一个条件，里面写明，`order`要按照`id`倒序

```js
// 定义查询条件
const condition = {
  order: [['id', 'DESC']]
};
```

然后传入查找数据库的方法

```js
const articles = await Article.findAll(condition);
```

### 模糊搜索

```js
// 如果有 title 查询参数，就添加到 where 条件中
    if(query.title) {
      condition.where = { // 添加到前面定义的condition对象中 
        title: {
          [Op.like]: `%${query.title}%` 
        }
      };
    }	
```

### 分页查找

​	sql语句中，传入的LIMIT如下

```sql
# sql
SELECT * FROM `Articles` LIMIT 0, 10;
SELECT * FROM `Articles` LIMIT 10, 10;
```

| 当前页数（currentPage） | 从哪里开始（offset） | 每页显示多少条（pageSize） |
| ----------------------- | -------------------- | -------------------------- |
| 第 1 页                 | 0                    | 10                         |
| 第 2 页                 | 10                   | 10                         |
| 第 3 页                 | 20                   | 10                         |

​	*推算出公式*	

```
offset = (currentPage - 1) * pageSize
```

```js
// 当前是第几页，如果不传，那就是第一页
 const currentPage = Math.abs(Number(query.currentPage)) || 1;

// 每页显示多少条数据，如果不传，那就显示10条
 const pageSize = Math.abs(Number(query.pageSize)) || 10;

// 计算 offset
const offset = (currentPage - 1) * pageSize;

const condition = {
  order: [['id', 'DESC']],

  // 在查询条件中添加 limit 和 offset
  limit: pageSize,
  offset: offset
};
```

接着还要修改下查询代码

```js
// 将 findAll 方法改为 findAndCountAll 方法
// findAndCountAll 方法会返回一个对象，对象中有两个属性，一个是 count，一个是 rows，
// count 是查询到的数据的总数，rows 中才是最终查询到的数据
const { count, rows } = await Article.findAndCountAll(condition);

// 返回查询结果
res.json({
  status: true,
  message: '查询文章列表成功。',
  data: {
    articles: rows,
    pagination: {
      total: count,
      currentPage,
      pageSize,
    },
  }
});

```

### 白名单过滤

**永远不要相信用户提交的任何数据！！！！**

解构出需要使用的字段再使用

```js
// 白名单过滤
// 因为用户提交的数据可能会包含一些我们不需要的数据，所以我们需要过滤一下
// 只获取 title 和 content
const body = {
  title: req.body.title,
  content: req.body.content,
}

// 使用过滤好的 body 数据，创建文章
const article = await Article.create(body);

```



## 06-验证表单数据

将数据验证，写到模型之中

打开`models/article.js`。找到`title`这个地方，改为这样。

```js
title: {
  type: DataTypes.STRING,	// 首先定义了标题的类型是字符串
  allowNull: false,	// 不允许空
  validate: {	// 出错了对应的提示信息
    notNull: {		// 没有传title
      msg: '标题必须存在。'
    },
    notEmpty: {		// 传了title过来，但是却没有值
      msg: '标题不能为空。'
    },
    len: {	
      args: [2, 45],
      msg: '标题长度需要在2 ~ 45个字符之间。'
    }
  }
},
```

修改异常，当验证表单抛出异常时，error会接受到`error.name`。还有实际的错误信息，位置在`error.errors`，里面又是个数组，这说明可能会有多个错误信息，但我们只需要分别取出它们的`message`，提示给用户看就好了

```js
if (error.name === 'SequelizeValidationError') {
  const errors = error.errors.map(e => e.message);

  res.status(400).json({
    status: false,
    message: '请求参数错误。',
    errors
  });
} else {
  res.status(500).json({
    status: false,
    message: '创建文章失败。',
    errors: [error.message]
  });
}
```

## 07-封装

参考网站



常用的响应码

| 响应         | 状态码 | 说明                                      |
| ------------ | ------ | ----------------------------------------- |
| 请求成功     | 200    | 正确响应了                                |
| 创建数据成功 | 201    | 正确响应了，并创建了新的资源              |
| 请求参数错误 | 400    | 数据验证失败，而且还需要 map 遍历错误信息 |
| 数据不存在   | 404    | 查询不存在的内容                          |
| 服务器错误   | 500    | 未知的各种问题                            |



RESTful 风格路由

| 请求方式 | 请求地址            | 说明         |
| -------- | ------------------- | ------------ |
| GET      | /admin/articles     | 查询文章列表 |
| GET      | /admin/articles/:id | 查询文章详情 |
| POST     | /admin/articles     | 创建文章     |
| PUT      | /admin/articles/:id | 更新文章     |
| DELETE   | /admin/articles/:id | 删除文章     |

# 二、数据库设计+Sequelize

- 每一个分类，都包含有多个课程。这种情况，我们叫做：`一对多`，英文叫做`hasMany`。
- 那反过来，每个课程，都`属于`一个分类。这种情况，我们叫做`belongsTo`。



## 01-设计数据库

```
---- Categories：分类表
id（编号）: integer，主键，不为null，无符号，自增 
name（名称）：varchar，不为null
rank（排序）：integer，无符号，不为null，默认值：1
```

```
---- Courses：课程表
id（编号）: integer，主键，不为null，无符号，自增 
categoryId（分类 ID）：integer，无符号，不为null，index索引
userId（用户Id）：integer，无符号，不为null，index索引
name（名称）：varchar，不为null
image（课程图片）：varchar
recommended（是否推荐课程）: boolean，不为null，默认false，index索引
introductory（是否入门课程）：boolean，不为null，默认false，index索引
content（课程内容）：text
likesCount（课程的点赞数量）：integer，无符号，不为null，默认0
chaptersCount（课程的章节数量）: integer，无符号，不为null，默认0
```

```
---- Chapters：章节表
id（编号）: integer，主键，不为null，无符号，自增
courseId（课程 ID）：integer，无符号，不为null，index索引
title（章节标题）：varchar，不为null
content（章节内容）：text
video（视频地址）：varchar
rank（排序）：integer，无符号，默认值1，不为null
```

```
---- Users：用户表
id（编号）: integer，主键，不为null，无符号，自增
email（电子邮箱）：varchar，不为null，unique索引
username（用户名）：varchar，不为null，unique索引
nickname（昵称）：varchar，不为null
password（密码）：varchar，不为null
avatar（头像）: varchar
sex（性别）：tinyint，不为null，无符号。0为男性，1为女性，2为不选择。默认为：2
company（公司・学校名）: varchar
introduce（自我介绍）：text
role（用户组）：tinyint，不为null，无符号，index索引。0为普通用户，100为管理员。默认为：0
```

```
---- Likes：点赞表
id（编号）: integer，主键，不为null，无符号，自增
courseId（课程ID）：integer，无符号，不为null，index索引
userId（用户ID）：integer，无符号，不为null，index索引
```

```
---- Settings：设置表
id（编号）: integer，主键，不为null，无符号，自增
name（项目名称）：varchar
icp（备案号）：varchar
copyright（版权信息）：varchar
```



## 02-MySQL Workbench 的使用

为了更方便浏览，我们将上一回数据库设计的文字内容，整理为表格形式。

**文章表：Articles**

| 字段          | 类型    | 允许 Null | 无符号 | 自增 | 索引    | 默认值 |
| ------------- | ------- | --------- | ------ | ---- | ------- | ------ |
| id(编号)      | integer | NO        | YES    | YES  | PRIMARY | -      |
| title(标题)   | varchar | NO        | -      | -    | -       | -      |
| content(内容) | text    | NO        | -      | -    | -       | -      |

**分类表：Categories**

| 字段       | 类型    | 允许 Null | 无符号 | 自增 | 索引    | 默认值 |
| ---------- | ------- | --------- | ------ | ---- | ------- | ------ |
| id(编号)   | integer | NO        | YES    | YES  | PRIMARY | -      |
| name(名称) | varchar | NO        | -      | -    | -       | -      |
| rank(排序) | integer | NO        | YES    | -    | -       | 1      |

**课程表：Courses**

| 字段                  | 类型    | 允许 Null | 无符号 | 自增 | 索引    | 默认值 |
| --------------------- | ------- | --------- | ------ | ---- | ------- | ------ |
| id(编号)              | integer | NO        | YES    | YES  | PRIMARY | -      |
| categoryId(分类 id)   | integer | NO        | YES    | -    | INDEX   | -      |
| userId(用户 id)       | integer | NO        | YES    | -    | INDEX   | -      |
| name(名称)            | varchar | NO        | -      | -    | -       | -      |
| image(图片)           | varchar | -         | -      | -    | -       | -      |
| recommended(推荐)     | boolean | NO        | -      | -    | INDEX   | false  |
| introductory(入门)    | boolean | NO        | -      | -    | INDEX   | false  |
| content(内容)         | text    | -         | -      | -    | -       | -      |
| likesCount(点赞数)    | integer | NO        | YES    | -    | -       | 0      |
| chaptersCount(章节数) | integer | NO        | YES    | -    | -       | 0      |

**章节表：Chapters**

| 字段              | 类型    | 允许 Null | 无符号 | 自增 | 索引    | 默认值 |
| ----------------- | ------- | --------- | ------ | ---- | ------- | ------ |
| id(编号)          | integer | NO        | YES    | YES  | PRIMARY | -      |
| courseId(课程 id) | integer | NO        | YES    | -    | INDEX   | -      |
| title(标题)       | varchar | NO        | -      | -    | -       | -      |
| content(内容)     | text    | -         | -      | -    | -       | -      |
| video(视频地址)   | varchar | -         | -      | -    | -       | -      |
| rank(排序)        | integer | NO        | -      | -    | -       | 1      |

**用户表：Users**

| 字段                | 类型    | 允许 Null | 无符号 | 自增 | 索引    | 默认值 | 备注                   |
| ------------------- | ------- | --------- | ------ | ---- | ------- | ------ | ---------------------- |
| id(编号)            | integer | NO        | YES    | YES  | PRIMARY | -      |                        |
| email(邮箱)         | varchar | NO        | -      | -    | UNIQUE  | -      |                        |
| username(用户名)    | varchar | NO        | -      | -    | UNIQUE  | -      |                        |
| password(密码)      | varchar | NO        | -      | -    | -       | -      |                        |
| nickname(昵称)      | varchar | NO        | -      | -    | -       | -      |                        |
| sex(性别)           | tinyint | NO        | -      | -    | -       | 2      | 0-男, 1-女, 2-未选择   |
| avatar(头像)        | varchar | -         | -      | -    | -       | -      |                        |
| company(公司)       | varchar | -         | -      | -    | -       | -      |                        |
| introduce(自我介绍) | text    | -         | -      | -    | -       | -      |                        |
| role(用户组)        | tinyint | NO        | YES    | -    | INDEX   | 0      | 0-普通用户, 100-管理员 |

**点赞表：Likes**

| 字段              | 类型    | 允许 Null | 无符号 | 自增 | 索引    |
| ----------------- | ------- | --------- | ------ | ---- | ------- |
| id(编号)          | integer | NO        | YES    | YES  | PRIMARY |
| courseId(课程 id) | integer | NO        | YES    | -    | INDEX   |
| userId(用户 id)   | integer | NO        | YES    | -    | INDEX   |

**设置表：Settings**

| 字段                | 类型    | 允许 Null | 无符号 | 自增 | 索引    |
| ------------------- | ------- | --------- | ------ | ---- | ------- |
| id(编号)            | integer | NO        | YES    | YES  | PRIMARY |
| name(项目名称)      | varchar | -         | -      | -    | -       |
| icp(备案号)         | varchar | -         | -      | -    | -       |
| copyright(版权信息) | varchar | -         | -      | -    | -       |



















![image-20250915212540315](C:\Users\c5106\AppData\Roaming\Typora\typora-user-images\image-20250915212540315.png)







### 建分类表：

```
sequelize model:generate --name Category --attributes name:string,rank:integer
```

稍作修改

- id，增加无符号
- name，增加不为空
- rank，增加不为空，默认值为 1，无符号

```js
async up(queryInterface, Sequelize) {
  await queryInterface.createTable('Categories', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER.UNSIGNED	// 无符号
    },
    name: {
      allowNull: false,		// 不为空
      type: Sequelize.STRING
    },
    rank: {
      allowNull: false,		// 不为空
      defaultValue: 1,	// 默认值为 1
      type: Sequelize.INTEGER.UNSIGNED	// 无符号
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
},

```

### 建用户表：

```
sequelize model:generate --name User --attributes email:string,username:string,password:string,nickname:string,sex:tinyint,company:string,introduce:text,role:tinyint
```

稍作修改

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

```
sequelize model:generate --name Course --attributes categoryId:integer,userId:integer,name:string,image:string,recommended:boolean,introductory:boolean,content:text,likesCount:integer,chaptersCount:integer
```

稍作修改

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

```
sequelize model:generate --name Chapter --attributes courseId:integer,title:string,content:text,video:string,rank:integer
```

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

```
sequelize model:generate --name Like --attributes courseId:integer,userId:integer
```

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



### 建系统设置表：

```
sequelize model:generate --name Setting --attributes name:string,icp:string,copyright:string
```

微调

```js
	id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED, // 无符号
      },
```

# 接口开发



## 01-分类接口

先添加点默认数据，好方便我们做测试，新建一个种子文件

```
sequelize seed:generate --name category
```

稍作修改

```js
async up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('Categories', [
    { name: '前端开发', rank: 1, createdAt: new Date(), updatedAt: new Date() },
    { name: '后端开发', rank: 2, createdAt: new Date(), updatedAt: new Date() },
    { name: '移动端开发', rank: 3, createdAt: new Date(), updatedAt: new Date() },
    { name: '数据库', rank: 4, createdAt: new Date(), updatedAt: new Date() },
    { name: '服务器运维', rank: 5, createdAt: new Date(), updatedAt: new Date() },
    { name: '公共', rank: 6, createdAt: new Date(), updatedAt: new Date() },
  ], {});
},

async down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Categories', null, {});
}
```

运行种子

```
sequelize db:seed --seed xxx-category
```

### 修改模型，增加验证

```js
name: {
  type: DataTypes.STRING,
  allowNull: false,
  unique: { msg: '名称已存在，请选择其他名称。' },	// 不好用!!!!!推荐用户管理接口的自己判断
  validate: {
    notNull: { msg: '名称必须填写。' },
    notEmpty: { msg: '名称不能为空。' },
    len: { args: [2, 45], msg: '长度必须是2 ~ 45之间。' }
  }
},
rank: {
  type: DataTypes.INTEGER,
  allowNull: false,
  validate: {
    notNull: { msg: '排序必须填写。' },
    notEmpty: { msg: '排序不能为空。' },
    isInt: { msg: '排序必须为整数。' },
    isPositive(value) {	// 自定义验证
      if (value <= 0) {
        throw new Error('排序必须是正整数。');
      }
    }
  }
},
```







## 02-系统设置接口

先添加点默认数据，好方便我们做测试，新建一个种子文件

```
sequelize seed:generate --name setting
```

稍作修改

```js
async up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('Settings', [{
    name: '长乐未央',
    icp: '鄂ICP备13016268号-11',
    copyright: '© 2013 Changle Weiyang Inc. All Rights Reserved.',
    createdAt: new Date(),
    updatedAt: new Date()
  }], {});
},

async down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Settings', null, {});
}
```

运行种子

```
sequelize db:seed --seed xxx-setting
```







## 03-用户管理接口

在开发用户接口之前，我们先检查一下数据库，发现用户的头像忘记创建了。我们现在就新建另一个迁移，来给用户表中增加头像字段。

```js
sequelize migration:create --name add-avatar-to-user
```

打开生成的迁移文件后，修改为

```js
async up (queryInterface, Sequelize) {
  await queryInterface.addColumn('Users', 'avatar', {	// 添加字段（列）
    type: Sequelize.STRING
  })
},

async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('Users', 'avatar')
}
```

运行一下迁移命令

```
sequelize db:migrate
```

去`User`模型文件里，自己手动增加`avatar`字段

```js
User.init({
  // ... 
  avatar: DataTypes.STRING 
}
```

先添加点默认数据，好方便我们做测试，新建一个种子文件

```
sequelize seed:generate --name user
```

稍作修改

```js
async up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('Users', [
    {
      email: 'admin@clwy.cn',
      username: 'admin',
      password: '123123',
      nickname: '超厉害的管理员',
      sex: 2,
      role: 100,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'user1@clwy.cn',
      username: 'user1',
      password: '123123',
      nickname: '普通用户1',
      sex: 0,
      role: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'user2@clwy.cn',
      username: 'user2',
      password: '123123',
      nickname: '普通用户2',
      sex: 0,
      role: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'user3@clwy.cn',
      username: 'user3',
      password: '123123',
      nickname: '普通用户3',
      sex: 1,
      role: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {});
},

async down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Users', null, {});
}
```

运行种子

```
sequelize db:seed --seed xxx-user
```

### 修改模型，增加验证

```js
email: {
  type: DataTypes.STRING,
  allowNull: false,
  validate: {
    notNull: { msg: '邮箱必须填写。' },
    notEmpty: { msg: '邮箱不能为空。' },
    isEmail: { msg: '邮箱格式不正确。' },
    async isUnique(value) {
      const user = await User.findOne({ where: { email: value } })
      if (user) {
        throw new Error('邮箱已存在，请直接登录。');
      }
    }
  }
},
username: {
  type: DataTypes.STRING,
  allowNull: false,
  validate: {
    notNull: { msg: '用户名必须填写。' },
    notEmpty: { msg: '用户名不能为空。' },
    len: { args: [2, 45], msg: '用户名长度必须是2 ~ 45之间。' },
    async isUnique(value) {
      const user = await User.findOne({ where: { username: value } })
      if (user) {
        throw new Error('用户名已经存在。');
      }
    }
  },
},
password: {
  type: DataTypes.STRING,
  allowNull: false,
  validate: {
    notNull: { msg: '密码必须填写。' },
    notEmpty: { msg: '密码不能为空。' },
    len: { args: [6, 45], msg: '密码长度必须是6 ~ 45之间。' }
  }
},
nickname: {
  type: DataTypes.STRING,
  allowNull: false,
  validate: {
    notNull: { msg: '昵称必须填写。' },
    notEmpty: { msg: '昵称不能为空。' },
    len: { args: [2, 45], msg: '昵称长度必须是2 ~ 45之间。' }
  }
},
sex: {
  type: DataTypes.TINYINT,
  allowNull: false,
  validate: {
    notNull: { msg: '性别必须填写。' },
    notEmpty: { msg: '性别不能为空。' },
    isIn: { args: [[0, 1, 2]], msg: '性别的值必须是，男性：0 女性：1 未选择：2。' }
  }
},
company: DataTypes.STRING,
introduce: DataTypes.TEXT,
role: {
  type: DataTypes.TINYINT,
  allowNull: false,
  validate: {
    notNull: { msg: '用户组必须选择。' },
    notEmpty: { msg: '用户组不能为空。' },
    isIn: { args: [[0, 100]], msg: '用户组的值必须是，普通用户：0 管理员：100。' }
  }
},
avatar: {
  type: DataTypes.STRING,
  validate: {
    isUrl: { msg: '图片地址不正确。' }
  }
},
```

```js
// 因为unique验证不好用，将分类接口模型的唯一验证，也修复一下
name: {
  type: DataTypes.STRING,
  allowNull: false,
  validate: {
    notNull: { msg: '名称必须填写。' },
    notEmpty: { msg: '名称不能为空。' },
    len: { args: [2, 45], msg: '长度必须是2 ~ 45之间。' },
    async isUnique(value) {
      const category = await Category.findOne({ where: { name: value } })
      if (category) {
        throw new Error('名称已存在，请选择其他名称。');
      }
    }
  }
},
```

### *使用 bcryptjs加密数据

密码不要明文存储在数据库里，而是要进行加密存储

安装*bcryptjs*

```
npm i bcryptjs
```

修改模型

```js
// 先引入
const bcrypt = require('bcryptjs');
// .......

password: {
  type: DataTypes.STRING,
  allowNull: false,
  set(value) {
    // 检查是否为空
    if (!value) {
      throw new Error('密码必须填写。');
    }

    // 检查长度
    if (value.length < 6 || value.length > 45) {
      throw new Error('密码长度必须是6 ~ 45之间。');
    }

    // 如果通过所有验证，进行hash处理并设置值
    this.setDataValue('password', bcrypt.hashSync(value, 10));
  }
},
```

修改种子文件

```js
// 引入
const bcrypt = require('bcryptjs');
// ......
// 密码部分改为
password: bcrypt.hashSync('123123', 10),
```

清空表后执行种子命令

```
sequelize db:seed --seed xxx-user
```

验证密码是否正确

```js
const isPasswordValid = bcrypt.compareSync("用户输入的密码", "加密后的密码");
// isPasswordValid ->  true or false
```





## 04-课程接口（关联模型）

> 如何防止出现孤儿记录  -> 重点

先生成一个种子文件

```
sequelize seed:generate --name course
```

加入数据

```js
async up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('Courses', [
    {
      categoryId: 1,
      userId: 1,
      name: 'CSS 入门',
      recommended: true,
      introductory: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      categoryId: 2,
      userId: 1,
      name: 'Node.js 项目实践（2024 版）',
      recommended: true,
      introductory: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ], {});
},

async down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Courses', null, {});
}
```

运行种子，刷新数据库

```
sequelize db:seed --seed xxx-course
```

### 修改模型（增加验证）

```js
categoryId: {
  type: DataTypes.INTEGER,
  allowNull: false,
  validate: {
    notNull: { msg: '分类ID必须填写。' },
    notEmpty: { msg: '分类ID不能为空。' },
    async isPresent(value) {
      const category = await sequelize.models.Category.findByPk(value)
      if (!category) {
        throw new Error(`ID为：${value} 的分类不存在。`);
      }
    }
  }
},
userId: {
  type: DataTypes.INTEGER,
  allowNull: false,
  validate: {
    notNull: { msg: '用户ID必须填写。' },
    notEmpty: { msg: '用户ID不能为空。' },
    async isPresent(value) {
      const user = await sequelize.models.User.findByPk(value)
      if (!user) {
        throw new Error(`ID为：${value} 的用户不存在。`);
      }
    }
  }
},
name: {
  type: DataTypes.STRING,
  allowNull: false,
  validate: {
    notNull: { msg: '名称必须填写。' },
    notEmpty: { msg: '名称不能为空。' },
    len: { args: [2, 45], msg: '名称长度必须是2 ~ 45之间。' }
  }
},
image: {
  type: DataTypes.STRING,
  validate: {
    isUrl: { msg: '图片地址不正确。' }
  }
},
recommended: {
  type: DataTypes.BOOLEAN,
  validate: {
    isIn: { args: [[true, false]], msg: '是否推荐的值必须是，推荐：true 不推荐：false。' }
  }
},
introductory: {
  type: DataTypes.BOOLEAN,
  validate: {
    isIn: { args: [[true, false]], msg: '是否入门课程的值必须是，推荐：true 不推荐：false。' }
  }
},
content: DataTypes.TEXT,
likesCount: DataTypes.INTEGER,
chaptersCount: DataTypes.INTEGER
```

### *关联模型

如何在这个接口里，直接显示出对应的分类和用户？

要实现这种功能，需要在`SQL`里要写[join 语句](https://clwy.cn/pages/mysql-left-join)。但我们用了`ORM`，那就不需要这么干了，可以非常简单的使用关联模型

01-修改课程模型

```js
static associate(models) {
  models.Course.belongsTo(models.Category);	// 属于-多对一
  models.Course.belongsTo(models.User);	// 属于-多对一
}
```

02-修改路由，顶部要引用分类和用户模型

```js
const { Course, Category, User } = require('../../models');
// ....
const condition = {
  include: [	// 添加包含
    {
      model: Category
    },
    {
      model: User
    }
  ],
  order: [['id', 'DESC']],
  limit: pageSize,
  offset: offset
};
```

再去调用一下接口，发现已经可以把当前课程对应的分类与用户查询出来了。但数据还是有点不好看，里面除了小写的`categoryId`与`userId`外，还出现了大写的。而且对应的数据里，也是大写字母`Category`与`User`。

03-回到模型里,通过`as`定义一个别名，就改为小写的分类和用户

```js
static associate(models) {
  models.Course.belongsTo(models.Category, { as: 'category' });
  models.Course.belongsTo(models.User, { as: 'user' });
}
```

04-路由里改为这样

```js
const condition = {
  attributes: { exclude: ['CategoryId', 'UserId'] },
  include: [
    {
      model: Category,
      as: 'category',
      attributes: ['id', 'name']
    },
    {
      model: User,
      as: 'user',
      attributes: ['id', 'username', 'avatar']
    }
  ],
  order: [['id', 'DESC']],
  limit: pageSize,
  offset: offset
};
```

05-去分类与用户模型里增加对应的关联关

与此同时，还应该去分类与用户模型里增加对应的关联关系。每个分类，都有很多课程。每个用户，也可以发布很多课程，用到的方法叫做hasMany

```js
// 分类模型....
static associate(models) {
  models.Category.hasMany(models.Course, { as: 'courses' });
}
```

```js
// 用户模型....
static associate(models) {
  models.User.hasMany(models.Course, { as: 'courses' });
}
```

这么写，就可以在查询当前分类的同时，还会查到当前分类对应的所有课程。

```js
/**
 * 公共方法：查询当前分类
 */
async function getCategory(req) {
  const { id } = req.params;
  const condition = {
    include: [
      {
        model: Course,
        as: 'courses',
      },
    ]
  }

  const category = await Category.findByPk(id, condition);
  if (!category) {
    throw new NotFound(`ID: ${ id }的分类未找到。`)
  }

  return category;
}
```

### *处理孤儿记录

在删除分类的时候，查询一下，有没有关联的课程。只要有对应的课程，就提示用户，不能删除。

- 方案一：可以在数据库里，设置外键约束，确保数据完整性，这样删除的时候，就会提示错误。但要注意啊，一般在企业里，是不让用外键约束。因为使用外键约束后，数据库会产生额外的性能开销。在高并发、数据量大的情况，可能造成性能瓶颈。
- 方案二：常规做法就是在代码层面来处理了。可以在删除分类的时候，写点代码，把当前分类关联的所有课程全部删掉，这样就没有孤儿记录了。但大家思考一下，你们觉得这样做行吗？万一用户不小心点错了，把一个重要的分类删掉了。这样所有对应的课程也全都没有了，这可就好玩了。
- 方案三：在删除分类的时候，查询一下，有没有关联的课程。只要有对应的课程，就提示用户，不能删除。

```js
const { Category, Course } = require('../../models');

// ...

router.delete('/:id', async function (req, res) {
  try {
    const category = await getCategory(req);

    const count = await Course.count({ where: { categoryId: req.params.id } });
    if (count > 0) {
      throw new Error('当前分类有课程，无法删除。');
    }

    await category.destroy();
    success(res, '删除分类成功。');
  } catch (error) {
    failure(res, error);
  }
});
```





## 05-章节接口（关联模型）

先用种子，填充点初始章节数据

```
sequelize seed:generate --name chapter
```

加入数据

```js
async up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('Chapters', [
    {
      courseId: 1,
      title: 'CSS 课程介绍',
      content: 'CSS的全名是层叠样式表。官方的解释，我就不细说了，因为就算细说了，对新手朋友们来说，听得还是一脸懵逼。那我们就用最通俗的说法来讲，到底啥是CSS？',
      video: '',
      rank: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      courseId: 2,
      title: 'Node.js 课程介绍',
      content: '这套课程，定位是使用 JS 来全栈开发项目。让我们一起从零基础开始，学习接口开发。先从最基础的项目搭建、数据库的入门，再到完整的真实项目开发，一步步的和大家一起完成一个真实的项目。',
      video: '',
      rank: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      courseId: 2,
      title: '安装 Node.js',
      content: '安装Node.js，最简单办法，就是直接在官网下载了安装。但这种方法，却不是最好的办法。因为如果需要更新Node.js的版本，那就需要把之前的卸载了，再去下载安装其他版本，这样就非常的麻烦了。',
      video: '',
      rank: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ], {});
},

async down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Chapters', null, {});
}
```

运行种子

```
sequelize db:seed --seed xxx-chapter
```

修改模型添加验证

```js
courseId: {
  type: DataTypes.INTEGER,
  allowNull: false,
  validate: {
    notNull: { msg: '课程ID必须填写。' },
    notEmpty: { msg: '课程ID不能为空。' },
    async isPresent(value) {
      const course = await sequelize.models.Course.findByPk(value)
      if (!course) {
        throw new Error(`ID为：${ value } 的课程不存在。`);
      }
    }
  }
},
title: {
  type: DataTypes.STRING,
  allowNull: false,
  validate: {
    notNull: { msg: '标题必须填写。' },
    notEmpty: { msg: '标题不能为空。' },
    len: { args: [2, 45], msg: '标题长度必须是2 ~ 45之间。' }
  }
},
content: DataTypes.TEXT,
video: {
  type: DataTypes.STRING,
  validate: {
    isUrl: { msg: '视频地址不正确。' }
  }
},
rank: {
  type: DataTypes.INTEGER,
  allowNull: false,
  validate: {
    notNull: { msg: '排序必须填写。' },
    notEmpty: { msg: '排序不能为空。' },
    isInt: { msg: '排序必须为整数。' },
    isPositive(value) {
      if (value <= 0) {
        throw new Error('排序必须是正整数。');
      }
    }
  }
},
```

关联模型，每个章节都属于一个课程，使用belongsTo

```js
static associate(models) {
  models.Chapter.belongsTo(models.Course, { as: 'course' });
}
```

反过来，每个课程都有很多章节，所以在课程模型里，要加上`hasMany`

```js
static associate(models) {
  // ...
  models.Course.hasMany(models.Chapter, { as: 'chapters' });
}
```







