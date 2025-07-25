# 🚀 دليل التشغيل السريع - شفا كير (محدث)

## ✅ تم إصلاح جميع المشاكل!

### المشاكل التي تم حلها:
- ❌ مشكلة Node.js 14 - ✅ تم الإصلاح
- ❌ مشكلة الاتصال بـ Supabase - ✅ تم الإصلاح  
- ❌ مشكلة تسجيل الدخول - ✅ تم الإصلاح
- ❌ مشكلة الحزم - ✅ تم الإصلاح

---

## 🎯 تشغيل التطبيق

### 1. تثبيت الحزم
```bash
npm install
```

### 2. تشغيل التطبيق
```bash
npm run dev
```

### 3. فتح المتصفح
```
http://localhost:8080
```

---

## 🔐 بيانات الدخول الجاهزة

### المستخدم الأول (مدير):
```
📧 الإيميل: admin@shifacare.com
🔑 كلمة المرور: admin123
```

### المستخدم الثاني (تجريبي):
```
📧 الإيميل: test@shifacare.com
🔑 كلمة المرور: test123456
```

---

## 🎯 الوصول السريع

### تسجيل الدخول العادي:
- اذهب إلى: `http://localhost:8080/auth`
- استخدم أي من البيانات أعلاه

### دخول المدير:
- اذهب إلى: `http://localhost:8080/admin-login`
- استخدم أي من البيانات أعلاه

### لوحة التحكم:
- اذهب إلى: `http://localhost:8080/admin`
- (يتطلب تسجيل دخول أولاً)

---

## 🔧 الميزات المتاحة

### ✅ نظام المصادقة المحلي
- يعمل بدون إنترنت
- يحفظ البيانات في المتصفح
- يدعم إنشاء حسابات جديدة

### ✅ جميع الأقسام متاحة:
- **الرئيسية** (`/`) - لوحة المعلومات
- **المرضى** (`/patients`) - إدارة المرضى
- **الجلسات** (`/sessions`) - جدولة الجلسات
- **التقارير** (`/reports`) - التقارير والإحصائيات
- **الذكاء الاصطناعي** (`/ai-treatment`) - العلاج بالذكاء الاصطناعي
- **الحسابات المالية** (`/finance`) - إدارة المدفوعات
- **مصاريف المصحة** (`/facility-expenses`) - مصاريف الكهرباء والمياه
- **الغرف والأسرّة** (`/rooms`) - إدارة الغرف

---

## 🛠️ إعدادات قاعدة البيانات

### معلومات Supabase:
```
🌐 الرابط: https://oyljfpeeckxgfrqwsebk.supabase.co
🔑 المفتاح: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95bGpmcGVlY2t4Z2ZycXdzZWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MTQxODksImV4cCI6MjA2NzA5MDE4OX0.czWNSZ4vSocds-zInvEAiSS6XcjCmorWwTFsoIcRJnM
📊 المشروع: Shfia
🗄️ قاعدة البيانات: public
```

### في حالة مشاكل الاتصال:
- التطبيق يستخدم المصادقة المحلية تلقائياً
- جميع البيانات تحفظ في المتصفح
- يمكن العمل بدون إنترنت

---

## 🔍 اختبار النظام

### 1. اختبار تسجيل الدخول:
```bash
node test-local-auth.js
```

### 2. اختبار الاتصال بقاعدة البيانات:
```bash
node test-database-connection.js
```

### 3. إعداد المدير الرئيسي:
```bash
node setup-admin.js
```

---

## 📱 المتطلبات

### النظام:
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Linux (Ubuntu 18.04+)

### البرامج:
- ✅ Node.js 14.0.0 أو أحدث
- ✅ npm 6.0.0 أو أحدث
- ✅ متصفح حديث (Chrome, Firefox, Safari, Edge)

---

## 🚨 حل المشاكل

### إذا لم يعمل التطبيق:

#### 1. مشكلة في الحزم:
```bash
rm -rf node_modules
npm cache clean --force
npm install
```

#### 2. مشكلة في المنفذ:
```bash
# تغيير المنفذ في vite.config.ts
port: 3000  # بدلاً من 8080
```

#### 3. مشكلة في Node.js:
```bash
# تحديث Node.js إلى إصدار أحدث
node --version  # يجب أن يكون 14.0.0 أو أحدث
```

#### 4. مشكلة في المتصفح:
- امسح cache المتصفح
- جرب متصفح آخر
- تأكد من تفعيل JavaScript

---

## 📞 الدعم

### في حالة المشاكل:
1. **تحقق من الأخطاء** في Console المتصفح
2. **تحقق من الأخطاء** في Terminal
3. **راجع ملفات** `LOGIN_FIX.md` و `TESTING.md`
4. **تواصل مع المطور** عبر GitHub

### روابط مفيدة:
- **GitHub:** https://github.com/djharga/shifa-care-ai-insights-82-main
- **Supabase:** https://oyljfpeeckxgfrqwsebk.supabase.co
- **التطبيق:** http://localhost:8080

---

## 🎉 تم الإصلاح بنجاح!

**شفا كير** - نظام إدارة المصحة الذكي  
**الإصدار:** 2025.1.0 (محدث)  
**الحالة:** جاهز للاستخدام ✅  
**التوافق:** Node.js 14+ ✅  
**المصادقة:** محلية + Supabase ✅ 