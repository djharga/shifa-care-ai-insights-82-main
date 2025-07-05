// ملف إنشاء مستخدم تجريبي - شفا كير
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oyljfpeeckxgfrqwsebk.supabase.co';
const supabaseServiceKey = 'YOUR_SUPABASE_SERVICE_KEY'; // تحتاج لمفتاح الخدمة من Supabase

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestUser() {
  try {
    console.log('جاري إنشاء مستخدم تجريبي...');

    // 1. إنشاء حساب المستخدم في Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'test@shifacare.com',
      password: 'test123456',
      email_confirm: true,
      user_metadata: {
        full_name: 'مستخدم تجريبي',
        role: 'admin'
      }
    });

    if (authError) {
      console.error('خطأ في إنشاء حساب المستخدم:', authError);
      return;
    }

    console.log('تم إنشاء حساب المستخدم بنجاح:', authData.user.id);

    // 2. إضافة بيانات المستخدم في جدول profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        full_name: 'مستخدم تجريبي',
        email: 'test@shifacare.com',
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
      }, {
        onConflict: 'email'
      });

    if (profileError) {
      console.error('خطأ في إضافة بيانات المستخدم:', profileError);
      return;
    }

    console.log('✅ تم إنشاء المستخدم التجريبي بنجاح!');
    console.log('📧 الإيميل: test@shifacare.com');
    console.log('🔑 كلمة المرور: test123456');
    console.log('👤 الدور: مدير');
    console.log('🔐 الصلاحيات: جميع الصلاحيات');

  } catch (error) {
    console.error('خطأ في إنشاء المستخدم التجريبي:', error);
  }
}

createTestUser(); 