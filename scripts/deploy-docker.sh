#!/bin/bash
set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${PROJECT_DIR}"

echo "=== [1/5] 检查运行环境与持久化目录 ==="
mkdir -p data public/uploads log

if [ ! -f "config/production.json" ]; then
  echo "未检测到 config/production.json，从 config/production.example.json 拷贝并生成随机 appKey ..."
  RANDOM_KEY=$(node -e "console.log(require('crypto').randomBytes(24).toString('hex'))" 2>/dev/null || openssl rand -hex 24)
  sed "s/\"REPLACE_WITH_RANDOM_HEX\"/\"${RANDOM_KEY}\"/" config/production.example.json > config/production.json
fi

echo "=== [2/5] 停止旧的本地常驻进程以释放端口 4000 ==="
if tmux has-session -t hacknical 2>/dev/null; then
  echo "检测到原有本地 tmux hacknical 会话，正在关闭以切换至 Docker 容器..."
  tmux kill-session -t hacknical 2>/dev/null || true
  sleep 1
fi

PORT_PID=$(lsof -ti:4000 2>/dev/null || true)
if [ -n "$PORT_PID" ]; then
  # 如果不是 docker-proxy，则清理掉宿主机本地 node 进程
  if ! ps -p "$PORT_PID" -o comm= 2>/dev/null | grep -q "docker"; then
    echo "释放本地占用端口 4000 的进程 PID: $PORT_PID"
    kill -9 "$PORT_PID" 2>/dev/null || true
    sleep 1
  fi
fi

echo "=== [3/5] 构建并启动 Docker 容器 (docker compose up -d --build) ==="
docker compose up -d --build

echo "=== [4/5] 等待服务就绪并执行健康检查 ==="
MAX_RETRIES=20
READY=0
for i in $(seq 1 $MAX_RETRIES); do
  if curl -s -f -o /dev/null http://127.0.0.1:4000/; then
    READY=1
    break
  fi
  echo "等待 Docker 容器内服务启动 (尝试 $i/$MAX_RETRIES)..."
  sleep 2
done

if [ "$READY" -ne 1 ]; then
  echo "❌ 容器启动健康检查超时！容器最新日志："
  docker compose logs --tail 40 || true
  exit 1
fi

echo "=== [5/5] 静态资源连通性探测 ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:4000/)
echo "首页探测状态码: $HTTP_CODE (期望 200)"

echo ""
echo "🎉 hacknical Docker 生产模式部署成功！"
echo "- 监听地址: http://127.0.0.1:4000 (安全绑定本地 127.0.0.1)"
echo "- 容器名称: hacknical"
echo "- 查看容器状态: docker compose ps"
echo "- 查看实时日志: docker compose logs -f"
