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

## GitHub 登录与 GitHub Actions 部署

登录直接使用 GitHub OAuth，运行时不需要 Auth0 或单独的 GitHub 服务。授权入口为 `/api/user/login/github`，回调为 `/api/user/login/github/callback`；会话和 GitHub token 保存在 SQLite，浏览器只保存签名的会话 ID。

本地开发先复制 `.env.example` 为 `.env`，填写 GitHub OAuth App 的 Client ID 和 Client Secret，再运行 `npm run start-local`。本地 OAuth App 回调地址为 `http://localhost:4000/api/user/login/github/callback`。未填写凭据时，首页正常运行，登录接口返回 `503 GITHUB_OAUTH_UNAVAILABLE`，不接受测试 code 或个人 token 代替授权码。

线上地址为 [https://hack.r2049.cn](https://hack.r2049.cn)。参照 PaperVault，默认分支 push 或手动运行 **CI and Deploy** 会依次执行 lint、OAuth 回归测试、Docker 构建、推送 GHCR 和 SSH 部署；PR 仅验证和构建。部署使用当前构建的镜像 digest，并在健康检查失败时恢复上一版本。SQLite、上传文件和已有生产配置保留在原部署目录。

完整配置及 OAuth App 创建步骤见 [部署文档](doc/DEPLOYMENT.md)。

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

## Docker 容器化部署 (Docker Deployment)

项目支持标准的 Docker 容器化多阶段构建与数据持久化运行。

### 1. 架构说明
- **服务容器**：基于 `node:22-bookworm-slim` 多阶段构建，仅保留运行阶段所需的最小化生产依赖与编译产物。
- **端口绑定**：`127.0.0.1:4000:4000`（安全绑定本机回环地址，由宿主机 Nginx 统一对外负责反代与 SSL 卸载）。
- **数据持久化挂载卷**：
  - `./data:/app/data`：持久化保存 SQLite 数据库。
  - `./public/uploads:/app/public/uploads`：保存上传的文件与生成的图片/PDF。
  - `./log:/app/log`：容器日志输出持久化。
  - `./config/production.json:/app/config/production.json:ro`：挂载生产环境配置。

### 2. 容器部署与日常运维
```bash
# 一键自动构建、平滑停机旧本地进程并启动 Docker 容器：
bash ./scripts/deploy-docker.sh

# 查看容器运行状态
docker compose ps

# 查看容器实时日志
docker compose logs -f

# 停止或重启容器
docker compose stop
docker compose up -d
```

## 域名与 TLS 证书配置 (Nginx & ACME)

支持通过 Nginx 反向代理并使用 `acme.sh` 自动签发与续期 TLS 证书：

1. **一键完成反代配置与证书签发**（需要宿主机 root 权限，支持自定义域名）：
   ```bash
   # 方式 1：通过参数传入域名
   sudo bash ./scripts/setup-nginx-ssl.sh your-domain.com

   # 方式 2：通过环境变量传入
   DOMAIN=your-domain.com sudo -E bash ./scripts/setup-nginx-ssl.sh
   ```
2. **全自动一键部署（Docker 启动 + 证书签发 + Nginx 重载）**：
   ```bash
   sudo bash ./scripts/setup-all.sh your-domain.com
   ```
3. **生成的配置与证书路径**：
   - Nginx 站点配置：`/etc/nginx/conf.d/<your-domain>.conf`
   - 证书文件：`/etc/nginx/cert/<your-domain>/{fullchain.pem, <your-domain>.key}`


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
