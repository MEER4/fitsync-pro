-- ========================================
-- Run this in Supabase SQL Editor
-- Dashboard > SQL Editor > New Query
-- ========================================

-- 1. Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    coach_id UUID REFERENCES profiles(id),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    age TEXT,
    weight TEXT,
    height TEXT,
    gender TEXT,
    goal TEXT,
    plan TEXT,
    experience_level TEXT,
    availability TEXT,
    medical_conditions TEXT,
    contact_preference TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS on leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 3. Allow public INSERT (for landing page form, no auth needed)
CREATE POLICY "Anyone can insert leads" ON leads
    FOR INSERT
    WITH CHECK (true);

-- 4. Allow coaches to read their own leads
CREATE POLICY "Coaches can view their leads" ON leads
    FOR SELECT
    USING (coach_id = auth.uid());

-- 5. Allow coaches to update their own leads
CREATE POLICY "Coaches can update their leads" ON leads
    FOR UPDATE
    USING (coach_id = auth.uid());

-- 6. Allow coaches to delete their own leads
CREATE POLICY "Coaches can delete their leads" ON leads
    FOR DELETE
    USING (coach_id = auth.uid());

-- 7. Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 8. Allow authenticated users to upload avatars
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- 9. Allow anyone to view avatars (public bucket)
CREATE POLICY "Anyone can view avatars" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'avatars');

-- 10. Allow users to update/delete their own avatars
CREATE POLICY "Users can update own avatars" ON storage.objects
    FOR UPDATE
    USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own avatars" ON storage.objects
    FOR DELETE
    USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Done! ✅
