# دليل إعداد قاعدة البيانات Supabase

## الخطوات السريعة لإعداد قاعدة البيانات

### 1. إنشاء مشروع Supabase
1. اذهب إلى [supabase.com](https://supabase.com)
2. أنشئ حساب جديد أو سجل دخول
3. أنشئ مشروع جديد
4. احفظ معلومات الاتصال (URL و API Key)

### 2. إنشاء الجداول
قم بتشغيل الملفات التالية بالترتيب:

#### أ) إنشاء الجداول الأساسية:
```sql
-- انسخ محتوى الملف: supabase/migrations/create_tables_only.sql
-- والصقه في SQL Editor في Supabase
```

#### ب) إصلاح جدول profiles (إذا كان موجوداً):
```sql
-- انسخ محتوى الملف: supabase/migrations/fix_profiles_table.sql
-- والصقه في SQL Editor في Supabase
```

### 3. إعداد متغيرات البيئة
أنشئ ملف `.env` في مجلد المشروع:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. اختبار الاتصال
قم بتشغيل التطبيق وتأكد من أن الاتصال يعمل:

```bash
npm run dev
```

## الجداول المطلوبة

### الجداول الأساسية:
- `profiles` - ملفات المستخدمين
- `patients` - المرضى
- `sessions` - الجلسات
- `treatment_goals` - الأهداف العلاجية
- `relapse_indicators` - مؤشرات الانتكاس
- `emotion_analysis` - تحليل المشاعر

### جداول إدارة المرافق:
- `rooms` - الغرف
- `families` - العائلات
- `family_messages` - رسائل العائلات
- `family_visits` - زيارات العائلات
- `family_reports` - تقارير العائلات

### جداول النظام:
- `system_settings` - إعدادات النظام
- `reports` - التقارير
- `ratings` - التقييمات
- `ai_settings` - إعدادات الذكاء الاصطناعي
- `financial_data` - البيانات المالية

## استكشاف الأخطاء

### خطأ: "column status does not exist"
إذا واجهت هذا الخطأ:
1. شغل ملف `fix_profiles_table.sql` أولاً
2. ثم شغل باقي الملفات

### خطأ: "relation does not exist"
إذا واجهت هذا الخطأ:
1. تأكد من أنك في المشروع الصحيح في Supabase
2. شغل ملف `create_tables_only.sql` أولاً

### خطأ: "permission denied"
إذا واجهت هذا الخطأ:
1. تأكد من أن RLS (Row Level Security) مفعل
2. أضف السياسات المناسبة أو عطل RLS مؤقتاً للاختبار

## إضافة بيانات تجريبية (اختياري)

بعد إنشاء الجداول، يمكنك إضافة بيانات تجريبية:

```sql
-- إضافة مستخدمين تجريبيين
INSERT INTO profiles (id, full_name, email, role, status) VALUES 
  (gen_random_uuid(), 'مدير النظام', 'admin@shifacare.com', 'admin', 'active'),
  (gen_random_uuid(), 'د. سارة أحمد', 'sara@shifacare.com', 'therapist', 'active');

-- إضافة مرضى تجريبيين
INSERT INTO patients (name, date_of_birth, gender, phone, addiction_type) VALUES 
  ('أحمد محمد علي', '1990-05-15', 'male', '0123456789', 'المخدرات'),
  ('فاطمة أحمد حسن', '1985-08-22', 'female', '0123456790', 'الكحول');

-- إضافة غرف تجريبية
INSERT INTO rooms (number, type, status, beds, price, floor) VALUES 
  ('101', 'عادي', 'متاحة', 2, 500.00, 'الأول'),
  ('201', 'VIP', 'متاحة', 1, 1000.00, 'الثاني');
```

## ملاحظات مهمة

1. **النسخ الاحتياطي**: احتفظ بنسخة من ملفات SQL
2. **الاختبار**: اختبر كل وظيفة بعد الإعداد
3. **الأمان**: لا تشارك مفاتيح API علناً
4. **التحديثات**: احتفظ بسجل للتغييرات في قاعدة البيانات

## الدعم

إذا واجهت أي مشاكل:
1. تحقق من سجلات الأخطاء في Supabase
2. تأكد من صحة متغيرات البيئة
3. اختبر الاتصال باستخدام Supabase Client 