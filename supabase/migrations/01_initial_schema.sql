-- 1. ENUMS & TYPES
CREATE TYPE user_role AS ENUM ('coach', 'member');
CREATE TYPE video_source AS ENUM ('youtube', 'vimeo', 'internal_upload');
CREATE TYPE assignment_status AS ENUM ('pending', 'in_progress', 'completed', 'missed');

-- 2. TABLES
-- Perfiles extendidos (Vinculado a auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role user_role DEFAULT 'member',
  avatar_url TEXT,
  language_pref TEXT DEFAULT 'es',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ejercicios (Biblioteca del Coach)
CREATE TABLE public.exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID REFERENCES public.profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_source video_source NOT NULL,
  video_url TEXT NOT NULL, -- URL externa o Path interno
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rutinas (Plantillas)
CREATE TABLE public.routines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID REFERENCES public.profiles(id) NOT NULL,
  name TEXT NOT NULL,
  difficulty_level TEXT, -- Beginner, Intermediate, Advanced
  estimated_duration_min INT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Items de Rutina (Ejercicios dentro de una rutina)
CREATE TABLE public.routine_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  routine_id UUID REFERENCES public.routines(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.exercises(id),
  order_index INT NOT NULL,
  sets INT DEFAULT 3,
  reps TEXT, -- "10-12" o "Fallo"
  rest_seconds INT DEFAULT 60,
  notes TEXT
);

-- Asignaciones (La relación Coach -> Miembro)
CREATE TABLE public.assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID REFERENCES public.profiles(id),
  member_id UUID REFERENCES public.profiles(id),
  routine_id UUID REFERENCES public.routines(id),
  status assignment_status DEFAULT 'pending',
  scheduled_date DATE,
  completed_date TIMESTAMPTZ,
  feedback_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. STORAGE
-- Crear bucket para videos subidos (Si el MCP lo permite, sino simular creación)
INSERT INTO storage.buckets (id, name, public) VALUES ('fitness-content', 'fitness-content', true) ON CONFLICT DO NOTHING;

-- 4. BASIC RLS (Row Level Security) - Habilitar seguridad
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Política simple: Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
