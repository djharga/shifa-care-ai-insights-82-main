# 🚀 دليل النشر على Netlify

## 📋 المتطلبات
- حساب على [Netlify](https://www.netlify.com/)
- مشروع على GitHub
- متغيرات البيئة جاهزة

## 🔧 خطوات النشر

### 1. إنشاء حساب Netlify
1. اذهب إلى [netlify.com](https://www.netlify.com/)
2. سجل دخول باستخدام GitHub
3. اربط حساب GitHub

### 2. ربط المشروع
1. في لوحة تحكم Netlify، انقر على **"New site from Git"**
2. اختر **GitHub**
3. اختر الريبو: `shifa-care-ai-insights-82-main`
4. اترك الإعدادات الافتراضية (Netlify سيكتشف التكوين تلقائياً)

### 3. إعداد متغيرات البيئة
في إعدادات الموقع، اذهب إلى **Site settings > Environment variables** وأضف:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

### 4. إعدادات إضافية

#### دومين مخصص
1. اذهب إلى **Domain settings**
2. انقر على **"Add custom domain"**
3. أضف دومينك

#### SSL
- Netlify يوفر SSL مجاني تلقائياً

#### التنبيهات
1. اذهب إلى **Site settings > Notifications**
2. فعّل تنبيهات النشر

## 🔄 النشر التلقائي

### من GitHub
- أي push إلى branch `main` سيتم نشره تلقائياً
- Pull Requests تحصل على Preview URLs

### من Terminal
```bash
npm run deploy:netlify
```

## 📊 المميزات

### ✅ ما تم إعداده
- ملف `netlify.toml` للتكوين
- SPA Routing للـ React Router
- Headers أمان متقدمة
- Cache optimization للملفات الثابتة
- Build optimization

### 🚀 المميزات المتاحة
- نشر تلقائي من GitHub
- Preview URLs للـ Pull Requests
- SSL مجاني
- CDN عالمي
- تحليلات مجانية
- وظائف Serverless (اختياري)

## 🔧 إعدادات متقدمة

### إضافة وظائف Serverless
```toml
[functions]
  directory = "netlify/functions"
```

### إضافة Forms
```toml
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

## 📞 الدعم

### روابط مفيدة
- [Netlify Docs](https://docs.netlify.com/)
- [Build Settings](https://docs.netlify.com/configure-builds/overview/)
- [Environment Variables](https://docs.netlify.com/environment-variables/get-started/)

### مشاكل شائعة
1. **Build fails**: تأكد من Node.js 22
2. **Environment variables**: تأكد من إضافتها في Netlify
3. **Routing issues**: تأكد من ملف `_redirects`

## 🎉 تم النشر!

بعد النشر، ستحصل على رابط مثل:
`https://your-site-name.netlify.app`

يمكنك تغيير الاسم في إعدادات الموقع. 