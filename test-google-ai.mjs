import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.VITE_GOOGLE_AI_API_KEY;

if (!apiKey) {
  console.error('❌ مفتاح Google AI API غير موجود في ملف .env');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

try {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      maxOutputTokens: 1000,
      temperature: 0.7,
    },
  });

  const prompt = `أنت مساعد ذكي متخصص في علاج الإدمان. 
  اكتب اقتراح واحد مفيد لنظام متابعة المقيمين في مركز علاج الإدمان.
  اكتب باللهجة المصرية فقط.`;

  console.log('🔄 جاري اختبار Google AI...');
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  console.log('✅ رد Google AI:');
  console.log(text);
  
} catch (error) {
  console.error('❌ حصل خطأ في الاتصال بـ Google AI:');
  console.error(error);
} 