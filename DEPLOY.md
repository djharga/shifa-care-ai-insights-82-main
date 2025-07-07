# دليل النشر على Vercel

## 📋 المتطلبات المسبقة

1. **حساب GitHub** - لرفع الكود
2. **حساب Vercel** - للنشر
3. **حساب Supabase** - لقاعدة البيانات
4. **مفتاح OpenAI API** - للذكاء الاصطناعي

## 🚀 خطوات النشر

### 1. إعداد Supabase

1. اذهب إلى [supabase.com](https://supabase.com)
2. أنشئ مشروع جديد
3. احصل على:
   - Project URL
   - Anon Public Key

### 2. إعداد OpenAI

1. اذهب إلى [platform.openai.com](https://platform.openai.com)
2. أنشئ مفتاح API جديد
3. احفظ المفتاح

### 3. رفع الكود إلى GitHub

```bash
# تهيئة Git
git init
git add .
git commit -m "Initial commit"

# رفع إلى GitHub
git remote add origin https://github.com/username/repo-name.git
git push -u origin main
```

### 4. النشر على Vercel

1. **إنشاء مشروع جديد**
   - اذهب إلى [vercel.com](https://vercel.com)
   - اضغط "New Project"
   - اختر المستودع من GitHub

2. **إعداد المشروع**
   - Framework Preset: Vite
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **إضافة المتغيرات البيئية**
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_OPENAI_API_KEY=your-openai-api-key
   ```

4. **النشر**
   - اضغط "Deploy"
   - انتظر حتى يكتمل النشر
   - احصل على رابط التطبيق

## 🔧 إعداد قاعدة البيانات

بعد النشر، قم بتشغيل ملفات الهجرة في Supabase:

1. اذهب إلى SQL Editor في Supabase
2. انسخ محتوى `supabase/migrations/20250703040323-complete-system.sql`
3. نفذ الكود

## 🌐 الوصول للتطبيق

بعد النشر، ستحصل على:
- رابط الإنتاج: `https://your-project.vercel.app`
- رابط المعاينة: `https://your-project-git-main.vercel.app`

## 🔄 التحديثات التلقائية

Vercel سيقوم بنشر تحديثات تلقائية عند:
- رفع تغييرات إلى GitHub
- دفع إلى فرع `main`

## 📊 مراقبة الأداء

في لوحة تحكم Vercel يمكنك:
- مراقبة الأداء
- عرض الأخطاء
- إدارة النطاقات
- إعدادات SSL

## 🆘 استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ في البناء**
   - تحقق من المتغيرات البيئية
   - تأكد من صحة الكود

2. **خطأ في قاعدة البيانات**
   - تحقق من إعدادات Supabase
   - تأكد من تشغيل الهجرات

3. **خطأ في API**
   - تحقق من مفتاح OpenAI
   - تأكد من صحة URL

## 📞 الدعم

للمساعدة:
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI Documentation](https://platform.openai.com/docs) 