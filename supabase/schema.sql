-- =====================================================
-- شفاء كير - نظام إدارة مراكز علاج الإدمان
-- قاعدة البيانات الموحدة - إصدار 2025.1.0
-- =====================================================

-- =====================================================
-- 1. جداول المستخدمين والموظفين
-- =====================================================

-- جدول الملفات الشخصية (الموظفين والمعالجين)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('admin', 'supervisor', 'therapist', 'accountant')) DEFAULT 'therapist',
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول المرضى
CREATE TABLE IF NOT EXISTS patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female')) NOT NULL,
  addiction_type TEXT NOT NULL,
  admission_date DATE NOT NULL,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. جداول الإقامة والغرف
-- =====================================================

-- جدول الغرف
CREATE TABLE IF NOT EXISTS rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_number TEXT UNIQUE NOT NULL,
  room_name TEXT,
  room_type TEXT CHECK (room_type IN ('single', 'double', 'triple', 'family', 'vip')) NOT NULL,
  floor_number INTEGER NOT NULL,
  capacity INTEGER NOT NULL,
  daily_rate DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('available', 'occupied', 'maintenance', 'reserved')) DEFAULT 'available',
  description TEXT,
  amenities JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول الأسرّة
CREATE TABLE IF NOT EXISTS beds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  bed_number TEXT NOT NULL,
  bed_name TEXT,
  bed_type TEXT CHECK (bed_type IN ('single', 'double', 'bunk')) NOT NULL,
  status TEXT CHECK (status IN ('available', 'occupied', 'maintenance', 'reserved')) DEFAULT 'available',
  current_patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول سجلات الإقامة
CREATE TABLE IF NOT EXISTS accommodation_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  bed_id UUID REFERENCES beds(id) ON DELETE CASCADE,
  daily_rate DECIMAL(10,2) NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE,
  total_days INTEGER,
  total_cost DECIMAL(10,2),
  status TEXT CHECK (status IN ('active', 'completed', 'cancelled')) DEFAULT 'active',
  notes TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. جداول الجلسات العلاجية والذكاء الاصطناعي
-- =====================================================

-- جدول الجلسات العلاجية (محدث مع الذكاء الاصطناعي)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  session_time TIME NOT NULL DEFAULT CURRENT_TIME,
  duration INTEGER NOT NULL DEFAULT 60 CHECK (duration >= 15 AND duration <= 180),
  session_type TEXT NOT NULL CHECK (session_type IN ('individual', 'group', 'family')),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  
  -- محتوى الجلسة
  raw_notes TEXT,
  ai_processed_notes TEXT,
  session_summary TEXT,
  
  -- تحليل المشاعر (JSON)
  emotions JSONB DEFAULT '{
    "primary_emotion": "",
    "secondary_emotions": [],
    "intensity": 5,
    "emotional_state": "neutral"
  }',
  
  -- التقدم الحالي
  current_progress INTEGER DEFAULT 0 CHECK (current_progress >= 0 AND current_progress <= 100),
  next_session_plan TEXT,
  
  -- تقييم المعالج (JSON)
  therapist_assessment JSONB DEFAULT '{
    "patient_cooperation": 5,
    "session_effectiveness": 5,
    "challenges_faced": [],
    "positive_developments": []
  }',
  
  -- التحليل الشامل (JSON)
  ai_analysis JSONB DEFAULT '{
    "insights": [],
    "recommendations": [],
    "risk_factors": [],
    "positive_indicators": []
  }',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول الأهداف العلاجية
CREATE TABLE IF NOT EXISTS treatment_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE NOT NULL,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  category TEXT NOT NULL CHECK (category IN ('behavioral', 'emotional', 'social', 'physical', 'spiritual')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول خطط العلاج
CREATE TABLE IF NOT EXISTS treatment_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  therapist_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT CHECK (status IN ('active', 'completed', 'cancelled')) DEFAULT 'active',
  goals JSONB DEFAULT '[]',
  interventions JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول أنشطة المركز العلاجي
CREATE TABLE IF NOT EXISTS center_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('individual', 'group', 'family')),
  duration INTEGER NOT NULL DEFAULT 60 CHECK (duration >= 15 AND duration <= 180),
  frequency TEXT NOT NULL DEFAULT 'weekly' CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'completed', 'cancelled')),
  effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 10),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول أهداف المركز
