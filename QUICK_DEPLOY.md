# 🚀 نشر سريع على Vercel

## خطوات سريعة:

### 1. رفع الكود
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. النشر على Vercel
1. اذهب إلى [vercel.com](https://vercel.com)
2. اضغط "New Project"
3. اختر المستودع
4. أضف المتغيرات البيئية:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_OPENAI_API_KEY=sk-proj-your-key
   ```
5. اضغط "Deploy"

### 3. إعداد قاعدة البيانات
1. اذهب إلى Supabase SQL Editor
2. انسخ محتوى `supabase/migrations/20250703040323-complete-system.sql`
3. نفذ الكود

### 4. جاهز! 🎉
رابط التطبيق: `https://your-project.vercel.app`

## 📞 للمساعدة
راجع `DEPLOY.md` للتفاصيل الكاملة 