@echo off
set "PATH=%LOCALAPPDATA%\Programs\MinGit\cmd;%LOCALAPPDATA%\Programs\MinGit\mingw64\bin;%PATH%"
cd /d "C:\Users\felip\OneDrive\Documents\Felpin"
echo =========================================
echo Enviando alteracoes para o GitHub...
echo =========================================
git push origin main
echo.
echo Concluido! Pressione qualquer tecla para fechar.
pause > nul