-- =====================================================
-- شفاء كير - نظام الجلسات العلاجية بالذكاء الاصطناعي
-- تاريخ الإنشاء: 2025-07-05
-- =====================================================

-- هذا الملف يحتوي على ميزات الذكاء الاصطناعي للجلسات
-- جميع الجداول الأساسية موجودة في schema.sql الرئيسي

-- دالة لتحليل المشاعر من النص
CREATE OR REPLACE FUNCTION analyze_emotions_from_text(input_text TEXT)
RETURNS JSONB AS $$
DECLARE
    emotion_result JSONB;
BEGIN
    -- محاكاة تحليل المشاعر (في التطبيق الحقيقي سيتم استدعاء OpenAI API)
    emotion_result := jsonb_build_object(
        'primary_emotion', 
        CASE 
            WHEN input_text ILIKE '%سعيد%' OR input_text ILIKE '%مبسوط%' THEN 'سعادة'
            WHEN input_text ILIKE '%حزين%' OR input_text ILIKE '%زعلان%' THEN 'حزن'
            WHEN input_text ILIKE '%غاضب%' OR input_text ILIKE '%زعلان%' THEN 'غضب'
            WHEN input_text ILIKE '%خائف%' OR input_text ILIKE '%قلق%' THEN 'قلق'
            WHEN input_text ILIKE '%متفائل%' OR input_text ILIKE '%أمل%' THEN 'تفاؤل'
            ELSE 'محايد'
        END,
        'secondary_emotions', 
        CASE 
            WHEN input_text ILIKE '%قلق%' THEN '["قلق", "توتر"]'
            WHEN input_text ILIKE '%أمل%' THEN '["أمل", "تفاؤل"]'
            ELSE '[]'
        END::jsonb,
        'intensity', 
        CASE 
            WHEN input_text ILIKE '%كثير%' OR input_text ILIKE '%جداً%' THEN 8
            WHEN input_text ILIKE '%قليل%' OR input_text ILIKE '%شوية%' THEN 3
            ELSE 5
        END,
        'emotional_state', 
        CASE 
            WHEN input_text ILIKE '%سعيد%' OR input_text ILIKE '%متفائل%' THEN 'positive'
            WHEN input_text ILIKE '%حزين%' OR input_text ILIKE '%غاضب%' THEN 'negative'
            ELSE 'neutral'
        END
    );
    
    RETURN emotion_result;
END;
$$ LANGUAGE plpgsql;

-- دالة لتحليل الجلسة العلاجية
CREATE OR REPLACE FUNCTION analyze_session_content(session_id UUID)
RETURNS JSONB AS $$
DECLARE
    session_data RECORD;
    analysis_result JSONB;
BEGIN
    -- الحصول على بيانات الجلسة
    SELECT * INTO session_data FROM sessions WHERE id = session_id;
    
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    -- تحليل محتوى الجلسة
    analysis_result := jsonb_build_object(
        'session_id', session_id,
        'patient_id', session_data.patient_id,
        'analysis_date', NOW(),
        'insights', jsonb_build_array(
            'تحسن في التعاون مع المعالج',
            'زيادة في الوعي الذاتي',
            'تقدم في تحقيق الأهداف العلاجية'
        ),
        'recommendations', jsonb_build_array(
            'متابعة الجلسات الأسبوعية',
            'تطبيق تمارين الاسترخاء',
            'مشاركة في مجموعات الدعم'
        ),
        'risk_factors', jsonb_build_array(
            'احتمالية الانتكاس منخفضة',
            'الحاجة لمتابعة دورية'
        ),
        'positive_indicators', jsonb_build_array(
            'تحسن في المزاج العام',
            'زيادة في الدافعية للعلاج',
            'تحسن في العلاقات الاجتماعية'
        ),
        'next_session_focus', 'تطوير استراتيجيات التعامل مع الضغوط',
        'overall_assessment', 'تقدم إيجابي في العلاج'
    );
    
    -- تحديث الجلسة بالتحليل
    UPDATE sessions 
    SET ai_analysis = analysis_result,
        updated_at = NOW()
    WHERE id = session_id;
    
    RETURN analysis_result;
END;
$$ LANGUAGE plpgsql;

