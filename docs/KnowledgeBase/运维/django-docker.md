---
title: 使用gitaction构建 dokcer镜像, 并发布到github, dockerhub, 阿里云镜像
---

# Django 使用gitaction构建 dokcer镜像, 并发布到github, dockerhub, 阿里云镜像

### workflow

```yml
# workflow
name: hub.heweishi.image
on:
  workflow_dispatch:
  push:
    branches:
      - main
    tags:
      - "v*"
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
        with:
          driver-opts: |
            network=host
      - name: Cache Docker layers
        uses: actions/cache@v4
        with:
          path: /tmp/.buildx-cache
          key: ${{ runner.os }}-buildx-${{ github.sha }}
          restore-keys: |
            ${{ runner.os }}-buildx-
      # 登录 GitHub Container Registry
      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          # username:${ { github.actor }}
          username: ${{ github.repository_owner }}
          password: ${{ secrets.GH_PAT }}
      # 登录 DockerHub
      - name: Login to DockerHub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      # 登录阿里云容器镜像服务
      - name: Login to Aliyun Container Registry
        uses: docker/login-action@v3
        with:
          registry: registry.cn-guangzhou.aliyuncs.com
          username: ${{ secrets.ALIYUN_USERNAME }}
          password: ${{ secrets.ALIYUN_PASSWORD }}
      - name: Set DOCKER_REPO_TAGGED based on branch or tag
        # 我的名称大写所以要转小写，否则会报错
        run: |
          echo "GHCR_TAGGED=$(echo ghcr.io/${{ github.repository_owner }}/hubheweishi:initial | tr '[:upper:]' '[:lower:]')" >> $GITHUB_ENV
          echo "DOCKERHUB_TAGGED=$(echo ${{secrets.DOCKERHUB_USERNAME}}/hubheweishi:initial | tr '[:upper:]' '[:lower:]')" >> $GITHUB_ENV
          echo "ALIYUN_TAGGED=$(echo registry.cn-guangzhou.aliyuncs.com/${{secrets.ALIYUN_BASENAME}}/hubheweishi:initial | tr '[:upper:]' '[:lower:]')" >> $GITHUB_ENV
      # 构建并推送镜像
      - name: Build and push Docker images
        uses: docker/build-push-action@v5
        with:
          context: .
          file: Dockerfile
          platforms: linux/amd64,linux/arm64
          push: true
          tags: |
            ${{ env.GHCR_TAGGED }}
            ${{ env.DOCKERHUB_TAGGED }}
            ${{ env.ALIYUN_TAGGED }}
          cache-from: type=local,src=/tmp/.buildx-cache
          cache-to: type=local,dest=/tmp/.buildx-cache
          labels: |
            org.opencontainers.image.source=https://github.com/${{ github.repository_owner }}/hubheweishi
            org.opencontainers.image.description=hub heweishi image


      # - name: Build and push Docker image
      #   env:
      #     DOCKER_REPO_TAGGED: ${{ env.DOCKER_REPO_TAGGED }}
      #   run: |
      #     docker buildx build \
      #     --platform linux/amd64,linux/arm64 \
      #     --label "org.opencontainers.image.source=https://github.com/${{ github.repository_owner }}/hubheweishi" \
      #     --label "org.opencontainers.image.description=hub heweishi image" \
      #     --push \
      #     --cache-from=type=local,src=/tmp/.buildx-cache \
      #     --cache-to=type=local,dest=/tmp/.buildx-cache \
      #     -t ${DOCKER_REPO_TAGGED} \
      #     -f Dockerfile \
      #     .
```
### Dockerfile
```Dockerfile
# Dockerfile
# 第一阶段：构建阶段
FROM python:3.12-slim AS builder

# 设置环境变量
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /build

# 安装构建依赖
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# 升级 pip
RUN pip install --upgrade pip

# 安装依赖
COPY requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /build/wheels -r requirements.txt

# 最终阶段
FROM python:3.12-slim

# 设置环境变量
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=project.settings

WORKDIR /app

# 复制 wheel 文件
COPY --from=builder /build/wheels /wheels
RUN pip install --no-cache /wheels/*

# 安装 gunicorn requirements已有
# RUN pip install gunicorn

# 复制项目文件
COPY . .

# 创建非-root用户并设置权限
RUN addgroup --system --gid 1002 django_user && \
    adduser --system --uid 1002 --gid 1002 --shell /bin/bash django_user && \
    mkdir -p /home/django_user && \
    chown -R 1002:1002 /home/django_user && \
    usermod -d /home/django_user django_user && \
    chown -R 1002:1002 /app

# # 创建 VS Code 工作目录
# RUN mkdir -p /home/django_user/.vscode-server && \
#     chown -R 1002:1002 /home/django_user/.vscode-server

# 确保日志目录的权限正确
RUN mkdir -p ./logs
RUN chown -R 1002:1002 /app/logs

# 切换到非-root用户
USER django_user

# 暴露端口
EXPOSE 8000

# 运行迁移并启动 gunicorn
CMD ["sh", "-c", "python manage.py migrate && gunicorn --config gunicorn.conf.py project.wsgi:application"]
# CMD ["sh", "-c", "python manage.py migrate && gunicorn project.wsgi:application --preload -b 0.0.0.0:5000"]
# CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
```
## docker-compose 去仓库看
https://github.com/WorshipMoon/hub-heweishi

## 题外话
### 目前dockerhub升级专业版可以自动云端构建镜像，阿里云可以免费云端构建镜像，两个可以直接绑定github储存库，自动构建
### 镜像加速 https://status.1panel.top/status/docker 国内我有使用这个https://proxy.1panel.live
