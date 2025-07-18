-- =====================================================
-- شفاء كير - ميزات متقدمة
-- تاريخ الإنشاء: 2025-07-03
-- =====================================================

-- هذا الملف يحتوي على ميزات متقدمة إضافية
-- جميع الجداول الأساسية موجودة في schema.sql الرئيسي

-- إضافة ميزات متقدمة للتقارير الذكية
CREATE OR REPLACE FUNCTION generate_smart_report(report_type TEXT, report_name TEXT, report_data JSONB, user_id UUID)
RETURNS UUID AS $$
DECLARE
    report_id UUID;
BEGIN
    INSERT INTO smart_reports (report_type, report_name, report_data, generated_by)
    VALUES (report_type, report_name, report_data, user_id)
    RETURNING id INTO report_id;
    
    RETURN report_id;
END;
$$ LANGUAGE plpgsql;

-- دالة لحساب مؤشرات الأداء
CREATE OR REPLACE FUNCTION calculate_performance_metrics(metric_date DATE)
RETURNS VOID AS $$
BEGIN
    -- حساب معدل نجاح الجلسات
    INSERT INTO performance_analytics (metric_name, metric_value, metric_date, context)
    SELECT 
        'session_success_rate',
        (COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / COUNT(*)),
        metric_date,
        jsonb_build_object('total_sessions', COUNT(*), 'completed_sessions', COUNT(CASE WHEN status = 'completed' THEN 1 END))
    FROM sessions
    WHERE DATE(session_date) = metric_date;
    
    -- حساب متوسط التقدم
    INSERT INTO performance_analytics (metric_name, metric_value, metric_date, context)
    SELECT 
        'average_progress',
        AVG(current_progress),
        metric_date,
        jsonb_build_object('total_patients', COUNT(DISTINCT patient_id))
    FROM sessions
    WHERE DATE(session_date) = metric_date AND status = 'completed';
END;
$$ LANGUAGE plpgsql;

