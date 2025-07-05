# 🚀 دليل الرفع التلقائي على GitHub

## 📋 نظرة عامة
هذا الدليل يوضح كيفية استخدام scripts الرفع التلقائي لرفع التحديثات على GitHub بشكل سريع وسهل.

## 🔧 الملفات المتاحة

### 1. `auto-deploy.sh` (Linux/macOS)
```bash
# تشغيل الرفع التلقائي
./auto-deploy.sh
```

### 2. `auto-deploy.ps1` (Windows PowerShell)
```powershell
# تشغيل الرفع التلقائي
.\auto-deploy.ps1
```

## 📝 كيفية الاستخدام

### الطريقة الأولى: تشغيل Script مباشرة
```bash
# في Linux/macOS
chmod +x auto-deploy.sh
./auto-deploy.sh

# في Windows PowerShell
.\auto-deploy.ps1
```

### الطريقة الثانية: تشغيل من npm
```bash
# إضافة script في package.json
npm run deploy
```

### الطريقة الثالثة: تشغيل يدوي
```bash
# إضافة الملفات
git add .

# إنشاء commit
git commit -m "تحديث جديد"

# رفع التحديثات
git push origin main
```

## ⚙️ إعداد الرفع التلقائي

### 1. إعداد Git Credentials
```bash
# حفظ بيانات الاعتماد
git config --global credential.helper store
```

### 2. إعداد SSH Keys (اختياري)
```bash
# إنشاء SSH key
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# إضافة SSH key إلى GitHub
cat ~/.ssh/id_rsa.pub
# انسخ المحتوى وأضفه في GitHub Settings > SSH Keys
```

### 3. إعداد Branch Protection (اختياري)
- اذهب إلى GitHub Repository Settings
- اختر Branches
- أضف rule للـ main branch
- فعّل "Require pull request reviews"

## 🔄 Workflow الرفع التلقائي

### الخطوات التي يقوم بها Script:
1. **فحص حالة Git** - عرض الملفات المعدلة
2. **إضافة الملفات** - `git add .`
3. **إنشاء Commit** - مع timestamp وتفاصيل التحديث
4. **رفع التحديثات** - `git push origin main`
5. **تأكيد النجاح** - عرض رابط المستودع

### مثال على Commit Message:
```
🔄 تحديث تلقائي - 2025-07-05 10:30:45

📝 التحديثات:
- تحسينات في الكود
- إصلاح الأخطاء
- تحديث التوثيق
- تحسين الأداء

🕐 وقت التحديث: 2025-07-05 10:30:45
```

## 🛠️ تخصيص Script

### تعديل Commit Message:
```bash
# في auto-deploy.sh
COMMIT_MESSAGE="تحديث مخصص - $TIMESTAMP"
```

### إضافة فحصات إضافية:
```bash
# فحص الأخطاء قبل الرفع
npm run lint
npm run test

# فحص حجم الملفات
du -sh .
```

### إضافة إشعارات:
```bash
# إرسال إشعار عند نجاح الرفع
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"تم الرفع بنجاح!"}' \
  https://hooks.slack.com/services/YOUR_WEBHOOK_URL
```

## 🔍 استكشاف الأخطاء

### مشكلة: Authentication Failed
```bash
# إعادة إعداد Git credentials
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

### مشكلة: Permission Denied
```bash
# إعطاء صلاحيات للـ script
chmod +x auto-deploy.sh
```

### مشكلة: Merge Conflicts
```bash
# حل التعارضات قبل الرفع
git pull origin main
# حل التعارضات يدوياً
git add .
git commit -m "حل التعارضات"
```

## 📊 مراقبة الرفع

### فحص حالة الرفع:
```bash
# عرض آخر commits
git log --oneline -5

# عرض حالة الـ remote
git remote -v

# عرض branches
git branch -a
```

### فحص GitHub Actions (إذا كان مفعلاً):
- اذهب إلى GitHub Repository
- اختر Actions tab
- راقب workflow runs

## 🚀 نصائح للاستخدام الأمثل

### 1. رفع منتظم
```bash
# رفع يومي في الساعة 9 صباحاً
0 9 * * * /path/to/auto-deploy.sh
```

### 2. رفع قبل النوم
```bash
# إضافة alias
alias deploy="./auto-deploy.sh"
```

### 3. رفع مع فحص
```bash
# إضافة فحصات قبل الرفع
npm run build && ./auto-deploy.sh
```

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من إعدادات Git
2. تأكد من وجود internet connection
3. تحقق من صلاحيات GitHub
4. راجع logs الأخطاء

## 🔗 روابط مفيدة

- [GitHub Repository](https://github.com/djharga/shifa-care-ai-insights-82-main)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub CLI](https://cli.github.com/)
- [GitHub Actions](https://github.com/features/actions)

---

**ملاحظة:** تأكد من اختبار scripts في بيئة آمنة قبل استخدامها في الإنتاج. 