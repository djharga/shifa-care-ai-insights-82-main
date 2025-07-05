# دليل الاختبار - شفاء كير

## 🧪 اختبار شامل للنظام

### أنواع الاختبارات

#### 1. اختبارات الوحدة (Unit Tests)
```typescript
// tests/services/session-ai-service.test.ts
import { SessionAIService } from '@/services/session-ai-service';

describe('SessionAIService', () => {
  let service: SessionAIService;

  beforeEach(() => {
    service = new SessionAIService();
  });

  it('يجب أن يعالج الجلسة بشكل صحيح', async () => {
    const mockNotes = 'المريض يبدو متوتراً اليوم';
    const result = await service.processSessionNotes(mockNotes);
    
    expect(result).toBeDefined();
    expect(result.processedNotes).toBeTruthy();
    expect(result.emotions).toBeDefined();
  });

  it('يجب أن يقترح أهداف علاجية', async () => {
    const mockSession = {
      raw_notes: 'ملاحظات تجريبية',
      emotions: { primary_emotion: 'قلق' }
    } as any;

    const goals = await service.suggestTreatmentGoals(mockSession, {});
    
    expect(goals).toBeInstanceOf(Array);
    expect(goals.length).toBeGreaterThan(0);
  });
});
```

#### 2. اختبارات التكامل (Integration Tests)
```typescript
// tests/integration/supabase-service.test.ts
import { SupabaseService } from '@/services/supabase-service';

describe('SupabaseService Integration', () => {
  let service: SupabaseService;

  beforeEach(() => {
    service = new SupabaseService();
  });

  it('يجب أن ينشئ جلسة جديدة', async () => {
    const sessionData = {
      patient_id: 'test-patient',
      therapist_id: 'test-therapist',
      session_date: '2025-07-05',
      session_time: '10:00:00',
      duration: 60,
      session_type: 'individual',
      status: 'completed',
      raw_notes: 'ملاحظات تجريبية',
      ai_processed_notes: 'ملاحظات معالجة',
      session_summary: 'ملخص الجلسة',
      emotions: { primary_emotion: 'أمل' },
      treatment_goals: [],
      current_progress: 0,
      next_session_plan: 'خطة الجلسة القادمة',
      therapist_assessment: {
        patient_cooperation: 7,
        session_effectiveness: 8,
        challenges_faced: [],
        positive_developments: []
      },
      center_goals: [],
      activities_planned: []
    };

    const result = await service.createSession(sessionData);
    
    expect(result).toBeDefined();
    expect(result.id).toBeTruthy();
    expect(result.patient_id).toBe(sessionData.patient_id);
  });
});
```

#### 3. اختبارات المكونات (Component Tests)
```typescript
// tests/components/AdvancedSessions.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdvancedSessions from '@/pages/AdvancedSessions';

describe('AdvancedSessions Component', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  it('يجب أن يعرض النموذج بشكل صحيح', () => {
    renderWithRouter(<AdvancedSessions />);
    
    expect(screen.getByText('الجلسات العلاجية المتقدمة')).toBeInTheDocument();
    expect(screen.getByLabelText('رقم المريض')).toBeInTheDocument();
    expect(screen.getByLabelText('ملاحظات الجلسة')).toBeInTheDocument();
  });

  it('يجب أن يعالج الجلسة عند الضغط على الزر', async () => {
    renderWithRouter(<AdvancedSessions />);
    
    const notesInput = screen.getByLabelText('ملاحظات الجلسة');
    const processButton = screen.getByText('معالجة الجلسة بالذكاء الاصطناعي');
    
    fireEvent.change(notesInput, {
      target: { value: 'ملاحظات تجريبية للاختبار' }
    });
    
    fireEvent.click(processButton);
    
    await waitFor(() => {
      expect(screen.getByText('جاري المعالجة بالذكاء الاصطناعي...')).toBeInTheDocument();
    });
  });
});
```

#### 4. اختبارات النهاية (End-to-End Tests)
```typescript
// tests/e2e/session-flow.test.ts
import { test, expect } from '@playwright/test';

test('تدفق إنشاء جلسة كامل', async ({ page }) => {
  // الانتقال إلى صفحة الجلسات المتقدمة
  await page.goto('/advanced-sessions');
  
  // ملء النموذج
  await page.fill('[data-testid="patient-id"]', 'test-patient-123');
  await page.selectOption('[data-testid="session-type"]', 'individual');
  await page.fill('[data-testid="session-notes"]', 'ملاحظات تجريبية للاختبار');
  
  // معالجة الجلسة
  await page.click('[data-testid="process-session"]');
  
  // انتظار المعالجة
  await page.waitForSelector('[data-testid="ai-insights"]');
  
  // التحقق من النتائج
  await expect(page.locator('[data-testid="processed-notes"]')).toBeVisible();
  await expect(page.locator('[data-testid="emotions-analysis"]')).toBeVisible();
  
  // حفظ الجلسة
  await page.click('[data-testid="save-session"]');
  
  // التحقق من الحفظ
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
});
```

