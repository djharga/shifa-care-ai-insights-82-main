# 🚀 دليل نشر شفاء كير على Vercel

## 📋 المتطلبات الأساسية

### 1. حساب Vercel
- اذهب إلى [vercel.com](https://vercel.com)
- سجل حساب جديد أو سجل دخول بحساب GitHub

### 2. حساب Supabase
- اذهب إلى [supabase.com](https://supabase.com)
- أنشئ مشروع جديد
- احصل على URL و API Key

### 3. مفتاح OpenAI API
- اذهب إلى [platform.openai.com](https://platform.openai.com)
- أنشئ حساب جديد
- احصل على API Key

## 🔧 خطوات النشر

### الخطوة 1: ربط المشروع بـ Vercel

1. **اذهب إلى Vercel Dashboard**
   ```
   https://vercel.com/dashboard
   ```

2. **اضغط على "New Project"**

3. **اختر GitHub كمنصة**
   - اضغط على "Import Git Repository"
   - اختر `shifa-care-ai-insights-82-main`

4. **إعدادات المشروع**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (افتراضي)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### الخطوة 2: إضافة المتغيرات البيئية

#### في صفحة إعدادات المشروع:

1. **اذهب إلى Settings > Environment Variables**

2. **أضف المتغيرات التالية:**

   ```
   VITE_SUPABASE_URL
   ```
   - **Value**: `https://your-project-id.supabase.co`
   - **Environment**: Production, Preview, Development
   - **Example**: `https://abcdefghijklmnop.supabase.co`

   ```
   VITE_SUPABASE_ANON_KEY
   ```
   - **Value**: `your-anon-key-here`
   - **Environment**: Production, Preview, Development
   - **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

   ```
   VITE_OPENAI_API_KEY
   ```
   - **Value**: `sk-proj-your-openai-key-here`
   - **Environment**: Production, Preview, Development
   - **Example**: `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`

### الخطوة 3: الحصول على قيم المتغيرات

#### من Supabase:
1. اذهب إلى مشروعك في Supabase
2. اضغط على "Settings" في القائمة الجانبية
3. اختر "API"
4. انسخ:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`

#### من OpenAI:
1. اذهب إلى [platform.openai.com](https://platform.openai.com)
2. اضغط على "API Keys"
3. اضغط "Create new secret key"
4. انسخ المفتاح → `VITE_OPENAI_API_KEY`

### الخطوة 4: تشغيل قاعدة البيانات

#### في Supabase:
1. اذهب إلى "SQL Editor"
2. انسخ محتوى الملف:
   ```
   supabase/migrations/20250703040324-advanced-features.sql
   ```
3. اضغط "Run" لإنشاء الجداول الجديدة

### الخطوة 5: النشر

1. **اضغط "Deploy"**
2. **انتظر حتى يكتمل البناء**
3. **احصل على رابط التطبيق**

## 🔍 التحقق من النشر

### 1. اختبار التطبيق
- اذهب إلى الرابط المقدم من Vercel
- تأكد من عمل جميع الصفحات
- اختبر الذكاء الاصطناعي

### 2. اختبار قاعدة البيانات
- تأكد من عمل تسجيل الدخول
- اختبر إضافة مرضى وجلسات
- تأكد من عمل التقارير

### 3. اختبار الإشعارات
- تأكد من طلب إذن الإشعارات
- اختبر إرسال إشعارات تجريبية

## 🛠️ إعدادات إضافية

### Custom Domain (اختياري)
1. اذهب إلى "Settings > Domains"
2. أضف نطاقك المخصص
3. اتبع التعليمات لإعداد DNS

### Environment Variables في Development
```bash
# في ملف .env.local
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_OPENAI_API_KEY=sk-proj-your-openai-key-here
```

### Troubleshooting

#### مشاكل شائعة:
1. **خطأ في البناء**: تأكد من إصدار Node.js 18+
2. **خطأ في Supabase**: تحقق من صحة URL و API Key
3. **خطأ في OpenAI**: تحقق من صحة API Key
4. **خطأ في CORS**: تأكد من إعدادات Supabase

#### حل المشاكل:
```bash
# في Vercel Dashboard > Functions
# تحقق من Logs للعثور على الأخطاء
```

## 📱 PWA Setup

### بعد النشر:
1. افتح التطبيق على الهاتف
2. ستظهر رسالة "Add to Home Screen"
3. اضغط "Add" لتثبيت التطبيق

### اختبار PWA:
- تأكد من عمل التطبيق بدون إنترنت
- اختبر الإشعارات
- تأكد من الأيقونات

## 🔒 الأمان

### نصائح مهمة:
1. **لا تشارك API Keys** في الكود العام
2. **استخدم Environment Variables** دائماً
3. **راقب استخدام OpenAI API** لتجنب التكاليف العالية
4. **أضف Rate Limiting** إذا لزم الأمر

## 📊 Monitoring

### في Vercel Dashboard:
- **Analytics**: مراقبة الأداء
- **Functions**: مراقبة Serverless Functions
- **Logs**: مراقبة الأخطاء

### في Supabase:
- **Database**: مراقبة الاستعلامات
- **Auth**: مراقبة تسجيلات الدخول
- **Storage**: مراقبة الملفات

## 🎯 النتيجة النهائية

بعد اتباع هذه الخطوات، ستحصل على:
- ✅ تطبيق يعمل أونلاين
- ✅ قاعدة بيانات متصلة
- ✅ ذكاء اصطناعي يعمل
- ✅ إشعارات تعمل
- ✅ PWA قابل للتثبيت

---

**🎉 تهانينا! تطبيق شفاء كير جاهز للاستخدام أونلاين!** 