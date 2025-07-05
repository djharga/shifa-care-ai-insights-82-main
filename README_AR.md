# شفاء كير - نظام الذكاء الاصطناعي للعلاج النفسي

## 🎯 نظرة عامة

شفاء كير هو نظام متقدم للعلاج النفسي يستخدم الذكاء الاصطناعي لتحليل الجلسات العلاجية وتقديم رؤى وتوصيات للمعالجين. النظام مصمم خصيصاً للمراكز العلاجية في مصر ويستخدم اللهجة المصرية.

## ✨ المميزات الرئيسية

### 🤖 الذكاء الاصطناعي
- **تحليل الجلسات**: معالجة وتحليل الملاحظات الخام للجلسات
- **تحليل المشاعر**: تحديد المشاعر الأساسية والثانوية وشدة المشاعر
- **اقتراح الأهداف**: اقتراح أهداف علاجية مخصصة
- **تخطيط الأنشطة**: اقتراح أنشطة مناسبة للمركز العلاجي
- **خطط الجلسات**: اقتراح خطط للجلسات القادمة

### 📊 إدارة البيانات
- **قاعدة بيانات Supabase**: تخزين آمن وموثوق للبيانات
- **إحصائيات متقدمة**: تتبع التقدم والإنجازات
- **تقارير شاملة**: تقارير مفصلة عن الجلسات والمرضى

### 🎨 واجهة المستخدم
- **تصميم عصري**: واجهة جميلة وسهلة الاستخدام
- **دعم اللغة العربية**: واجهة كاملة باللغة العربية
- **تصميم متجاوب**: يعمل على جميع الأجهزة
- **نظام تبويب**: تنظيم المحتوى في تبويبات

## 🚀 التثبيت والتشغيل

### المتطلبات
- Node.js 14 أو أحدث
- npm أو yarn
- حساب Supabase
- مفتاح OpenAI API

### خطوات التثبيت

1. **استنساخ المشروع**
```bash
git clone https://github.com/your-username/shifa-care-ai-insights.git
cd shifa-care-ai-insights
```

2. **تثبيت التبعيات**
```bash
npm install
```

3. **إعداد المتغيرات البيئية**
```bash
cp .env.example .env
```

ثم قم بتعديل ملف `.env` وإضافة:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your-openai-api-key

# Application Configuration
VITE_APP_NAME=شفاء كير
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development
```

4. **تشغيل المشروع محلياً**
```bash
npm run dev
```

5. **فتح المتصفح**
```
http://localhost:3000
```

## 🗄️ إعداد قاعدة البيانات

### إنشاء مشروع Supabase

1. اذهب إلى [Supabase](https://supabase.com)
2. أنشئ مشروع جديد
3. انسخ URL و ANON KEY إلى ملف `.env`

### تشغيل الهجرات

```bash
# تشغيل الهجرات
npx supabase db push

