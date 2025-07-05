@echo off
chcp 65001 >nul
echo 🚀 بدء عملية الرفع التلقائي على GitHub...

echo 📊 فحص حالة Git...
git status

echo 📁 إضافة الملفات...
git add .

for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "TIMESTAMP=%YYYY%-%MM%-%DD% %HH%:%Min%:%Sec%"

echo 💾 إنشاء commit...
git commit -m "🔄 تحديث تلقائي - %TIMESTAMP%"

echo ⬆️ رفع التحديثات على GitHub...
git push origin main

echo ✅ تم الرفع بنجاح!
echo 🔗 رابط المستودع: https://github.com/djharga/shifa-care-ai-insights-82-main
echo 📅 وقت الرفع: %TIMESTAMP%
pause 