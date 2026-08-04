@echo off
setlocal enabledelayedexpansion

:: 获取提交信息（优先使用命令行参数，否则提示输入）
if "%~1"=="" (
    set /p commitMsg="请输入提交信息: "
) else (
    set commitMsg=%~1
)

:: 如果输入为空，退出
if "!commitMsg!"=="" (
    echo 提交信息不能为空，操作取消。
    exit /b 1
)

echo 正在添加所有更改...
git add .
if errorlevel 1 (
    echo git add 失败，请检查 Git 状态。
    exit /b 1
)

echo 正在提交...
git commit -m "!commitMsg!"
if errorlevel 1 (
    echo 提交失败（可能没有需要提交的更改），跳过推送。
    exit /b 1
)

echo 正在推送到远程仓库...
git push
if errorlevel 1 (
    echo 推送失败，请检查网络或权限。
    exit /b 1
)

echo 全部操作成功完成！
endlocal