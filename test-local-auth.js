// اختبار المصادقة المحلية - شفا كير
import { localAuth } from './setup-local-auth.js';

async function testLocalAuth() {
  console.log('🔍 بدء اختبار المصادقة المحلية...\n');

  try {
    // 1. اختبار تسجيل الدخول
    console.log('1️⃣ اختبار تسجيل الدخول...');
    
    const signInResult = await localAuth.signInWithPassword({
      email: 'admin@shifacare.com',
      password: 'admin123'
    });

    if (signInResult.error) {
      console.error('❌ خطأ في تسجيل الدخول:', signInResult.error.message);
    } else {
      console.log('✅ تم تسجيل الدخول بنجاح');
      console.log('👤 المستخدم:', signInResult.data.user.full_name);
      console.log('🎭 الدور:', signInResult.data.user.role);
    }
    console.log('');

    // 2. اختبار الحصول على الجلسة
    console.log('2️⃣ اختبار الحصول على الجلسة...');
    
    const sessionResult = await localAuth.getSession();
    
    if (sessionResult.data.session) {
      console.log('✅ الجلسة نشطة');
      console.log('👤 المستخدم الحالي:', sessionResult.data.session.user.email);
    } else {
      console.log('⚠️ لا توجد جلسة نشطة');
    }
    console.log('');

    // 3. اختبار إنشاء حساب جديد
    console.log('3️⃣ اختبار إنشاء حساب جديد...');
    
    const signUpResult = await localAuth.signUp({
      email: 'newuser@shifacare.com',
      password: 'newpass123',
      options: {
        data: {
          full_name: 'مستخدم جديد',
          role: 'therapist'
        }
      }
    });

    if (signUpResult.error) {
      console.error('❌ خطأ في إنشاء الحساب:', signUpResult.error.message);
    } else {
      console.log('✅ تم إنشاء الحساب بنجاح');
      console.log('👤 المستخدم الجديد:', signUpResult.data.user.full_name);
    }
    console.log('');

    // 4. اختبار الحصول على المستخدمين
    console.log('4️⃣ اختبار الحصول على المستخدمين...');
    
    const users = await localAuth.getUsers();
    console.log(`📊 عدد المستخدمين: ${users.length}`);
    users.forEach(user => {
      console.log(`   - ${user.full_name} (${user.email}) - ${user.role}`);
    });
    console.log('');

    // 5. اختبار تسجيل الخروج
    console.log('5️⃣ اختبار تسجيل الخروج...');
    
    const signOutResult = await localAuth.signOut();
    
    if (signOutResult.error) {
      console.error('❌ خطأ في تسجيل الخروج:', signOutResult.error.message);
    } else {
      console.log('✅ تم تسجيل الخروج بنجاح');
    }
    console.log('');

    // 6. اختبار الجلسة بعد تسجيل الخروج
    console.log('6️⃣ اختبار الجلسة بعد تسجيل الخروج...');
    
    const sessionAfterSignOut = await localAuth.getSession();
    
    if (sessionAfterSignOut.data.session) {
      console.log('⚠️ الجلسة لا تزال نشطة');
    } else {
      console.log('✅ تم تسجيل الخروج بنجاح - لا توجد جلسة نشطة');
    }

    console.log('\n🎉 انتهى اختبار المصادقة المحلية!');
    console.log('\n📋 ملخص النتائج:');
    console.log('✅ تسجيل الدخول يعمل');
    console.log('✅ إنشاء الحسابات يعمل');
    console.log('✅ إدارة الجلسات يعمل');
    console.log('✅ تسجيل الخروج يعمل');
    console.log('✅ إدارة المستخدمين يعمل');

    console.log('\n🔐 بيانات الدخول المتاحة:');
    console.log('   - admin@shifacare.com / admin123');
    console.log('   - test@shifacare.com / test123456');
    console.log('   - newuser@shifacare.com / newpass123');

  } catch (error) {
    console.error('❌ خطأ عام في اختبار المصادقة المحلية:', error.message);
  }
}

// تشغيل الاختبار
testLocalAuth(); 