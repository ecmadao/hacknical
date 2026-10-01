#!/bin/bash
# ==============================================================================
# 为 hack.r2049.cn 配置 Nginx 反向代理与申请 ZeroSSL 证书
# 参考主机既有配置：/etc/nginx/conf.d/papervault.top.conf 和 pxmapping.cn.conf
# ==============================================================================
set -euo pipefail

DOMAIN="hack.r2049.cn"
UPSTREAM="http://127.0.0.1:4000"
ACME_WEBROOT="/var/www/acme"
CERT_DIR="/etc/nginx/cert/${DOMAIN}"
CONF="/etc/nginx/conf.d/${DOMAIN}.conf"

# 查找 acme.sh 位置
ACME_SH=""
if [ -x "/root/.acme.sh/acme.sh" ]; then
  ACME_SH="/root/.acme.sh/acme.sh"
elif [ -x "${HOME}/.acme.sh/acme.sh" ]; then
  ACME_SH="${HOME}/.acme.sh/acme.sh"
elif command -v acme.sh >/dev/null 2>&1; then
  ACME_SH="$(command -v acme.sh)"
fi

if [ "$(id -u)" -ne 0 ]; then
  echo "❌ 错误：配置 /etc/nginx 与证书申请必须以 root 权限执行！"
  echo "请在宿主机终端执行: sudo bash $0"
  exit 1
fi

if [ -z "${ACME_SH}" ]; then
  echo "❌ 错误：未找到 acme.sh。请确认 /root/.acme.sh/acme.sh 是否存在。"
  exit 1
fi

echo "=== [1/4] 配置 HTTP 阶段虚拟主机 (用于 ACME Challenge 验证) ==="
mkdir -p "${ACME_WEBROOT}"
cat > "${CONF}" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    location ^~ /.well-known/acme-challenge/ {
        root ${ACME_WEBROOT};
        default_type text/plain;
        try_files \$uri =404;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}
EOF

nginx -t
nginx -s reload
echo "HTTP ACME 规则加载成功。"

ACME_RUN="env -i HOME=/root PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin ${ACME_SH}"

echo "=== [2/4] 向 ACME CA (ZeroSSL / LetsEncrypt) 申请 ECC TLS 证书 ==="
# 优先采用 ZeroSSL，如失败则平滑降级至 LetsEncrypt (与 turn-us1.r2049.cn 一致)
$ACME_RUN --issue -d "${DOMAIN}" --webroot "${ACME_WEBROOT}" --server zerossl --keylength ec-256 || \
$ACME_RUN --issue -d "${DOMAIN}" --webroot "${ACME_WEBROOT}" --server letsencrypt --keylength ec-256

echo "=== [3/4] 安装证书至 ${CERT_DIR} ==="
mkdir -p "${CERT_DIR}"
$ACME_RUN --install-cert -d "${DOMAIN}" --ecc \
  --key-file "${CERT_DIR}/${DOMAIN}.key" \
  --fullchain-file "${CERT_DIR}/fullchain.pem" \
  --reloadcmd "nginx -s reload"

echo "=== [4/4] 写入完整 HTTPS 反向代理配置 ==="
cat > "${CONF}" <<EOF
# ==============================================================================
# ${DOMAIN} - Nginx 生产反向代理配置 (Managed for Hacknical)
# ==============================================================================
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    location ^~ /.well-known/acme-challenge/ {
        root ${ACME_WEBROOT};
        default_type text/plain;
        try_files \$uri =404;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${DOMAIN};

    ssl_certificate ${CERT_DIR}/fullchain.pem;
    ssl_certificate_key ${CERT_DIR}/${DOMAIN}.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    access_log /var/log/nginx/${DOMAIN}.access.log;
    error_log  /var/log/nginx/${DOMAIN}.error.log;

    client_max_body_size 50m;

    location / {
        proxy_pass ${UPSTREAM};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection \$http_connection;
        proxy_connect_timeout 10s;
        proxy_read_timeout 180s;
        proxy_send_timeout 180s;
    }
}
EOF

nginx -t
nginx -s reload

echo ""
echo "🎉 ${DOMAIN} Nginx 与 ZeroSSL 证书配置全部完成！"
echo "- 配置文件: ${CONF}"
echo "- 证书文件: ${CERT_DIR}/fullchain.pem"
echo "- 验证命令: curl -I https://${DOMAIN}/"
