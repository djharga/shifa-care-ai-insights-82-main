import React from 'react';
import { useTranslation } from 'react-i18next';

const SimplePage = () => {
  const { t } = useTranslation();

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
          {t('simple_title')}
        </h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          {t('simple_desc')}
        </p>
        <div style={{ 
          backgroundColor: '#e8f5e8', 
          padding: '1rem', 
          borderRadius: '5px',
          marginBottom: '1rem'
        }}>
          <h3 style={{ color: '#2d5a2d', marginBottom: '0.5rem' }}>{t('simple_login_data')}</h3>
          <p style={{ color: '#4a7c4a', margin: '0.25rem 0' }}>
            {t('simple_login_admin')}
          </p>
          <p style={{ color: '#4a7c4a', margin: '0.25rem 0' }}>
            {t('simple_login_test')}
          </p>
        </div>
        <div style={{ 
          backgroundColor: '#e8f4fd', 
          padding: '1rem', 
          borderRadius: '5px'
        }}>
          <h3 style={{ color: '#1e3a8a', marginBottom: '0.5rem' }}>{t('simple_status')}</h3>
          <p style={{ color: '#1e40af', margin: '0.25rem 0' }}>{t('simple_status_ok')}</p>
          <p style={{ color: '#1e40af', margin: '0.25rem 0' }}>{t('simple_status_react')}</p>
          <p style={{ color: '#1e40af', margin: '0.25rem 0' }}>{t('simple_status_ready')}</p>
        </div>
      </div>
    </div>
  );
};

export default SimplePage; 