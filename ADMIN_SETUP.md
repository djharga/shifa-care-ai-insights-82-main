# دليل إعداد الإدارة - شفاء كير

## 👨‍💼 إعداد نظام الإدارة

### المتطلبات
- حساب Supabase
- مفتاح OpenAI API
- معرفة أساسية بـ SQL
- معرفة بـ React

## 🗄️ إعداد قاعدة البيانات

### 1. إنشاء مشروع Supabase
```bash
# تثبيت Supabase CLI
npm install -g supabase

# تسجيل الدخول
supabase login

# إنشاء مشروع جديد
supabase init
```

### 2. تشغيل الهجرات
```sql
-- تشغيل ملف الهجرات الكامل
-- انسخ محتوى supabase/migrations/complete-system.sql
-- والصقه في SQL Editor في Supabase Dashboard
```

### 3. إعداد RLS (Row Level Security)
```sql
-- تفعيل RLS على الجداول
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE center_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE center_goals ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات الأمان
CREATE POLICY "Users can view their own sessions" ON sessions
  FOR SELECT USING (auth.uid() = therapist_id);

CREATE POLICY "Users can insert their own sessions" ON sessions
  FOR INSERT WITH CHECK (auth.uid() = therapist_id);

CREATE POLICY "Users can update their own sessions" ON sessions
  FOR UPDATE USING (auth.uid() = therapist_id);
```

## 🔐 إعداد المصادقة

### 1. إعداد Supabase Auth
```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
```

### 2. إنشاء مستخدمي الإدارة
```sql
-- إنشاء مستخدم إدارة
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role
) VALUES (
  gen_random_uuid(),
  'admin@shifa-care.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  'admin'
);
```

### 3. إعداد الأدوار
```sql
-- إنشاء جدول الأدوار
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إضافة أدوار افتراضية
INSERT INTO user_roles (user_id, role) VALUES
  ('admin-user-id', 'admin'),
  ('therapist-user-id', 'therapist'),
  ('supervisor-user-id', 'supervisor');
```

## 🤖 إعداد الذكاء الاصطناعي

### 1. الحصول على مفتاح OpenAI
```bash
# اذهب إلى platform.openai.com
# أنشئ حساب جديد
# اذهب إلى API Keys
# أنشئ مفتاح جديد
# انسخ المفتاح
```

### 2. إعداد خدمة الذكاء الاصطناعي
```typescript
// src/services/session-ai-service.ts
export class SessionAIService {
  private openaiApiKey: string;

  constructor() {
    this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!this.openaiApiKey) {
      console.warn('OpenAI API key not found');
    }
  }
}
```

### 3. اختبار الاتصال
```typescript
// اختبار الاتصال بـ OpenAI
const testConnection = async () => {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`
      }
    });
    
    if (response.ok) {
      console.log('OpenAI connection successful');
    }
  } catch (error) {
    console.error('OpenAI connection failed:', error);
  }
};
```

## 📊 إعداد التقارير

### 1. إنشاء جداول التقارير
```sql
-- جدول التقارير
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  report_type VARCHAR(50) NOT NULL,
  data JSONB,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول إعدادات التقارير
CREATE TABLE report_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type VARCHAR(50) NOT NULL,
  settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. إنشاء وظائف التقارير
```sql
-- وظيفة لتوليد تقرير الجلسات
CREATE OR REPLACE FUNCTION generate_sessions_report(
  start_date DATE,
  end_date DATE
) RETURNS JSONB AS $$
BEGIN
  RETURN (
    SELECT jsonb_build_object(
      'total_sessions', COUNT(*),
      'completed_sessions', COUNT(*) FILTER (WHERE status = 'completed'),
      'avg_progress', AVG(current_progress),
      'sessions_by_type', jsonb_object_agg(session_type, count)
    )
    FROM sessions
    WHERE session_date BETWEEN start_date AND end_date
  );
END;
$$ LANGUAGE plpgsql;
```

## 🔧 إعدادات النظام

### 1. إعدادات التطبيق
```typescript
// src/config/app-config.ts
export const appConfig = {
  name: 'شفاء كير',
  version: '1.0.0',
  environment: import.meta.env.VITE_APP_ENVIRONMENT,
  features: {
    ai: import.meta.env.VITE_ENABLE_AI_FEATURES === 'true',
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    notifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true'
  },
  limits: {
    maxSessionsPerDay: 50,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxSessionDuration: 180 // 3 hours
  }
};
```

### 2. إعدادات الأمان
```typescript
// src/config/security-config.ts
export const securityConfig = {
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  maxLoginAttempts: 5,
  passwordMinLength: 8,
  requireTwoFactor: false,
  allowedFileTypes: ['pdf', 'doc', 'docx', 'txt'],
  maxFileUploads: 10
};
```

## 📱 إعداد الإشعارات

### 1. إعداد Service Worker
```javascript
// public/sw.js
self.addEventListener('push', function(event) {
  const options = {
    body: event.data.text(),
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('شفاء كير', options)
  );
});
```

### 2. إعداد الإشعارات في التطبيق
```typescript
// src/services/notification-service.ts
export class NotificationService {
  async requestPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  async sendNotification(title: string, body: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }
}
```

## 🔍 المراقبة والتحليل

### 1. إعداد Analytics
```typescript
// src/services/analytics-service.ts
export class AnalyticsService {
  trackEvent(eventName: string, data: any) {
    if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
      // إرسال البيانات إلى خدمة التحليل
      console.log('Analytics event:', eventName, data);
    }
  }

  trackError(error: Error) {
    this.trackEvent('error', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
}
```

### 2. إعداد Logging
```typescript
// src/services/logging-service.ts
export class LoggingService {
  log(level: 'info' | 'warn' | 'error', message: string, data?: any) {
    const logEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };

    if (import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true') {
      console.log(logEntry);
    }

    // إرسال إلى خدمة Logging
    this.sendToLoggingService(logEntry);
  }
}
```

## 🚀 النشر والإنتاج

### 1. إعدادات الإنتاج
```env
# .env.production
VITE_APP_ENVIRONMENT=production
VITE_ENABLE_DEBUG_MODE=false
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
```

### 2. إعدادات الأمان للإنتاج
```typescript
// src/config/production-config.ts
export const productionConfig = {
  cors: {
    origin: ['https://your-domain.com'],
    credentials: true
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"]
      }
    }
  }
};
```

## 📋 قائمة التحقق

### قبل النشر
- [ ] قاعدة البيانات مهيأة
- [ ] المصادقة تعمل
- [ ] الذكاء الاصطناعي متصل
- [ ] التقارير تعمل
- [ ] الإشعارات تعمل
- [ ] الأمان مفعل
- [ ] الاختبارات تمر
- [ ] الوثائق محدثة

### بعد النشر
- [ ] الموقع يعمل
- [ ] تسجيل الدخول يعمل
- [ ] الجلسات تحفظ
- [ ] الذكاء الاصطناعي يعمل
- [ ] التقارير تولد
- [ ] الإشعارات تصل
- [ ] الأداء جيد
- [ ] الأمان محقق

## 📞 الدعم

### في حالة المشاكل
1. راجع سجلات الأخطاء
2. تحقق من إعدادات قاعدة البيانات
3. تحقق من مفاتيح API
4. تواصل مع فريق الدعم

### الموارد
- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [React Documentation](https://react.dev)

---

**شفاء كير** - إدارة متقدمة وآمنة 👨‍💼🔐 