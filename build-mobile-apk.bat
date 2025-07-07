@echo off
echo ========================================
echo    بناء تطبيق الهاتف - شفاء كير
echo ========================================

echo.
echo 1. بناء المشروع...
call npm run build

echo.
echo 2. نسخ الملفات للأندرويد...
call npx cap copy android

echo.
echo 3. مزامنة التحديثات...
call npx cap sync android

echo.
echo 4. فتح مجلد الأندرويد...
echo    - انتظر حتى يفتح مجلد android
echo    - اذهب لـ app\build\outputs\apk\debug
echo    - ستجد ملف app-debug.apk

echo.
echo 5. أو استخدم Android Studio:
echo    - افتح مجلد android في Android Studio
echo    - انتظر حتى ينتهي التحميل
echo    - اذهب لـ Build > Build Bundle(s) / APK(s) > Build APK(s)
echo    - انتظر حتى ينتهي البناء
echo    - اذهب لـ Build > Generate Signed Bundle / APK
echo    - اختر APK واملأ البيانات

echo.
echo ========================================
echo    تم إعداد المشروع للبناء!
echo ========================================

start android
pause 