CREATE TABLE IF NOT EXISTS center_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE NOT NULL,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  category TEXT NOT NULL CHECK (category IN ('therapy', 'education', 'recreation', 'support')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. جداول التقدم والمؤشرات
-- =====================================================

-- جدول مؤشرات التقدم
CREATE TABLE IF NOT EXISTS progress_indicators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  indicator_type TEXT CHECK (indicator_type IN ('relapse', 'improvement', 'compliance')) NOT NULL,
  value INTEGER NOT NULL CHECK (value >= 0 AND value <= 100),
  notes TEXT,
  recorded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول مؤشرات الانتكاس
CREATE TABLE IF NOT EXISTS relapse_indicators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  indicator_name TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) NOT NULL,
  description TEXT,
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- جدول مؤشرات التحسن
CREATE TABLE IF NOT EXISTS improvement_indicators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  indicator_name TEXT NOT NULL,
  improvement_level TEXT CHECK (improvement_level IN ('minimal', 'moderate', 'significant', 'excellent')) NOT NULL,
  description TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  recorded_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- جدول مخاطر الانتكاس
CREATE TABLE IF NOT EXISTS relapse_risks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  risk_factor TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) NOT NULL,
  probability INTEGER CHECK (probability >= 0 AND probability <= 100),
  mitigation_strategy TEXT,
  status TEXT CHECK (status IN ('active', 'mitigated', 'resolved')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول سجل تحليل المشاعر
CREATE TABLE IF NOT EXISTS emotion_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  emotion_data JSONB NOT NULL,
  analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول تقارير التقدم
CREATE TABLE IF NOT EXISTS progress_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  report_date DATE NOT NULL DEFAULT CURRENT_DATE,
  overall_progress INTEGER DEFAULT 0 CHECK (overall_progress >= 0 AND overall_progress <= 100),
  goals_completed INTEGER DEFAULT 0,
  goals_in_progress INTEGER DEFAULT 0,
  goals_pending INTEGER DEFAULT 0,
  activities_completed INTEGER DEFAULT 0,
  emotional_trend JSONB,
  recommendations TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. جداول المالية
-- =====================================================

-- جدول مصاريف المصحة
CREATE TABLE IF NOT EXISTS facility_expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  expense_category TEXT CHECK (expense_category IN ('electricity', 'water', 'food', 'cleaning', 'maintenance', 'security', 'internet', 'phone', 'other')) NOT NULL,
  expense_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  expense_date DATE NOT NULL,
  due_date DATE,
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'overdue', 'cancelled')) DEFAULT 'pending',
  payment_method TEXT,
  receipt_number TEXT,
  vendor_name TEXT,
  vendor_phone TEXT,
  description TEXT,
  approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  recorded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول المدفوعات
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  accommodation_id UUID REFERENCES accommodation_records(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_type TEXT CHECK (payment_type IN ('cash', 'card', 'bank_transfer', 'insurance')) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method TEXT,
  receipt_number TEXT,
  notes TEXT,
  recorded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول المصاريف الشخصية
CREATE TABLE IF NOT EXISTS personal_expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  expense_type TEXT CHECK (expense_type IN ('medication', 'personal_care', 'food', 'transportation', 'entertainment', 'other')) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  expense_date DATE NOT NULL,
  description TEXT,
  receipt_available BOOLEAN DEFAULT false,
  receipt_number TEXT,
  approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول الملخص المالي
CREATE TABLE IF NOT EXISTS financial_summary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  accommodation_id UUID REFERENCES accommodation_records(id) ON DELETE CASCADE,
  total_accommodation_cost DECIMAL(10,2) DEFAULT 0,
  total_payments DECIMAL(10,2) DEFAULT 0,
  total_expenses DECIMAL(10,2) DEFAULT 0,
  balance DECIMAL(10,2) DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. جداول الإشعارات والتقارير
-- =====================================================

-- جدول الإشعارات
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('info', 'warning', 'error', 'success')) DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول الإشعارات المجدولة
CREATE TABLE IF NOT EXISTS scheduled_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول التقارير الذكية
CREATE TABLE IF NOT EXISTS smart_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_type TEXT NOT NULL,
  report_name TEXT NOT NULL,
  report_data JSONB NOT NULL,
  generated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول تحليلات الأداء
