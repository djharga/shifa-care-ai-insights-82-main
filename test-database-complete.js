// ملف اختبار شامل لقاعدة البيانات - شفا كير
// قم بتشغيل هذا الملف لاختبار وإنشاء جميع الجداول المفقودة

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ خطأ: متغيرات Supabase غير موجودة في .env.local');
  console.log('📝 تأكد من وجود الملف .env.local مع المتغيرات التالية:');
  console.log('VITE_SUPABASE_URL=your-supabase-url');
  console.log('VITE_SUPABASE_ANON_KEY=your-supabase-anon-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseConnection() {
  console.log('🔍 جاري اختبار الاتصال بقاعدة البيانات...');
  
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('❌ خطأ في الاتصال:', error.message);
      return false;
    }
    
    console.log('✅ الاتصال بقاعدة البيانات ناجح');
    return true;
  } catch (error) {
    console.error('❌ خطأ في الاتصال:', error.message);
    return false;
  }
}

async function checkTables() {
  console.log('\n📋 جاري فحص الجداول الموجودة...');
  
  const tables = [
    'profiles',
    'patients', 
    'rooms',
    'beds',
    'accommodation_records',
    'sessions',
    'facility_expenses',
    'payments',
    'personal_expenses'
  ];
  
  const results = {};
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('count').limit(1);
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
        results[table] = false;
      } else {
        console.log(`✅ ${table}: موجود ويعمل`);
        results[table] = true;
      }
    } catch (error) {
      console.log(`❌ ${table}: ${error.message}`);
      results[table] = false;
    }
  }
  
  return results;
}

async function createMissingTables() {
  console.log('\n🔧 جاري إنشاء الجداول المفقودة...');
  
  // قراءة ملف SQL
  try {
    const fs = await import('fs');
    const sqlContent = fs.readFileSync('create-missing-tables.sql', 'utf8');
    
    // تقسيم SQL إلى أوامر منفصلة
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const command of commands) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: command });
        
        if (error) {
          console.log(`❌ خطأ في تنفيذ: ${error.message}`);
          errorCount++;
        } else {
          successCount++;
        }
      } catch (error) {
        console.log(`❌ خطأ في تنفيذ: ${error.message}`);
        errorCount++;
      }
    }
    
    console.log(`✅ تم تنفيذ ${successCount} أمر بنجاح`);
    if (errorCount > 0) {
      console.log(`❌ فشل في تنفيذ ${errorCount} أمر`);
    }
    
  } catch (error) {
    console.error('❌ خطأ في قراءة ملف SQL:', error.message);
  }
}

