#!/bin/bash
set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${PROJECT_DIR}"

echo "=== [1/6] 检查运行环境与数据目录 ==="
mkdir -p data public/uploads log

if [ ! -f "config/production.json" ]; then
  echo "未检测到 config/production.json，从 config/production.example.json 拷贝并生成随机 appKey ..."
  RANDOM_KEY=$(node -e "console.log(require('crypto').randomBytes(24).toString('hex'))")
  sed "s/\"REPLACE_WITH_RANDOM_HEX\"/\"${RANDOM_KEY}\"/" config/production.example.json > config/production.json
fi

echo "=== [2/6] 安装依赖 (npm install) ==="
npm install

echo "=== [3/6] 编译后端与生产产物 (build-app & build-dll-pro & build-src) ==="
npm run build-app
npm run build-dll-pro
npm run build-src

echo "=== [4/6] 重启 tmux 常驻守护进程 (会话名: hacknical) ==="
if tmux has-session -t hacknical 2>/dev/null; then
  echo "检测到已有 hacknical 会话，正在平滑关闭旧进程..."
  tmux kill-session -t hacknical 2>/dev/null || true
  sleep 1
fi

# 确保端口 4000 已释放
PORT_PID=$(lsof -ti:4000 2>/dev/null || true)
if [ -n "$PORT_PID" ]; then
  echo "释放残留占用端口 4000 的进程 PID: $PORT_PID"
  kill -9 "$PORT_PID" 2>/dev/null || true
  sleep 1
fi

echo "启动新的 tmux hacknical 会话并在后台运行..."
tmux new-session -d -s hacknical "cd ${PROJECT_DIR} && NODE_ENV=production node dist/bin/app.js 2>&1 | tee -a log/production.log"

echo "=== [5/6] 等待服务就绪并执行健康检查 ==="
MAX_RETRIES=15
READY=0
for i in $(seq 1 $MAX_RETRIES); do
  if curl -s -f -o /dev/null http://127.0.0.1:4000/; then
    READY=1
    break
  fi
  echo "等待服务启动 (尝试 $i/$MAX_RETRIES)..."
  sleep 1
done

if [ "$READY" -ne 1 ]; then
  echo "❌ 服务启动健康检查失败！最新日志："
  tail -n 30 log/production.log || true
  exit 1
fi

echo "=== [6/6] 静态资源连通性验证 ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:4000/)
echo "首页探测状态码: $HTTP_CODE (期望 200)"

BUNDLE_JS=$(ls -1 public/assets/base.bundle.*.js 2>/dev/null | head -n 1 | xargs -r basename || true)
if [ -n "$BUNDLE_JS" ]; then
  ASSET_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:4000/assets/${BUNDLE_JS}")
  echo "静态资源 /assets/${BUNDLE_JS} 探测状态码: $ASSET_CODE (期望 200)"
fi

echo ""
echo "🎉 hacknical 本机生产模式部署成功！"
echo "- 监听地址: http://127.0.0.1:4000"
echo "- tmux 会话: hacknical (查看命令: tmux attach -t hacknical)"
echo "- 日志文件: log/production.log (实时查看: tail -f log/production.log)"
