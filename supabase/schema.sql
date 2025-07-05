-- Create patients table
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

-- Create profiles table (for therapists and staff)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('admin', 'supervisor', 'therapist', 'accountant')) DEFAULT 'therapist',
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rooms table
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

-- Create beds table
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

-- Create facility expenses table
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

-- Create accommodation records table
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

-- Create payments table
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

-- Create personal expenses table
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

-- Create financial summary table
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

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  therapist_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  session_time TIME NOT NULL,
  session_type TEXT CHECK (session_type IN ('individual', 'group', 'family')) NOT NULL,
  status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')) DEFAULT 'scheduled',
  duration INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create treatment plans table
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

-- Create progress indicators table
CREATE TABLE IF NOT EXISTS progress_indicators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  indicator_type TEXT CHECK (indicator_type IN ('relapse', 'improvement', 'compliance')) NOT NULL,
  value INTEGER NOT NULL CHECK (value >= 0 AND value <= 100),
  notes TEXT,
  recorded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create relapse indicators table
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

-- Create improvement indicators table
CREATE TABLE IF NOT EXISTS improvement_indicators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  indicator_name TEXT NOT NULL,
  improvement_level TEXT CHECK (improvement_level IN ('minimal', 'moderate', 'significant', 'excellent')) NOT NULL,
  description TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  recorded_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Create system settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO profiles (full_name, email, role, permissions) VALUES
  ('المدير الرئيسي', 'djharga@gmail.com', 'admin', '{"manage_users": true, "manage_patients": true, "manage_sessions": true, "view_reports": true, "manage_settings": true, "manage_finances": true, "manage_facility": true, "manage_rooms": true}'),
  ('د. أحمد محمد', 'ahmed.mohamed@shifacare.com', 'admin', '{"manage_users": true, "manage_patients": true, "manage_sessions": true, "view_reports": true, "manage_settings": true, "manage_finances": true}'),
  ('د. سارة أحمد', 'sara.ahmed@shifacare.com', 'supervisor', '{"manage_patients": true, "manage_sessions": true, "view_reports": true, "view_finances": true}'),
  ('د. محمد علي', 'mohamed.ali@shifacare.com', 'therapist', '{"view_patients": true, "manage_sessions": true}'),
  ('أ. فاطمة محمود', 'fatima.mahmoud@shifacare.com', 'accountant', '{"manage_finances": true, "view_patients": true, "manage_accommodation": true, "manage_payments": true, "manage_expenses": true}')
ON CONFLICT (email) DO NOTHING;

INSERT INTO patients (name, email, phone, date_of_birth, gender, addiction_type, admission_date) VALUES
  ('أحمد محمد', 'ahmed.mohamed@example.com', '+201234567890', '1990-05-15', 'male', 'المخدرات', '2024-01-15'),
  ('فاطمة علي', 'fatima.ali@example.com', '+201234567891', '1985-08-22', 'female', 'الكحول', '2024-02-01'),
  ('محمد عبدالله', 'mohamed.abdullah@example.com', '+201234567892', '1988-12-10', 'male', 'التدخين', '2024-01-20')
ON CONFLICT (email) DO NOTHING;

-- Insert sample rooms
INSERT INTO rooms (room_number, room_name, room_type, floor_number, capacity, daily_rate, status, description, amenities) VALUES
  ('101', 'غرفة 101', 'single', 1, 1, 500.00, 'available', 'غرفة فردية مريحة', '["تلفاز", "مكيف", "حمام خاص"]'),
  ('102', 'غرفة 102', 'double', 1, 2, 600.00, 'available', 'غرفة مزدوجة', '["تلفاز", "مكيف", "حمام مشترك"]'),
  ('201', 'غرفة 201', 'family', 2, 4, 800.00, 'available', 'غرفة عائلية', '["تلفاز", "مكيف", "حمام خاص", "مطبخ صغير"]'),
  ('301', 'غرفة VIP', 'vip', 3, 2, 1200.00, 'available', 'غرفة VIP فاخرة', '["تلفاز كبير", "مكيف", "حمام خاص", "مطبخ", "إنترنت مجاني"]')
ON CONFLICT (room_number) DO NOTHING;

-- Insert sample beds
INSERT INTO beds (room_id, bed_number, bed_name, bed_type, status) VALUES
  ((SELECT id FROM rooms WHERE room_number = '101'), 'B101-1', 'سرير 1', 'single', 'available'),
  ((SELECT id FROM rooms WHERE room_number = '102'), 'B102-1', 'سرير 1', 'single', 'available'),
  ((SELECT id FROM rooms WHERE room_number = '102'), 'B102-2', 'سرير 2', 'single', 'available'),
  ((SELECT id FROM rooms WHERE room_number = '201'), 'B201-1', 'سرير 1', 'double', 'available'),
  ((SELECT id FROM rooms WHERE room_number = '201'), 'B201-2', 'سرير 2', 'double', 'available'),
  ((SELECT id FROM rooms WHERE room_number = '301'), 'B301-1', 'سرير VIP 1', 'double', 'available'),
  ((SELECT id FROM rooms WHERE room_number = '301'), 'B301-2', 'سرير VIP 2', 'double', 'available')