-- دالة لإرسال إشعارات تلقائية
CREATE OR REPLACE FUNCTION send_automatic_notification(user_id UUID, title TEXT, message TEXT, notification_type TEXT DEFAULT 'info')
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (user_id, title, message, notification_type)
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- دالة لجدولة إشعارات مستقبلية
CREATE OR REPLACE FUNCTION schedule_notification(user_id UUID, title TEXT, message TEXT, scheduled_time TIMESTAMP WITH TIME ZONE)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO scheduled_notifications (user_id, title, message, scheduled_at)
    VALUES (user_id, title, message, scheduled_time)
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger لإرسال إشعار عند إنشاء جلسة جديدة
CREATE OR REPLACE FUNCTION notify_new_session()
RETURNS TRIGGER AS $$
BEGIN
    -- إرسال إشعار للمريض
    PERFORM send_automatic_notification(
        NEW.patient_id::UUID,
        'جلسة علاجية جديدة',
        'تم جدولة جلسة علاجية جديدة لك في ' || NEW.session_date,
        'info'
    );
    
    -- إرسال إشعار للمعالج
    PERFORM send_automatic_notification(
        NEW.therapist_id,
        'جلسة علاجية جديدة',
        'تم جدولة جلسة علاجية جديدة مع المريض في ' || NEW.session_date,
        'info'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_new_session
    AFTER INSERT ON sessions
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_session();

-- Trigger لإرسال إشعار عند تحديث حالة الجلسة
CREATE OR REPLACE FUNCTION notify_session_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status != NEW.status THEN
        -- إرسال إشعار بتغيير حالة الجلسة
        PERFORM send_automatic_notification(
            NEW.patient_id::UUID,
            'تحديث حالة الجلسة',
            'تم تحديث حالة جلستك العلاجية إلى: ' || NEW.status,
            'info'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_session_status_change
    AFTER UPDATE ON sessions
    FOR EACH ROW
    EXECUTE FUNCTION notify_session_status_change();

-- Trigger لحساب مؤشرات الأداء يومياً
CREATE OR REPLACE FUNCTION daily_performance_calculation()
RETURNS TRIGGER AS $$
BEGIN
    -- حساب مؤشرات الأداء لليوم السابق
    PERFORM calculate_performance_metrics(CURRENT_DATE - INTERVAL '1 day');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إنشاء جدول للـ cron jobs (إذا كان مدعوماً)
-- CREATE TABLE IF NOT EXISTS cron_jobs (
--     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--     job_name TEXT NOT NULL,
--     schedule TEXT NOT NULL,
--     function_name TEXT NOT NULL,
--     is_active BOOLEAN DEFAULT true,
--     last_run TIMESTAMP WITH TIME ZONE,
--     next_run TIMESTAMP WITH TIME ZONE,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- إدراج بيانات تجريبية للميزات المتقدمة
INSERT INTO smart_reports (report_type, report_name, report_data, generated_by) VALUES
    ('patient_progress', 'تقرير تقدم المريض - يناير 2025', 
     '{"patient_id": "sample", "progress_percentage": 75, "goals_completed": 3, "sessions_attended": 8}',
     (SELECT id FROM profiles WHERE email = 'djharga@gmail.com'))
ON CONFLICT DO NOTHING;

INSERT INTO performance_analytics (metric_name, metric_value, metric_date, context) VALUES
    ('daily_sessions', 12, CURRENT_DATE, '{"total_patients": 15, "completed_sessions": 10}'),
    ('average_session_duration', 65.5, CURRENT_DATE, '{"total_sessions": 12, "total_duration": 786}')
ON CONFLICT DO NOTHING;

-- إنشاء views إضافية للتقارير
CREATE OR REPLACE VIEW daily_activity_summary AS
SELECT 
    DATE(session_date) as activity_date,
    COUNT(*) as total_sessions,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_sessions,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_sessions,
    AVG(duration) as avg_session_duration,
    COUNT(DISTINCT patient_id) as unique_patients,
    COUNT(DISTINCT therapist_id) as active_therapists
FROM sessions
GROUP BY DATE(session_date)
ORDER BY activity_date DESC;

CREATE OR REPLACE VIEW therapist_performance AS
SELECT 
    p.full_name as therapist_name,
    p.email as therapist_email,
    COUNT(s.id) as total_sessions,
    COUNT(CASE WHEN s.status = 'completed' THEN 1 END) as completed_sessions,
    AVG(s.current_progress) as avg_patient_progress,
    AVG(s.duration) as avg_session_duration,
    COUNT(DISTINCT s.patient_id) as unique_patients
FROM profiles p
LEFT JOIN sessions s ON p.id = s.therapist_id
WHERE p.role = 'therapist'
GROUP BY p.id, p.full_name, p.email
ORDER BY completed_sessions DESC;

CREATE OR REPLACE VIEW financial_dashboard AS
SELECT 
    DATE(expense_date) as expense_date,
    expense_category,
    SUM(amount) as total_amount,
    COUNT(*) as expense_count,
    AVG(amount) as avg_amount
FROM facility_expenses
GROUP BY DATE(expense_date), expense_category
ORDER BY expense_date DESC, total_amount DESC;

-- إنشاء فهارس إضافية للأداء
CREATE INDEX IF NOT EXISTS idx_smart_reports_type ON smart_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_smart_reports_generated_at ON smart_reports(generated_at);
CREATE INDEX IF NOT EXISTS idx_performance_analytics_date ON performance_analytics(metric_date);
CREATE INDEX IF NOT EXISTS idx_performance_analytics_name ON performance_analytics(metric_name);
CREATE INDEX IF NOT EXISTS idx_scheduled_notifications_is_sent ON scheduled_notifications(is_sent);

-- تعليقات على الميزات المتقدمة
COMMENT ON FUNCTION generate_smart_report IS 'إنشاء تقرير ذكي مع البيانات المخصصة';
COMMENT ON FUNCTION calculate_performance_metrics IS 'حساب مؤشرات الأداء اليومية';
COMMENT ON FUNCTION send_automatic_notification IS 'إرسال إشعار تلقائي للمستخدم';
COMMENT ON FUNCTION schedule_notification IS 'جدولة إشعار مستقبلي';
COMMENT ON VIEW daily_activity_summary IS 'ملخص الأنشطة اليومية';
COMMENT ON VIEW therapist_performance IS 'أداء المعالجين';
COMMENT ON VIEW financial_dashboard IS 'لوحة المعلومات المالية';

-- إنشاء جداول الميزات المتقدمة

-- جدول خطط العلاج
CREATE TABLE IF NOT EXISTS treatment_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    plan_type TEXT CHECK (plan_type IN ('individual', 'group', 'family')),
    duration_weeks INTEGER NOT NULL,
    sessions_per_week INTEGER NOT NULL,
    goals TEXT[] NOT NULL,
    interventions TEXT[] NOT NULL,
    risk_mitigation TEXT[] NOT NULL,
    success_metrics TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول تقييمات مخاطر الانتكاس
CREATE TABLE IF NOT EXISTS relapse_risks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    risk_factors TEXT[] NOT NULL,
    probability DECIMAL(3,2) NOT NULL CHECK (probability >= 0 AND probability <= 1),
    recommendations TEXT[] NOT NULL,
    next_assessment TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول الإشعارات
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    scheduled_for TIMESTAMP WITH TIME ZONE
);

-- جدول الإشعارات المجدولة
CREATE TABLE IF NOT EXISTS scheduled_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    action_url TEXT,
    scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول التقارير الذكية
CREATE TABLE IF NOT EXISTS smart_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    report_type TEXT NOT NULL,
    content TEXT NOT NULL,
    generated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول تحليلات الأداء
CREATE TABLE IF NOT EXISTS performance_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء Indexes للأداء
CREATE INDEX IF NOT EXISTS idx_treatment_plans_patient_id ON treatment_plans(patient_id);
CREATE INDEX IF NOT EXISTS idx_treatment_plans_created_at ON treatment_plans(created_at);

CREATE INDEX IF NOT EXISTS idx_relapse_risks_patient_id ON relapse_risks(patient_id);
CREATE INDEX IF NOT EXISTS idx_relapse_risks_risk_level ON relapse_risks(risk_level);
CREATE INDEX IF NOT EXISTS idx_relapse_risks_created_at ON relapse_risks(created_at);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

CREATE INDEX IF NOT EXISTS idx_scheduled_notifications_scheduled_for ON scheduled_notifications(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_scheduled_notifications_user_id ON scheduled_notifications(user_id);

CREATE INDEX IF NOT EXISTS idx_smart_reports_patient_id ON smart_reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_smart_reports_created_at ON smart_reports(created_at);

CREATE INDEX IF NOT EXISTS idx_performance_analytics_metric_name ON performance_analytics(metric_name);
CREATE INDEX IF NOT EXISTS idx_performance_analytics_period ON performance_analytics(period_start, period_end);

-- إنشاء RLS Policies
ALTER TABLE treatment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE relapse_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_analytics ENABLE ROW LEVEL SECURITY;

-- Policies لخطط العلاج
CREATE POLICY "Users can view treatment plans for their patients" ON treatment_plans
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = treatment_plans.patient_id 
            AND patients.therapist_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert treatment plans for their patients" ON treatment_plans
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = treatment_plans.patient_id 
            AND patients.therapist_id = auth.uid()
        )
    );

CREATE POLICY "Users can update treatment plans for their patients" ON treatment_plans
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = treatment_plans.patient_id 
            AND patients.therapist_id = auth.uid()
        )
    );

