// ملف إدراج البيانات الافتراضية - شفا كير
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ خطأ: متغيرات Supabase غير موجودة');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertSampleData() {
  console.log('🔧 جاري إدراج البيانات الافتراضية...\n');

  try {
    // 1. إدراج المرضى
    console.log('🏥 إدراج بيانات المرضى...');
    const patientsData = [
      { name: 'أحمد محمد', email: 'ahmed.mohamed@example.com', phone: '+201234567890', date_of_birth: '1990-05-15', gender: 'male', addiction_type: 'المخدرات', admission_date: '2024-01-15', status: 'active' },
      { name: 'فاطمة علي', email: 'fatima.ali@example.com', phone: '+201234567891', date_of_birth: '1985-08-22', gender: 'female', addiction_type: 'الكحول', admission_date: '2024-02-01', status: 'active' },
      { name: 'محمد عبدالله', email: 'mohamed.abdullah@example.com', phone: '+201234567892', date_of_birth: '1988-12-10', gender: 'male', addiction_type: 'التدخين', admission_date: '2024-01-20', status: 'active' },
      { name: 'سارة أحمد', email: 'sara.ahmed@example.com', phone: '+201234567893', date_of_birth: '1992-03-08', gender: 'female', addiction_type: 'المخدرات', admission_date: '2024-02-15', status: 'active' },
      { name: 'علي حسن', email: 'ali.hassan@example.com', phone: '+201234567894', date_of_birth: '1987-07-12', gender: 'male', addiction_type: 'الكحول', admission_date: '2024-01-25', status: 'active' }
    ];

    const { data: patients, error: patientsError } = await supabase
      .from('patients')
      .insert(patientsData)
      .select();

    if (patientsError) {
      console.log(`❌ خطأ في إدراج المرضى: ${patientsError.message}`);
    } else {
      console.log(`✅ تم إدراج ${patients.length} مريض`);
    }

    // 2. إدراج الغرف
    console.log('\n🏠 إدراج بيانات الغرف...');
    const roomsData = [
      { room_number: '101', room_name: 'غرفة 101', room_type: 'single', floor_number: 1, capacity: 1, daily_rate: 500.00, status: 'available', description: 'غرفة فردية مريحة' },
      { room_number: '102', room_name: 'غرفة 102', room_type: 'double', floor_number: 1, capacity: 2, daily_rate: 800.00, status: 'available', description: 'غرفة مزدوجة' },
      { room_number: '103', room_name: 'غرفة 103', room_type: 'triple', floor_number: 1, capacity: 3, daily_rate: 1200.00, status: 'available', description: 'غرفة ثلاثية' },
      { room_number: '201', room_name: 'غرفة VIP 201', room_type: 'vip', floor_number: 2, capacity: 1, daily_rate: 1500.00, status: 'available', description: 'غرفة VIP فاخرة' },
      { room_number: '202', room_name: 'غرفة 202', room_type: 'single', floor_number: 2, capacity: 1, daily_rate: 500.00, status: 'available', description: 'غرفة فردية' }
    ];

    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .insert(roomsData)
      .select();

    if (roomsError) {
      console.log(`❌ خطأ في إدراج الغرف: ${roomsError.message}`);
    } else {
      console.log(`✅ تم إدراج ${rooms.length} غرفة`);
    }

    // 3. إدراج الأسرّة
    console.log('\n🛏️ إدراج بيانات الأسرّة...');
    if (rooms && rooms.length > 0) {
      const bedsData = [
        { room_id: rooms[0].id, bed_number: 'B101-1', bed_name: 'سرير 1', bed_type: 'single', status: 'available' },
        { room_id: rooms[1].id, bed_number: 'B102-1', bed_name: 'سرير 1', bed_type: 'single', status: 'available' },
        { room_id: rooms[1].id, bed_number: 'B102-2', bed_name: 'سرير 2', bed_type: 'single', status: 'available' },
        { room_id: rooms[2].id, bed_number: 'B103-1', bed_name: 'سرير 1', bed_type: 'single', status: 'available' },
        { room_id: rooms[2].id, bed_number: 'B103-2', bed_name: 'سرير 2', bed_type: 'single', status: 'available' },
        { room_id: rooms[2].id, bed_number: 'B103-3', bed_name: 'سرير 3', bed_type: 'single', status: 'available' },
        { room_id: rooms[3].id, bed_number: 'B201-1', bed_name: 'سرير VIP', bed_type: 'single', status: 'available' },
        { room_id: rooms[4].id, bed_number: 'B202-1', bed_name: 'سرير 1', bed_type: 'single', status: 'available' }
      ];

      const { data: beds, error: bedsError } = await supabase
        .from('beds')
        .insert(bedsData)
        .select();

      if (bedsError) {
        console.log(`❌ خطأ في إدراج الأسرّة: ${bedsError.message}`);
      } else {
        console.log(`✅ تم إدراج ${beds.length} سرير`);
      }
    }

    // 4. إدراج مصاريف المصحة
    console.log('\n💰 إدراج بيانات مصاريف المصحة...');
    const expensesData = [
      { expense_category: 'electricity', expense_name: 'فاتورة الكهرباء - يناير 2025', amount: 2500.00, expense_date: '2025-01-31', due_date: '2025-02-15', payment_status: 'paid', payment_method: 'تحويل بنكي', receipt_number: 'ELEC001', vendor_name: 'شركة الكهرباء', vendor_phone: '+20123456789', description: 'فاتورة الكهرباء الشهرية' },
      { expense_category: 'water', expense_name: 'فاتورة المياه - يناير 2025', amount: 800.00, expense_date: '2025-01-31', due_date: '2025-02-10', payment_status: 'paid', payment_method: 'نقدي', receipt_number: 'WATER001', vendor_name: 'شركة المياه', vendor_phone: '+20123456790', description: 'فاتورة المياه الشهرية' },
      { expense_category: 'food', expense_name: 'مصاريف الطعام - يناير 2025', amount: 5000.00, expense_date: '2025-01-31', due_date: '2025-02-05', payment_status: 'paid', payment_method: 'بطاقة ائتمان', receipt_number: 'FOOD001', vendor_name: 'مطعم الصحة', vendor_phone: '+20123456791', description: 'مصاريف الطعام الشهرية للمرضى' },
      { expense_category: 'cleaning', expense_name: 'خدمات التنظيف - يناير 2025', amount: 1500.00, expense_date: '2025-01-31', due_date: '2025-02-20', payment_status: 'pending', payment_method: 'تحويل بنكي', receipt_number: 'CLEAN001', vendor_name: 'شركة النظافة', vendor_phone: '+20123456792', description: 'خدمات التنظيف الشهرية' },
      { expense_category: 'maintenance', expense_name: 'صيانة المكيفات', amount: 1200.00, expense_date: '2025-02-01', due_date: '2025-02-15', payment_status: 'pending', payment_method: 'نقدي', receipt_number: 'MAINT001', vendor_name: 'شركة الصيانة', vendor_phone: '+20123456793', description: 'صيانة دورية للمكيفات' }
    ];

    const { data: expenses, error: expensesError } = await supabase
      .from('facility_expenses')
      .insert(expensesData)
      .select();

    if (expensesError) {
      console.log(`❌ خطأ في إدراج المصاريف: ${expensesError.message}`);
    } else {
      console.log(`✅ تم إدراج ${expenses.length} مصروف`);
    }

    // 5. إدراج الجلسات
    console.log('\n📅 إدراج بيانات الجلسات...');
    if (patients && patients.length > 0) {
      // الحصول على معالج
      const { data: therapists } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (therapists && therapists.length > 0) {
        const sessionsData = [
          { patient_id: patients[0].id, therapist_id: therapists[0].id, session_date: '2025-01-15', session_time: '09:00:00', duration: 60, session_type: 'individual', status: 'completed', notes: 'جلسة علاجية أولية' },
          { patient_id: patients[1].id, therapist_id: therapists[0].id, session_date: '2025-01-16', session_time: '10:00:00', duration: 60, session_type: 'individual', status: 'completed', notes: 'جلسة علاجية أولية' },
          { patient_id: patients[2].id, therapist_id: therapists[0].id, session_date: '2025-01-17', session_time: '11:00:00', duration: 60, session_type: 'individual', status: 'completed', notes: 'جلسة علاجية أولية' },
          { patient_id: patients[3].id, therapist_id: therapists[0].id, session_date: '2025-01-18', session_time: '14:00:00', duration: 60, session_type: 'individual', status: 'completed', notes: 'جلسة علاجية أولية' },
          { patient_id: patients[4].id, therapist_id: therapists[0].id, session_date: '2025-01-19', session_time: '15:00:00', duration: 60, session_type: 'individual', status: 'completed', notes: 'جلسة علاجية أولية' }
        ];

        const { data: sessions, error: sessionsError } = await supabase
          .from('sessions')
          .insert(sessionsData)
          .select();

        if (sessionsError) {
          console.log(`❌ خطأ في إدراج الجلسات: ${sessionsError.message}`);
        } else {
          console.log(`✅ تم إدراج ${sessions.length} جلسة`);
        }
      }
    }

    console.log('\n🎉 تم إدراج جميع البيانات الافتراضية بنجاح!');

  } catch (error) {
    console.error('❌ خطأ في إدراج البيانات:', error.message);
  }
}

// تشغيل الإدراج
insertSampleData(); 