CREATE TABLE IF NOT EXISTS performance_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(10,2) NOT NULL,
  metric_date DATE NOT NULL,
  context JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. جداول النظام
-- =====================================================

-- جدول إعدادات النظام
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. الفهارس لتحسين الأداء
-- =====================================================

-- فهارس الجداول الرئيسية
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- فهارس الجلسات
CREATE INDEX IF NOT EXISTS idx_sessions_patient_id ON sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_sessions_therapist_id ON sessions(therapist_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);

-- فهارس الأهداف العلاجية
CREATE INDEX IF NOT EXISTS idx_treatment_goals_patient_id ON treatment_goals(patient_id);
CREATE INDEX IF NOT EXISTS idx_treatment_goals_session_id ON treatment_goals(session_id);
CREATE INDEX IF NOT EXISTS idx_treatment_goals_status ON treatment_goals(status);
CREATE INDEX IF NOT EXISTS idx_treatment_goals_priority ON treatment_goals(priority);

-- فهارس أنشطة المركز
CREATE INDEX IF NOT EXISTS idx_center_activities_patient_id ON center_activities(patient_id);
CREATE INDEX IF NOT EXISTS idx_center_activities_session_id ON center_activities(session_id);
CREATE INDEX IF NOT EXISTS idx_center_activities_type ON center_activities(type);
CREATE INDEX IF NOT EXISTS idx_center_activities_status ON center_activities(status);

-- فهارس تحليل المشاعر
CREATE INDEX IF NOT EXISTS idx_emotion_logs_patient_id ON emotion_logs(patient_id);
CREATE INDEX IF NOT EXISTS idx_emotion_logs_session_id ON emotion_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_emotion_logs_date ON emotion_logs(analysis_date);

-- فهارس تقارير التقدم
CREATE INDEX IF NOT EXISTS idx_progress_reports_patient_id ON progress_reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_progress_reports_date ON progress_reports(report_date);

-- فهارس الإشعارات
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_scheduled_notifications_scheduled_at ON scheduled_notifications(scheduled_at);

-- =====================================================
-- 9. الدوال والـ Triggers
-- =====================================================

