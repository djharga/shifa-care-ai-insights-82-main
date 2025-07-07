#!/usr/bin/env node

// =====================================================
// شفاء كير - إعداد متغيرات البيئة التلقائي
// تاريخ التحديث: 2025-01-05
// متوافق مع Node.js 22+ فقط
// =====================================================

import fs from 'fs';
import path from 'path';

console.log('🔧 بدء إعداد متغيرات البيئة تلقائياً...');

// بيانات Supabase المقدمة
const SUPABASE_URL = 'https://klmonieepqpljusopnga.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsbW9uaWVlcHFwbGp1c29wbmdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MTY3NTgsImV4cCI6MjA2NzM5Mjc1OH0.mG9jmmPP_6Nv3nMrOWEDIjEMqCnf-yt_zgS6nxXwglo';

// محتوى ملف .env
const envContent = `# =====================================================
# شفاء كير - متغيرات البيئة لـ Supabase
# تاريخ التحديث: 2025-01-05
# متوافق مع Node.js 22+ فقط
# =====================================================

# =====================================================
# إعدادات Supabase (PostgreSQL)
# =====================================================
VITE_SUPABASE_URL=${SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}

# =====================================================
# إعدادات Google AI
# =====================================================
VITE_GOOGLE_AI_API_KEY=AIzaSyAISMlZx9Ukfi7QJlog5_e0KJuWyb_Atrk
VITE_GOOGLE_AI_MODEL=gemini-1.5-flash
VITE_GOOGLE_AI_MAX_TOKENS=2000
VITE_GOOGLE_AI_TEMPERATURE=0.7

# =====================================================
# إعدادات التطبيق
# =====================================================
VITE_APP_NAME=شفاء كير
VITE_APP_VERSION=2025.2.1
VITE_APP_ENV=production
VITE_APP_LOCALE=ar-EG

# =====================================================
# إعدادات الأمان
# =====================================================
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=false
VITE_ENABLE_LOGGING=true

# =====================================================
# إعدادات AI
# =====================================================
VITE_AI_RESPONSE_LANGUAGE=egyptian_arabic
VITE_AI_MAX_SESSIONS_PER_DAY=50
VITE_AI_SESSION_TIMEOUT=300000

# =====================================================
# إعدادات قاعدة البيانات
# =====================================================
VITE_DB_ENABLE_LOGGING=false
VITE_DB_CONNECTION_TIMEOUT=30000
VITE_DB_POOL_SIZE=10

# =====================================================
# إعدادات النشر
# =====================================================
NODE_ENV=production
VITE_DEV_MODE=false
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_DEBUG_MODE=false
VITE_ENABLE_HOT_RELOAD=false
`;

try {
  // كتابة ملف .env
  fs.writeFileSync('.env', envContent, 'utf8');
  console.log('✅ تم إنشاء ملف .env بنجاح!');
  
  // إنشاء ملف .env.local أيضاً
  fs.writeFileSync('.env.local', envContent, 'utf8');
  console.log('✅ تم إنشاء ملف .env.local بنجاح!');
  
  console.log('🔗 بيانات Supabase:');
  console.log(`   URL: ${SUPABASE_URL}`);
  console.log(`   Key: ${SUPABASE_ANON_KEY.substring(0, 20)}...`);
  
  console.log('\n📝 الخطوات التالية:');
  console.log('1. أضف مفتاح Google AI API في VITE_GOOGLE_AI_API_KEY');
  console.log('2. شغل "npm run dev" لتشغيل المشروع محلياً');
  console.log('3. شغل "npm run deploy:vercel" للنشر على Vercel');
  
} catch (error) {
  console.error('❌ خطأ في إنشاء ملف .env:', error.message);
  process.exit(1);
} 