-- نظام الجلسات العلاجية بالذكاء الاصطناعي
-- تاريخ الإنشاء: 2025-07-05

-- إنشاء جدول الجلسات العلاجية
CREATE TABLE IF NOT EXISTS sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    session_time TIME NOT NULL DEFAULT CURRENT_TIME,
    duration INTEGER NOT NULL DEFAULT 60 CHECK (duration >= 15 AND duration <= 180),
    session_type TEXT NOT NULL CHECK (session_type IN ('individual', 'group', 'family')),
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    
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

-- إنشاء جدول الأهداف العلاجية
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

-- إنشاء جدول أنشطة المركز العلاجي
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

-- إنشاء جدول أهداف المركز
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

-- إنشاء جدول سجل تحليل المشاعر
CREATE TABLE IF NOT EXISTS emotion_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    emotion_data JSONB NOT NULL,
    analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول تقارير التقدم
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

-- إنشاء الفهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_sessions_patient_id ON sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_sessions_therapist_id ON sessions(therapist_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);

CREATE INDEX IF NOT EXISTS idx_treatment_goals_patient_id ON treatment_goals(patient_id);
CREATE INDEX IF NOT EXISTS idx_treatment_goals_session_id ON treatment_goals(session_id);
CREATE INDEX IF NOT EXISTS idx_treatment_goals_status ON treatment_goals(status);
CREATE INDEX IF NOT EXISTS idx_treatment_goals_priority ON treatment_goals(priority);

CREATE INDEX IF NOT EXISTS idx_center_activities_patient_id ON center_activities(patient_id);
CREATE INDEX IF NOT EXISTS idx_center_activities_session_id ON center_activities(session_id);
CREATE INDEX IF NOT EXISTS idx_center_activities_type ON center_activities(type);
CREATE INDEX IF NOT EXISTS idx_center_activities_status ON center_activities(status);

CREATE INDEX IF NOT EXISTS idx_emotion_logs_patient_id ON emotion_logs(patient_id);
CREATE INDEX IF NOT EXISTS idx_emotion_logs_session_id ON emotion_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_emotion_logs_date ON emotion_logs(analysis_date);

CREATE INDEX IF NOT EXISTS idx_progress_reports_patient_id ON progress_reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_progress_reports_date ON progress_reports(report_date);

-- إنشاء دالة لتحديث timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

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

-- إنشاء دالة لحساب التقدم الإجمالي للمريض
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

-- إنشاء دالة لإنشاء تقرير تقدم تلقائي
CREATE OR REPLACE FUNCTION create_progress_report(patient_uuid UUID)
RETURNS UUID AS $$
DECLARE
    report_id UUID;
    overall_progress INTEGER;
    goals_completed_count INTEGER;
    goals_in_progress_count INTEGER;
    goals_pending_count INTEGER;
    activities_completed_count INTEGER;
BEGIN
    -- حساب التقدم الإجمالي
    overall_progress := calculate_patient_progress(patient_uuid);
    
    -- حساب إحصائيات الأهداف
    SELECT 
        COUNT(*) FILTER (WHERE status = 'completed'),
        COUNT(*) FILTER (WHERE status = 'in_progress'),
        COUNT(*) FILTER (WHERE status = 'pending')
    INTO goals_completed_count, goals_in_progress_count, goals_pending_count
    FROM treatment_goals
    WHERE patient_id = patient_uuid;
    
    -- حساب الأنشطة المكتملة
    SELECT COUNT(*)
    INTO activities_completed_count
    FROM center_activities
    WHERE patient_id = patient_uuid AND status = 'completed';
    
    -- إنشاء التقرير
    INSERT INTO progress_reports (
        patient_id,
        overall_progress,
        goals_completed,
        goals_in_progress,
        goals_pending,
        activities_completed
    ) VALUES (
        patient_uuid,
        overall_progress,
        goals_completed_count,
        goals_in_progress_count,
        goals_pending_count,
        activities_completed_count
    ) RETURNING id INTO report_id;
    
    RETURN report_id;
END;
$$ LANGUAGE plpgsql;

