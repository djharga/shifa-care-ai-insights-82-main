import React from 'react';

const SimplePage = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f0f0f0', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      direction: 'rtl'
    }}>
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ color: '#333', marginBottom: '1rem' }}>
          شفاء كير - صفحة بسيطة
        </h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          هذه صفحة اختبار بسيطة للتأكد من عمل التطبيق
        </p>
        <div style={{ 
          backgroundColor: '#e8f5e8', 
          padding: '1rem', 
          borderRadius: '5px',
          marginBottom: '1rem'
        }}>
          <h3 style={{ color: '#2d5a2d', marginBottom: '0.5rem' }}>بيانات الدخول:</h3>
          <p style={{ color: '#4a7c4a', margin: '0.25rem 0' }}>
            📧 admin@shifacare.com / admin123
          </p>
          <p style={{ color: '#4a7c4a', margin: '0.25rem 0' }}>
            📧 test@shifacare.com / test123456
          </p>
        </div>
        <div style={{ 
          backgroundColor: '#e8f4fd', 
          padding: '1rem', 
          borderRadius: '5px'
        }}>
          <h3 style={{ color: '#1e3a8a', marginBottom: '0.5rem' }}>حالة النظام:</h3>
          <p style={{ color: '#1e40af', margin: '0.25rem 0' }}>✅ التطبيق يعمل بشكل صحيح</p>
          <p style={{ color: '#1e40af', margin: '0.25rem 0' }}>✅ React يعمل</p>
          <p style={{ color: '#1e40af', margin: '0.25rem 0' }}>✅ جاهز للنشر</p>
        </div>
      </div>
    </div>
  );
};

export default SimplePage; 