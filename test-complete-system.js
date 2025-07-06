// ملف اختبار شامل للنظام - شفا كير
// قم بتشغيل هذا الملف لاختبار جميع مكونات النظام

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

async function testCompleteSystem() {
  console.log('🔍 جاري اختبار النظام الشامل...\n');
  
  try {
    // =====================================================
    // 1. اختبار نظام إدارة الموظفين
    // =====================================================
    console.log('👥 اختبار نظام إدارة الموظفين...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.log(`❌ خطأ في profiles: ${profilesError.message}`);
    } else {
      console.log(`✅ profiles: ${profiles.length} موظف`);
      profiles.forEach(profile => {
        console.log(`   - ${profile.full_name || profile.name} (${profile.role})`);
      });
    }

    // =====================================================
    // 2. اختبار نظام إدارة المرضى
    // =====================================================
    console.log('\n🏥 اختبار نظام إدارة المرضى...');
    const { data: patients, error: patientsError } = await supabase
      .from('patients')
      .select('*');
    
    if (patientsError) {
      console.log(`❌ خطأ في patients: ${patientsError.message}`);
    } else {
      console.log(`✅ patients: ${patients.length} مريض`);
      patients.forEach(patient => {
        console.log(`   - ${patient.name} (${patient.addiction_type}) - ${patient.status}`);
      });
    }

    // =====================================================
    // 3. اختبار نظام إدارة الغرف
    // =====================================================
    console.log('\n🏠 اختبار نظام إدارة الغرف...');
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('*');
    
    if (roomsError) {
      console.log(`❌ خطأ في rooms: ${roomsError.message}`);
    } else {
      console.log(`✅ rooms: ${rooms.length} غرفة`);
      rooms.forEach(room => {
        console.log(`   - ${room.room_name} (${room.room_type}) - ${room.status} - ${room.daily_rate} جنيه`);
      });
    }

    // =====================================================
    // 4. اختبار نظام إدارة الأسرّة
    // =====================================================
    console.log('\n🛏️ اختبار نظام إدارة الأسرّة...');
    const { data: beds, error: bedsError } = await supabase
      .from('beds')
      .select('*, rooms(room_name)');
    
    if (bedsError) {
      console.log(`❌ خطأ في beds: ${bedsError.message}`);
    } else {
      console.log(`✅ beds: ${beds.length} سرير`);
      beds.forEach(bed => {
        console.log(`   - ${bed.bed_name} في ${bed.rooms?.room_name} - ${bed.status}`);
      });
    }

    // =====================================================
    // 5. اختبار النظام المالي
    // =====================================================
    console.log('\n💰 اختبار النظام المالي...');
    
    // مصاريف المصحة
    const { data: facilityExpenses, error: facilityExpensesError } = await supabase
      .from('facility_expenses')
      .select('*');
    
    if (facilityExpensesError) {
      console.log(`❌ خطأ في facility_expenses: ${facilityExpensesError.message}`);
    } else {
      console.log(`✅ facility_expenses: ${facilityExpenses.length} مصروف`);
      const totalExpenses = facilityExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
      console.log(`   - إجمالي المصاريف: ${totalExpenses.toFixed(2)} جنيه`);
    }

    // المدفوعات
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('*');
    
    if (paymentsError) {
      console.log(`❌ خطأ في payments: ${paymentsError.message}`);
    } else {
      console.log(`✅ payments: ${payments.length} دفعة`);
    }

    // المصاريف الشخصية
    const { data: personalExpenses, error: personalExpensesError } = await supabase
      .from('personal_expenses')
      .select('*');
    
    if (personalExpensesError) {
      console.log(`❌ خطأ في personal_expenses: ${personalExpensesError.message}`);
    } else {
      console.log(`✅ personal_expenses: ${personalExpenses.length} مصروف شخصي`);
    }

    // =====================================================
    // 6. اختبار نظام الجلسات
    // =====================================================
    console.log('\n📅 اختبار نظام الجلسات...');
    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select('*, patients(name), profiles(full_name)');
    
    if (sessionsError) {
      console.log(`❌ خطأ في sessions: ${sessionsError.message}`);
    } else {
      console.log(`✅ sessions: ${sessions.length} جلسة`);
      sessions.forEach(session => {
        console.log(`   - ${session.patients?.name} مع ${session.profiles?.full_name} - ${session.session_type} - ${session.status}`);
      });
    }

    // =====================================================
    // 7. اختبار نظام الإقامة
    // =====================================================
    console.log('\n🏨 اختبار نظام الإقامة...');
    const { data: accommodationRecords, error: accommodationError } = await supabase
      .from('accommodation_records')
      .select('*');
    
    if (accommodationError) {
      console.log(`❌ خطأ في accommodation_records: ${accommodationError.message}`);
    } else {
      console.log(`✅ accommodation_records: ${accommodationRecords.length} سجل إقامة`);
    }

    // =====================================================
    // 8. ملخص النظام
    // =====================================================
    console.log('\n📊 ملخص النظام:');
    console.log('='.repeat(50));
    console.log(`👥 الموظفين: ${profiles?.length || 0}`);
    console.log(`🏥 المرضى: ${patients?.length || 0}`);
    console.log(`🏠 الغرف: ${rooms?.length || 0}`);
    console.log(`🛏️ الأسرّة: ${beds?.length || 0}`);
    console.log(`💰 مصاريف المصحة: ${facilityExpenses?.length || 0}`);
    console.log(`💳 المدفوعات: ${payments?.length || 0}`);
    console.log(`💸 المصاريف الشخصية: ${personalExpenses?.length || 0}`);
    console.log(`📅 الجلسات: ${sessions?.length || 0}`);
    console.log(`🏨 سجلات الإقامة: ${accommodationRecords?.length || 0}`);
    console.log('='.repeat(50));

    // =====================================================
    // 9. تقييم حالة النظام
    // =====================================================
    console.log('\n🎯 تقييم حالة النظام:');
    
    const systemStatus = {
      profiles: profiles?.length > 0,
      patients: patients?.length > 0,
      rooms: rooms?.length > 0,
      beds: beds?.length > 0,
      facilityExpenses: facilityExpenses?.length > 0,
      sessions: sessions?.length > 0
    };

    const workingModules = Object.values(systemStatus).filter(Boolean).length;
    const totalModules = Object.keys(systemStatus).length;
    const percentage = Math.round((workingModules / totalModules) * 100);

    console.log(`✅ الوحدات العاملة: ${workingModules}/${totalModules} (${percentage}%)`);

    if (percentage >= 80) {
      console.log('🎉 النظام يعمل بشكل ممتاز!');
    } else if (percentage >= 60) {
      console.log('⚠️ النظام يعمل بشكل جيد مع بعض المشاكل البسيطة');
    } else {
      console.log('❌ النظام يحتاج إلى إصلاحات');
    }

  } catch (error) {
    console.error('❌ خطأ في اختبار النظام:', error.message);
  }
}

// تشغيل الاختبار
testCompleteSystem(); 