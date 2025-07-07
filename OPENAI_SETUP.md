# 🧠 إعداد OpenAI - شفا كير

## 📋 نظرة عامة

هذا الدليل يوضح كيفية إعداد وتفعيل خدمات الذكاء الاصطناعي OpenAI في منصة شفا كير لتحليل الجلسات العلاجية وتقديم رؤى ذكية.

## 🚀 الميزات المتاحة

### 1. تحليل الجلسات العلاجية
- معالجة الملاحظات الخام وتنظيمها
- تحليل المشاعر والعواطف
- استخراج الرؤى المهمة
- إنشاء ملخصات مفصلة

### 2. اقتراح خطط علاجية
- خطط مخصصة حسب حالة المريض
- أهداف علاجية محددة
- تدخلات مناسبة
- استراتيجيات تقليل المخاطر

### 3. تقييم مخاطر الانتكاس
- تحليل عوامل الخطر
- حساب احتمالية الانتكاس
- توصيات وقائية
- متابعة دورية

### 4. إنشاء تقارير ذكية
- تقارير شاملة ومفصلة
- تحليل التقدم
- توصيات علاجية
- مؤشرات النجاح

### 5. اقتراح أنشطة علاجية
- أنشطة فردية وجماعية
- أنشطة عائلية
- أنشطة ترفيهية وتعليمية
- أنشطة مخصصة لحالة المريض

## 🔧 خطوات الإعداد

### الخطوة 1: إنشاء حساب OpenAI

