# 使用官方的 Node.js 镜像作为基础镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制 docs和package.json
COPY docs/ /app/docs
COPY package.json /app/package.json

# 安装依赖
RUN npm ci

# 构建应用
RUN npm run docs:build

# 暴露端口
EXPOSE 80

# 运行应用
CMD ["npm", "start"]