# أو تشغيل الملفات يدوياً
psql -h your-host -U your-user -d your-database -f supabase/migrations/complete-system.sql
```

## 🌐 النشر على Vercel

### إعداد Vercel

1. **إنشاء حساب على Vercel**
   - اذهب إلى [Vercel](https://vercel.com)
   - سجل دخول باستخدام GitHub

2. **ربط المشروع**
   - ارفع المشروع إلى GitHub
   - في Vercel، اختر "Import Project"
   - اختر المستودع من GitHub

3. **إعداد المتغيرات البيئية**
   - في إعدادات المشروع على Vercel
   - أضف جميع المتغيرات من ملف `.env`

4. **النشر**
   - Vercel سينشر تلقائياً عند كل تحديث
   - أو اضغط "Deploy" للنشر اليدوي

## 📁 هيكل المشروع

```
shifa-care-ai-insights/
├── src/
│   ├── components/          # مكونات React
│   │   ├── ui/             # مكونات واجهة المستخدم
│   │   ├── dashboard/      # مكونات لوحة التحكم
│   │   └── layout/         # مكونات التخطيط
│   ├── pages/              # صفحات التطبيق
│   ├── services/           # خدمات الذكاء الاصطناعي وقاعدة البيانات
│   ├── types/              # تعريفات TypeScript
│   ├── hooks/              # React Hooks
│   ├── lib/                # مكتبات مساعدة
│   └── locales/            # ملفات الترجمة
├── supabase/               # ملفات Supabase
│   ├── migrations/         # هجرات قاعدة البيانات
│   └── config.toml         # إعدادات Supabase
├── public/                 # الملفات العامة
└── docs/                   # الوثائق
```

## 🔧 الملفات المهمة

### ملفات الإعداد
- `package.json` - تبعيات المشروع
- `vite.config.ts` - إعدادات Vite
- `tsconfig.json` - إعدادات TypeScript
- `tailwind.config.ts` - إعدادات Tailwind CSS

### ملفات قاعدة البيانات
- `supabase/migrations/complete-system.sql` - هجرات قاعدة البيانات
- `src/integrations/supabase/client.ts` - عميل Supabase

### ملفات الذكاء الاصطناعي
- `src/services/session-ai-service.ts` - خدمة الذكاء الاصطناعي
- `src/services/supabase-service.ts` - خدمة قاعدة البيانات

## 🎨 المكونات الرئيسية

### صفحات التطبيق
- **الصفحة الرئيسية** (`src/pages/Index.tsx`) - لوحة التحكم الرئيسية
- **الجلسات المتقدمة** (`src/pages/AdvancedSessions.tsx`) - نظام الجلسات مع الذكاء الاصطناعي
- **المرضى** (`src/pages/Patients.tsx`) - إدارة المرضى
- **التقارير** (`src/pages/Reports.tsx`) - التقارير والإحصائيات

### الخدمات
- **SessionAIService** - معالجة الجلسات بالذكاء الاصطناعي
- **SupabaseService** - عمليات قاعدة البيانات

## 🔐 الأمان

### المتغيرات البيئية
- جميع المفاتيح الحساسة محفوظة في متغيرات بيئية
- لا يتم رفع المفاتيح إلى Git
- استخدام ملف `.env.example` كقالب

### قاعدة البيانات
- استخدام Supabase مع RLS (Row Level Security)
- تشفير البيانات في الراحة
- نسخ احتياطية تلقائية

## 📊 الإحصائيات والتقارير

### إحصائيات الجلسات
- إجمالي الجلسات
- جلسات هذا الأسبوع/الشهر
- متوسط التقدم
- معدل النجاح

### إحصائيات الأهداف
- إجمالي الأهداف
- الأهداف المكتملة
- الأهداف المعلقة
- الأهداف عالية الأولوية

## 🤝 المساهمة

### كيفية المساهمة
1. Fork المشروع
2. أنشئ فرع جديد (`git checkout -b feature/amazing-feature`)
3. اكتب التغييرات (`git commit -m 'Add amazing feature'`)
4. ارفع الفرع (`git push origin feature/amazing-feature`)
5. أنشئ Pull Request

### معايير الكود
- استخدام TypeScript
- اتباع معايير ESLint
- كتابة تعليقات باللغة العربية
- اختبار الكود قبل الرفع

## 📝 الترخيص

هذا المشروع مرخص تحت رخصة MIT. راجع ملف `LICENSE` للتفاصيل.

## 📞 الدعم

### التواصل
- **البريد الإلكتروني**: support@shifa-care.com
- **GitHub Issues**: للإبلاغ عن الأخطاء والاقتراحات
- **التوثيق**: راجع ملفات README في كل مجلد

### المساعدة
- راجع ملف `CONTRIBUTING.md` لإرشادات المساهمة
- راجع ملف `DEPLOY_QUICK.md` لتعليمات النشر السريع
- راجع ملف `ADMIN_SETUP.md` لإعداد الإدارة

## 🎉 الشكر

شكراً لجميع المساهمين والمطورين الذين ساعدوا في تطوير هذا النظام.

---

**شفاء كير** - نحو علاج نفسي أفضل بالذكاء الاصطناعي 🤖💙 