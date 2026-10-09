#!/bin/bash
# ==============================================================================
# Hacknical 一键全自动生产部署脚本 (Docker 容器化 + Nginx 反代 + ZeroSSL 证书)
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${PROJECT_DIR}"

if [ "$(id -u)" -ne 0 ]; then
  echo "❌ 错误：配置宿主机 Nginx 与证书必须以 root 权限运行！"
  echo "👉 请在宿主机执行: sudo bash $0"
  exit 1
fi

DOMAIN="${1:-${DOMAIN:-}}"
if [ -z "${DOMAIN}" ] && [ -f "${PROJECT_DIR}/config/production.json" ]; then
  DOMAIN=$(grep -o '"url": *"https://[^"]*"' "${PROJECT_DIR}/config/production.json" | sed 's/.*https:\/\///;s/".*//' || true)
fi

echo "=========================================================="
echo "步骤 1/2: 切换并启动 Hacknical Docker 容器化服务"
echo "=========================================================="
bash "${SCRIPT_DIR}/deploy-docker.sh"

echo ""
echo "=========================================================="
echo "步骤 2/2: 配置 Nginx 虚拟主机并申请 TLS 证书"
echo "=========================================================="
bash "${SCRIPT_DIR}/setup-nginx-ssl.sh" "${DOMAIN}"

echo ""
echo "=========================================================="
echo "✅ 整体部署与域名证书上线全部完成！"
echo "=========================================================="
if [ -n "${DOMAIN}" ]; then
  echo "您可以直接在浏览器访问: https://${DOMAIN}"
  echo ""
  echo "最终连通性探测结果："
  curl -Is "https://${DOMAIN}/" | head -n 5 || true
fi
