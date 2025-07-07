import { config } from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

config();

const apiKey = process.env.VITE_GOOGLE_AI_API_KEY;

if (!apiKey) {
  console.error('❌ مفتاح Google AI API غير موجود في ملف .env');
  console.log('   أضف VITE_GOOGLE_AI_API_KEY في ملف .env');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testGoogleAI() {
  try {
    console.log('🤖 اختبار Google AI...');
    
    // استخدام نموذج Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = "أهلاً! أنت معالج نفسي مصري متخصص في علاج الإدمان. اكتب جملة واحدة باللهجة المصرية فقط.";
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ رد Google AI:');
    console.log(text);
    console.log('\n🎉 اختبار Google AI نجح!');
    
  } catch (error) {
    console.error('❌ حصل خطأ في الاتصال بـ Google AI:', error.message);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('   تأكد من صحة مفتاح API');
    } else if (error.message.includes('QUOTA_EXCEEDED')) {
      console.log('   تم تجاوز الحد المسموح للاستخدام');
    } else if (error.message.includes('MODEL_NOT_FOUND')) {
      console.log('   النموذج غير موجود أو غير متاح');
    }
  }
}

testGoogleAI(); 