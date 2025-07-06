// =====================================================
// شفاء كير - اختبار الاتصال بـ Supabase
// تاريخ الإنشاء: 2025-07-05
// متوافق مع Node.js 22+ فقط
// =====================================================

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config({ path: '.env.local' });

// الحصول على بيانات الاتصال
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

// التحقق من وجود البيانات
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ بيانات Supabase مفقودة!');
  console.error('تأكد من إعداد VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY في ملف .env.local');
  process.exit(1);
}

// إنشاء عميل Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// اختبار الاتصال
async function testConnection() {
  console.log('🔍 اختبار الاتصال بـ Supabase...');
  
  try {
    // اختبار الاتصال الأساسي
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('❌ خطأ في الاتصال:', error.message);
      return false;
    }
    
    console.log('✅ الاتصال بـ Supabase ناجح!');
    return true;
  } catch (error) {
    console.error('❌ فشل الاتصال:', error.message);
    return false;
  }
}

// اختبار الجداول
async function testTables() {
  console.log('\n📊 اختبار الجداول...');
  
  const tables = [
    'profiles',
    'patients', 
    'sessions',
    'rooms',
    'beds',
    'accommodation_records',
    'facility_expenses',
    'payments',
    'personal_expenses'
  ];
  
  const results = {};
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('count').limit(1);
      
      if (error) {
        console.error(`❌ خطأ في جدول ${table}:`, error.message);
        results[table] = { status: 'error', error: error.message };
      } else {
        console.log(`✅ جدول ${table} يعمل بشكل صحيح`);
        results[table] = { status: 'ok' };
      }
    } catch (error) {
      console.error(`❌ فشل في اختبار جدول ${table}:`, error.message);
      results[table] = { status: 'error', error: error.message };
    }
  }
  
  return results;
}

// اختبار البيانات الافتراضية
async function testDefaultData() {
  console.log('\n📋 اختبار البيانات الافتراضية...');
  
  try {
    // اختبار الغرف
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('*')
      .limit(5);
    
    if (roomsError) {
      console.error('❌ خطأ في قراءة الغرف:', roomsError.message);
    } else {
      console.log(`✅ تم العثور على ${rooms.length} غرفة`);
      rooms.forEach(room => {
        console.log(`   - ${room.room_name} (${room.room_number}) - ${room.status}`);
      });
    }
    
    // اختبار الأسرّة
    const { data: beds, error: bedsError } = await supabase
      .from('beds')
      .select('*')
      .limit(10);
    
    if (bedsError) {
      console.error('❌ خطأ في قراءة الأسرّة:', bedsError.message);
    } else {
      console.log(`✅ تم العثور على ${beds.length} سرير`);
    }
    
    // اختبار مصاريف المصحة
    const { data: expenses, error: expensesError } = await supabase
      .from('facility_expenses')
      .select('*')
      .limit(5);
    
    if (expensesError) {
      console.error('❌ خطأ في قراءة المصاريف:', expensesError.message);
    } else {
      console.log(`✅ تم العثور على ${expenses.length} مصروف مصحة`);
      expenses.forEach(expense => {
        console.log(`   - ${expense.expense_name}: ${expense.amount} جنيه (${expense.payment_status})`);
      });
    }
    
  } catch (error) {
    console.error('❌ خطأ في اختبار البيانات:', error.message);
  }
}

// اختبار AI
async function testAI() {
  console.log('\n🤖 اختبار إعدادات AI...');
  
  const googleAiKey = process.env.VITE_GOOGLE_AI_API_KEY;
  const googleAiModel = process.env.VITE_GOOGLE_AI_MODEL;
  const aiLanguage = process.env.VITE_AI_RESPONSE_LANGUAGE;
  
  if (!googleAiKey) {
    console.error('❌ مفتاح Google AI مفقود!');
    return false;
  }
  
  console.log('✅ مفتاح Google AI موجود');
  console.log(`✅ نموذج AI: ${googleAiModel || 'غير محدد'}`);
  console.log(`✅ لغة الاستجابة: ${aiLanguage || 'غير محدد'}`);
  
  return true;
}

// اختبار متغيرات البيئة
function testEnvironment() {
  console.log('\n⚙️ اختبار متغيرات البيئة...');
  
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_GOOGLE_AI_API_KEY',
    'VITE_APP_NAME',
    'VITE_AI_RESPONSE_LANGUAGE'
  ];
  
  const missingVars = [];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    } else {
      console.log(`✅ ${varName}: ${varName.includes('KEY') ? '***مخفي***' : process.env[varName]}`);
    }
  }
  
  if (missingVars.length > 0) {
    console.error('❌ متغيرات مفقودة:', missingVars.join(', '));
    return false;
  }
  
  return true;
}

// تشغيل جميع الاختبارات
async function runAllTests() {
  console.log('🚀 بدء اختبارات شفاء كير...\n');
  
  // اختبار Node.js
  const nodeVersion = process.version;
  console.log(`📦 إصدار Node.js: ${nodeVersion}`);
  
  if (!nodeVersion.startsWith('v22')) {
    console.error('❌ يتطلب Node.js 22+');
    process.exit(1);
  }
  
  console.log('✅ إصدار Node.js متوافق\n');
  
  // اختبار متغيرات البيئة
  const envOk = testEnvironment();
  
  // اختبار الاتصال
  const connectionOk = await testConnection();
  
  if (!connectionOk) {
    console.error('\n❌ فشل في الاتصال بقاعدة البيانات');
    process.exit(1);
  }
  
  // اختبار الجداول
  const tablesOk = await testTables();
  
  // اختبار البيانات
  await testDefaultData();
  
  // اختبار AI
  const aiOk = await testAI();
  
  // ملخص النتائج
  console.log('\n📋 ملخص النتائج:');
  console.log('================');
  console.log(`✅ متغيرات البيئة: ${envOk ? 'صحيح' : 'خطأ'}`);
  console.log(`✅ الاتصال بقاعدة البيانات: ${connectionOk ? 'صحيح' : 'خطأ'}`);
  console.log(`✅ إعدادات AI: ${aiOk ? 'صحيح' : 'خطأ'}`);
  
  const workingTables = Object.values(tablesOk).filter(t => t.status === 'ok').length;
  console.log(`✅ الجداول العاملة: ${workingTables}/${Object.keys(tablesOk).length}`);
  
  if (envOk && connectionOk && aiOk && workingTables === Object.keys(tablesOk).length) {
    console.log('\n🎉 جميع الاختبارات نجحت! النظام جاهز للاستخدام.');
  } else {
    console.log('\n⚠️ بعض الاختبارات فشلت. راجع الأخطاء أعلاه.');
  }
}

// تشغيل الاختبارات
runAllTests().catch(error => {
  console.error('❌ خطأ غير متوقع:', error);
  process.exit(1);
}); 