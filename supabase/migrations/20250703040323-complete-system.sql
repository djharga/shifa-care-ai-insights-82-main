-- Create enum types first
CREATE TYPE user_role AS ENUM ('admin', 'therapist', 'nurse', 'staff');
CREATE TYPE gender AS ENUM ('male', 'female');
CREATE TYPE patient_status AS ENUM ('active', 'completed', 'paused', 'dropped_out');
CREATE TYPE session_type AS ENUM ('individual', 'group', 'family');
CREATE TYPE session_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');

-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    role user_role DEFAULT 'staff',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create patients table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    date_of_birth DATE,
    gender gender,
    addiction_type TEXT NOT NULL,
    status patient_status DEFAULT 'active',
    admission_date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sessions table
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    session_type session_type DEFAULT 'individual',
    status session_status DEFAULT 'scheduled',
    duration INTEGER DEFAULT 60,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create patient_notes table
CREATE TABLE patient_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    note_type TEXT DEFAULT 'general',
    content TEXT NOT NULL,
    is_private BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Profiles are viewable by authenticated users" 
    ON profiles FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Users can update own profile" 
    ON profiles FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = id);

CREATE POLICY "Patients are viewable by authenticated users" 
    ON patients FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Authenticated users can insert patients" 
    ON patients FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update patients" 
    ON patients FOR UPDATE 
    TO authenticated 
    USING (true);

CREATE POLICY "Sessions are viewable by authenticated users" 
    ON sessions FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Authenticated users can insert sessions" 
    ON sessions FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update sessions" 
    ON sessions FOR UPDATE 
    TO authenticated 
    USING (true);

CREATE POLICY "Patient notes are viewable by authenticated users" 
    ON patient_notes FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Authenticated users can insert patient notes" 
    ON patient_notes FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update patient notes" 
    ON patient_notes FOR UPDATE 
    TO authenticated 
    USING (true);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_sessions_updated_at
    BEFORE UPDATE ON sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_patient_notes_updated_at
    BEFORE UPDATE ON patient_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, full_name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();