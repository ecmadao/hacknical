# [Hacknical](https://hacknical.com)

**hacknical, hacker & technical**

![hacknical-logo-with-text](./doc/screenshots/logos/hacknical-logo-large.png)

> A website for GitHub user to generate his GitHub data analysis (contributions/commits/languages/repos datas), helps to make a better resume.

[中文版 README](./doc/README-ZH.md)

**Attention：Most of the pages support English now😁😁😁, including github data analysis page.**

Extract dependency：

- UI Components --> [light-ui](https://github.com/ecmadao/light-ui)
- GitHub API crawler --> [hacknical-github](https://github.com/ecmadao/hacknical-github)

## Examples

- [My GitHub data analysis](https://hacknical.com/ecmadao/github)

## Screenshots

> login page

![login page](./doc/screenshots/login-en.png)

> github datas analysis

![github datas](./doc/screenshots/github-en.png)

## About

[中文版说明](./doc/ABOUT-zh.md)

## Local SQLite

Node 22.13+ is required. The local profile uses Node's built-in SQLite driver, an in-process cache, a no-op message queue, and local file uploads, so Redis, MongoDB, and OSS are not required for local startup:

```bash
nvm use
npm install
npm run start-local
```

## 本机部署 (Local Deployment)

hacknical 在本机支持通过内建 SQLite、内存缓存以及本地文件系统完整运行生产模式，无需依赖外部 Redis、MongoDB 与云端 OSS。

### 1. 一键部署与健康检查
执行预置的幂等部署脚本（会自动安装依赖、编译后端/DLL/前端资源、启动或平滑重启 tmux 会话并执行连通性探测）：
```bash
./scripts/deploy-local.sh
```

### 2. 手动启动与常驻管理
- **生产环境配置**：`config/production.json`
- **监听端口**：`127.0.0.1:4000`
- **数据与上传**：
  - SQLite 数据文件：`data/hacknical.sqlite`
  - 本地上传资源：`public/uploads/`
- **日志位置**：`log/production.log`
- **手动启动**：
  ```bash
  NODE_ENV=production node dist/bin/app.js
  ```
- **tmux 常驻守护**：
  - 查看实时运行控制台：`tmux attach -t hacknical`（退出查看按 `Ctrl+B` 后按 `d`）
  - 查看日志输出：`tail -f log/production.log`
  - 重启服务：直接运行 `./scripts/deploy-local.sh`，或：
    ```bash
    tmux kill-session -t hacknical 2>/dev/null || true
    tmux new-session -d -s hacknical "NODE_ENV=production node dist/bin/app.js 2>&1 | tee -a log/production.log"
    ```


## Todos

- [x] support English
- [x] support orgs
- [ ] support forked repos
- [ ] support edit resume in mobile
- [x] support show resume in mobile
- [x] support export resume to PDF

## Techs

- backend

  - koa2
  - redis
  - mongoose
  - nunjucks
  - request
  - pm2

- frontend

  - react
  - redux
  - react-router
  - particles
  - scrollreveal
  - chart.js
  - clipboard
  - headroom.js
  - webpack


## License

[Apache License](./LICENSE)

## Author

[ecmadao](//github.com/ecmadao)
