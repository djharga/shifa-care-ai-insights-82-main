# ⚡ دليل الإعداد السريع - شفاء كير

## 🎯 البيانات المقدمة

### Supabase Configuration ✅
- **URL**: `https://oyljfpeeckxgfrqwsebk.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95bGpmcGVlY2t4Z2ZycXdzZWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MTQxODksImV4cCI6MjA2NzA5MDE4OX0.czWNSZ4vSocds-zInvEAiSS6XcjCmorWwTFsoIcRJnM`

### OpenAI Configuration ✅
- **API Key**: `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`

## 🚀 خطوات الإعداد السريع

### 1. إنشاء ملف .env.local

أنشئ ملف `.env.local` في مجلد المشروع وأضف:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://oyljfpeeckxgfrqwsebk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95bGpmcGVlY2t4Z2ZycXdzZWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MTQxODksImV4cCI6MjA2NzA5MDE4OX0.czWNSZ4vSocds-zInvEAiSS6XcjCmorWwTFsoIcRJnM

# OpenAI Configuration ✅
VITE_OPENAI_API_KEY=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

# Application Configuration
VITE_APP_NAME=شفاء كير
VITE_APP_VERSION=2.0.0
VITE_APP_DESCRIPTION=نظام إدارة مراكز علاج الإدمان مع الذكاء الاصطناعي

# Development Configuration
NODE_ENV=development
VITE_DEV_MODE=true
```

### 2. إعداد قاعدة البيانات

1. **اذهب إلى Supabase SQL Editor:**
   ```
   https://oyljfpeeckxgfrqwsebk.supabase.co/project/default/sql
   ```

2. **انسخ محتوى الملف:**
   ```
   supabase/migrations/20250703040324-advanced-features.sql
   ```

3. **اضغط "Run" لإنشاء الجداول الجديدة**

### 3. تشغيل التطبيق

```bash
# تثبيت التبعيات
npm install

# تشغيل التطبيق
npm run dev
```

## 🌐 النشر على Vercel

### إضافة المتغيرات البيئية في Vercel:

1. اذهب إلى [vercel.com/dashboard](https://vercel.com/dashboard)
2. اختر مشروعك
3. اذهب إلى **Settings > Environment Variables**
4. أضف:

```
VITE_SUPABASE_URL
Value: https://oyljfpeeckxgfrqwsebk.supabase.co
Environment: Production, Preview, Development

VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95bGpmcGVlY2t4Z2ZycXdzZWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MTQxODksImV4cCI6MjA2NzA5MDE4OX0.czWNSZ4vSocds-zInvEAiSS6XcjCmorWwTFsoIcRJnM
Environment: Production, Preview, Development

VITE_OPENAI_API_KEY
Value: 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
Environment: Production, Preview, Development
```

## ✅ التحقق من الإعداد

### اختبار الاتصال بـ Supabase:
- افتح التطبيق على `http://localhost:3000`
- تأكد من عمل تسجيل الدخول
- اختبر إضافة مرضى وجلسات

### اختبار الذكاء الاصطناعي:
- اذهب إلى `/advanced-ai`
- اختبر إنشاء خطة علاجية
- اختبر تقييم مخاطر الانتكاس

### اختبار الإشعارات:
- تأكد من طلب إذن الإشعارات
- اختبر إرسال إشعارات تجريبية

## 🔗 روابط مفيدة

- **Supabase Dashboard**: https://oyljfpeeckxgfrqwsebk.supabase.co
- **Supabase SQL Editor**: https://oyljfpeeckxgfrqwsebk.supabase.co/project/default/sql
- **OpenAI Platform**: https://platform.openai.com
- **Vercel Dashboard**: https://vercel.com/dashboard

## 🆘 في حالة المشاكل

1. **تأكد من صحة API Keys**
2. **تحقق من إعدادات Supabase**
3. **راجع ملف `VERCEL_DEPLOYMENT_GUIDE.md`**
4. **تحقق من Logs في Vercel**

---

**🎉 تهانينا! شفاء كير جاهز للاستخدام!** 