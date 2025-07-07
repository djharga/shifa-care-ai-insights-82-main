# دليل بناء تطبيق الهاتف - شفاء كير

## الطريقة الأولى: باستخدام Android Studio

### المتطلبات:
1. **Java JDK** (الإصدار 11 أو أحدث)
2. **Android Studio** (الإصدار 4.2 أو أحدث)
3. **Android SDK**

### الخطوات:

#### 1. تثبيت Java JDK
```bash
# تحميل من Oracle أو OpenJDK
# https://adoptium.net/ (OpenJDK مجاني)
```

#### 2. تثبيت Android Studio
```bash
# تحميل من Google
# https://developer.android.com/studio
```

#### 3. إعداد متغيرات البيئة
```bash
# إضافة JAVA_HOME
JAVA_HOME=C:\Program Files\Java\jdk-11.0.x

# إضافة ANDROID_HOME
ANDROID_HOME=C:\Users\[USERNAME]\AppData\Local\Android\Sdk

# إضافة للـ PATH
%JAVA_HOME%\bin
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
```

#### 4. بناء APK
```bash
# تشغيل السكريبت
build-mobile-apk.bat

# أو يدوياً:
npm run build
npx cap copy android
npx cap sync android
npx cap open android
```

#### 5. في Android Studio:
1. انتظر حتى يفتح المشروع
2. اذهب لـ **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**
3. انتظر حتى ينتهي البناء
4. اذهب لـ **Build** > **Generate Signed Bundle / APK**
5. اختر **APK**
6. املأ البيانات:
   - **Key store path**: أنشئ keystore جديد
   - **Key alias**: اسم مفتاح
   - **Password**: كلمة مرور
7. اختر مسار حفظ APK

## الطريقة الثانية: باستخدام Gradle مباشرة

### المتطلبات:
- Java JDK
- Android SDK

### الخطوات:
```bash
# بناء المشروع
npm run build

# نسخ الملفات
npx cap copy android

# مزامنة التحديثات
npx cap sync android

# بناء APK
cd android
./gradlew assembleDebug

# APK سيكون في:
# android/app/build/outputs/apk/debug/app-debug.apk
```

## الطريقة الثالثة: باستخدام Capacitor CLI

### المتطلبات:
- Android Studio مثبت
- Android SDK مُعد

### الخطوات:
```bash
# بناء وتشغيل
npx cap run android

# أو بناء فقط
npx cap build android
```

## مواقع التحميل:

### Java JDK:
- **OpenJDK**: https://adoptium.net/
- **Oracle JDK**: https://www.oracle.com/java/technologies/downloads/

### Android Studio:
- **Google**: https://developer.android.com/studio

### Android SDK:
- يأتي مع Android Studio
- أو تحميل منفصل: https://developer.android.com/studio#command-tools

## ملاحظات مهمة:

1. **حجم APK**: سيكون حوالي 10-20 ميجابايت
2. **وقت البناء**: 5-15 دقيقة حسب سرعة الجهاز
3. **التوقيع**: ضروري لنشر التطبيق
4. **التوافق**: يعمل على Android 5.0+ (API 21+)

## استكشاف الأخطاء:

### خطأ JAVA_HOME:
```bash
# تأكد من تثبيت Java
java -version

# إعداد JAVA_HOME
set JAVA_HOME=C:\Program Files\Java\jdk-11.0.x
```

### خطأ Android SDK:
```bash
# تأكد من تثبيت Android Studio
# أو تحميل SDK منفصل
```

### خطأ Gradle:
```bash
# تنظيف المشروع
cd android
./gradlew clean
./gradlew assembleDebug
```

## النتيجة:
- **APK Debug**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **APK Release**: `android/app/build/outputs/apk/release/app-release.apk`

## تثبيت التطبيق:

### على الهاتف:
1. فعّل "مصادر غير معروفة" في إعدادات الأمان
2. انسخ ملف APK للهاتف
3. اضغط على الملف لتثبيته

### على المحاكي:
1. شغل Android Emulator
2. اسحب ملف APK للمحاكي
3. أو استخدم: `adb install app-debug.apk`

---
*تم إنشاء هذا الدليل لبناء تطبيق الهاتف لشفاء كير* 