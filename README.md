# NodeUser - Node.js 用户认证服务

基于 Express + MongoDB + HTTPS 的用户注册登录后端服务，提供用户登录和注册 API。

## 功能特性

- HTTPS 安全连接（自带 SSL 证书）
- 用户注册（检查用户名是否已存在）
- 用户登录（密码校验）
- MongoDB 数据持久化
- 统一返回数据格式

## 技术栈

- Node.js + Express
- MongoDB
- HTTPS + SSL
- body-parser

## 运行方式

1. 安装依赖：`npm install`
2. 确保 MongoDB 已启动
3. 启动服务：`node app.js`

## API 接口

- `POST /login` - 用户登录
- `POST /register` - 用户注册