async function insertSampleData() {
  console.log('\n📊 جاري إدراج البيانات الافتراضية...');
  
  // إدراج موظفين
  const profiles = [
    {
      full_name: 'المدير الرئيسي',
      email: 'djharga@gmail.com',
      role: 'admin',
      permissions: {
        manage_users: true,
        manage_patients: true,
        manage_sessions: true,
        view_reports: true,
        manage_settings: true,
        manage_finances: true,
        manage_facility: true,
        manage_rooms: true
      },
      is_active: true
    },
    {
      full_name: 'د. أحمد محمد',
      email: 'ahmed.mohamed@shifacare.com',
      role: 'admin',
      permissions: {
        manage_users: true,
        manage_patients: true,
        manage_sessions: true,
        view_reports: true,
        manage_settings: true,
        manage_finances: true
      },
      is_active: true
    }
  ];
  
  for (const profile of profiles) {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert(profile, { onConflict: 'email' });
      
      if (error) {
        console.log(`❌ خطأ في إدراج ${profile.full_name}: ${error.message}`);
      } else {
        console.log(`✅ تم إدراج ${profile.full_name}`);
      }
    } catch (error) {
      console.log(`❌ خطأ في إدراج ${profile.full_name}: ${error.message}`);
    }
  }
  
  // إدراج مرضى
  const patients = [
    {
      name: 'أحمد محمد',
      email: 'ahmed.mohamed@example.com',
      phone: '+201234567890',
      date_of_birth: '1990-05-15',
      gender: 'male',
      addiction_type: 'المخدرات',
      admission_date: '2024-01-15',
      status: 'active',
      notes: 'مريض متعاون'
    },
    {
      name: 'فاطمة علي',
      email: 'fatima.ali@example.com',
      phone: '+201234567891',
      date_of_birth: '1985-08-22',
      gender: 'female',
      addiction_type: 'الكحول',
      admission_date: '2024-02-01',
      status: 'active',
      notes: 'تحسن ملحوظ'
    },
    {
      name: 'محمد عبدالله',
      email: 'mohamed.abdullah@example.com',
      phone: '+201234567892',
      date_of_birth: '1988-12-10',
      gender: 'male',
      addiction_type: 'التدخين',
      admission_date: '2024-01-20',
      status: 'active',
      notes: 'مريض جديد'
    }
  ];
  
  for (const patient of patients) {
    try {
      const { error } = await supabase
        .from('patients')
        .upsert(patient, { onConflict: 'email' });
      
      if (error) {
        console.log(`❌ خطأ في إدراج ${patient.name}: ${error.message}`);
      } else {
        console.log(`✅ تم إدراج ${patient.name}`);
      }
    } catch (error) {
      console.log(`❌ خطأ في إدراج ${patient.name}: ${error.message}`);
    }
  }
  
  // إدراج غرف
  const rooms = [
    {
      room_number: '101',
      room_name: 'غرفة 101',
      room_type: 'single',
      floor_number: 1,
      capacity: 1,
      daily_rate: 500.00,
      status: 'available',
      description: 'غرفة فردية مريحة'
    },
    {
      room_number: '102',
      room_name: 'غرفة 102',
      room_type: 'double',
      floor_number: 1,
      capacity: 2,
      daily_rate: 800.00,
      status: 'available',
      description: 'غرفة مزدوجة'
    },
    {
      room_number: '201',
      room_name: 'غرفة VIP 201',
      room_type: 'vip',
      floor_number: 2,
      capacity: 1,
      daily_rate: 1500.00,
      status: 'available',
      description: 'غرفة VIP فاخرة'
    }
  ];
  
  for (const room of rooms) {
    try {
      const { error } = await supabase
        .from('rooms')
        .upsert(room, { onConflict: 'room_number' });
      
      if (error) {
        console.log(`❌ خطأ في إدراج ${room.room_name}: ${error.message}`);
      } else {
        console.log(`✅ تم إدراج ${room.room_name}`);
      }
    } catch (error) {
      console.log(`❌ خطأ في إدراج ${room.room_name}: ${error.message}`);
    }
  }
  
  // إدراج مصاريف مصحة
  const expenses = [
    {
      expense_category: 'electricity',
      expense_name: 'فاتورة الكهرباء - يناير 2025',
      amount: 2500.00,
      expense_date: '2025-01-31',
      due_date: '2025-02-15',
      payment_status: 'paid',
      payment_method: 'تحويل بنكي',
      receipt_number: 'ELEC001',
      vendor_name: 'شركة الكهرباء',
      vendor_phone: '+20123456789',
      description: 'فاتورة الكهرباء الشهرية'
    },
    {
      expense_category: 'water',
      expense_name: 'فاتورة المياه - يناير 2025',
      amount: 800.00,
      expense_date: '2025-01-31',
      due_date: '2025-02-10',
      payment_status: 'paid',
      payment_method: 'نقدي',
      receipt_number: 'WATER001',
      vendor_name: 'شركة المياه',
      vendor_phone: '+20123456790',
      description: 'فاتورة المياه الشهرية'
    },
    {
      expense_category: 'food',
      expense_name: 'مصاريف الطعام - يناير 2025',
      amount: 5000.00,
      expense_date: '2025-01-31',
      due_date: '2025-02-05',
      payment_status: 'paid',
      payment_method: 'بطاقة ائتمان',
      receipt_number: 'FOOD001',
      vendor_name: 'مطعم الصحة',
      vendor_phone: '+20123456791',
      description: 'مصاريف الطعام الشهرية للمرضى'
    }
  ];
  
  for (const expense of expenses) {
    try {
      const { error } = await supabase
        .from('facility_expenses')
        .insert(expense);
      
      if (error) {
        console.log(`❌ خطأ في إدراج ${expense.expense_name}: ${error.message}`);
      } else {
        console.log(`✅ تم إدراج ${expense.expense_name}`);
      }
    } catch (error) {
      console.log(`❌ خطأ في إدراج ${expense.expense_name}: ${error.message}`);
    }
  }
}

async function getStatistics() {
  console.log('\n📈 إحصائيات قاعدة البيانات:');
  
  try {
    // عدد الموظفين
    const { count: profilesCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    console.log(`👥 عدد الموظفين: ${profilesCount}`);
    
    // عدد المرضى
    const { count: patientsCount } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true });
    
    console.log(`🏥 عدد المرضى: ${patientsCount}`);
    
    // عدد الغرف
    const { count: roomsCount } = await supabase
      .from('rooms')
      .select('*', { count: 'exact', head: true });
    
    console.log(`🏠 عدد الغرف: ${roomsCount}`);
    
    // عدد مصاريف المصحة
    const { count: expensesCount } = await supabase
      .from('facility_expenses')
      .select('*', { count: 'exact', head: true });
    
    console.log(`💰 عدد مصاريف المصحة: ${expensesCount}`);
    
    // إجمالي مصاريف المصحة
    const { data: totalExpenses } = await supabase
      .from('facility_expenses')
      .select('amount');
    
    const total = totalExpenses?.reduce((sum, item) => sum + parseFloat(item.amount), 0) || 0;
    console.log(`💵 إجمالي مصاريف المصحة: ${total.toLocaleString()} ج.م`);
    
  } catch (error) {
    console.error('❌ خطأ في جلب الإحصائيات:', error.message);
  }
}

async function main() {
  console.log('🚀 بدء اختبار قاعدة البيانات الشامل - شفا كير\n');
  
  // اختبار الاتصال
  const isConnected = await testDatabaseConnection();
  if (!isConnected) {
    console.log('❌ فشل في الاتصال بقاعدة البيانات');
    return;
  }
  
  // فحص الجداول
  const tableResults = await checkTables();
  
  // إنشاء الجداول المفقودة إذا لزم الأمر
  const missingTables = Object.values(tableResults).filter(exists => !exists);
  if (missingTables.length > 0) {
    console.log(`\n⚠️ يوجد ${missingTables.length} جدول مفقود`);
    await createMissingTables();
  }
  
  // إدراج البيانات الافتراضية
  await insertSampleData();
  
  // عرض الإحصائيات
  await getStatistics();
  
  console.log('\n✅ تم الانتهاء من اختبار قاعدة البيانات بنجاح!');
  console.log('🎉 النظام جاهز للاستخدام');
}

// تشغيل الاختبار
main().catch(console.error); 