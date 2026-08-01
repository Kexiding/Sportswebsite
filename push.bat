@echo off
chcp 65001 >nul
echo ========================================
echo   一键上传到 GitHub
echo ========================================
echo.

REM 设置远程仓库地址
set REMOTE_NAME=origin
set BRANCH_NAME=main

REM 显示当前状态
echo 当前仓库状态：
echo.
git status
echo.

REM 获取提交信息
set /p COMMIT_MSG=请输入提交说明（直接回车使用默认信息）:

if "%COMMIT_MSG%"=="" (
    set "COMMIT_MSG=更新项目文件 - %DATE% %TIME%"
)

echo.
echo ======== 正在添加文件... ========
git add .
echo 文件已添加。
echo.

echo ======== 正在提交... ========
git commit -m "%COMMIT_MSG%"

if %ERRORLEVEL% neq 0 (
    echo.
    echo 提交失败或没有需要提交的更改。
    echo.
    set /p FORCE_CONTINUE=是否仍要推送到远程？(Y/N):
    if /i not "!FORCE_CONTINUE!"=="Y" (
        echo 操作已取消。
        pause
        exit /b
    )
)

echo.
echo ======== 正在推送到远程仓库... ========
git push %REMOTE_NAME% %BRANCH_NAME%

if %ERRORLEVEL% equ 0 (
    echo.
    echo ======== 上传成功！========
    echo 仓库: %REMOTE_NAME%/%BRANCH_NAME%
    echo 地址: https://github.com/Kexiding/Sportswebsite
    echo.
    echo 提交说明: %COMMIT_MSG%
) else (
    echo.
    echo ======== 上传失败！========
    echo 请检查：
    echo 1. 远程仓库地址是否正确（git remote -v）
    echo 2. 网络是否正常
    echo 3. 是否有推送权限
)

echo.
pause
