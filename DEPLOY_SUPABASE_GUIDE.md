# 🚀 دليل نشر شفاء كير مع Supabase

## 📋 المتطلبات
- Node.js 22+ (مطلوب)
- حساب Supabase (مجاني)
- حساب Vercel/Netlify (مجاني)
- مفتاح OpenAI (your-openai-api-key)

---

## 🔧 الخطوة 1: إنشاء قاعدة بيانات Supabase

### 1.1 إنشاء مشروع Supabase
1. ادخل على [Supabase](https://supabase.com/)
2. اضغط "Start your project"
3. سجل دخولك بـ GitHub أو Google
4. اضغط "New Project"
5. اختر اسم المشروع: `shifa-care-ai`
6. اختر كلمة مرور قوية لقاعدة البيانات
7. اختر المنطقة الأقرب لك
8. اضغط "Create new project"

### 1.2 الحصول على بيانات الاتصال
1. بعد إنشاء المشروع، اذهب إلى Settings → API
2. انسخ:
   - **Project URL**: `your-supabase-url`
   - **anon public key**: `your-supabase-anon-key`

### 1.3 إنشاء قاعدة البيانات
1. اذهب إلى SQL Editor
2. انسخ محتوى ملف `supabase-setup.sql`
3. اضغط "Run" لتنفيذ السكريبت
4. ستظهر رسالة نجاح مع عدد الجداول المنشأة

---

## 🔑 الخطوة 2: إعداد مفتاح OpenAI

### 2.1 الحصول على مفتاح OpenAI
1. ادخل على [OpenAI Platform](https://platform.openai.com/)
2. سجل دخولك أو أنشئ حساب جديد
3. اذهب إلى API Keys
4. اضغط "Create new secret key"
5. انسخ المفتاح: `sk-...`

---

## 🌐 الخطوة 3: رفع الكود على GitHub

### 3.1 إنشاء مستودع GitHub
1. ادخل على [GitHub](https://github.com/)
2. اضغط "New repository"
3. اختر اسم: `shifa-care-ai-insights`
4. اختر Public
5. اضغط "Create repository"

### 3.2 رفع الكود
```bash
# في مجلد المشروع
git init
git add .
git commit -m "🚀 إطلاق شفاء كير مع Supabase"
git branch -M main
git remote add origin https://github.com/your-username/shifa-care-ai-insights.git
git push -u origin main
```

---

## 🚀 الخطوة 4: نشر على Vercel (مجاني)

### 4.1 إنشاء حساب Vercel
1. ادخل على [Vercel](https://vercel.com/)
2. سجل دخولك بـ GitHub
3. اضغط "New Project"
4. اختر المستودع `shifa-care-ai-insights`

### 4.2 إعداد متغيرات البيئة
في Vercel، أضف هذه المتغيرات:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_OPENAI_API_KEY=sk-...
VITE_OPENAI_MODEL=gpt-4o-mini
VITE_APP_NAME=شفاء كير
VITE_APP_VERSION=2025.2.1
VITE_APP_ENV=production
VITE_APP_LOCALE=ar-EG
VITE_AI_RESPONSE_LANGUAGE=egyptian_arabic
```

### 4.3 إعدادات البناء
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node.js Version**: 22.x

### 4.4 النشر
1. اضغط "Deploy"
2. انتظر حتى يكتمل البناء
3. ستظهر رسالة نجاح مع رابط الموقع

---

## 🔧 الخطوة 5: اختبار النظام

### 5.1 اختبار قاعدة البيانات
1. افتح الموقع المنشور
2. اذهب إلى صفحة المرضى
3. تأكد من ظهور البيانات الافتراضية

### 5.2 اختبار AI
1. اذهب إلى صفحة الجلسات
2. أنشئ جلسة جديدة
3. تأكد من استجابة AI باللغة المصرية

### 5.3 اختبار الإدارة
1. اذهب إلى صفحة الإدارة
2. تأكد من عمل جميع الأقسام

---

## 📱 الخطوة 6: ربط النطاق (اختياري)

### 6.1 نطاق مخصص
1. في Vercel، اذهب إلى Settings → Domains
2. أضف نطاقك المخصص
3. اتبع التعليمات لإعداد DNS

---

## 🔒 الأمان

### 6.1 حماية البيانات
- ✅ جميع البيانات مشفرة
- ✅ Row Level Security مفعل
- ✅ API Keys محمية
- ✅ HTTPS إجباري

### 6.2 النسخ الاحتياطي
- ✅ Supabase يقوم بنسخ احتياطي تلقائي
- ✅ يمكنك تصدير البيانات يدوياً

---

## 💰 التكلفة

### الخطة المجانية تشمل:
- ✅ **Supabase**: 500MB قاعدة بيانات، 50,000 طلب شهرياً
- ✅ **Vercel**: استضافة مجانية غير محدودة
- ✅ **OpenAI**: $5 رصيد مجاني شهرياً
- ✅ **GitHub**: مستودعات عامة مجانية

### الترقية (اختياري):
- **Supabase Pro**: $25/شهر (للمشاريع الكبيرة)
- **Vercel Pro**: $20/شهر (للميزات المتقدمة)
- **OpenAI**: حسب الاستخدام

---

## 🆘 استكشاف الأخطاء

### مشاكل شائعة:

#### 1. خطأ في الاتصال بـ Supabase
```bash
# تأكد من صحة بيانات الاتصال
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

#### 2. خطأ في OpenAI
```bash
# تأكد من صحة مفتاح API
VITE_OPENAI_API_KEY=sk-...
```

#### 3. خطأ في البناء
```bash
# تأكد من Node.js 22+
node --version
# يجب أن يظهر: v22.x.x
```

#### 4. خطأ في قاعدة البيانات
```bash
# نفذ سكريبت الإعداد مرة أخرى
# في Supabase SQL Editor
```

---

## 📞 الدعم

### روابط مفيدة:
- 📚 [دليل Supabase](https://supabase.com/docs)
- 🚀 [دليل Vercel](https://vercel.com/docs)
- 🤖 [دليل OpenAI](https://platform.openai.com/docs)
- 💬 [مجتمع شفاء كير](https://github.com/your-username/shifa-care-ai-insights)

### للدعم الفني:
- 📧 البريد الإلكتروني: support@shifa-care.com
- 💬 Discord: [رابط السيرفر]
- 📱 WhatsApp: [رقم الدعم]

---

## ✅ قائمة التحقق

- [ ] إنشاء مشروع Supabase
- [ ] تنفيذ سكريبت قاعدة البيانات
- [ ] الحصول على مفتاح OpenAI
- [ ] رفع الكود على GitHub
- [ ] نشر على Vercel
- [ ] إعداد متغيرات البيئة
- [ ] اختبار النظام
- [ ] ربط النطاق (اختياري)

---

## 🎉 تم النشر بنجاح!

موقعك الآن يعمل أونلاين على:
**https://your-project.vercel.app**

### المميزات المتاحة:
- ✅ نظام إدارة المرضى
- ✅ نظام الجلسات مع AI
- ✅ إدارة الغرف والأسرّة
- ✅ نظام المدفوعات
- ✅ التقارير والإحصائيات
- ✅ واجهة عربية كاملة
- ✅ استجابة AI باللغة المصرية

**مبروك! 🎊 موقع شفاء كير جاهز للاستخدام!** 