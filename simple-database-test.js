// ملف اختبار مبسط لقاعدة البيانات - شفا كير
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ خطأ: متغيرات Supabase غير موجودة في .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  console.log('🔍 جاري اختبار قاعدة البيانات...\n');
  
  try {
    // اختبار جدول profiles
    console.log('📋 اختبار جدول profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);
    
    if (profilesError) {
      console.log(`❌ خطأ في profiles: ${profilesError.message}`);
    } else {
      console.log(`✅ profiles: ${profiles?.length || 0} موظف`);
    }
    
    // اختبار جدول patients
    console.log('📋 اختبار جدول patients...');
    const { data: patients, error: patientsError } = await supabase
      .from('patients')
      .select('*')
      .limit(5);
    
    if (patientsError) {
      console.log(`❌ خطأ في patients: ${patientsError.message}`);
    } else {
      console.log(`✅ patients: ${patients?.length || 0} مريض`);
    }
    
    // اختبار جدول rooms
    console.log('📋 اختبار جدول rooms...');
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('*')
      .limit(5);
    
    if (roomsError) {
      console.log(`❌ خطأ في rooms: ${roomsError.message}`);
    } else {
      console.log(`✅ rooms: ${rooms?.length || 0} غرفة`);
    }
    
    // اختبار جدول facility_expenses
    console.log('📋 اختبار جدول facility_expenses...');
    const { data: expenses, error: expensesError } = await supabase
      .from('facility_expenses')
      .select('*')
      .limit(5);
    
    if (expensesError) {
      console.log(`❌ خطأ في facility_expenses: ${expensesError.message}`);
    } else {
      console.log(`✅ facility_expenses: ${expenses?.length || 0} مصروف`);
    }
    
    // اختبار جدول sessions
    console.log('📋 اختبار جدول sessions...');
    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select('*')
      .limit(5);
    
    if (sessionsError) {
      console.log(`❌ خطأ في sessions: ${sessionsError.message}`);
    } else {
      console.log(`✅ sessions: ${sessions?.length || 0} جلسة`);
    }
    
    console.log('\n✅ تم الانتهاء من اختبار قاعدة البيانات');
    
  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
  }
}

testDatabase(); 