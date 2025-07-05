import React from 'react';

const WorkingPage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1e293b',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#10b981' }}>
          ✅ شفاء كير يعمل!
        </h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#94a3b8' }}>
          التطبيق يعمل بشكل صحيح
        </p>
        
        <div style={{
          backgroundColor: '#334155',
          padding: '2rem',
          borderRadius: '10px',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#10b981', marginBottom: '1rem' }}>🔐 بيانات الدخول:</h2>
          <div style={{ fontSize: '1.2rem', lineHeight: '2' }}>
            <p>📧 admin@shifacare.com</p>
            <p>🔑 admin123</p>
            <hr style={{ margin: '1rem 0', borderColor: '#475569' }} />
            <p>📧 test@shifacare.com</p>
            <p>🔑 test123456</p>
          </div>
        </div>

        <div style={{
          backgroundColor: '#334155',
          padding: '2rem',
          borderRadius: '10px'
        }}>
          <h2 style={{ color: '#10b981', marginBottom: '1rem' }}>📱 الصفحات المتاحة:</h2>
          <div style={{ fontSize: '1.2rem', lineHeight: '2' }}>
            <p>🏠 <a href="/" style={{ color: '#60a5fa' }}>الصفحة الرئيسية</a></p>
            <p>🔐 <a href="/auth" style={{ color: '#60a5fa' }}>تسجيل الدخول</a></p>
            <p>📊 <a href="/dashboard" style={{ color: '#60a5fa' }}>لوحة التحكم</a></p>
            <p>🧪 <a href="/test" style={{ color: '#60a5fa' }}>صفحة الاختبار</a></p>
          </div>
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#059669',
          borderRadius: '5px'
        }}>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>
            🚀 جاهز للنشر على Netlify!
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkingPage; 