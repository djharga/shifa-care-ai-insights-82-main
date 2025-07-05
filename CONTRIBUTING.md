# دليل المساهمة - شفاء كير

## 🤝 كيفية المساهمة

نرحب بمساهماتكم في تطوير نظام شفاء كير! إليكم دليل شامل للمساهمة.

## 📋 قبل البدء

### المتطلبات
- معرفة بـ React و TypeScript
- فهم أساسي للذكاء الاصطناعي
- معرفة بـ Supabase (اختياري)
- معرفة بـ Tailwind CSS

### إعداد البيئة
1. Fork المشروع
2. Clone الفرع المحلي
3. تثبيت التبعيات: `npm install`
4. إعداد المتغيرات البيئية
5. تشغيل المشروع: `npm run dev`

## 🎯 أنواع المساهمات

### 🐛 إصلاح الأخطاء
- تحديد الأخطاء في Issues
- إصلاح الأخطاء وإضافة اختبارات
- تحديث الوثائق إذا لزم الأمر

### ✨ إضافة ميزات جديدة
- مناقشة الميزة في Issues أولاً
- تطوير الميزة مع اختبارات
- تحديث الوثائق

### 📚 تحسين الوثائق
- تحسين README
- إضافة تعليقات للكود
- تحديث دليل المستخدم

### 🎨 تحسينات واجهة المستخدم
- تحسين التصميم
- إضافة مكونات جديدة
- تحسين تجربة المستخدم

## 📝 معايير الكود

### TypeScript
```typescript
// ✅ صحيح
interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = async (id: string): Promise<User> => {
  // implementation
};

// ❌ خطأ
const getUser = async (id) => {
  // implementation
};
```

### React Components
```typescript
// ✅ صحيح
interface Props {
  title: string;
  onSave: () => void;
}

export const MyComponent: React.FC<Props> = ({ title, onSave }) => {
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onSave}>حفظ</button>
    </div>
  );
};

// ❌ خطأ
export const MyComponent = (props) => {
  return <div>{props.title}</div>;
};
```

### التعليقات
```typescript
// ✅ صحيح - تعليقات باللغة العربية
/**
 * معالجة الجلسة بالذكاء الاصطناعي
 * @param sessionData بيانات الجلسة
 * @returns النتائج المعالجة
 */
const processSession = async (sessionData: Session) => {
  // implementation
};

// ❌ خطأ - بدون تعليقات
const processSession = async (sessionData) => {
  // implementation
};
```

## 🧪 الاختبارات

### إضافة اختبارات جديدة
```typescript
// tests/services/session-ai-service.test.ts
import { SessionAIService } from '@/services/session-ai-service';

describe('SessionAIService', () => {
  it('يجب أن يعالج الجلسة بشكل صحيح', async () => {
    const service = new SessionAIService();
    const result = await service.processSessionNotes('ملاحظات تجريبية');
    
    expect(result).toBeDefined();
    expect(result.processedNotes).toBeTruthy();
  });
});
```

### تشغيل الاختبارات
```bash
npm test
npm run test:watch
npm run test:coverage
```

## 📦 إدارة الحزم

### إضافة حزم جديدة
```bash
# إضافة dependency
npm install package-name

# إضافة dev dependency
npm install --save-dev package-name
```

### تحديث الحزم
```bash
npm update
npm audit fix
```

## 🌐 الترجمة

### إضافة ترجمات جديدة
```json
// src/locales/ar.json
{
  "new_feature": "ميزة جديدة",
  "description": "وصف الميزة"
}

// src/locales/en.json
{
  "new_feature": "New Feature",
  "description": "Feature description"
}
```

### استخدام الترجمة
```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return <h1>{t('new_feature')}</h1>;
};
```

## 🔄 عملية المساهمة

### 1. إنشاء Issue
- وصف المشكلة أو الميزة
- إضافة لقطات شاشة إذا لزم الأمر
- تحديد الأولوية

### 2. إنشاء Branch
```bash
git checkout -b feature/amazing-feature
git checkout -b fix/bug-fix
```

### 3. تطوير التغييرات
- اكتب الكود
- أضف اختبارات
- حدث الوثائق

### 4. Commit التغييرات
```bash
git add .
git commit -m "feat: إضافة ميزة جديدة"
git commit -m "fix: إصلاح خطأ في المعالجة"
```

### 5. Push و Pull Request
```bash
git push origin feature/amazing-feature
```

### 6. مراجعة الكود
- انتظر مراجعة الكود
- أضف التعديلات المطلوبة
- احصل على الموافقة

## 📋 معايير Commit Messages

### التنسيق
```
type(scope): description

[optional body]

[optional footer]
```

### الأنواع
- `feat`: ميزة جديدة
- `fix`: إصلاح خطأ
- `docs`: تحديث الوثائق
- `style`: تحسينات التنسيق
- `refactor`: إعادة هيكلة الكود
- `test`: إضافة أو تحديث الاختبارات
- `chore`: مهام الصيانة

### أمثلة
```bash
feat(sessions): إضافة معالجة الجلسات بالذكاء الاصطناعي
fix(auth): إصلاح مشكلة تسجيل الدخول
docs(readme): تحديث دليل التثبيت
style(ui): تحسين تصميم الأزرار
```

## 🎨 معايير التصميم

### الألوان
```css
/* الألوان الأساسية */
--primary: #3B82F6;    /* أزرق */
--secondary: #6B7280;  /* رمادي */
--success: #10B981;    /* أخضر */
--warning: #F59E0B;    /* برتقالي */
--error: #EF4444;      /* أحمر */
```

### التباعد
```css
/* نظام التباعد */
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-4: 1rem;     /* 16px */
--spacing-8: 2rem;     /* 32px */
```

### الخطوط
```css
/* الخطوط العربية */
font-family: 'Cairo', 'Segoe UI', sans-serif;
```

## 🔍 مراجعة الكود

### ما نبحث عنه
- ✅ الكود يتبع المعايير
- ✅ الاختبارات موجودة
- ✅ الوثائق محدثة
- ✅ لا توجد أخطاء TypeScript
- ✅ التصميم متسق
- ✅ الأداء جيد

### التعليقات
- كن محترماً ومشجعاً
- اشرح سبب التغييرات
- اقترح تحسينات
- اطرح أسئلة إذا لزم الأمر

## 🏆 الاعتراف

### المساهمون المميزون
- سيتم إضافة أسماء المساهمين النشطين إلى README
- شكر خاص للمساهمين الكبار
- شهادات مشاركة للمشاريع المهمة

### كيفية الحصول على الاعتراف
- مساهمات منتظمة
- جودة عالية في الكود
- مساعدة الآخرين
- تحسين الوثائق

## 📞 التواصل

### القنوات
- **GitHub Issues**: للمشاكل والاقتراحات
- **GitHub Discussions**: للمناقشات العامة
- **Email**: support@shifa-care.com

### الاجتماعات
- اجتماعات أسبوعية للمطورين
- اجتماعات شهرية للمراجعة
- ورش عمل للتعلم

## 📚 الموارد

### الوثائق
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)

### الأدوات
- [VS Code](https://code.visualstudio.com)
- [Prettier](https://prettier.io)
- [ESLint](https://eslint.org)
- [GitHub Desktop](https://desktop.github.com)

---

**شكراً لمساهمتكم في تطوير شفاء كير!** 🤝💙 