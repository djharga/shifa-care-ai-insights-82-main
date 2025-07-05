# 🚀 نشر سريع على Netlify

## 📋 خطوات سريعة

### 1. رفع الكود إلى GitHub
```bash
git init
git add .
git commit -m "إعداد النشر على Netlify"
git remote add origin https://github.com/djharga/shifa-care-ai-insights-82-main.git
git branch -M main
git push -u origin main
```

### 2. النشر على Netlify
1. اذهب إلى [Netlify](https://app.netlify.com)
2. اضغط "New site from Git"
3. اختر GitHub
4. اختر المستودع: `djharga/shifa-care-ai-insights-82-main`
5. إعدادات البناء:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. اضغط "Deploy site"

### 3. إعداد متغيرات البيئة
في Netlify Dashboard > Site settings > Environment variables:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_APP_ENV=production
```

## 🔗 روابط مهمة

- **GitHub:** https://github.com/djharga/shifa-care-ai-insights-82-main.git
- **Netlify:** https://app.netlify.com
- **Supabase:** https://supabase.com

## 👤 بيانات المدير الرئيسي
- **الإيميل:** djharga@gmail.com
- **كلمة المرور:** [مخفي لأسباب أمنية]

## ✅ اختبار سريع
1. تحقق من تحميل الصفحة الرئيسية
2. اختبر تسجيل دخول المدير
3. تحقق من الترجمة
4. اختبر المساعد الذكي

---
**شفا كير** - رعاية نفسية ذكية ومتطورة 