import React from 'react';
import { useTranslation } from 'react-i18next';

const WorkingPage = () => {
  const { t } = useTranslation();

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
          {t('working_title')}
        </h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#94a3b8' }}>
          {t('working_app_ok')}
        </p>
        
        <div style={{
          backgroundColor: '#334155',
          padding: '2rem',
          borderRadius: '10px',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#10b981', marginBottom: '1rem' }}>{t('working_login_data')}</h2>
          <div style={{ fontSize: '1.2rem', lineHeight: '2' }}>
            <p>{t('working_admin_email')}</p>
            <p>{t('working_admin_pass')}</p>
            <hr style={{ margin: '1rem 0', borderColor: '#475569' }} />
            <p>{t('working_test_email')}</p>
            <p>{t('working_test_pass')}</p>
          </div>
        </div>

        <div style={{
          backgroundColor: '#334155',
          padding: '2rem',
          borderRadius: '10px'
        }}>
          <h2 style={{ color: '#10b981', marginBottom: '1rem' }}>{t('working_pages')}</h2>
          <div style={{ fontSize: '1.2rem', lineHeight: '2' }}>
            <p>🏠 <a href="/" style={{ color: '#60a5fa' }}>{t('working_home')}</a></p>
            <p>🔐 <a href="/auth" style={{ color: '#60a5fa' }}>{t('working_auth')}</a></p>
            <p>📊 <a href="/dashboard" style={{ color: '#60a5fa' }}>{t('working_dashboard')}</a></p>
            <p>🧪 <a href="/test" style={{ color: '#60a5fa' }}>{t('working_test')}</a></p>
          </div>
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#059669',
          borderRadius: '5px'
        }}>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>
            {t('working_ready_netlify')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkingPage; 