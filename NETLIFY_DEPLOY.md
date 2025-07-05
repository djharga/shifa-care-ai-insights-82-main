# 🚀 نشر شفا كير على Netlify

## 📋 المتطلبات المسبقة

1. **حساب Netlify** - [سجل هنا](https://app.netlify.com/signup)
2. **حساب GitHub** - لحفظ الكود
3. **حساب Supabase** - لقاعدة البيانات
4. **OpenAI API Key** - للمساعد الذكي

---

## 🔧 خطوات النشر

### 1. رفع الكود إلى GitHub

```bash
# تهيئة Git (إذا لم تكن موجودة)
git init

# إضافة الملفات
git add .

# حفظ التغييرات
git commit -m "إعداد النشر على Netlify"

# رفع إلى GitHub
git remote add origin https://github.com/djharga/shifa-care-ai-insights-82-main.git
git branch -M main
git push -u origin main
```

### 2. إعداد Netlify

1. **اذهب إلى [Netlify](https://app.netlify.com)**
2. **اضغط "New site from Git"**
3. **اختر GitHub**
4. **اختر المستودع `shifa-care-ai-insights-82-main`**
5. **اضبط إعدادات البناء:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. **اضغط "Deploy site"**

### 3. إعداد متغيرات البيئة

في Netlify Dashboard:

1. **اذهب إلى Site settings > Environment variables**
2. **أضف المتغيرات التالية:**

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_APP_ENV=production
```

### 4. إعداد النطاق المخصص (اختياري)

1. **اذهب إلى Site settings > Domain management**
2. **اضغط "Add custom domain"**
3. **أدخل النطاق المطلوب**
4. **اتبع التعليمات لإعداد DNS**

---

## ⚙️ إعدادات إضافية

### إعدادات البناء المتقدمة

في ملف `netlify.toml`:

```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--legacy-peer-deps"
```

### إعدادات التخزين المؤقت

```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### إعدادات الأمان

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

---

## 🔍 اختبار النشر

### 1. اختبار الوظائف الأساسية

- ✅ **الصفحة الرئيسية** - تحميل صحيح
- ✅ **تسجيل دخول المدير** - يعمل بنجاح
- ✅ **الترجمة** - تبديل بين اللغات
- ✅ **المساعد الذكي** - استجابة صحيحة

### 2. اختبار الأدوار والصلاحيات

- ✅ **المدير الرئيسي** - `djharga@gmail.com` / `metaleslam`
- ✅ **لوحة التحكم** - الوصول لجميع الأقسام
- ✅ **إدارة المالية** - إضافة وتعديل البيانات
- ✅ **إدارة الغرف** - إضافة وتعديل الغرف

### 3. اختبار الأداء

- ✅ **سرعة التحميل** - أقل من 3 ثواني
- ✅ **التجاوب** - يعمل على جميع الأجهزة
- ✅ **التخزين المؤقت** - تحميل سريع للصفحات

---

## 🚨 استكشاف الأخطاء

### مشاكل شائعة وحلولها

#### 1. خطأ في البناء
```bash
# تحقق من التبعيات
npm install

# تنظيف البناء
npm run clean
npm run build
```

#### 2. خطأ في متغيرات البيئة
- تأكد من صحة قيم Supabase
- تحقق من OpenAI API Key
- أعد نشر الموقع بعد التحديث

#### 3. خطأ في التوجيه
- تحقق من ملف `_redirects`
- تأكد من إعدادات SPA في Netlify

#### 4. خطأ في قاعدة البيانات
- تحقق من إعدادات Supabase
- تأكد من تشغيل schema.sql
- راجع إعدادات RLS

---

## 📊 مراقبة الأداء

### أدوات المراقبة

1. **Netlify Analytics** - إحصائيات الزيارات
2. **Google Analytics** - تحليلات مفصلة
3. **Sentry** - تتبع الأخطاء
4. **Supabase Dashboard** - مراقبة قاعدة البيانات

### مؤشرات الأداء

- **Core Web Vitals** - LCP, FID, CLS
- **سرعة التحميل** - أقل من 3 ثواني
- **معدل الخطأ** - أقل من 1%
- **وقت الاستجابة** - أقل من 200ms

---

## 🔄 التحديثات المستمرة

### النشر التلقائي

1. **ربط GitHub مع Netlify**
2. **إعداد النشر التلقائي**
3. **اختبار التحديثات**

### إدارة الإصدارات

```bash
# تحديث الإصدار
npm version patch

# رفع التحديثات
git add .
git commit -m "تحديث الإصدار"
git push origin main
```

---

## 📞 الدعم

### في حالة المشاكل

1. **تحقق من Netlify Status** - [status.netlify.com](https://status.netlify.com)
2. **راجع Build Logs** - في Netlify Dashboard
3. **تواصل مع الدعم** - support@netlify.com

### معلومات مفيدة

- **Netlify Docs** - [docs.netlify.com](https://docs.netlify.com)
- **Vite Docs** - [vitejs.dev](https://vitejs.dev)
- **Supabase Docs** - [supabase.com/docs](https://supabase.com/docs)

---

## 🎉 النشر الناجح

بعد النشر الناجح:

1. **اختبر جميع الوظائف**
2. **تحقق من الأداء**
3. **أضف النطاق المخصص**
4. **فعّل SSL**
5. **أضف Google Analytics**
6. **أضف أدوات المراقبة**

---

**شفا كير** - رعاية نفسية ذكية ومتطورة  
**GitHub:** https://github.com/djharga/shifa-care-ai-insights-82-main.git  
**النشر على:** Netlify  
**الإصدار:** 1.0  
**التاريخ:** 2024 