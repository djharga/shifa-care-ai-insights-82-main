@echo off
cd /d "C:\Users\postgres\Downloads\shifa-care-ai-insights-82-main\node-v24.3.0-win-x64\node-v24.3.0-win-x64"
set PATH=%CD%;%CD%\node_modules\npm\bin;%PATH%
echo ✅ تم تهيئة بيئة Node.js بنجاح
echo -------------------------------
node -v
npm -v
cmd
