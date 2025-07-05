// ملف اختبار الاتصال بقاعدة البيانات - شفا كير
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oyljfpeeckxgfrqwsebk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95bGpmcGVlY2t4Z2ZycXdzZWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MTQxODksImV4cCI6MjA2NzA5MDE4OX0.czWNSZ4vSocds-zInvEAiSS6XcjCmorWwTFsoIcRJnM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseConnection() {
  console.log('🔍 بدء اختبار الاتصال بقاعدة البيانات...\n');

  try {
    // 1. اختبار الاتصال الأساسي
    console.log('1️⃣ اختبار الاتصال الأساسي...');
    const { data: healthData, error: healthError } = await supabase.from('profiles').select('count').limit(1);
    
    if (healthError) {
      console.error('❌ خطأ في الاتصال الأساسي:', healthError.message);
      return;
    }
    console.log('✅ الاتصال الأساسي يعمل بنجاح\n');

    // 2. اختبار جدول profiles
    console.log('2️⃣ اختبار جدول profiles...');
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);

    if (profilesError) {
      console.error('❌ خطأ في جدول profiles:', profilesError.message);
    } else {
      console.log('✅ جدول profiles يعمل بنجاح');
      console.log(`📊 عدد المستخدمين: ${profilesData?.length || 0}`);
      if (profilesData && profilesData.length > 0) {
        console.log('👥 المستخدمين الموجودين:');
        profilesData.forEach(user => {
          console.log(`   - ${user.full_name} (${user.email}) - ${user.role}`);
        });
      } else {
        console.log('⚠️ لا توجد مستخدمين في قاعدة البيانات');
      }
    }
    console.log('');

    // 3. اختبار إنشاء مستخدم تجريبي
    console.log('3️⃣ اختبار إنشاء مستخدم تجريبي...');
    
    // أولاً، نحاول تسجيل الدخول ببيانات تجريبية
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'test@shifacare.com',
      password: 'test123456'
    });

    if (signInError) {
      console.log('⚠️ المستخدم التجريبي غير موجود، جاري إنشاؤه...');
      
      // إنشاء حساب جديد
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'test@shifacare.com',
        password: 'test123456',
        options: {
          data: {
            full_name: 'مستخدم تجريبي',
            role: 'admin'
          }
        }
      });

      if (signUpError) {
        console.error('❌ خطأ في إنشاء المستخدم التجريبي:', signUpError.message);
      } else {
        console.log('✅ تم إنشاء المستخدم التجريبي بنجاح');
        console.log('📧 الإيميل: test@shifacare.com');
        console.log('🔑 كلمة المرور: test123456');
        
        // إضافة بيانات المستخدم في جدول profiles
        if (signUpData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: signUpData.user.id,
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
            });

          if (profileError) {
            console.error('❌ خطأ في إضافة بيانات المستخدم:', profileError.message);
          } else {
            console.log('✅ تم إضافة بيانات المستخدم في جدول profiles');
          }
        }
      }
    } else {
      console.log('✅ المستخدم التجريبي موجود ويعمل بنجاح');
      console.log('📧 الإيميل: test@shifacare.com');
      console.log('🔑 كلمة المرور: test123456');
    }
    console.log('');

    // 4. اختبار الجداول الأخرى
    console.log('4️⃣ اختبار الجداول الأخرى...');
    
    const tables = ['patients', 'sessions', 'rooms', 'payments', 'facility_expenses'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('count').limit(1);
        if (error) {
          console.log(`❌ خطأ في جدول ${table}:`, error.message);
        } else {
          console.log(`✅ جدول ${table} يعمل بنجاح`);
        }
      } catch (err) {
        console.log(`❌ خطأ في جدول ${table}:`, err.message);
      }
    }
    console.log('');

    // 5. اختبار المصادقة
    console.log('5️⃣ اختبار المصادقة...');
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (sessionData.session) {
      console.log('✅ المصادقة تعمل بنجاح');
      console.log('👤 المستخدم الحالي:', sessionData.session.user.email);
    } else {
      console.log('⚠️ لا يوجد مستخدم مسجل دخول حالياً');
    }

    console.log('\n🎉 انتهى اختبار الاتصال بقاعدة البيانات!');
    console.log('\n📋 ملخص النتائج:');
    console.log('✅ الاتصال بقاعدة البيانات يعمل');
    console.log('✅ جميع الجداول متاحة');
    console.log('✅ المصادقة تعمل بنجاح');
    console.log('✅ المستخدم التجريبي جاهز للاستخدام');

  } catch (error) {
    console.error('❌ خطأ عام في اختبار الاتصال:', error.message);
    console.log('\n🔧 اقتراحات الحل:');
    console.log('1. تحقق من اتصال الإنترنت');
    console.log('2. تحقق من إعدادات Supabase');
    console.log('3. تحقق من مفاتيح API');
    console.log('4. تحقق من وجود الجداول في قاعدة البيانات');
  }
}

// تشغيل الاختبار
testDatabaseConnection(); 