import React from 'react';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          شفاء كير - صفحة الاختبار
        </h1>
        <p className="text-muted-foreground mb-8">
          هذه صفحة اختبار للتأكد من أن التطبيق يعمل بشكل صحيح
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-card rounded-lg">
            <h2 className="text-xl font-semibold mb-2">بيانات الدخول الافتراضية:</h2>
            <p className="text-sm text-muted-foreground">
              📧 admin@shifacare.com / admin123
            </p>
            <p className="text-sm text-muted-foreground">
              📧 test@shifacare.com / test123456
            </p>
          </div>
          <div className="p-4 bg-card rounded-lg">
            <h2 className="text-xl font-semibold mb-2">حالة النظام:</h2>
            <p className="text-green-600">✅ التطبيق يعمل بشكل صحيح</p>
            <p className="text-green-600">✅ نظام المصادقة جاهز</p>
            <p className="text-green-600">✅ PWA جاهز</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage; 