# 🚀 دليل النشر - شفاء كير مع Supabase

## 📋 المتطلبات
- Node.js 22+ (مطلوب)
- حساب GitHub
- حساب Supabase (مجاني)
- حساب Vercel/Netlify (مجاني)
- مفتاح OpenAI (مجاني)

---

## 🗄️ 1. إعداد قاعدة البيانات (Supabase)

### الخطوة 1: إنشاء مشروع Supabase
1. ادخل على [Supabase](https://supabase.com)
2. اضغط "Start your project"
3. سجل دخول بحساب GitHub
4. اضغط "New Project"
5. اختر اسم المشروع: `shifa-care-ai`
6. اختر كلمة مرور قوية لقاعدة البيانات
7. اختر المنطقة الأقرب لك
8. اضغط "Create new project"

### الخطوة 2: نسخ بيانات الاتصال
1. بعد إنشاء المشروع، اذهب إلى Settings → API
2. انسخ:
   - **Project URL**: `https://your-project.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### الخطوة 3: إنشاء الجداول
1. اذهب إلى SQL Editor
2. انسخ محتوى ملف `supabase-setup.sql`
3. اضغط "Run" لتنفيذ السكريبت
4. ستظهر رسالة نجاح مع عدد الجداول والبيانات المنشأة

---

## 🔑 2. إعداد OpenAI

### الخطوة 1: الحصول على مفتاح API
1. ادخل على [OpenAI Platform](https://platform.openai.com)
2. سجل دخول أو أنشئ حساب جديد
3. اذهب إلى API Keys
4. اضغط "Create new secret key"
5. انسخ المفتاح (يبدأ بـ `sk-`)

---

## 🌐 3. رفع الكود على GitHub

### الخطوة 1: إنشاء مستودع
1. ادخل على [GitHub](https://github.com)
2. اضغط "New repository"
3. اختر اسم: `shifa-care-ai-insights`
4. اختر Public
5. اضغط "Create repository"

### الخطوة 2: رفع الكود
```bash
# في مجلد المشروع
git init
git add .
git commit -m "🚀 إطلاق شفاء كير"
git branch -M main
git remote add origin https://github.com/username/shifa-care-ai-insights.git
git push -u origin main
```

---

## 🚀 4. النشر على Vercel (مجاني)

### الخطوة 1: ربط Vercel مع GitHub
1. ادخل على [Vercel](https://vercel.com)
2. سجل دخول بحساب GitHub
3. اضغط "New Project"
4. اختر المستودع `shifa-care-ai-insights`
5. اضغط "Import"

### الخطوة 2: إعداد متغيرات البيئة
في صفحة إعداد المشروع، أضف هذه المتغيرات:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_OPENAI_API_KEY=sk-your-openai-key-here
VITE_OPENAI_MODEL=gpt-4o-mini
VITE_APP_NAME=شفاء كير
VITE_APP_ENV=production
VITE_APP_LOCALE=ar-EG
VITE_AI_RESPONSE_LANGUAGE=egyptian_arabic
```

### الخطوة 3: إعدادات البناء
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node.js Version**: 22.x

### الخطوة 4: النشر
1. اضغط "Deploy"
2. انتظر حتى يكتمل البناء (2-3 دقائق)
3. ستظهر رسالة نجاح مع رابط الموقع

---

## 🔧 5. إعدادات إضافية

### إعداد النطاق المخصص (اختياري)
1. في Vercel، اذهب إلى Settings → Domains
2. أضف نطاقك المخصص
3. اتبع التعليمات لإعداد DNS

### إعداد HTTPS
- Vercel يوفر HTTPS تلقائياً
- لا تحتاج لإعداد إضافي

---

## 📱 6. اختبار الموقع

### اختبار الوظائف الأساسية
1. ✅ تسجيل دخول المدير
2. ✅ إدارة المرضى
3. ✅ إدارة الجلسات
4. ✅ إدارة الغرف
5. ✅ إدارة المالية
6. ✅ الذكاء الاصطناعي

### بيانات تسجيل الدخول الافتراضية
- **البريد الإلكتروني**: `admin@shifa-care.com`
- **كلمة المرور**: (ستحتاج لإنشائها في Supabase)

---

## 🔒 7. الأمان

### إعدادات Supabase
1. اذهب إلى Authentication → Settings
2. فعّل Email confirmation
3. أضف قواعد كلمة المرور
4. فعّل Two-factor authentication (اختياري)

### إعدادات Vercel
1. اذهب إلى Settings → Security
2. فعّل Security Headers
3. أضف Content Security Policy

---

## 📊 8. المراقبة

### مراقبة الأداء
- Vercel Analytics (مجاني)
- Supabase Dashboard
- OpenAI Usage Dashboard

### مراقبة الأخطاء
- Vercel Function Logs
- Supabase Logs
- Browser Console

---

## 🆘 9. استكشاف الأخطاء

### مشاكل شائعة
1. **خطأ في الاتصال بقاعدة البيانات**
   - تحقق من بيانات Supabase
   - تأكد من تفعيل RLS

2. **خطأ في OpenAI**
   - تحقق من مفتاح API
   - تحقق من رصيد الحساب

3. **خطأ في البناء**
   - تأكد من Node.js 22+
   - تحقق من متغيرات البيئة

### الدعم
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [OpenAI Docs](https://platform.openai.com/docs)

---

## 🎉 10. النجاح!

مبروك! موقعك الآن يعمل أونلاين مجاناً مع:
- ✅ قاعدة بيانات PostgreSQL (Supabase)
- ✅ استضافة سريعة (Vercel)
- ✅ ذكاء اصطناعي (OpenAI)
- ✅ واجهة عربية كاملة
- ✅ أمان عالي
- ✅ أداء ممتاز

### الرابط النهائي
`https://your-project.vercel.app`

---

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من هذا الدليل
2. راجع ملفات السجلات
3. ابحث في الوثائق الرسمية
4. اطلب المساعدة من المجتمع

**تم إنشاؤه بواسطة فريق شفاء كير - 2025** 🏥 