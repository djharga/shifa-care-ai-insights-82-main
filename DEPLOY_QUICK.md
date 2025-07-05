# دليل النشر السريع - شفاء كير

## 🚀 نشر سريع على Vercel

### الخطوة 1: إعداد GitHub
1. ارفع المشروع إلى GitHub
2. تأكد من وجود جميع الملفات المطلوبة

### الخطوة 2: إعداد Vercel
1. اذهب إلى [vercel.com](https://vercel.com)
2. سجل دخول باستخدام GitHub
3. اضغط "New Project"
4. اختر المستودع من GitHub

### الخطوة 3: إعداد المتغيرات البيئية
في إعدادات المشروع على Vercel، أضف:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_OPENAI_API_KEY=your-openai-api-key
VITE_APP_NAME=شفاء كير
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=production
```

### الخطوة 4: النشر
1. اضغط "Deploy"
2. انتظر حتى يكتمل النشر
3. احصل على رابط الموقع

## 🗄️ إعداد Supabase

### إنشاء مشروع Supabase
1. اذهب إلى [supabase.com](https://supabase.com)
2. أنشئ مشروع جديد
3. انسخ URL و ANON KEY

### تشغيل الهجرات
```sql
-- تشغيل ملف الهجرات الكامل
-- انسخ محتوى supabase/migrations/complete-system.sql
-- والصقه في SQL Editor في Supabase
```

## 🔑 الحصول على مفتاح OpenAI

1. اذهب إلى [platform.openai.com](https://platform.openai.com)
2. أنشئ حساب جديد أو سجل دخول
3. اذهب إلى API Keys
4. أنشئ مفتاح جديد
5. انسخ المفتاح

## ✅ التحقق من النشر

### اختبار الوظائف
1. ✅ الصفحة الرئيسية تعمل
2. ✅ نظام الجلسات المتقدمة يعمل
3. ✅ الذكاء الاصطناعي يعمل
4. ✅ قاعدة البيانات متصلة
5. ✅ الترجمة تعمل

### اختبار الأمان
1. ✅ المتغيرات البيئية محمية
2. ✅ HTTPS مفعل
3. ✅ Headers الأمان موجودة

## 🐛 حل المشاكل الشائعة

### مشكلة: الموقع لا يعمل
**الحل**: تحقق من المتغيرات البيئية في Vercel

### مشكلة: قاعدة البيانات لا تعمل
**الحل**: تحقق من إعدادات Supabase و RLS

### مشكلة: الذكاء الاصطناعي لا يعمل
**الحل**: تحقق من مفتاح OpenAI API

### مشكلة: الترجمة لا تعمل
**الحل**: تحقق من ملفات الترجمة في `src/locales/`

## 📞 الدعم

إذا واجهت أي مشاكل:
1. راجع ملف `README.md`
2. تحقق من `CONTRIBUTING.md`
3. ارفع issue على GitHub
4. تواصل مع فريق الدعم

---

**شفاء كير** - نشر سريع وآمن 🚀 