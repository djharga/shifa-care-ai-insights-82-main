# دليل النشر على Netlify - شفاء كير

## 🚀 نشر سريع على Netlify

### الخطوة 1: إعداد GitHub
1. ارفع المشروع إلى GitHub
2. تأكد من وجود جميع الملفات المطلوبة

### الخطوة 2: إعداد Netlify
1. اذهب إلى [netlify.com](https://netlify.com)
2. سجل دخول باستخدام GitHub
3. اضغط "New site from Git"
4. اختر GitHub واختر المستودع

### الخطوة 3: إعدادات البناء
```bash
# Build command
npm run build

# Publish directory
dist

# Node version
14
```

### الخطوة 4: إعداد المتغيرات البيئية
في إعدادات الموقع على Netlify، أضف:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_OPENAI_API_KEY=your-openai-api-key
VITE_APP_NAME=شفاء كير
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=production
```

### الخطوة 5: إعدادات إضافية
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "14"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### الخطوة 6: النشر
1. اضغط "Deploy site"
2. انتظر حتى يكتمل النشر
3. احصل على رابط الموقع

## 🔧 إعدادات متقدمة

### النطاق المخصص
1. في إعدادات الموقع
2. اذهب إلى "Domain settings"
3. أضف نطاقك المخصص
4. اتبع تعليمات DNS

### SSL/HTTPS
- Netlify يوفر SSL تلقائياً
- لا حاجة لإعداد إضافي

### النسخ الاحتياطية
- Netlify يحفظ نسخ من كل نشر
- يمكن العودة لأي نسخة سابقة

## 📊 المراقبة

### Analytics
- Netlify Analytics مجاني
- تتبع الزيارات والأداء
- تحليل السلوك

### Logs
- مراجعة سجلات البناء
- تتبع الأخطاء
- تحليل الأداء

## 🐛 حل المشاكل

### مشكلة: البناء فشل
**الحل**: تحقق من:
- إعدادات Node.js
- المتغيرات البيئية
- تبعيات المشروع

### مشكلة: الموقع لا يعمل
**الحل**: تحقق من:
- إعدادات النشر
- ملف netlify.toml
- التوجيه (redirects)

### مشكلة: المتغيرات البيئية لا تعمل
**الحل**: تحقق من:
- أسماء المتغيرات
- إعادة نشر الموقع
- إعدادات البيئة

## 🔄 النشر المستمر

### GitHub Integration
- النشر التلقائي عند كل push
- مراجعة التغييرات قبل النشر
- إعدادات البيئات المختلفة

### Branch Deployments
```bash
# نشر من فرع محدد
git push origin feature/new-feature

# مراجعة على Netlify
# ثم دمج مع main
```

## 📱 PWA Support

### إعداد PWA
```json
// public/manifest.json
{
  "name": "شفاء كير",
  "short_name": "شفاء كير",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3B82F6"
}
```

### Service Worker
```javascript
// public/sw.js
// Service Worker للعمل بدون إنترنت
```

## 🔐 الأمان

### Headers الأمان
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'"
```

### Environment Variables
- حماية المفاتيح الحساسة
- استخدام متغيرات بيئية
- عدم رفع المفاتيح إلى Git

## 📈 الأداء

### تحسينات
- ضغط الملفات
- تحسين الصور
- تحسين الخطوط
- تحسين JavaScript

### CDN
- Netlify CDN عالمي
- تحسين سرعة التحميل
- تقليل زمن الاستجابة

## 🔍 SEO

### إعدادات SEO
```html
<!-- public/index.html -->
<meta name="description" content="شفاء كير - نظام الذكاء الاصطناعي للعلاج النفسي">
<meta name="keywords" content="علاج نفسي, ذكاء اصطناعي, مصر">
<meta name="author" content="شفاء كير">
```

### Sitemap
```xml
<!-- public/sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-site.netlify.app/</loc>
    <lastmod>2025-07-05</lastmod>
  </url>
</urlset>
```

## 📞 الدعم

### Netlify Support
- [Netlify Docs](https://docs.netlify.com)
- [Netlify Community](https://community.netlify.com)
- [Netlify Status](https://status.netlify.com)

### مشاكل شائعة
1. **مشكلة البناء**: تحقق من إعدادات Node.js
2. **مشكلة التوجيه**: تحقق من netlify.toml
3. **مشكلة المتغيرات**: تحقق من Environment Variables

---

**شفاء كير** - نشر سريع وآمن على Netlify 🚀 