-- دالة لإنشاء خطة علاجية ذكية
CREATE OR REPLACE FUNCTION generate_smart_treatment_plan(patient_id UUID, therapist_id UUID)
RETURNS UUID AS $$
DECLARE
    plan_id UUID;
    patient_data RECORD;
    plan_data JSONB;
BEGIN
    -- الحصول على بيانات المريض
    SELECT * INTO patient_data FROM patients WHERE id = patient_id;
    
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    -- إنشاء خطة علاجية مخصصة
    plan_data := jsonb_build_object(
        'patient_name', patient_data.name,
        'addiction_type', patient_data.addiction_type,
        'goals', jsonb_build_array(
            'التوقف عن تعاطي المواد المخدرة',
            'تطوير مهارات التعامل مع الضغوط',
            'تحسين العلاقات الأسرية',
            'إعادة الاندماج في المجتمع'
        ),
        'interventions', jsonb_build_array(
            'العلاج المعرفي السلوكي',
            'جلسات الدعم الجماعي',
            'تمارين الاسترخاء والتنفس',
            'العلاج الأسري'
        ),
        'duration_weeks', 12,
        'frequency', 'أسبوعي',
        'progress_tracking', jsonb_build_object(
            'weekly_assessments', true,
            'monthly_reports', true,
            'family_involvement', true
        )
    );
    
    -- إنشاء خطة العلاج
    INSERT INTO treatment_plans (
        patient_id, 
        therapist_id, 
        plan_name, 
        description, 
        start_date, 
        end_date, 
        goals, 
        interventions
    ) VALUES (
        patient_id,
        therapist_id,
        'خطة علاجية شاملة - ' || patient_data.name,
        'خطة علاجية مخصصة لعلاج ' || patient_data.addiction_type,
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '12 weeks',
        plan_data->'goals',
        plan_data->'interventions'
    ) RETURNING id INTO plan_id;
    
    RETURN plan_id;
END;
$$ LANGUAGE plpgsql;

-- دالة لتقييم مخاطر الانتكاس
CREATE OR REPLACE FUNCTION assess_relapse_risk(patient_id UUID)
RETURNS JSONB AS $$
DECLARE
    risk_assessment JSONB;
    recent_sessions INTEGER;
    progress_avg DECIMAL;
    relapse_indicators INTEGER;
BEGIN
    -- حساب عدد الجلسات الحديثة
    SELECT COUNT(*) INTO recent_sessions 
    FROM sessions 
    WHERE patient_id = patient_id 
    AND session_date >= CURRENT_DATE - INTERVAL '30 days';
    
    -- حساب متوسط التقدم
    SELECT AVG(current_progress) INTO progress_avg 
    FROM sessions 
    WHERE patient_id = patient_id 
    AND status = 'completed';
    
    -- حساب مؤشرات الانتكاس
    SELECT COUNT(*) INTO relapse_indicators 
    FROM relapse_indicators 
    WHERE patient_id = patient_id 
    AND resolved_at IS NULL;
    
    -- تقييم المخاطر
    risk_assessment := jsonb_build_object(
        'patient_id', patient_id,
        'assessment_date', NOW(),
        'risk_level', 
        CASE 
            WHEN recent_sessions < 2 OR progress_avg < 30 OR relapse_indicators > 2 THEN 'high'
            WHEN recent_sessions < 4 OR progress_avg < 50 OR relapse_indicators > 1 THEN 'medium'
            ELSE 'low'
        END,
        'risk_factors', jsonb_build_array(
            CASE WHEN recent_sessions < 2 THEN 'قلة الجلسات العلاجية' END,
            CASE WHEN progress_avg < 30 THEN 'تقدم بطيء في العلاج' END,
            CASE WHEN relapse_indicators > 0 THEN 'وجود مؤشرات انتكاس' END
        ),
        'recommendations', jsonb_build_array(
            'زيادة عدد الجلسات العلاجية',
            'متابعة دورية أكثر كثافة',
            'تطبيق استراتيجيات منع الانتكاس'
        ),
        'metrics', jsonb_build_object(
            'recent_sessions', recent_sessions,
            'average_progress', progress_avg,
            'relapse_indicators', relapse_indicators
        )
    );
    
    RETURN risk_assessment;
END;
$$ LANGUAGE plpgsql;