## 🛠️ إعداد بيئة الاختبار

### 1. تثبيت أدوات الاختبار
```bash
# تثبيت Jest و React Testing Library
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event

# تثبيت Playwright للاختبارات E2E
npm install --save-dev @playwright/test

# تثبيت MSW للاختبارات
npm install --save-dev msw
```

### 2. إعداد Jest
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### 3. إعداد Playwright
```javascript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## 📊 اختبارات الأداء

### 1. اختبار سرعة التحميل
```typescript
// tests/performance/load-time.test.ts
import { test, expect } from '@playwright/test';

test('سرعة تحميل الصفحة الرئيسية', async ({ page }) => {
  const startTime = Date.now();
  
  await page.goto('/');
  
  const loadTime = Date.now() - startTime;
  
  // يجب أن يتحمل في أقل من 3 ثوان
  expect(loadTime).toBeLessThan(3000);
});

test('سرعة معالجة الجلسة', async ({ page }) => {
  await page.goto('/advanced-sessions');
  
  await page.fill('[data-testid="session-notes"]', 'ملاحظات تجريبية');
  await page.click('[data-testid="process-session"]');
  
  const startTime = Date.now();
  
  await page.waitForSelector('[data-testid="ai-insights"]');
  
  const processTime = Date.now() - startTime;
  
  // يجب أن تتم المعالجة في أقل من 10 ثوان
  expect(processTime).toBeLessThan(10000);
});
```

### 2. اختبار استهلاك الذاكرة
```typescript
// tests/performance/memory.test.ts
test('استهلاك الذاكرة', async ({ page }) => {
  const initialMemory = await page.evaluate(() => {
    return (performance as any).memory?.usedJSHeapSize || 0;
  });
  
  // تنفيذ عمليات متعددة
  for (let i = 0; i < 10; i++) {
    await page.goto('/advanced-sessions');
    await page.fill('[data-testid="session-notes"]', `ملاحظات ${i}`);
    await page.click('[data-testid="process-session"]');
    await page.waitForSelector('[data-testid="ai-insights"]');
  }
  
  const finalMemory = await page.evaluate(() => {
    return (performance as any).memory?.usedJSHeapSize || 0;
  });
  
  const memoryIncrease = finalMemory - initialMemory;
  
  // يجب ألا يزيد استهلاك الذاكرة عن 50MB
  expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
});
```

## 🔒 اختبارات الأمان

### 1. اختبار المصادقة
```typescript
// tests/security/auth.test.ts
test('حماية الصفحات المحمية', async ({ page }) => {
  // محاولة الوصول لصفحة محمية بدون تسجيل دخول
  await page.goto('/advanced-sessions');
  
  // يجب أن يتم التوجيه لصفحة تسجيل الدخول
  await expect(page).toHaveURL(/.*auth.*/);
});

test('حماية API endpoints', async ({ request }) => {
  // محاولة الوصول لـ API بدون مصادقة
  const response = await request.post('/api/sessions', {
    data: { raw_notes: 'test' }
  });
  
  expect(response.status()).toBe(401);
});
```

### 2. اختبار XSS
```typescript
// tests/security/xss.test.ts
test('حماية من XSS', async ({ page }) => {
  await page.goto('/advanced-sessions');
  
  const maliciousInput = '<script>alert("XSS")</script>';
  
  await page.fill('[data-testid="session-notes"]', maliciousInput);
  await page.click('[data-testid="process-session"]');
  
  await page.waitForSelector('[data-testid="processed-notes"]');
  
  const processedContent = await page.textContent('[data-testid="processed-notes"]');
  
  // يجب ألا يحتوي على script tags
  expect(processedContent).not.toContain('<script>');
});
```

## 🌐 اختبارات التوافق

### 1. اختبار المتصفحات
```typescript
// tests/compatibility/browsers.test.ts
import { test, expect } from '@playwright/test';