ON CONFLICT DO NOTHING;

-- Insert sample facility expenses
INSERT INTO facility_expenses (expense_category, expense_name, amount, expense_date, due_date, payment_status, payment_method, receipt_number, vendor_name, vendor_phone, description) VALUES
  ('electricity', 'فاتورة الكهرباء - يناير 2024', 2500.00, '2024-01-31', '2024-02-15', 'paid', 'تحويل بنكي', 'ELEC001', 'شركة الكهرباء', '+20123456789', 'فاتورة الكهرباء الشهرية'),
  ('water', 'فاتورة المياه - يناير 2024', 800.00, '2024-01-31', '2024-02-10', 'paid', 'نقدي', 'WATER001', 'شركة المياه', '+20123456790', 'فاتورة المياه الشهرية'),
  ('food', 'مصاريف الطعام - يناير 2024', 5000.00, '2024-01-31', '2024-02-05', 'paid', 'بطاقة ائتمان', 'FOOD001', 'مطعم الصحة', '+20123456791', 'مصاريف الطعام الشهرية للمرضى'),
  ('cleaning', 'خدمات التنظيف - يناير 2024', 1500.00, '2024-01-31', '2024-02-20', 'pending', 'تحويل بنكي', 'CLEAN001', 'شركة النظافة', '+20123456792', 'خدمات التنظيف الشهرية'),
  ('maintenance', 'صيانة المكيفات', 1200.00, '2024-02-01', '2024-02-15', 'pending', 'نقدي', 'MAINT001', 'شركة الصيانة', '+20123456793', 'صيانة دورية للمكيفات')
ON CONFLICT DO NOTHING;

-- Insert sample accommodation records
INSERT INTO accommodation_records (patient_id, room_id, bed_id, daily_rate, check_in_date, check_out_date, total_days, total_cost, status) VALUES
  ((SELECT id FROM patients WHERE email = 'ahmed.mohamed@example.com'), 
   (SELECT id FROM rooms WHERE room_number = '101'), 
   (SELECT id FROM beds WHERE bed_number = 'B101-1'), 
   500.00, '2024-01-15', NULL, NULL, NULL, 'active'),
  ((SELECT id FROM patients WHERE email = 'fatima.ali@example.com'), 
   (SELECT id FROM rooms WHERE room_number = '102'), 
   (SELECT id FROM beds WHERE bed_number = 'B102-1'), 
   600.00, '2024-02-01', NULL, NULL, NULL, 'active'),
  ((SELECT id FROM patients WHERE email = 'mohamed.abdullah@example.com'), 
   (SELECT id FROM rooms WHERE room_number = '201'), 
   (SELECT id FROM beds WHERE bed_number = 'B201-1'), 
   800.00, '2024-01-20', NULL, NULL, NULL, 'active')
ON CONFLICT DO NOTHING;

-- Insert sample payments
INSERT INTO payments (patient_id, accommodation_id, amount, payment_type, payment_date, payment_method, receipt_number) VALUES
  ((SELECT id FROM patients WHERE email = 'ahmed.mohamed@example.com'), 
   (SELECT id FROM accommodation_records WHERE patient_id = (SELECT id FROM patients WHERE email = 'ahmed.mohamed@example.com')), 
   5000.00, 'cash', '2024-01-15', 'نقدي', 'RCP001'),
  ((SELECT id FROM patients WHERE email = 'fatima.ali@example.com'), 
   (SELECT id FROM accommodation_records WHERE patient_id = (SELECT id FROM patients WHERE email = 'fatima.ali@example.com')), 
   6000.00, 'card', '2024-02-01', 'بطاقة ائتمان', 'RCP002')
ON CONFLICT DO NOTHING;

-- Insert sample personal expenses
INSERT INTO personal_expenses (patient_id, expense_type, amount, expense_date, description, receipt_available, status) VALUES
  ((SELECT id FROM patients WHERE email = 'ahmed.mohamed@example.com'), 'medication', 150.00, '2024-01-20', 'أدوية مخصصة', true, 'approved'),
  ((SELECT id FROM patients WHERE email = 'fatima.ali@example.com'), 'personal_care', 80.00, '2024-02-05', 'مستلزمات شخصية', false, 'pending')
ON CONFLICT DO NOTHING;

-- Insert sample system settings
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