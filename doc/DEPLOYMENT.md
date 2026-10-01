# GitHub 登录与自动部署

线上地址：<https://hack.r2049.cn>。SSH 自动部署沿用服务器上已有的项目目录 `/var/lib/dsh/workspace/hacknical`，端口为 `127.0.0.1:4000`，Nginx 负责 HTTPS。数据库、上传资源和日志分别位于 `data/`、`public/uploads/`、`log/`，发布不会删除这些目录。

## 创建 GitHub OAuth App

在 <https://github.com/settings/applications/new> 创建 **OAuth App**，填写：

| 字段 | 值 |
| --- | --- |
| Application name | Hacknical |
| Homepage URL | `https://hack.r2049.cn` |
| Authorization callback URL | `https://hack.r2049.cn/api/user/login/github/callback` |

创建后生成 Client Secret，在本仓库 **Settings → Secrets and variables → Actions** 添加：

| Repository secret | 内容 |
| --- | --- |
| `HACKNICAL_GITHUB_OAUTH_CLIENT_ID` | OAuth App 的 Client ID |
| `HACKNICAL_GITHUB_OAUTH_CLIENT_SECRET` | OAuth App 的 Client Secret |

然后在 **Actions → CI and Deploy → Run workflow** 选择 `master` 运行一次。工作流会把以上值映射为服务器运行时的 `GITHUB_OAUTH_CLIENT_ID` / `GITHUB_OAUTH_CLIENT_SECRET`，不把凭据放进镜像或 Git。GitHub 的仓库 secret/variable 名称不能以 `GITHUB_` 开头，所以仓库配置使用 `HACKNICAL_` 前缀。

OAuth App 创建前，服务器 `.env` 保留空值，登录返回 `503 GITHUB_OAUTH_UNAVAILABLE`。不能完成真实 GitHub 授权，但网站和部署流程可以正常工作。空的工作流 secret 不会覆盖服务器上已配置的非空凭据。

## GitHub Actions 配置

工作流：`.github/workflows/docker-publish.yml`。

| 类型 | 名称 | 当前用途 / 值 |
| --- | --- | --- |
| Secret | `DEPLOY_HOST` | 部署服务器 |
| Secret | `DEPLOY_USER` | SSH 用户 |
| Secret | `SSH_PRIVATE_KEY` | 本项目专用部署密钥 |
| Secret，可选 | `APP_KEY` | 稳定的会话签名密钥，至少 32 字符；未提供则沿用服务器配置或首次自动生成 |
| Variable | `DEPLOY_ENABLED` | `true` |
| Variable | `APP_URL` | `https://hack.r2049.cn` |
| Variable | `DEPLOY_PATH` | `/var/lib/dsh/workspace/hacknical` |
| Variable | `DEPLOY_PORT` | `22` |
| Variable | `SSH_HOST_FINGERPRINT` | SSH 服务器 Ed25519 指纹，上传和执行均验证 |
| Variable | `HACKNICAL_GITHUB_OAUTH_REDIRECT_URI` | `https://hack.r2049.cn/api/user/login/github/callback` |

默认分支 `master` 的 push 和手动执行会完成：

1. Node 22 安装依赖、lint、编译后端和 OAuth 回归测试。
2. 构建前后端 Docker 镜像，以 commit SHA 和 `latest` 标签推送 `ghcr.io/liguobao/hacknical`。
3. 上传 Compose 与部署脚本，通过 SSH 拉取本次构建的镜像 digest。
4. 保存稳定的运行配置，更新容器，等待 `/api/healthz` 健康检查；失败时恢复旧镜像和 `.env`。
5. 从 Actions runner 检查公共 HTTPS 健康地址。

PR 只执行验证和镜像构建。部署串行执行；只有当前默认分支可以发布到生产。SSH 更新时容器会短暂重启。SQLite 数据不能照搬 PaperVault 的独立缓存双容器方案，因此这里采用单容器更新并保留数据。

GHCR 初次创建的包可能为私有。工作流使用自动生成的 `GITHUB_TOKEN` 发布/拉取，无需保存个人访问令牌；认证配置仅临时创建，用完删除，不覆盖服务器其他服务的 Docker 凭据。需要匿名拉取时可自行把 GHCR 包可见性设为 Public。

## 本地开发

```bash
nvm use
npm ci
cp .env.example .env
# 在 .env 中填写本地 OAuth App 的凭据
npm run start-local
```

本地 App 的 Homepage URL 为 `http://localhost:4000`，回调为 `http://localhost:4000/api/user/login/github/callback`。本地与线上建议各建一个 OAuth App。`GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` 旧环境变量仍可使用，但推荐统一使用 `GITHUB_OAUTH_*`。

登录不再依赖 Auth0；旧 `/api/user/login/auth0` 回调已移除。OAuth state 为随机值，有效期 10 分钟且只能使用一次。GitHub token 保存在 SQLite `sessions` 表中，HTTPS cookie 使用 HttpOnly、Secure 和 SameSite=Lax；登录后刷新会话 ID，退出时删除服务端会话。切换到新会话存储后，已有浏览器会话需要重新登录。

## 运维与回滚

```bash
cd /var/lib/dsh/workspace/hacknical
docker compose -p hacknical -f docker-compose.deploy.yml ps
docker logs --tail 100 hacknical
curl -fsS http://127.0.0.1:4000/api/healthz
curl -fsS https://hack.r2049.cn/api/healthz

# 使用已知正常的 commit SHA 镜像手动回滚
HACKNICAL_IMAGE=ghcr.io/liguobao/hacknical:<commit-sha> bash scripts/deploy-image.sh
```

`.env` 和 `config/production.json` 仅服务器持有，权限为 `600`，不会传入 Docker 构建上下文。需要备份时应使用 SQLite 在线备份 API 或停机后备份数据库及 WAL，而不是在运行时只复制主数据库文件。
