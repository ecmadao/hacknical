# ==========================================
# Stage 1: 构建阶段 (编译前后端代码与打包静态资产)
# ==========================================
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# 安装构建与解压工具 (bzip2 供 phantomjs-prebuilt 解压二进制)
RUN apt-get update && \
    apt-get install -y --no-install-recommends bzip2 ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# 安装依赖
COPY package.json package-lock.json ./
RUN npm ci

# 复制源码并执行构建
COPY . .
RUN npm run build-app && \
    npm run build-dll-pro && \
    npm run build-src

# 清理 devDependencies，仅保留生产运行时依赖
RUN npm prune --omit=dev

# ==========================================
# Stage 2: 运行阶段 (精简无冗余运行时环境)
# ==========================================
FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production \
    PORT=4000

# 安装运行时所需的基础字体与证书库 (供 phantom 导出 PDF/图片等服务)
RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates fontconfig fonts-dejavu-core && \
    rm -rf /var/lib/apt/lists/*

# 拷贝生产依赖与构建产物
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/config ./config

# 创建挂载与运行所需目录
RUN mkdir -p data log public/uploads

EXPOSE 4000

# 容器健康检查
HEALTHCHECK --interval=20s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "const http = require('http'); http.get('http://127.0.0.1:4000/api/healthz', (res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1));"

CMD ["node", "dist/bin/app.js"]
