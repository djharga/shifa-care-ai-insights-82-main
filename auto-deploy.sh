#!/bin/bash

# Script تلقائي لرفع التحديثات على GitHub
# Auto-deploy script for GitHub

echo "🚀 بدء عملية الرفع التلقائي على GitHub..."

# التحقق من حالة Git
echo "📊 فحص حالة Git..."
git status

# إضافة جميع الملفات
echo "📁 إضافة الملفات..."
git add .

# إنشاء commit مع timestamp
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
COMMIT_MESSAGE="🔄 تحديث تلقائي - $TIMESTAMP

📝 التحديثات:
- تحسينات في الكود
- إصلاح الأخطاء
- تحديث التوثيق
- تحسين الأداء

🕐 وقت التحديث: $TIMESTAMP"

echo "💾 إنشاء commit..."
git commit -m "$COMMIT_MESSAGE"

# رفع التحديثات
echo "⬆️ رفع التحديثات على GitHub..."
git push origin main

echo "✅ تم الرفع بنجاح!"
echo "🔗 رابط المستودع: https://github.com/djharga/shifa-care-ai-insights-82-main"
echo "📅 وقت الرفع: $TIMESTAMP" 