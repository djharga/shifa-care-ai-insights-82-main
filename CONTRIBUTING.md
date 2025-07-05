# 🤝 المساهمة في شفا كير

## 📋 كيفية المساهمة

### 1. استنساخ المشروع
```bash
git clone https://github.com/djharga/shifa-care-ai-insights-82-main.git
cd shifa-care-ai-insights-82-main
npm install
```

### 2. إنشاء فرع جديد
```bash
git checkout -b feature/your-feature-name
# أو
git checkout -b fix/your-fix-name
```

### 3. إجراء التغييرات
- اكتب الكود
- أضف الاختبارات إذا لزم الأمر
- حدث التوثيق

### 4. اختبار التغييرات
```bash
npm run dev
npm run build
npm run lint
```

### 5. رفع التغييرات
```bash
git add .
git commit -m "feat: إضافة ميزة جديدة"
git push origin feature/your-feature-name
```

### 6. إنشاء Pull Request
- اذهب إلى GitHub
- اضغط "New Pull Request"
- اختر الفرع المصدر والهدف
- اكتب وصف للتغييرات

## 📝 معايير الكود

### تسمية المتغيرات
```typescript
// ✅ صحيح
const userName = 'أحمد';
const isActive = true;
const userList = [];

// ❌ خطأ
const user_name = 'أحمد';
const is_active = true;
const user_list = [];
```

### تسمية الدوال
```typescript
// ✅ صحيح
const getUserData = () => {};
const handleSubmit = () => {};
const validateEmail = () => {};

// ❌ خطأ
const get_user_data = () => {};
const handle_submit = () => {};
const validate_email = () => {};
```

### التعليقات
```typescript
// تعليق باللغة العربية
const calculateTotal = (items: Item[]) => {
  // حساب المجموع الكلي للمنتجات
  return items.reduce((sum, item) => sum + item.price, 0);
};
```

## 🌐 الترجمة

### إضافة ترجمة جديدة
1. أضف النص في `src/locales/ar.json` (الفصحى)
2. أضف الترجمة في `src/locales/ar-EG.json` (المصرية)
3. استخدم `t('key')` في الكود

```json
// ar.json
{
  "new_feature": "ميزة جديدة"
}

// ar-EG.json
{
  "new_feature": "ميزة جديدة"
}
```

## 🧪 الاختبارات

### تشغيل الاختبارات
```bash
npm run test
npm run test:watch
npm run test:coverage
```

### كتابة اختبارات جديدة
```typescript
import { render, screen } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('نص')).toBeInTheDocument();
  });
});
```

## 📦 إدارة الحزم

### إضافة حزمة جديدة
```bash
npm install package-name
npm install --save-dev package-name
```

### تحديث الحزم
```bash
npm update
npm audit fix
```

## 🚀 النشر

### إعداد النشر
1. تأكد من أن جميع الاختبارات تمر
2. حدث الإصدار في `package.json`
3. اكتب ملاحظات الإصدار

### إصدار جديد
```bash
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

## 📞 التواصل

### قنوات التواصل
- **GitHub Issues:** للإبلاغ عن الأخطاء
- **GitHub Discussions:** للمناقشات العامة
- **Email:** support@shifacare.com

### تقرير الأخطاء
عند الإبلاغ عن خطأ، يرجى تضمين:
- وصف الخطأ
- خطوات إعادة الإنتاج
- معلومات النظام
- لقطة شاشة (إذا لزم الأمر)

## 🎯 أنواع المساهمات

### الميزات الجديدة
- إضافة وظائف جديدة
- تحسين واجهة المستخدم
- إضافة دعم للغات جديدة

### إصلاح الأخطاء
- إصلاح الأخطاء البرمجية
- تحسين الأداء
- إصلاح مشاكل التوافق

### التوثيق
- تحديث README
- إضافة تعليقات للكود
- كتابة أدلة الاستخدام

### الترجمة
- إضافة ترجمات جديدة
- تحسين الترجمات الموجودة
- إضافة دعم للهجات جديدة

## 📋 قائمة التحقق

قبل إرسال Pull Request، تأكد من:

- [ ] الكود يتبع معايير المشروع
- [ ] جميع الاختبارات تمر
- [ ] الترجمة محدثة
- [ ] التوثيق محدث
- [ ] لا توجد أخطاء في البناء
- [ ] الكود يعمل على المتصفحات المختلفة

## 🏆 الاعتراف

سيتم ذكر جميع المساهمين في:
- ملف `CONTRIBUTORS.md`
- صفحة GitHub
- التوثيق

---

**شكراً لك على مساهمتك في شفا كير!** 🎉

**GitHub:** https://github.com/djharga/shifa-care-ai-insights-82-main.git 