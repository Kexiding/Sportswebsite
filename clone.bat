@echo off
chcp 65001 >nul
echo ========================================
echo   一键从 GitHub 克隆项目
echo ========================================
echo.

REM 远程仓库地址
set REPO_URL=git@github.com:Kexiding/Sportswebsite.git

REM 获取目标目录名
for %%a in (%REPO_URL%) do set "DIR_NAME=Sportswebsite"

REM 询问是否自定义目录名
set /p DIR_NAME=请输入目标目录名（直接回车则使用: %DIR_NAME%）:

if "%DIR_NAME%"=="" set DIR_NAME=Sportswebsite

echo.
echo 正在克隆 %REPO_URL% 到 %DIR_NAME% 目录...
echo.

git clone %REPO_URL% "%DIR_NAME%"

if %ERRORLEVEL% equ 0 (
    echo.
    echo ======== 克隆成功！========
    echo 项目已克隆到: %CD%\%DIR_NAME%
    echo.
    cd /d "%DIR_NAME%"
    echo 当前目录已切换到项目目录
) else (
    echo.
    echo ======== 克隆失败！========
    echo 请检查：
    echo 1. 是否已配置 SSH Key（若使用 HTTPS 方式，请修改脚本中的 REPO_URL）
    echo 2. 网络是否正常
    echo 3. 是否有访问权限
)

echo.
pause
