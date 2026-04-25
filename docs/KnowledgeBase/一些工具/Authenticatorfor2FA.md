---
title: "使用身份验证器（Authenticator）开启 Facebook 双重验证（2FA）可以极大地提升账号安全性，防止因密码泄露导致的盗号。"
---

使用身份验证器（Authenticator）开启 Facebook 双重验证（2FA）可以极大地提升账号安全性，防止因密码泄露导致的盗号。
## 第一步：准备身份验证器应用
在手机应用商店下载并安装一个身份验证器。推荐使用：

* Google Authenticator（谷歌验证器）
* Microsoft Authenticator（微软验证器）

## 第二步：在 Facebook 中开启设置

   1. 进入设置：打开 Facebook，点击头像，进入 [设置与隐私](https://www.facebook.com/settings) -> 设置。
   2. 进入账号中心：在左侧或顶部菜单点击 账号中心 (Accounts Center)。
   3. 找到安全选项：点击 密码和安全 (Password and security) -> 双重验证 (Two-factor authentication)。
   4. 选择账号：选择你需要设置的 Facebook 个人账号。

## 第三步：绑定验证器

   1. 选择验证方式：在弹出的选项中，选择 验证应用 (Authentication app)。
   2. 获取密钥/二维码：Facebook 会显示一个二维码或一串字符密钥。
   3. 在验证器中添加：
   * 打开手机上的 Authenticator 应用，点击 “+” 号。
      * 选择 扫描二维码（直接扫 Facebook 屏幕上的码）或 手动输入密钥（将 Facebook 提供的字符复制进去）。 
   4. 确认绑定：验证器应用会立即生成一个 6 位数字动态码。回到 Facebook 页面，输入这个动态码完成确认。 

## 关键注意事项

* 备份恢复码：设置完成后，Facebook 会提供一组公共恢复码 (Recovery Codes)。请务必将它们截图或抄写下来存放在安全的地方。如果手机丢失或应用被删，这是你找回账号的唯一途径。
* 跨设备登录：开启后，每当在陌生浏览器或新设备登录时，除了密码，你都必须输入验证器内生成的最新 6 位码。