1. اذهب إلى [platform.openai.com](https://platform.openai.com)
2. انقر على "Sign up" لإنشاء حساب جديد
3. أكمل عملية التسجيل والتحقق من البريد الإلكتروني
4. سجل دخول إلى حسابك

### الخطوة 2: الحصول على مفتاح API

1. في لوحة التحكم، اذهب إلى "API Keys"
2. انقر على "Create new secret key"
3. أدخل اسم للمفتاح (مثال: "Shifa Care AI")
4. انقر على "Create secret key"
5. انسخ المفتاح فوراً (لن تتمكن من رؤيته مرة أخرى)

### الخطوة 3: إعداد متغيرات البيئة

1. انسخ ملف `env.example` إلى `.env.local`
2. أضف مفتاح API:

```bash
VITE_OPENAI_API_KEY=sk-your-openai-api-key
```

3. (اختياري) اضبط الإعدادات المتقدمة:

```bash
VITE_OPENAI_MODEL=gpt-3.5-turbo
VITE_OPENAI_MAX_TOKENS=1000
VITE_OPENAI_TEMPERATURE=0.7
VITE_OPENAI_TIMEOUT=30000
VITE_OPENAI_RETRIES=3
```

### الخطوة 4: اختبار الإعداد

1. شغل التطبيق: `npm run dev`
2. اذهب إلى صفحة إعدادات الذكاء الاصطناعي
3. انقر على "اختبار الاتصال"
4. تأكد من ظهور رسالة "اختبار ناجح"

## 📁 هيكل الملفات

```
src/
├── config/
│   └── openai-config.ts          # إعدادات OpenAI
├── services/
│   ├── openai-service.ts         # خدمة OpenAI الرئيسية
│   ├── ai-service.ts             # خدمة الذكاء الاصطناعي للعلاج
│   └── session-ai-service.ts     # خدمة تحليل الجلسات
├── hooks/
│   └── use-openai.ts             # Hook لاستخدام OpenAI
└── components/
    └── ai/
        ├── AIStatusIndicator.tsx  # مؤشر حالة AI
        └── AIConfigPanel.tsx      # لوحة الإعدادات
```

## 🔌 الاستخدام في الكود

### استخدام Hook

```typescript
import { useOpenAI } from '@/hooks/use-openai';

const MyComponent = () => {
  const { analyzeSession, isLoading, error } = useOpenAI({
    onSuccess: (response) => {
      console.log('تم التحليل بنجاح:', response.data);
    },
    onError: (error) => {
      console.error('خطأ في التحليل:', error);
    }
  });

  const handleAnalyze = async () => {
    const result = await analyzeSession('ملاحظات الجلسة هنا...');
    // معالجة النتيجة
  };

  return (
    <div>
      <button onClick={handleAnalyze} disabled={isLoading}>
        تحليل الجلسة
      </button>
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};
```

### استخدام الخدمة مباشرة

```typescript
import { openAIService } from '@/services/openai-service';

const analyzeSession = async (notes: string) => {
  const response = await openAIService.analyzeSession(notes);
  
  if (response.success) {
    console.log('النتيجة:', response.data);
    return response.data;
  } else {
    console.error('خطأ:', response.error);
    throw new Error(response.error);
  }
};
```

## ⚙️ الإعدادات المتقدمة

### نماذج الذكاء الاصطناعي

- **GPT-4**: أفضل جودة ولكن أغلى
- **GPT-3.5 Turbo**: جودة جيدة وسعر معقول (مُوصى به)
- **GPT-3.5 Turbo 16K**: نفس الجودة مع سياق أطول

### معاملات التحكم

- **Temperature**: درجة الإبداع (0-2)
  - 0: دقيق ومتسق
  - 1: متوازن
  - 2: مبدع ومتنوع

- **Max Tokens**: الحد الأقصى للرموز في الاستجابة
  - 100-500: إجابات قصيرة
  - 500-1000: إجابات متوسطة
  - 1000+: إجابات مفصلة

### إدارة الأخطاء

```typescript
// إعادة المحاولة التلقائية
const response = await openAIService.callOpenAI(messages, {
  retries: 3,
  timeout: 30000
});

// معالجة الأخطاء المحددة
if (response.error?.includes('rate limit')) {
  // معالجة تجاوز الحد
} else if (response.error?.includes('invalid key')) {
  // معالجة مفتاح غير صحيح
}
```

## 🔒 الأمان

### أفضل الممارسات

1. **لا تشارك مفتاح API** مع أي شخص
2. **استخدم مفتاح API مخصص** للمنصة فقط
3. **راقب استخدام API** لتجنب تجاوز الحدود
4. **احفظ المفتاح** في متغيرات البيئة فقط
5. **لا تضعه في الكود** أو في GitHub

### مراقبة الاستخدام

```typescript
// مراقبة استخدام الرموز
const response = await openAIService.callOpenAI(messages);
console.log('الرموز المستخدمة:', response.usage);

// تتبع التكلفة (تقريبي)
const costPer1kTokens = 0.002; // GPT-3.5 Turbo
const estimatedCost = (response.usage?.total_tokens || 0) * costPer1kTokens / 1000;
```

## 🚨 استكشاف الأخطاء

### مشاكل شائعة

#### 1. "OpenAI API key not configured"
**الحل**: تأكد من إضافة `VITE_OPENAI_API_KEY` في ملف `.env.local`

#### 2. "Invalid API key"
**الحل**: تحقق من صحة المفتاح في [platform.openai.com](https://platform.openai.com)

#### 3. "Rate limit exceeded"
**الحل**: انتظر قليلاً أو ترقى إلى خطة مدفوعة

#### 4. "Request timeout"
**الحل**: زد قيمة `VITE_OPENAI_TIMEOUT` أو تحقق من الاتصال بالإنترنت

### رسائل الخطأ

```typescript
// معالجة أخطاء محددة
try {
  const response = await openAIService.callOpenAI(messages);
} catch (error) {
  if (error.message.includes('401')) {
    console.error('مفتاح API غير صحيح');
  } else if (error.message.includes('429')) {
    console.error('تجاوزت الحد المسموح');
  } else if (error.message.includes('timeout')) {
    console.error('انتهت مهلة الاتصال');
  }
}
```

## 📊 مراقبة الأداء

### مؤشرات الأداء

- **وقت الاستجابة**: يجب أن يكون أقل من 10 ثوانٍ
- **معدل النجاح**: يجب أن يكون أعلى من 95%
- **استخدام الرموز**: راقب التكلفة الشهرية
- **جودة الاستجابات**: راقب رضا المستخدمين

### سجلات الأخطاء

```typescript
// تسجيل الأخطاء للتتبع
const logAIError = (error: any, context: string) => {
  console.error(`AI Error in ${context}:`, {
    error: error.message,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  });
};
```

## 🔄 التحديثات والصيانة

### تحديث المفتاح

1. اذهب إلى [platform.openai.com](https://platform.openai.com)
2. اذهب إلى API Keys
3. احذف المفتاح القديم
4. أنشئ مفتاح جديد
5. حدث `VITE_OPENAI_API_KEY` في `.env.local`

### مراقبة التحديثات

- راقب [OpenAI Blog](https://openai.com/blog) للتحديثات
- تحقق من [API Documentation](https://platform.openai.com/docs) للتغييرات
- اختبر التطبيق بعد أي تحديثات مهمة

## 📞 الدعم

### موارد مفيدة

- [OpenAI Documentation](https://platform.openai.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [OpenAI Community](https://community.openai.com)
- [OpenAI Status](https://status.openai.com)

### الحصول على المساعدة

1. تحقق من [استكشاف الأخطاء](#-استكشاف-الأخطاء)
2. راجع [OpenAI Documentation](https://platform.openai.com/docs)
3. اطرح سؤال في [OpenAI Community](https://community.openai.com)
4. تواصل مع فريق الدعم الفني

---

**ملاحظة**: تأكد من اتباع [شروط استخدام OpenAI](https://openai.com/policies/terms-of-use) و[سياسة الخصوصية](https://openai.com/policies/privacy-policy) عند استخدام خدماتهم. 