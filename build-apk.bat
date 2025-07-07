@echo off
echo ========================================
echo    بناء ملف APK - شفاء كير
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
echo 4. فتح Android Studio...
echo    - انتظر حتى يفتح Android Studio
echo    - اذهب لـ Build > Build Bundle(s) / APK(s) > Build APK(s)
echo    - انتظر حتى ينتهي البناء
echo    - اذهب لـ Build > Generate Signed Bundle / APK
echo    - اختر APK
echo    - املأ البيانات المطلوبة
echo    - اختر مسار حفظ APK
echo.
echo 5. أو استخدم Gradle مباشرة:
echo    cd android
echo    ./gradlew assembleDebug
echo    (APK سيكون في: android/app/build/outputs/apk/debug/app-debug.apk)

echo.
echo ========================================
echo    تم إعداد المشروع للبناء!
echo ========================================
pause 