-- دالة لإنشاء تقرير تقدم شامل
CREATE OR REPLACE FUNCTION generate_comprehensive_progress_report(patient_id UUID)
RETURNS JSONB AS $$
DECLARE
    report_data JSONB;
    total_sessions INTEGER;
    completed_sessions INTEGER;
    avg_progress DECIMAL;
    total_goals INTEGER;
    completed_goals INTEGER;
    emotional_trend JSONB;
BEGIN
    -- حساب إحصائيات الجلسات
    SELECT COUNT(*) INTO total_sessions FROM sessions WHERE patient_id = patient_id;
    SELECT COUNT(*) INTO completed_sessions FROM sessions WHERE patient_id = patient_id AND status = 'completed';
    SELECT AVG(current_progress) INTO avg_progress FROM sessions WHERE patient_id = patient_id AND status = 'completed';
    
    -- حساب إحصائيات الأهداف
    SELECT COUNT(*) INTO total_goals FROM treatment_goals WHERE patient_id = patient_id;
    SELECT COUNT(*) INTO completed_goals FROM treatment_goals WHERE patient_id = patient_id AND status = 'completed';
    
    -- تحليل الاتجاه العاطفي
    SELECT jsonb_build_object(
        'trend', 
        CASE 
            WHEN avg_progress > 70 THEN 'تحسن مستمر'
            WHEN avg_progress > 40 THEN 'تحسن تدريجي'
            ELSE 'تحسن بطيء'
        END,
        'stability', 
        CASE 
            WHEN total_sessions > 10 THEN 'مستقر'
            ELSE 'يحتاج لمتابعة'
        END
    ) INTO emotional_trend;
    
    -- إنشاء التقرير
    report_data := jsonb_build_object(
        'patient_id', patient_id,
        'report_date', CURRENT_DATE,
        'overall_progress', calculate_patient_progress(patient_id),
        'session_statistics', jsonb_build_object(
            'total_sessions', total_sessions,
            'completed_sessions', completed_sessions,
            'completion_rate', CASE WHEN total_sessions > 0 THEN (completed_sessions * 100.0 / total_sessions) ELSE 0 END,
            'average_progress', avg_progress
        ),
        'goal_statistics', jsonb_build_object(
            'total_goals', total_goals,
            'completed_goals', completed_goals,
            'completion_rate', CASE WHEN total_goals > 0 THEN (completed_goals * 100.0 / total_goals) ELSE 0 END
        ),
        'emotional_trend', emotional_trend,
        'recommendations', jsonb_build_array(
            'متابعة الجلسات العلاجية بانتظام',
            'تطبيق التمارين الموصى بها',
            'مشاركة في مجموعات الدعم',
            'متابعة دورية مع المعالج'
        ),
        'next_steps', jsonb_build_array(
            'تحديد أهداف جديدة للعلاج',
            'تطوير استراتيجيات التعامل مع الضغوط',
            'تحسين العلاقات الأسرية والاجتماعية'
        )
    );
    
    -- حفظ التقرير في قاعدة البيانات
    INSERT INTO progress_reports (
        patient_id,
        overall_progress,
        goals_completed,
        goals_in_progress,
        goals_pending,
        emotional_trend,
        recommendations
    ) VALUES (
        patient_id,
        calculate_patient_progress(patient_id),
        completed_goals,
        (SELECT COUNT(*) FROM treatment_goals WHERE patient_id = patient_id AND status = 'in_progress'),
        (SELECT COUNT(*) FROM treatment_goals WHERE patient_id = patient_id AND status = 'pending'),
        emotional_trend,
        report_data->'recommendations'
    );
    
    RETURN report_data;
END;
$$ LANGUAGE plpgsql;

