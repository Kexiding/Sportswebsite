#!/bin/bash
set -e

# ============ 配置区（按需修改） ============
# 服务器上网站的部署路径
SITE_DIR="/opt/Sportswebsite"
# pm2 进程名，需与启动时 --name 一致。
# 首次部署启动命令示例：
#   pm2 start backend/app.js --name zhanlt-backend
PM2_NAME="zhanlt-backend"
# ===========================================

echo "📥 拉取最新代码..."
cd "$SITE_DIR"
git pull

echo "📦 安装后端依赖..."
cd "$SITE_DIR/backend"
npm install

echo "🚀 重启后端服务..."
pm2 restart "$PM2_NAME"

echo "✅ 更新完成！访问 http://你的服务器IP"
