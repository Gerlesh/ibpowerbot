@echo off

title IB Power Bot Installer
echo /------------------------\
echo   IB Power Bot Installer
echo \------------------------/

cd %~dp0

if not exist "config.json" (call :configsetup)
if not exist "resources.json" (call :resourcessetup)
if not exist "run.bat" (call :launchersetup)
if not exist "%~dp0\node_modules\" goto :nodeinstall
goto :afterfunctions


:configsetup
echo Config file setup
echo { > "config.json"
set /p prefix="Command prefix: "
echo    "prefix":"%prefix%", >> "config.json"
set /p token="Bot token: "
echo    "token":"%token%", >> "config.json"
echo    "mods":[ >> "config.json"
echo    ] >> "config.json"
echo } >> "config.json"
echo Config file created. Add server moderators based on README.md
EXIT /B 0


:resourcessetup
echo Resources file setup
echo { > "resources.json"
echo } >> "resources.json"
echo Resources file created. Add resources based on README.md
EXIT /B 0


:launchersetup
echo Creating launcher file (run.bat)...
echo @echo off > "run.bat"
echo title IB Power Bot >> "run.bat"
echo echo /--------------\ >> "run.bat"
echo echo   IB Power Bot >> "run.bat"
echo echo \--------------/ >> "run.bat"
echo cd ^%~dp0 >> "run.bat"
echo :start >> "run.bat"
echo node server.js >> "run.bat"
echo goto :start >> "run.bat"
EXIT /B 0


:nodeinstall
echo Installing dependencies...
npm ci
echo Dependencies installed


:afterfunctions
echo Bot installation completed. If you need to edit any information provided during installation, consult README.md.
set /p start="Start bot? (y/n)"
if /I %start%==y (start "IB Power Bot" run.bat)
exit