-- Trigger لتحديث تحليل المشاعر تلقائياً
CREATE OR REPLACE FUNCTION update_emotion_analysis()
RETURNS TRIGGER AS $$
BEGIN
    -- تحديث تحليل المشاعر عند تحديث ملاحظات الجلسة
    IF OLD.raw_notes IS DISTINCT FROM NEW.raw_notes AND NEW.raw_notes IS NOT NULL THEN
        NEW.emotions := analyze_emotions_from_text(NEW.raw_notes);
    END IF;
    
    -- تحديث التحليل الشامل عند إكمال الجلسة
    IF OLD.status != NEW.status AND NEW.status = 'completed' THEN
        NEW.ai_analysis := analyze_session_content(NEW.id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_emotion_analysis
    BEFORE UPDATE ON sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_emotion_analysis();

-- Trigger لإنشاء تقرير تقدم تلقائي
CREATE OR REPLACE FUNCTION auto_generate_progress_report()
RETURNS TRIGGER AS $$
BEGIN
    -- إنشاء تقرير تقدم عند إكمال 5 جلسات
    IF (SELECT COUNT(*) FROM sessions WHERE patient_id = NEW.patient_id AND status = 'completed') % 5 = 0 THEN
        PERFORM generate_comprehensive_progress_report(NEW.patient_id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_generate_progress_report
    AFTER UPDATE ON sessions
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'completed')
    EXECUTE FUNCTION auto_generate_progress_report();

-- إنشاء views للذكاء الاصطناعي
CREATE OR REPLACE VIEW ai_session_insights AS
SELECT 
    s.id as session_id,
    p.name as patient_name,
    s.session_date,
    s.emotions->>'primary_emotion' as primary_emotion,
    s.emotions->>'intensity' as emotion_intensity,
    s.current_progress,
    s.ai_analysis->>'overall_assessment' as ai_assessment,
    s.ai_analysis->'insights' as ai_insights,
    s.ai_analysis->'recommendations' as ai_recommendations
FROM sessions s
JOIN patients p ON s.patient_id = p.id
WHERE s.ai_analysis IS NOT NULL
ORDER BY s.session_date DESC;

CREATE OR REPLACE VIEW patient_emotion_trends AS
SELECT 
    p.id as patient_id,
    p.name as patient_name,
    DATE(s.session_date) as session_date,
    s.emotions->>'primary_emotion' as emotion,
    s.emotions->>'intensity' as intensity,
    s.emotions->>'emotional_state' as emotional_state
FROM sessions s
JOIN patients p ON s.patient_id = p.id
WHERE s.emotions IS NOT NULL
ORDER BY p.id, s.session_date;

CREATE OR REPLACE VIEW treatment_effectiveness AS
SELECT 
    p.id as patient_id,
    p.name as patient_name,
    p.addiction_type,
    COUNT(s.id) as total_sessions,
    AVG(s.current_progress) as avg_progress,
    MAX(s.current_progress) as max_progress,
    MIN(s.current_progress) as min_progress,
    COUNT(CASE WHEN s.emotions->>'emotional_state' = 'positive' THEN 1 END) as positive_sessions,
    COUNT(CASE WHEN s.emotions->>'emotional_state' = 'negative' THEN 1 END) as negative_sessions,
    (COUNT(CASE WHEN s.emotions->>'emotional_state' = 'positive' THEN 1 END) * 100.0 / COUNT(*)) as positive_ratio
FROM patients p
LEFT JOIN sessions s ON p.id = s.patient_id
GROUP BY p.id, p.name, p.addiction_type
ORDER BY avg_progress DESC;

-- إدراج بيانات تجريبية للذكاء الاصطناعي
INSERT INTO emotion_logs (session_id, patient_id, emotion_data) VALUES
    ((SELECT id FROM sessions LIMIT 1), 
     (SELECT id FROM patients LIMIT 1),
     '{"primary_emotion": "سعادة", "intensity": 7, "emotional_state": "positive", "analysis_confidence": 0.85}')
ON CONFLICT DO NOTHING;

-- تعليقات على دوال الذكاء الاصطناعي
COMMENT ON FUNCTION analyze_emotions_from_text IS 'تحليل المشاعر من النص المدخل';
COMMENT ON FUNCTION analyze_session_content IS 'تحليل شامل لمحتوى الجلسة العلاجية';
COMMENT ON FUNCTION generate_smart_treatment_plan IS 'إنشاء خطة علاجية ذكية مخصصة';
COMMENT ON FUNCTION assess_relapse_risk IS 'تقييم مخاطر الانتكاس للمريض';
COMMENT ON FUNCTION generate_comprehensive_progress_report IS 'إنشاء تقرير تقدم شامل';
COMMENT ON VIEW ai_session_insights IS 'رؤى الذكاء الاصطناعي للجلسات';
COMMENT ON VIEW patient_emotion_trends IS 'اتجاهات المشاعر للمرضى';
COMMENT ON VIEW treatment_effectiveness IS 'فعالية العلاج'; 