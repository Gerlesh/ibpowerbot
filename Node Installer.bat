@echo off

title Node Installer
echo Node Installer
@RD /S /Q C:\Users\Owner\Documents\github\ibpowerbot\node_modules
npm i
npm ci
pause
