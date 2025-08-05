@echo off
chcp 65001 > nul
echo Starting ASCII Art project deployment...
echo.

echo Checking git status...
git status
echo.

echo Getting current branch name...
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
echo Current branch: %CURRENT_BRANCH%
echo.

echo Adding files to git...
git add .
if errorlevel 1 (
    echo Git add failed!
    pause
    exit /b 1
)

echo Checking if there are changes to commit...
git diff --cached --quiet
if errorlevel 1 (
    echo Committing changes...
    git commit -m "Quick update: Auto deployment via batch script"
    if errorlevel 1 (
        echo Commit failed!
        pause
        exit /b 1
    )
    echo.
    echo Pushing to GitHub...
    git push
    if errorlevel 1 (
        echo Push failed! Trying with origin %CURRENT_BRANCH%...
        git push origin %CURRENT_BRANCH%
        if errorlevel 1 (
            echo Push failed!
            echo.
            echo Please check:
            echo 1. Internet connection
            echo 2. GitHub credentials
            echo 3. Repository permissions
            echo 4. Branch permissions for %CURRENT_BRANCH%
            pause
            exit /b 1
        )
    )
) else (
    echo No changes to commit. Everything is up to date!
    echo.
)

echo.
echo =====================================
echo   ASCII Art Deployment Complete! 
echo =====================================
echo.
echo Your changes have been uploaded to:
echo https://github.com/xiaonaofua/asciiArt
echo.
echo Website will be updated at:
echo https://xiaonaofua.github.io/asciiArt/
echo.
echo GitHub Pages may take a few minutes to update
echo.
pause