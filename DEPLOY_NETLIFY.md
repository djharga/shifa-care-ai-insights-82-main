# دليل النشر على Netlify - شفاء كير

## 🚀 النشر السريع

### الطريقة الأولى: النشر من GitHub

1. **ادفع الكود إلى GitHub:**
   ```bash
   git add .
   git commit -m "جاهز للنشر على Netlify"
   git push origin main
   ```

2. **اذهب إلى Netlify:**
   - افتح [netlify.com](https://netlify.com)
   - اضغط "New site from Git"
   - اختر GitHub
   - اختر repository الخاص بك

3. **إعدادات البناء:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

4. **متغيرات البيئة (Environment Variables):**
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_APP_NAME=Shifa Care AI Insights
   VITE_ENABLE_LOCAL_AUTH=true
   VITE_ENABLE_SUPABASE_AUTH=true
   ```

### الطريقة الثانية: النشر بالـ Drag & Drop

1. **ابن المشروع محلياً:**
   ```bash
   npm run build
   ```

2. **اسحب مجلد `dist` إلى Netlify**

## ⚙️ إعدادات متقدمة

### إعدادات النطاق المخصص

1. **في Netlify Dashboard:**
   - اذهب إلى Site settings > Domain management
   - اضغط "Add custom domain"
   - أدخل نطاقك

2. **إعدادات DNS:**
   ```
   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```

### إعدادات SSL

- Netlify يوفر SSL تلقائياً
- لا حاجة لإعدادات إضافية

### إعدادات التخزين المؤقت

- تم إعداد التخزين المؤقت في `netlify.toml`
- الملفات الثابتة تُخزن لمدة سنة
- الصفحات تُحدث فوراً

## 🔧 استكشاف الأخطاء

### مشاكل شائعة

1. **خطأ في البناء:**
   ```bash
   # تحقق من إصدار Node.js
   node --version  # يجب أن يكون 18 أو أحدث
   
   # امسح cache
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **مشاكل في التوجيه:**
   - تأكد من وجود ملف `_redirects`
   - تحقق من إعدادات `netlify.toml`

3. **مشاكل في المصادقة:**
   - تأكد من صحة متغيرات Supabase
   - تحقق من إعدادات CORS في Supabase

### سجلات الأخطاء

- في Netlify Dashboard > Functions > Logs
- في Netlify Dashboard > Deploys > [Deploy] > Logs

## 📱 إعدادات PWA

### Manifest
- تم إعداد `manifest.json`
- يدعم التثبيت كتطبيق

### Service Worker
- تم إعداد `sw.js`
- يوفر التخزين المؤقت
- يعمل offline

## 🔒 الأمان

### Headers
- تم إعداد headers الأمان في `_headers`
- Content Security Policy
- XSS Protection
- Frame Options

### CORS
- إعدادات CORS في `netlify.toml`
- يدعم Supabase و Netlify

## 📊 المراقبة

### Analytics
- يمكن إضافة Google Analytics
- يمكن إضافة Netlify Analytics

### Performance
- Lighthouse score محسن
- Core Web Vitals محسنة
- التخزين المؤقت محسن

## 🚀 النشر التلقائي

### GitHub Actions (اختياري)

```yaml
name: Deploy to Netlify
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './dist'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 📞 الدعم

### روابط مفيدة
- [Netlify Docs](https://docs.netlify.com/)
- [Vite Docs](https://vitejs.dev/)
- [Supabase Docs](https://supabase.com/docs)

### بيانات الاتصال
- GitHub Issues: [رابط repository]
- Email: support@shifacare.com

---

## ✅ قائمة التحقق قبل النشر

- [ ] الكود يعمل محلياً
- [ ] جميع الاختبارات تمر
- [ ] متغيرات البيئة محددة
- [ ] ملفات الأمان موجودة
- [ ] PWA يعمل
- [ ] التخزين المؤقت محسن
- [ ] SEO محسن
- [ ] الأداء مقبول

---

**🎉 تهانينا! موقعك جاهز للنشر على Netlify!** 