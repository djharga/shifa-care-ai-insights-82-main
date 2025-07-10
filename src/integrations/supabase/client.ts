// =====================================================
// شفاء كير - إعداد عميل Supabase
// تاريخ التحديث: 2025-07-05
// متوافق مع Node.js 22+ فقط
// =====================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// =====================================================
// وظائف مساعدة للتعامل مع قاعدة البيانات
// =====================================================

/**
 * التحقق من صحة الاتصال بقاعدة البيانات
 */
export const checkDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('خطأ في الاتصال بقاعدة البيانات:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true, data }
  } catch (error) {
    console.error('خطأ غير متوقع:', error)
    return { success: false, error: 'خطأ في الاتصال بقاعدة البيانات' }
  }
}

/**
 * الحصول على إحصائيات قاعدة البيانات
 */
export const getDatabaseStats = async () => {
  try {
    const [profiles, patients, sessions, rooms, expenses] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact' }),
      supabase.from('patients').select('*', { count: 'exact' }),
      supabase.from('sessions').select('*', { count: 'exact' }),
      supabase.from('rooms').select('*', { count: 'exact' }),
      supabase.from('facility_expenses').select('*', { count: 'exact' })
    ])

    return {
      success: true,
      stats: {
        profiles: profiles.count || 0,
        patients: patients.count || 0,
        sessions: sessions.count || 0,
        rooms: rooms.count || 0,
        expenses: expenses.count || 0
      }
    }
  } catch (error) {
    console.error('خطأ في الحصول على الإحصائيات:', error)
    return { success: false, error: 'خطأ في الحصول على الإحصائيات' }
  }
}

/**
 * تنظيف البيانات المؤقتة
 */
export const clearCache = () => {
  // يمكن إضافة منطق تنظيف الكاش هنا
  console.log('تم تنظيف الكاش')
}

/**
 * إعادة الاتصال بقاعدة البيانات
 */
export const reconnectDatabase = async () => {
  try {
    await supabase.auth.refreshSession()
    const connection = await checkDatabaseConnection()
    return connection
  } catch (error) {
    console.error('خطأ في إعادة الاتصال:', error)
    return { success: false, error: 'خطأ في إعادة الاتصال' }
  }
}

// =====================================================
// أنواع TypeScript
// =====================================================

export interface DatabaseStats {
  profiles: number
  patients: number
  sessions: number
  rooms: number
  expenses: number
}

export interface ConnectionResult {
  success: boolean
  error?: string
  data?: any
}

// =====================================================
// تصدير الكائن الرئيسي
// =====================================================

console.log('🔐 نظام المصادقة أونلاين جاهز!');
console.log('📧 يمكنك التسجيل أو الدخول عبر Supabase');
console.log('🌐 متوافق مع Node.js 22+');