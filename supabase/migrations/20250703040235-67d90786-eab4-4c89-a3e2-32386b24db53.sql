-- Create enum types
CREATE TYPE addiction_type AS ENUM ('مخدرات', 'كحول', 'تدخين', 'مخدرات رقمية', 'أدوية', 'أخرى');
CREATE TYPE treatment_stage AS ENUM ('انسحاب', 'إعادة تأهيل', 'متابعة', 'تعافي');
CREATE TYPE session_type AS ENUM ('دعم نفسي', 'جماعية', 'تقييم', 'متابعة');
CREATE TYPE attendance_status AS ENUM ('حضر', 'غاب', 'متأخر');
CREATE TYPE user_role AS ENUM ('مدير', 'معالج', 'مشرف');

-- Create profiles table for additional user info
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'معالج',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patients table
CREATE TABLE public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age > 0 AND age < 120),
    addiction_type addiction_type NOT NULL,
    medical_history TEXT,
    treatment_stage treatment_stage NOT NULL DEFAULT 'تقييم',
    assigned_therapist_id UUID REFERENCES public.profiles(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sessions table
CREATE TABLE public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    session_type session_type NOT NULL,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES public.profiles(user_id),
    session_notes TEXT,
    attendance_status attendance_status DEFAULT 'حضر',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patient notes table
CREATE TABLE public.patient_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES public.profiles(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for patients
CREATE POLICY "Authenticated users can view patients" ON public.patients FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert patients" ON public.patients FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update patients" ON public.patients FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete patients" ON public.patients FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for sessions
CREATE POLICY "Authenticated users can view sessions" ON public.sessions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert sessions" ON public.sessions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update sessions" ON public.sessions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete sessions" ON public.sessions FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for patient notes
CREATE POLICY "Authenticated users can view patient notes" ON public.patient_notes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert patient notes" ON public.patient_notes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update their own notes" ON public.patient_notes FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Authenticated users can delete their own notes" ON public.patient_notes FOR DELETE USING (auth.uid() = created_by);

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON public.patients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON public.sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();