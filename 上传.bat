@echo off
setlocal enabledelayedexpansion

:: 设置控制台标题
title Git 一键提交推送工具

:: 显示开头分隔线
echo ==============================================
echo          Git 一键提交推送脚本
echo ==============================================

:: 获取当前时间（用于日志）
for /f "tokens=1-3 delims=: " %%a in ("%time%") do set curTime=%%a:%%b:%%c
echo [启动时间] %date% %curTime%

:: 检查是否为 Git 仓库
for /f "tokens=*" %%i in ('git rev-parse --abbrev-ref HEAD 2^>nul') do set currentBranch=%%i
if not defined currentBranch (
    echo [错误] 当前目录不是 Git 仓库，请进入仓库目录后再运行。
    pause
    exit /b 1
)
echo [当前分支] %currentBranch%

:: 获取提交信息（支持命令行参数或手动输入）
if "%~1"=="" (
    echo.
    set /p commitMsg="请输入提交信息: "
) else (
    set commitMsg=%~1
)

:: 检查提交信息是否为空
if "!commitMsg!"=="" (
    echo [错误] 提交信息不能为空，操作取消。
    pause
    exit /b 1
)

:: 显示本次提交的信息
echo.
echo [提交信息] "!commitMsg!"
echo.

:: 显示工作区变更状态
echo [检查] 当前工作区变更如下（简略）：
git status --short
echo.

:: 询问用户是否继续
set /p confirm="是否继续执行 add、commit 和 push？(y/n) "
if /i not "!confirm!"=="y" (
    echo 操作已取消。
    pause
    exit /b 0
)

:: ----- 执行 git add -----
echo.
echo [步骤 1/3] 正在添加所有更改到暂存区...
git add .
if errorlevel 1 (
    echo [错误] git add 失败，请检查文件权限或 Git 状态。
    pause
    exit /b 1
) else (
    echo [成功] 已将所有更改加入暂存区。
)

:: ----- 执行 git commit -----
echo.
echo [步骤 2/3] 正在提交更改...
git commit -m "!commitMsg!"
if errorlevel 1 (
    echo [警告] 提交失败（可能没有需要提交的更改），跳过推送。
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%h in ('git rev-parse --short HEAD') do set commitHash=%%h
    echo [成功] 提交完成，提交哈希: %commitHash%
)

:: ----- 执行 git push -----
echo.
echo [步骤 3/3] 正在推送到远程仓库...
git push
if errorlevel 1 (
    echo [错误] 推送失败，请检查网络连接或远程仓库权限。
    pause
    exit /b 1
) else (
    echo [成功] 推送完成！远程仓库已更新。
)

:: 全部完成
echo.
echo ==============================================
echo           所有操作成功完成！
echo ==============================================
echo 分支 %currentBranch% 已同步至远程仓库。
pause
endlocal