@echo off
chcp 65001 >nul
title 国际健身体育产业博览会 - 后端服务

echo ========================================
echo   国际健身体育产业博览会
echo   一键启动后端服务
echo ========================================
echo.

REM 切换到脚本所在目录
cd /d "%~dp0"

echo [1/3] 检测依赖环境...
echo.

if not exist "backend\node_modules" (
    echo [INFO] node_modules 不存在，正在安装依赖...
    echo.
    cd backend
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo.
        echo [ERROR] 依赖安装失败！请检查 Node.js 是否安装。
        pause
        exit /b
    )
    cd ..
) else (
    echo [OK] node_modules 已存在
)

echo.
echo [2/3] 启动后端服务...
echo.
echo 服务地址: http://localhost:3000
echo 前端页面: http://localhost:3000/register.html
echo.
echo ========================================
echo  按 Ctrl+C 可停止服务
echo ========================================
echo.

cd backend
start "" http://localhost:3000/register.html
npm start

pause
