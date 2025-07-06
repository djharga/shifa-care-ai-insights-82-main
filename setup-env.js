#!/usr/bin/env node

/**
 * سكريبت إعداد المتغيرات البيئية لشفاء كير
 * يساعد في إعداد ملف .env.local بسهولة
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🏥 شفاء كير - إعداد المتغيرات البيئية');
console.log('=====================================\n');

const questions = [
  {
    name: 'supabaseUrl',
    question: '🔗 أدخل Supabase URL (مثال: https://abcdefghijklmnop.supabase.co): ',
    required: true
  },
  {
    name: 'supabaseAnonKey',
    question: '🔑 أدخل Supabase Anon Key (مفتاح anon public): ',
    required: true
  },
  {
    name: 'googleAiApiKey',
    question: '🤖 أدخل Google AI API Key: ',
    required: true
  },
  {
    name: 'appName',
    question: '📱 اسم التطبيق (افتراضي: شفاء كير): ',
    required: false,
    default: 'شفاء كير'
  },
  {
    name: 'appVersion',
    question: '📦 إصدار التطبيق (افتراضي: 2025.1.0): ',
    required: false,
    default: '2025.1.0'
  }
];

const answers = {};

function askQuestion(index) {
  if (index >= questions.length) {
    createEnvFile();
    return;
  }

  const question = questions[index];
  rl.question(question.question, (answer) => {
    if (question.required && !answer.trim()) {
      console.log('❌ هذا الحقل مطلوب!');
      askQuestion(index);
      return;
    }

    answers[question.name] = answer.trim() || question.default;
    askQuestion(index + 1);
  });
}

function createEnvFile() {
  const envContent = `# 🌐 شفاء كير - متغيرات البيئة
# تم إنشاؤه بواسطة setup-env.js

# Supabase Configuration
VITE_SUPABASE_URL=${answers.supabaseUrl}
VITE_SUPABASE_ANON_KEY=${answers.supabaseAnonKey}

# Google AI Configuration
VITE_GOOGLE_AI_API_KEY=${answers.googleAiApiKey}

# Application Configuration
VITE_APP_NAME=${answers.appName}
VITE_APP_VERSION=${answers.appVersion}
VITE_APP_DESCRIPTION=نظام إدارة مراكز علاج الإدمان مع الذكاء الاصطناعي

# Development Configuration
NODE_ENV=development
VITE_DEV_MODE=true

# تم إنشاؤه في: ${new Date().toLocaleString('ar-SA')}
`;

  const envPath = path.join(process.cwd(), '.env.local');
  
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ تم إنشاء ملف .env.local بنجاح!');
    console.log(`📁 المسار: ${envPath}`);
    
    console.log('\n📋 ملخص الإعدادات:');
    console.log(`   Supabase URL: ${answers.supabaseUrl}`);
    console.log(`   Supabase Key: ${answers.supabaseAnonKey.substring(0, 20)}...`);
    console.log(`   Google AI Key: ${answers.googleAiApiKey.substring(0, 20)}...`);
    console.log(`   App Name: ${answers.appName}`);
    console.log(`   App Version: ${answers.appVersion}`);
    
    console.log('\n🚀 الخطوات التالية:');
    console.log('1. تأكد من أن ملف .env.local موجود في .gitignore');
    console.log('2. شغل: npm run dev');
    console.log('3. للنشر على Vercel، أضف هذه المتغيرات في Environment Variables');
    
    console.log('\n📖 للمزيد من المعلومات:');
    console.log('   - راجع ملف VERCEL_DEPLOYMENT_GUIDE.md');
    console.log('   - راجع ملف README_ENHANCED.md');
    
  } catch (error) {
    console.error('❌ خطأ في إنشاء الملف:', error.message);
  }
  
  rl.close();
}

// التحقق من وجود ملف .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  rl.question('⚠️  ملف .env.local موجود بالفعل. هل تريد استبداله؟ (y/N): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      console.log('🔄 بدء الإعداد من جديد...\n');
      askQuestion(0);
    } else {
      console.log('❌ تم إلغاء العملية.');
      rl.close();
    }
  });
} else {
  askQuestion(0);
}

// معالجة الإغلاق
rl.on('close', () => {
  console.log('\n👋 شكراً لاستخدام سكريبت إعداد شفاء كير!');
  process.exit(0);
}); 