-- إنشاء views مفيدة
CREATE OR REPLACE VIEW sessions_summary AS
SELECT 
    s.id,
    s.patient_id,
    p.name as patient_name,
    s.therapist_id,
    u.name as therapist_name,
    s.session_date,
    s.session_time,
    s.duration,
    s.session_type,
    s.status,
    s.current_progress,
    s.emotions->>'primary_emotion' as primary_emotion,
    s.emotions->>'emotional_state' as emotional_state,
    s.emotions->>'intensity' as emotion_intensity,
    s.created_at
FROM sessions s
JOIN patients p ON s.patient_id = p.id
JOIN users u ON s.therapist_id = u.id
ORDER BY s.session_date DESC, s.session_time DESC;

CREATE OR REPLACE VIEW patient_progress_summary AS
SELECT 
    p.id as patient_id,
    p.name as patient_name,
    COUNT(s.id) as total_sessions,
    AVG(s.current_progress) as avg_progress,
    COUNT(tg.id) as total_goals,
    COUNT(tg.id) FILTER (WHERE tg.status = 'completed') as completed_goals,
    COUNT(ca.id) as total_activities,
    COUNT(ca.id) FILTER (WHERE ca.status = 'completed') as completed_activities,
    calculate_patient_progress(p.id) as overall_progress
FROM patients p
LEFT JOIN sessions s ON p.id = s.patient_id
LEFT JOIN treatment_goals tg ON p.id = tg.patient_id
LEFT JOIN center_activities ca ON p.id = ca.patient_id
GROUP BY p.id, p.name;

-- إضافة صلاحيات للمستخدمين
GRANT SELECT, INSERT, UPDATE, DELETE ON sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON treatment_goals TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON center_activities TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON center_goals TO authenticated;
GRANT SELECT, INSERT ON emotion_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE ON progress_reports TO authenticated;

GRANT SELECT ON sessions_summary TO authenticated;
GRANT SELECT ON patient_progress_summary TO authenticated;

-- إنشاء RLS (Row Level Security)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE center_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE center_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotion_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_reports ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان
CREATE POLICY "Users can view their own sessions" ON sessions
    FOR SELECT USING (therapist_id = auth.uid());

CREATE POLICY "Users can insert their own sessions" ON sessions
    FOR INSERT WITH CHECK (therapist_id = auth.uid());

CREATE POLICY "Users can update their own sessions" ON sessions
    FOR UPDATE USING (therapist_id = auth.uid());

CREATE POLICY "Users can view patient goals" ON treatment_goals
    FOR SELECT USING (true);

CREATE POLICY "Users can manage patient goals" ON treatment_goals
    FOR ALL USING (true);

CREATE POLICY "Users can view center activities" ON center_activities
    FOR SELECT USING (true);

CREATE POLICY "Users can manage center activities" ON center_activities
    FOR ALL USING (true);

CREATE POLICY "Users can view center goals" ON center_goals
    FOR SELECT USING (true);

CREATE POLICY "Users can manage center goals" ON center_goals
    FOR ALL USING (true);

CREATE POLICY "Users can view emotion logs" ON emotion_logs
    FOR SELECT USING (true);

CREATE POLICY "Users can insert emotion logs" ON emotion_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view progress reports" ON progress_reports
    FOR SELECT USING (true);

CREATE POLICY "Users can manage progress reports" ON progress_reports
    FOR ALL USING (true);

-- إضافة تعليقات للتوثيق
COMMENT ON TABLE sessions IS 'جدول الجلسات العلاجية مع تحليل الذكاء الاصطناعي';
COMMENT ON TABLE treatment_goals IS 'جدول الأهداف العلاجية للمرضى';
COMMENT ON TABLE center_activities IS 'جدول أنشطة المركز العلاجي';
COMMENT ON TABLE center_goals IS 'جدول أهداف المركز العلاجي';
COMMENT ON TABLE emotion_logs IS 'جدول سجل تحليل المشاعر';
COMMENT ON TABLE progress_reports IS 'جدول تقارير تقدم المرضى';

COMMENT ON COLUMN sessions.emotions IS 'تحليل المشاعر بتنسيق JSON';
COMMENT ON COLUMN sessions.therapist_assessment IS 'تقييم المعالج بتنسيق JSON';
COMMENT ON COLUMN sessions.ai_analysis IS 'التحليل الشامل بالذكاء الاصطناعي بتنسيق JSON'; 