test.describe('توافق المتصفحات', () => {
  test('Chrome', async ({ page }) => {
    await testCompatibility(page);
  });
  
  test('Firefox', async ({ page }) => {
    await testCompatibility(page);
  });
  
  test('Safari', async ({ page }) => {
    await testCompatibility(page);
  });
  
  test('Edge', async ({ page }) => {
    await testCompatibility(page);
  });
});

async function testCompatibility(page: any) {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('شفاء كير');
  
  await page.goto('/advanced-sessions');
  await expect(page.locator('h1')).toContainText('الجلسات العلاجية المتقدمة');
}
```

### 2. اختبار الأجهزة المحمولة
```typescript
// tests/compatibility/mobile.test.ts
test('الأجهزة المحمولة', async ({ page }) => {
  // محاكاة جهاز محمول
  await page.setViewportSize({ width: 375, height: 667 });
  
  await page.goto('/advanced-sessions');
  
  // التحقق من أن النموذج يعمل على الشاشة الصغيرة
  await expect(page.locator('[data-testid="session-form"]')).toBeVisible();
  
  // التحقق من أن الأزرار قابلة للضغط
  await expect(page.locator('[data-testid="process-session"]')).toBeVisible();
});
```

## 📱 اختبارات PWA

### 1. اختبار Service Worker
```typescript
// tests/pwa/service-worker.test.ts
test('Service Worker', async ({ page }) => {
  await page.goto('/');
  
  // التحقق من تسجيل Service Worker
  const swRegistered = await page.evaluate(() => {
    return 'serviceWorker' in navigator;
  });
  
  expect(swRegistered).toBe(true);
  
  // التحقق من التخزين المؤقت
  const cached = await page.evaluate(() => {
    return caches.keys();
  });
  
  expect(cached.length).toBeGreaterThan(0);
});
```

### 2. اختبار العمل بدون إنترنت
```typescript
// tests/pwa/offline.test.ts
test('العمل بدون إنترنت', async ({ page }) => {
  await page.goto('/');
  
  // قطع الاتصال
  await page.route('**/*', route => route.abort());
  
  // محاولة الوصول للصفحة
  await page.reload();
  
  // يجب أن تظهر رسالة "لا يوجد اتصال"
  await expect(page.locator('[data-testid="offline-message"]')).toBeVisible();
});
```

## 🚀 تشغيل الاختبارات

### 1. تشغيل جميع الاختبارات
```bash
# اختبارات الوحدة والتكامل
npm test

# اختبارات E2E
npm run test:e2e

# اختبارات الأداء
npm run test:performance

# اختبارات الأمان
npm run test:security

# جميع الاختبارات
npm run test:all
```

### 2. تشغيل الاختبارات مع التغطية
```bash
npm run test:coverage
```

### 3. تشغيل الاختبارات في وضع المراقبة
```bash
npm run test:watch
```

## 📊 تقارير الاختبارات

### 1. تقرير التغطية
```bash
# إنشاء تقرير HTML للتغطية
npm run test:coverage:html

# فتح التقرير
open coverage/lcov-report/index.html
```

### 2. تقرير الأداء
```bash
# إنشاء تقرير الأداء
npm run test:performance:report

# فتح التقرير
open performance-report.html
```

### 3. تقرير الأمان
```bash
# فحص الأمان
npm run test:security:audit

# إنشاء تقرير
npm run test:security:report
```

## 🔧 إعدادات CI/CD

### 1. GitHub Actions
```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '14'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run unit tests
      run: npm test
      
    - name: Run E2E tests
      run: npm run test:e2e
      
    - name: Upload coverage
      uses: codecov/codecov-action@v3
```

### 2. Vercel
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "testCommand": "npm run test:all",
  "outputDirectory": "dist"
}
```

## 📋 قائمة التحقق

### قبل النشر
- [ ] جميع اختبارات الوحدة تمر
- [ ] جميع اختبارات التكامل تمر
- [ ] جميع اختبارات E2E تمر
- [ ] اختبارات الأداء مقبولة
- [ ] اختبارات الأمان مقبولة
- [ ] التغطية أكثر من 80%
- [ ] لا توجد أخطاء أمنية
- [ ] الأداء مقبول

### بعد النشر
- [ ] اختبارات الإنتاج تمر
- [ ] الأداء في الإنتاج مقبول
- [ ] لا توجد أخطاء في السجلات
- [ ] المستخدمون لا يبلغون عن مشاكل

---

**شفاء كير** - اختبار شامل وموثوق 🧪✅ 