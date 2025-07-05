# Script تلقائي لرفع التحديثات على GitHub - PowerShell
# Auto-deploy script for GitHub - PowerShell

Write-Host "🚀 بدء عملية الرفع التلقائي على GitHub..." -ForegroundColor Green

# التحقق من حالة Git
Write-Host "📊 فحص حالة Git..." -ForegroundColor Yellow
git status

# إضافة جميع الملفات
Write-Host "📁 إضافة الملفات..." -ForegroundColor Yellow
git add .

# إنشاء commit مع timestamp
$TIMESTAMP = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$COMMIT_MESSAGE = @"
🔄 تحديث تلقائي - $TIMESTAMP

📝 التحديثات:
- تحسينات في الكود
- إصلاح الأخطاء
- تحديث التوثيق
- تحسين الأداء

🕐 وقت التحديث: $TIMESTAMP
"@

Write-Host "💾 إنشاء commit..." -ForegroundColor Yellow
git commit -m $COMMIT_MESSAGE

# رفع التحديثات
Write-Host "⬆️ رفع التحديثات على GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "✅ تم الرفع بنجاح!" -ForegroundColor Green
Write-Host "🔗 رابط المستودع: https://github.com/djharga/shifa-care-ai-insights-82-main" -ForegroundColor Cyan
Write-Host "📅 وقت الرفع: $TIMESTAMP" -ForegroundColor Gray 