-- دالة لتحديث timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- دالة لحساب التقدم الإجمالي للمريض
CREATE OR REPLACE FUNCTION calculate_patient_progress(patient_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    total_goals INTEGER;
    completed_goals INTEGER;
    progress_percentage INTEGER;
BEGIN
    -- حساب إجمالي الأهداف
    SELECT COUNT(*) INTO total_goals
    FROM treatment_goals
    WHERE patient_id = patient_uuid;
    
    -- حساب الأهداف المكتملة
    SELECT COUNT(*) INTO completed_goals
    FROM treatment_goals
    WHERE patient_id = patient_uuid AND status = 'completed';
    
    -- حساب النسبة المئوية
    IF total_goals > 0 THEN
        progress_percentage := (completed_goals * 100) / total_goals;
    ELSE
        progress_percentage := 0;
    END IF;
    
    RETURN progress_percentage;
END;
$$ LANGUAGE plpgsql;

-- دالة لإنشاء تقرير التقدم
CREATE OR REPLACE FUNCTION create_progress_report(patient_uuid UUID)
RETURNS UUID AS $$
DECLARE
    report_id UUID;
    total_goals INTEGER;
    completed_goals INTEGER;
    in_progress_goals INTEGER;
    pending_goals INTEGER;
    completed_activities INTEGER;
BEGIN
    -- حساب إحصائيات الأهداف
    SELECT COUNT(*) INTO total_goals FROM treatment_goals WHERE patient_id = patient_uuid;
    SELECT COUNT(*) INTO completed_goals FROM treatment_goals WHERE patient_id = patient_uuid AND status = 'completed';
    SELECT COUNT(*) INTO in_progress_goals FROM treatment_goals WHERE patient_id = patient_uuid AND status = 'in_progress';
    SELECT COUNT(*) INTO pending_goals FROM treatment_goals WHERE patient_id = patient_uuid AND status = 'pending';
    
    -- حساب الأنشطة المكتملة
    SELECT COUNT(*) INTO completed_activities FROM center_activities WHERE patient_id = patient_uuid AND status = 'completed';
    
    -- إنشاء التقرير
    INSERT INTO progress_reports (
        patient_id, 
        goals_completed, 
        goals_in_progress, 
        goals_pending, 
        activities_completed,
        overall_progress
    ) VALUES (
        patient_uuid,
        completed_goals,
        in_progress_goals,
        pending_goals,
        completed_activities,
        calculate_patient_progress(patient_uuid)
    ) RETURNING id INTO report_id;
    
    RETURN report_id;
END;
$$ LANGUAGE plpgsql;

-- إنشاء triggers لتحديث updated_at
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_treatment_goals_updated_at BEFORE UPDATE ON treatment_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_center_activities_updated_at BEFORE UPDATE ON center_activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_center_goals_updated_at BEFORE UPDATE ON center_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_reports_updated_at BEFORE UPDATE ON progress_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_relapse_risks_updated_at BEFORE UPDATE ON relapse_risks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 10. الـ Views
-- =====================================================

-- عرض ملخص الجلسات
CREATE OR REPLACE VIEW sessions_summary AS
SELECT 
    s.id,
    s.session_date,
    s.session_time,
    s.duration,
    s.session_type,
    s.status,
    s.current_progress,
    p.name as patient_name,
    pr.full_name as therapist_name,
    s.emotions->>'primary_emotion' as primary_emotion,
    s.emotions->>'intensity' as emotion_intensity
FROM sessions s
JOIN patients p ON s.patient_id = p.id
JOIN profiles pr ON s.therapist_id = pr.id
ORDER BY s.session_date DESC, s.session_time DESC;

-- عرض ملخص تقدم المريض
CREATE OR REPLACE VIEW patient_progress_summary AS
SELECT 
    p.id as patient_id,
    p.name as patient_name,
    p.admission_date,
    p.status as patient_status,
    COUNT(s.id) as total_sessions,
    COUNT(CASE WHEN s.status = 'completed' THEN 1 END) as completed_sessions,
    AVG(s.current_progress) as avg_progress,
    COUNT(tg.id) as total_goals,
    COUNT(CASE WHEN tg.status = 'completed' THEN 1 END) as completed_goals,
    calculate_patient_progress(p.id) as overall_progress
FROM patients p
LEFT JOIN sessions s ON p.id = s.patient_id
LEFT JOIN treatment_goals tg ON p.id = tg.patient_id
GROUP BY p.id, p.name, p.admission_date, p.status;

-- =====================================================
-- 11. البيانات الافتراضية
-- =====================================================

-- إدراج بيانات الموظفين الافتراضية
INSERT INTO profiles (full_name, email, role, permissions) VALUES
  ('المدير الرئيسي', 'djharga@gmail.com', 'admin', '{"manage_users": true, "manage_patients": true, "manage_sessions": true, "view_reports": true, "manage_settings": true, "manage_finances": true, "manage_facility": true, "manage_rooms": true}'),
  ('د. أحمد محمد', 'ahmed.mohamed@shifacare.com', 'admin', '{"manage_users": true, "manage_patients": true, "manage_sessions": true, "view_reports": true, "manage_settings": true, "manage_finances": true}'),
  ('د. سارة أحمد', 'sara.ahmed@shifacare.com', 'supervisor', '{"manage_patients": true, "manage_sessions": true, "view_reports": true, "view_finances": true}'),
  ('د. محمد علي', 'mohamed.ali@shifacare.com', 'therapist', '{"view_patients": true, "manage_sessions": true}'),
  ('أ. فاطمة محمود', 'fatima.mahmoud@shifacare.com', 'accountant', '{"manage_finances": true, "view_patients": true, "manage_accommodation": true, "manage_payments": true, "manage_expenses": true}')
ON CONFLICT (email) DO NOTHING;

-- إدراج بيانات المرضى الافتراضية
INSERT INTO patients (name, email, phone, date_of_birth, gender, addiction_type, admission_date) VALUES
  ('أحمد محمد', 'ahmed.mohamed@example.com', '+201234567890', '1990-05-15', 'male', 'المخدرات', '2024-01-15'),
  ('فاطمة علي', 'fatima.ali@example.com', '+201234567891', '1985-08-22', 'female', 'الكحول', '2024-02-01'),
  ('محمد عبدالله', 'mohamed.abdullah@example.com', '+201234567892', '1988-12-10', 'male', 'التدخين', '2024-01-20')
ON CONFLICT (email) DO NOTHING;

-- إدراج بيانات الغرف الافتراضية
INSERT INTO rooms (room_number, room_name, room_type, floor_number, capacity, daily_rate, status, description, amenities) VALUES
  ('101', 'غرفة 101', 'single', 1, 1, 500.00, 'available', 'غرفة فردية مريحة', '["تلفاز", "مكيف", "حمام خاص"]'),
  ('102', 'غرفة 102', 'double', 1, 2, 600.00, 'available', 'غرفة مزدوجة', '["تلفاز", "مكيف", "حمام مشترك"]'),
  ('201', 'غرفة 201', 'family', 2, 4, 800.00, 'available', 'غرفة عائلية', '["تلفاز", "مكيف", "حمام خاص", "مطبخ صغير"]'),
  ('301', 'غرفة VIP', 'vip', 3, 2, 1200.00, 'available', 'غرفة VIP فاخرة', '["تلفاز كبير", "مكيف", "حمام خاص", "مطبخ", "إنترنت مجاني"]')
ON CONFLICT (room_number) DO NOTHING;

-- إدراج بيانات الأسرّة الافتراضية
INSERT INTO beds (room_id, bed_number, bed_name, bed_type, status) VALUES
  ((SELECT id FROM rooms WHERE room_number = '101'), 'B101-1', 'سرير 1', 'single', 'available'),
  ((SELECT id FROM rooms WHERE room_number = '102'), 'B102-1', 'سرير 1', 'single', 'available'),
  ((SELECT id FROM rooms WHERE room_number = '102'), 'B102-2', 'سرير 2', 'single', 'available'),
  ((SELECT id FROM rooms WHERE room_number = '201'), 'B201-1', 'سرير 1', 'double', 'available'),
  ((SELECT id FROM rooms WHERE room_number = '201'), 'B201-2', 'سرير 2', 'double', 'available'),
  ((SELECT id FROM rooms WHERE room_number = '301'), 'B301-1', 'سرير VIP 1', 'double', 'available'),
  ((SELECT id FROM rooms WHERE room_number = '301'), 'B301-2', 'سرير VIP 2', 'double', 'available')
ON CONFLICT DO NOTHING;

-- إدراج بيانات مصاريف المصحة الافتراضية
INSERT INTO facility_expenses (expense_category, expense_name, amount, expense_date, due_date, payment_status, payment_method, receipt_number, vendor_name, vendor_phone, description) VALUES
  ('electricity', 'فاتورة الكهرباء - يناير 2025', 2500.00, '2025-01-31', '2025-02-15', 'paid', 'تحويل بنكي', 'ELEC001', 'شركة الكهرباء', '+20123456789', 'فاتورة الكهرباء الشهرية'),
  ('water', 'فاتورة المياه - يناير 2025', 800.00, '2025-01-31', '2025-02-10', 'paid', 'نقدي', 'WATER001', 'شركة المياه', '+20123456790', 'فاتورة المياه الشهرية'),
  ('food', 'مصاريف الطعام - يناير 2025', 5000.00, '2025-01-31', '2025-02-05', 'paid', 'بطاقة ائتمان', 'FOOD001', 'مطعم الصحة', '+20123456791', 'مصاريف الطعام الشهرية للمرضى'),
  ('cleaning', 'خدمات التنظيف - يناير 2025', 1500.00, '2025-01-31', '2025-02-20', 'pending', 'تحويل بنكي', 'CLEAN001', 'شركة النظافة', '+20123456792', 'خدمات التنظيف الشهرية'),
  ('maintenance', 'صيانة المكيفات', 1200.00, '2025-02-01', '2025-02-15', 'pending', 'نقدي', 'MAINT001', 'شركة الصيانة', '+20123456793', 'صيانة دورية للمكيفات')
ON CONFLICT DO NOTHING;

-- إدراج بيانات الإقامة الافتراضية
INSERT INTO accommodation_records (patient_id, room_id, bed_id, daily_rate, check_in_date, check_out_date, total_days, total_cost, status) VALUES
  ((SELECT id FROM patients WHERE email = 'ahmed.mohamed@example.com'), 
   (SELECT id FROM rooms WHERE room_number = '101'), 
   (SELECT id FROM beds WHERE bed_number = 'B101-1'), 
   500.00, '2025-01-15', NULL, NULL, NULL, 'active'),
  ((SELECT id FROM patients WHERE email = 'fatima.ali@example.com'), 
   (SELECT id FROM rooms WHERE room_number = '102'), 
   (SELECT id FROM beds WHERE bed_number = 'B102-1'), 
   600.00, '2025-02-01', NULL, NULL, NULL, 'active'),
  ((SELECT id FROM patients WHERE email = 'mohamed.abdullah@example.com'), 
   (SELECT id FROM rooms WHERE room_number = '201'), 
   (SELECT id FROM beds WHERE bed_number = 'B201-1'), 
   800.00, '2025-01-20', NULL, NULL, NULL, 'active')
ON CONFLICT DO NOTHING;

-- إدراج بيانات المدفوعات الافتراضية
INSERT INTO payments (patient_id, accommodation_id, amount, payment_type, payment_date, payment_method, receipt_number) VALUES
  ((SELECT id FROM patients WHERE email = 'ahmed.mohamed@example.com'), 
   (SELECT id FROM accommodation_records WHERE patient_id = (SELECT id FROM patients WHERE email = 'ahmed.mohamed@example.com')), 
   5000.00, 'cash', '2025-01-15', 'نقدي', 'RCP001'),
  ((SELECT id FROM patients WHERE email = 'fatima.ali@example.com'), 
   (SELECT id FROM accommodation_records WHERE patient_id = (SELECT id FROM patients WHERE email = 'fatima.ali@example.com')), 
   6000.00, 'card', '2025-02-01', 'بطاقة ائتمان', 'RCP002')
ON CONFLICT DO NOTHING;

-- إدراج بيانات المصاريف الشخصية الافتراضية
INSERT INTO personal_expenses (patient_id, expense_type, amount, expense_date, description, receipt_available, status) VALUES
  ((SELECT id FROM patients WHERE email = 'ahmed.mohamed@example.com'), 'medication', 150.00, '2025-01-20', 'أدوية مخصصة', true, 'approved'),
  ((SELECT id FROM patients WHERE email = 'fatima.ali@example.com'), 'personal_care', 80.00, '2025-02-05', 'مستلزمات شخصية', false, 'pending')
ON CONFLICT DO NOTHING;

-- إدراج بيانات إعدادات النظام الافتراضية
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
  ('site_name', '"شفا كير"', 'اسم الموقع'),
  ('site_description', '"نظام إدارة المصحات العلاجية"', 'وصف الموقع'),
  ('default_language', '"ar-EG"', 'اللغة الافتراضية'),
  ('session_duration_options', '[15, 30, 45, 60, 90, 120]', 'خيارات مدة الجلسات'),
  ('addiction_types', '["المخدرات", "الكحول", "التدخين", "القمار", "أخرى"]', 'أنواع الإدمان'),
  ('room_types', '["عادي", "مميز", "VIP", "عائلي"]', 'أنواع الغرف'),
  ('expense_categories', '["أدوية", "رعاية شخصية", "طعام", "مواصلات", "ترفيه", "أخرى"]', 'فئات المصاريف الشخصية'),
  ('payment_methods', '["نقدي", "بطاقة ائتمان", "تحويل بنكي", "تأمين"]', 'طرق الدفع'),
  ('facility_expense_categories', '["كهرباء", "مياه", "طعام", "تنظيف", "صيانة", "أمن", "إنترنت", "هاتف", "أخرى"]', 'فئات مصاريف المصحة'),
  ('bed_types', '["فردي", "مزدوج", "طابقية"]', 'أنواع الأسرّة')
ON CONFLICT (setting_key) DO NOTHING; 