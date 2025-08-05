@echo off
echo Starting ASCII Art project deployment...
echo.

echo Checking git status...
git status
echo.

echo Adding files to git...
git add .
if errorlevel 1 (
    echo Git add failed!
    pause
    exit /b 1
)

echo Committing changes...
git commit -m "🚀 Quick update: Auto deployment via batch script"
if errorlevel 1 (
    echo Commit failed or no changes to commit!
    echo.
    echo This might be normal if there are no changes.
    echo.
)

echo Pushing to GitHub...
git push origin master
if errorlevel 1 (
    echo Push failed!
    pause
    exit /b 1
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
echo (GitHub Pages may take a few minutes to update)
echo.
pause