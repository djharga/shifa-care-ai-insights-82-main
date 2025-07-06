# 🚀 رفع سريع على GitHub

## ⚡ الطرق السريعة

### 1. PowerShell (Windows)
```powershell
.\auto-deploy.ps1
```

### 2. Batch File (Windows)
```cmd
auto-deploy.bat
```

### 3. Bash (Linux/macOS)
```bash
./auto-deploy.sh
```

### 4. npm Script
```bash
npm run deploy
```

## 📋 خطوات سريعة

1. **أضف الملفات:**
   ```bash
   git add .
   ```

2. **أنشئ commit:**
   ```bash
   git commit -m "تحديث جديد"
   ```

3. **ارفع على GitHub:**
   ```bash
   git push origin main
   ```

## 🔗 رابط المستودع
https://github.com/djharga/shifa-care-ai-insights-82-main

## 📞 للمساعدة
راجع ملف `AUTO_DEPLOY_README.md` للحصول على دليل مفصل. 

# ⚡ نشر سريع - شفاء كير

## 🎯 النشر في 5 دقائق

### 1️⃣ إنشاء Supabase (دقيقة واحدة)
1. ادخل [Supabase](https://supabase.com/)
2. اضغط "Start your project"
3. اختر اسم: `shifa-care-ai`
4. انسخ **Project URL** و **anon key**

### 2️⃣ إنشاء قاعدة البيانات (دقيقة واحدة)
1. في Supabase، اذهب إلى SQL Editor
2. انسخ محتوى `supabase-setup.sql`
3. اضغط "Run"

### 3️⃣ الحصول على OpenAI (دقيقة واحدة)
1. ادخل [OpenAI Platform](https://platform.openai.com/)
2. اذهب إلى API Keys
3. اضغط "Create new secret key"
4. انسخ المفتاح

### 4️⃣ رفع الكود (دقيقة واحدة)
```bash
git clone https://github.com/your-username/shifa-care-ai-insights.git
cd shifa-care-ai-insights
git remote set-url origin https://github.com/YOUR_USERNAME/shifa-care-ai-insights.git
git push -u origin main
```

### 5️⃣ نشر على Vercel (دقيقة واحدة)
1. ادخل [Vercel](https://vercel.com/)
2. اضغط "New Project"
3. اختر المستودع
4. أضف متغيرات البيئة:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_OPENAI_API_KEY=sk-...
VITE_OPENAI_MODEL=gpt-4o-mini
VITE_APP_NAME=شفاء كير
VITE_AI_RESPONSE_LANGUAGE=egyptian_arabic
```

5. اضغط "Deploy"

## ✅ تم! موقعك جاهز

**الرابط:** `https://your-project.vercel.app`

---

## 🔧 إعدادات إضافية

### ربط نطاق مخصص
1. في Vercel → Settings → Domains
2. أضف نطاقك
3. اتبع تعليمات DNS

### إعداد البريد الإلكتروني
1. في Supabase → Authentication → Settings
2. أضف SMTP settings
3. اختبر إرسال البريد

---

## 🆘 استكشاف الأخطاء

### خطأ في الاتصال
```bash
# تأكد من صحة البيانات
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### خطأ في AI
```bash
# تأكد من صحة مفتاح OpenAI
VITE_OPENAI_API_KEY=sk-...
```

### خطأ في البناء
```bash
# تأكد من Node.js 22+
node --version
# يجب أن يظهر: v22.x.x
```

---

## 📞 دعم سريع

- 📧 البريد: support@shifa-care.com
- 💬 Discord: [رابط السيرفر]
- 📱 WhatsApp: [رقم الدعم]

---

## 🎉 مبروك!

موقع شفاء كير يعمل الآن أونلاين مع:
- ✅ قاعدة بيانات PostgreSQL
- ✅ AI باللغة المصرية
- ✅ إدارة كاملة للمرضى
- ✅ نظام مالي متكامل
- ✅ واجهة عربية جميلة

**استمتع باستخدام النظام! 🚀** 