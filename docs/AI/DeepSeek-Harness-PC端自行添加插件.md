---
title: DeepSeek Harness PC 端如何自行添加插件
description: DeepSeek Harness 桌面版 / PC 端自行安装社区插件教程：插件市场、dsh plugin add、GitHub 源与本地 link 开发，以及装完不生效的排查方法。
---

# DeepSeek Harness PC 端如何自行添加插件

## 一、告诉agent帮你装

## 二、终端命令安装

1. 先维护终端环境变量
![自带终端环境变量安装](./deepseek_env_installation.png){data-zoomable}

<!-- <img src="./deepseek_env_installation.png" alt="自带终端环境变量安装" style="with:100%" data-zoomable class="medium-zoom-image"/> -->


2. 运行终端命令，示例：
```sh

dsh plugin --profile desktop add github:jiangzhenguo/dsh-codegraph

```

