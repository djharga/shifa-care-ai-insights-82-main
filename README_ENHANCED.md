# 🏥 شفاء كير - نظام إدارة مراكز علاج الإدمان المتقدم

## 🌟 الميزات الجديدة المضافة

### 🤖 الذكاء الاصطناعي المتقدم
- **خطط علاجية ذكية**: إنشاء خطط علاجية مخصصة باستخدام GPT-3.5
- **تقييم مخاطر الانتكاس**: تحليل ذكي لعوامل الخطر واحتمالية الانتكاس
- **تقارير ذكية**: إنشاء تقارير شاملة ومفصلة تلقائياً
- **توصيات علاجية**: اقتراحات ذكية بناءً على حالة المريض

### 🔔 نظام الإشعارات الذكي
- **إشعارات فورية**: تنبيهات فورية للأحداث المهمة
- **إشعارات مجدولة**: تذكيرات مبرمجة للجلسات والمتابعات
- **أولويات متعددة**: تصنيف الإشعارات حسب الأهمية
- **إشعارات Push**: دعم الإشعارات على المتصفح

### 📱 تطبيق ويب متقدم (PWA)
- **عمل بدون إنترنت**: إمكانية العمل بدون اتصال بالإنترنت
- **تثبيت على الهاتف**: إمكانية تثبيت التطبيق كتطبيق محلي
- **أيقونات مخصصة**: تصميم أيقونات احترافية
- **تجربة مستخدم محسنة**: واجهة مستخدم سلسة وسريعة

### ⚡ تحسينات الأداء
- **تحميل سريع**: تحسين سرعة التحميل والاستجابة
- **ذاكرة تخزين مؤقت**: تخزين البيانات للوصول السريع
- **تحميل تدريجي**: تحميل المكونات حسب الحاجة
- **تحسين الصور**: ضغط وتحسين الصور تلقائياً

### 🗄️ قاعدة بيانات محسنة
- **جداول جديدة**: جداول لخطط العلاج والإشعارات والتقارير
- **فهارس محسنة**: تحسين سرعة الاستعلامات
- **أمان محسن**: سياسات أمان متقدمة
- **نسخ احتياطية**: نظام نسخ احتياطية تلقائي

## 🚀 كيفية التشغيل

### المتطلبات
- Node.js 18+ 
- npm أو yarn
- حساب Supabase
- مفتاح OpenAI API

### التثبيت
```bash
# استنساخ المشروع
git clone https://github.com/djharga/shifa-care-ai-insights-82-main.git
cd shifa-care-ai-insights-82-main

# تثبيت التبعيات
npm install

# إعداد المتغيرات البيئية
cp env.example .env.local
# تعديل .env.local بإعداداتك

# تشغيل التطبيق
npm run dev
```

### إعداد قاعدة البيانات
```bash
# تشغيل migrations
npx supabase db push

# أو تشغيل الملفات يدوياً
psql -h your-supabase-host -U postgres -d postgres -f supabase/migrations/20250703040324-advanced-features.sql
```

## 📊 الميزات المتقدمة

### 1. الذكاء الاصطناعي
```typescript
// إنشاء خطة علاجية
const plan = await aiService.generateTreatmentPlan(patientData);

// تقييم مخاطر الانتكاس
const risk = await aiService.assessRelapseRisk(patientId);

// إنشاء تقرير ذكي
const report = await aiService.generateSmartReport(patientId, 'progress');
```

### 2. نظام الإشعارات
```typescript
// إرسال إشعار
await notificationService.sendNotification({
  user_id: userId,
  type: 'session_reminder',
  title: 'تذكير بجلسة علاج',
  message: 'لديك جلسة غداً',
  priority: 'medium'
});

// جدولة إشعار
await notificationService.scheduleNotification(notification, scheduledDate);
```

### 3. PWA Features
```javascript
// تسجيل Service Worker
navigator.serviceWorker.register('/sw.js');

// طلب إذن الإشعارات
Notification.requestPermission();
```

## 🎯 الصفحات الجديدة

### `/advanced-ai` - الذكاء الاصطناعي المتقدم
- إنشاء خطط علاجية ذكية
- تقييم مخاطر الانتكاس
- إنشاء تقارير ذكية
- تحليلات متقدمة

### الميزات في الصفحات الموجودة
- **مركز الإشعارات**: في جميع الصفحات
- **تحسينات UI/UX**: تصميم محسن ومتجاوب
- **أداء محسن**: تحميل أسرع واستجابة أفضل

## 🔧 الإعدادات المتقدمة

### Vercel Deployment
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Service Worker
```javascript
// Cache strategies
caches.match(event.request)
  .then(response => response || fetch(event.request))
```

### Push Notifications
```javascript
// Request permission
Notification.requestPermission();

// Show notification
new Notification('شفاء كير', {
  body: 'إشعار جديد',
  icon: '/icon-192.png'
});
```

## 📈 التحسينات المستقبلية

### المرحلة الأولى (مكتملة) ✅
- [x] نظام الذكاء الاصطناعي الأساسي
- [x] نظام الإشعارات
- [x] PWA features
- [x] تحسينات الأداء

### المرحلة الثانية (قادمة) 🚧
- [ ] تحليلات متقدمة مع الرسوم البيانية
- [ ] نظام المتابعة التلقائية
- [ ] تطبيق موبايل React Native
- [ ] تكامل مع أنظمة خارجية

### المرحلة الثالثة (مخططة) 📋
- [ ] الذكاء الاصطناعي المتقدم (GPT-4)
- [ ] تحليل الصور والوثائق
- [ ] نظام التنبؤات المتقدم
- [ ] تكامل مع الأجهزة الطبية

## 🛠️ التقنيات المستخدمة

### Frontend
- **React 18** - مكتبة واجهة المستخدم
- **TypeScript** - لغة البرمجة
- **Vite** - أداة البناء
- **Tailwind CSS** - إطار العمل للتصميم
- **Radix UI** - مكونات واجهة المستخدم

### Backend
- **Supabase** - قاعدة البيانات والخدمات
- **PostgreSQL** - قاعدة البيانات
- **OpenAI API** - الذكاء الاصطناعي

### DevOps
- **Vercel** - الاستضافة والنشر
- **GitHub** - إدارة الكود
- **Service Workers** - PWA features

## 📞 الدعم والمساعدة

### المشاكل الشائعة
1. **خطأ في OpenAI API**: تأكد من صحة المفتاح
2. **مشاكل في Supabase**: تحقق من إعدادات الاتصال
3. **مشاكل في البناء**: تأكد من إصدار Node.js

### الاتصال
- **GitHub Issues**: للإبلاغ عن المشاكل
- **Email**: للدعم المباشر
- **Documentation**: للدليل الكامل

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT. راجع ملف `LICENSE` للتفاصيل.

## 🤝 المساهمة

نرحب بالمساهمات! يرجى قراءة `CONTRIBUTING.md` قبل البدء.

---

**شفاء كير** - نظام متكامل لإدارة مراكز علاج الإدمان مع الذكاء الاصطناعي 🏥✨ 