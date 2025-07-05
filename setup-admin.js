// ملف إعداد المدير الرئيسي - شفا كير
// قم بتشغيل هذا الملف مرة واحدة لإعداد حساب المدير الرئيسي
// GitHub: https://github.com/djharga/shifa-care-ai-insights-82-main.git

import { createClient } from '@supabase/supabase-js';

// استبدل هذه القيم بقيم Supabase الخاصة بك
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseServiceKey = 'YOUR_SUPABASE_SERVICE_KEY';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupMainAdmin() {
  try {
    console.log('جاري إعداد المدير الرئيسي...');

    // 1. إنشاء حساب المستخدم في Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'djharga@gmail.com',
      password: 'metaleslam',
      email_confirm: true,
      user_metadata: {
        full_name: 'المدير الرئيسي',
        role: 'admin'
      }
    });

    if (authError) {
      console.error('خطأ في إنشاء حساب المستخدم:', authError);
      return;
    }

    console.log('تم إنشاء حساب المستخدم بنجاح:', authData.user.id);

    // 2. إضافة بيانات المدير في جدول profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
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
      }, {
        onConflict: 'email'
      });

    if (profileError) {
      console.error('خطأ في إضافة بيانات المدير:', profileError);
      return;
    }

    console.log('تم إضافة بيانات المدير بنجاح');

    // 3. إعداد الصلاحيات الإضافية
    const { error: rpcError } = await supabase.rpc('grant_admin_permissions', {
      user_id: authData.user.id
    });

    if (rpcError) {
      console.log('ملاحظة: لم يتم إعداد الصلاحيات الإضافية (قد لا تكون موجودة):', rpcError.message);
    }

    console.log('✅ تم إعداد المدير الرئيسي بنجاح!');
    console.log('📧 الإيميل: djharga@gmail.com');
    console.log('🔑 كلمة المرور: metaleslam');
    console.log('👤 الدور: مدير رئيسي');
    console.log('🔐 الصلاحيات: جميع الصلاحيات');

  } catch (error) {
    console.error('خطأ في إعداد المدير الرئيسي:', error);
  }
}

// تشغيل الإعداد
setupMainAdmin(); 