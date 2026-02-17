-- 1. AUTOMATIZACIÓN DE PERFILES (Trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'member')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. POLÍTICAS DE SEGURIDAD (RLS - Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts (safe for setup phase)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Coaches can view members" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Coaches manage own exercises" ON public.exercises;
DROP POLICY IF EXISTS "Coaches manage own routines" ON public.routines;
DROP POLICY IF EXISTS "Members can view exercises" ON public.exercises;
DROP POLICY IF EXISTS "Coach manages assignments" ON public.assignments;
DROP POLICY IF EXISTS "Member views own assignments" ON public.assignments;
DROP POLICY IF EXISTS "Member updates own assignments" ON public.assignments;

-- POLÍTICAS PARA PROFILES
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Coaches can view members" ON public.profiles
  FOR SELECT USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'coach' 
    AND role = 'member'
  );

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- POLÍTICAS PARA EXERCISES & ROUTINES
CREATE POLICY "Coaches manage own exercises" ON public.exercises
  FOR ALL USING (auth.uid() = coach_id);

CREATE POLICY "Coaches manage own routines" ON public.routines
  FOR ALL USING (auth.uid() = coach_id);

CREATE POLICY "Members can view exercises" ON public.exercises
  FOR SELECT TO authenticated USING (true);

-- POLÍTICAS PARA ASSIGNMENTS
CREATE POLICY "Coach manages assignments" ON public.assignments
  FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'coach');

CREATE POLICY "Member views own assignments" ON public.assignments
  FOR SELECT USING (auth.uid() = member_id);

CREATE POLICY "Member updates own assignments" ON public.assignments
  FOR UPDATE USING (auth.uid() = member_id);
