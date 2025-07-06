// ملف اختبار مبسط لقاعدة البيانات
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

async function quickTest() {
  console.log('🔍 فحص سريع لقاعدة البيانات...\n');
  
  const tables = ['profiles', 'patients', 'rooms', 'beds', 'facility_expenses', 'sessions'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(5);
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: ${data.length} سجل`);
        if (data.length > 0) {
          console.log(`   مثال: ${JSON.stringify(data[0], null, 2).substring(0, 100)}...`);
        }
      }
    } catch (err) {
      console.log(`❌ ${table}: خطأ في الاتصال`);
    }
  }
  
  console.log('\n📊 ملخص سريع:');
  console.log('='.repeat(40));
  
  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table}: خطأ`);
      } else {
        console.log(`✅ ${table}: ${count} سجل`);
      }
    } catch (err) {
      console.log(`❌ ${table}: خطأ في الاتصال`);
    }
  }
}

quickTest(); 