-- Policies لتقييمات مخاطر الانتكاس
CREATE POLICY "Users can view relapse risks for their patients" ON relapse_risks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = relapse_risks.patient_id 
            AND patients.therapist_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert relapse risks for their patients" ON relapse_risks
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = relapse_risks.patient_id 
            AND patients.therapist_id = auth.uid()
        )
    );

-- Policies للإشعارات
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own notifications" ON notifications
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own notifications" ON notifications
    FOR DELETE USING (user_id = auth.uid());

-- Policies للإشعارات المجدولة
CREATE POLICY "Users can view their own scheduled notifications" ON scheduled_notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own scheduled notifications" ON scheduled_notifications
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own scheduled notifications" ON scheduled_notifications
    FOR DELETE USING (user_id = auth.uid());

-- Policies للتقارير الذكية
CREATE POLICY "Users can view smart reports for their patients" ON smart_reports
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = smart_reports.patient_id 
            AND patients.therapist_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert smart reports for their patients" ON smart_reports
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = smart_reports.patient_id 
            AND patients.therapist_id = auth.uid()
        )
    );

-- Policies لتحليلات الأداء (للإدارة فقط)
CREATE POLICY "Admins can view performance analytics" ON performance_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can insert performance analytics" ON performance_analytics
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- إنشاء Functions مفيدة
CREATE OR REPLACE FUNCTION get_patient_treatment_plan(patient_uuid UUID)
RETURNS TABLE (
    plan_type TEXT,
    duration_weeks INTEGER,
    sessions_per_week INTEGER,
    goals TEXT[],
    interventions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tp.plan_type,
        tp.duration_weeks,
        tp.sessions_per_week,
        tp.goals,
        tp.interventions,
        tp.created_at
    FROM treatment_plans tp
    WHERE tp.patient_id = patient_uuid
    ORDER BY tp.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_patient_relapse_risk(patient_uuid UUID)
RETURNS TABLE (
    risk_level TEXT,
    probability DECIMAL(3,2),
    risk_factors TEXT[],
    recommendations TEXT[],
    next_assessment TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        rr.risk_level,
        rr.probability,
        rr.risk_factors,
        rr.recommendations,
        rr.next_assessment
    FROM relapse_risks rr
    WHERE rr.patient_id = patient_uuid
    ORDER BY rr.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_unread_notifications(user_uuid UUID)
RETURNS TABLE (
    id UUID,
    type TEXT,
    title TEXT,
    message TEXT,
    priority TEXT,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.id,
        n.type,
        n.title,
        n.message,
        n.priority,
        n.action_url,
        n.created_at
    FROM notifications n
    WHERE n.user_id = user_uuid AND n.read = FALSE
    ORDER BY n.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إنشاء Triggers للتحديث التلقائي
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_treatment_plans_updated_at
    BEFORE UPDATE ON treatment_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- إضافة بيانات تجريبية
INSERT INTO treatment_plans (patient_id, plan_type, duration_weeks, sessions_per_week, goals, interventions, risk_mitigation, success_metrics)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'individual', 12, 3, 
     ARRAY['التوقف عن تعاطي المخدرات', 'تحسين الصحة النفسية', 'إعادة الاندماج الاجتماعي'],
     ARRAY['العلاج السلوكي المعرفي', 'العلاج الدوائي', 'جلسات الدعم النفسي'],
     ARRAY['متابعة دورية', 'دعم عائلي', 'تجنب المحفزات'],
     ARRAY['عدم الانتكاس لمدة 3 أشهر', 'تحسن في الصحة النفسية', 'عودة للعمل']
    );

INSERT INTO relapse_risks (patient_id, risk_level, risk_factors, probability, recommendations, next_assessment)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'medium', 
     ARRAY['تاريخ انتكاسات متعدد', 'ضعف النظام الداعم'],
     0.45,
     ARRAY['زيادة المتابعة الأسبوعية', 'جلسات دعم إضافية', 'تعزيز الدعم العائلي'],
     NOW() + INTERVAL '7 days'
    ); 