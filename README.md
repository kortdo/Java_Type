# TaskFlow

一个使用 HTML、CSS 和 JavaScript 编写的任务管理练习项目。

在线地址：https://kortdo.github.io/Java_Type/

## 功能

- 添加、编辑、删除任务
- 切换完成状态，统计待完成任务
- 按状态筛选和标题搜索
- 使用 localStorage 保存任务
- 通过 fetch 加载示例任务

## 本地运行

环境：Node.js 24。

在 taskflow 目录执行：
1. npm ci
2. npx playwright install chromium
3. npm run dev

## 验证

- npm test：运行三条 Playwright 测试
- npm run build：构建网站
- npm run preview：预览构建结果

推送到 master 后，GitHub Actions 会先检查，再部署到 GitHub Pages。

## 数据说明

任务保存在当前浏览器的 localStorage 中，不支持跨设备同步。