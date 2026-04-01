-- =====================================================
-- Migration 03: Multi-Tenant Architecture
-- =====================================================
-- Purpose: Add admin role and coach_id to enable proper multi-tenant data isolation
-- Date: 2026-03-31
-- Author: AI Agent
-- =====================================================

-- =====================================================
-- PHASE 1: Schema Changes
-- =====================================================

-- Step 1: Add 'admin' to user_role enum
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'admin' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
    ) THEN
        ALTER TYPE user_role ADD VALUE 'admin';
    END IF;
END $$;

-- Step 2: Add coach_id column to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS coach_id UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- Step 3: Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_coach_id ON profiles(coach_id);

-- Step 4: Create helper function for RLS policies (DRY principle)
CREATE OR REPLACE FUNCTION role_from_profiles()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid()
$$ LANGUAGE SQL STABLE;

-- =====================================================
-- PHASE 2: Data Migration
-- =====================================================

-- Migrate existing members to their coaches based on assignments
-- Strategy: Use most recent assignment to determine coach ownership
UPDATE profiles
SET coach_id = (
    SELECT coach_id 
    FROM assignments 
    WHERE assignments.member_id = profiles.id 
    AND assignments.coach_id IS NOT NULL
    ORDER BY assignments.created_at DESC 
    LIMIT 1
)
WHERE role = 'member' AND coach_id IS NULL;

-- Note: Members with no assignments will have coach_id = NULL (to be assigned manually)

-- =====================================================
-- PHASE 3: RLS Policy Updates (Admin Bypass)
-- =====================================================

-- Pattern: All policies get admin bypass prefix
-- Format: (role_from_profiles() = 'admin') OR (existing_logic)

-- -----------------------------------------------------
-- Table: profiles
-- -----------------------------------------------------

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (
    role_from_profiles() = 'admin' OR
    id = auth.uid()
);

DROP POLICY IF EXISTS "Coaches can view all members" ON profiles;
CREATE POLICY "Coaches can view all members" ON profiles
FOR SELECT USING (
    role_from_profiles() = 'admin' OR
    (role_from_profiles() = 'coach' AND role = 'member' AND coach_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (
    role_from_profiles() = 'admin' OR
    id = auth.uid()
);

-- -----------------------------------------------------
-- Table: exercises
-- -----------------------------------------------------

DROP POLICY IF EXISTS "Coaches can view their exercises" ON exercises;
CREATE POLICY "Coaches can view their exercises" ON exercises
FOR SELECT USING (
    role_from_profiles() = 'admin' OR
    coach_id = auth.uid()
);

DROP POLICY IF EXISTS "Coaches can insert their exercises" ON exercises;
CREATE POLICY "Coaches can insert their exercises" ON exercises
FOR INSERT WITH CHECK (
    role_from_profiles() = 'admin' OR
    coach_id = auth.uid()
);

DROP POLICY IF EXISTS "Coaches can update their exercises" ON exercises;
CREATE POLICY "Coaches can update their exercises" ON exercises
FOR UPDATE USING (
    role_from_profiles() = 'admin' OR
    coach_id = auth.uid()
);

DROP POLICY IF EXISTS "Coaches can delete their exercises" ON exercises;
CREATE POLICY "Coaches can delete their exercises" ON exercises
FOR DELETE USING (
    role_from_profiles() = 'admin' OR
    coach_id = auth.uid()
);

-- -----------------------------------------------------
-- Table: routines
-- -----------------------------------------------------

DROP POLICY IF EXISTS "Coaches can view their routines" ON routines;
CREATE POLICY "Coaches can view their routines" ON routines
FOR SELECT USING (
    role_from_profiles() = 'admin' OR
    coach_id = auth.uid()
);

DROP POLICY IF EXISTS "Coaches can insert their routines" ON routines;
CREATE POLICY "Coaches can insert their routines" ON routines
FOR INSERT WITH CHECK (
    role_from_profiles() = 'admin' OR
    coach_id = auth.uid()
);

DROP POLICY IF EXISTS "Coaches can update their routines" ON routines;
CREATE POLICY "Coaches can update their routines" ON routines
FOR UPDATE USING (
    role_from_profiles() = 'admin' OR
    coach_id = auth.uid()
);

DROP POLICY IF EXISTS "Coaches can delete their routines" ON routines;
CREATE POLICY "Coaches can delete their routines" ON routines
FOR DELETE USING (
    role_from_profiles() = 'admin' OR
    coach_id = auth.uid()
);

-- -----------------------------------------------------
-- Table: routine_items
-- -----------------------------------------------------

DROP POLICY IF EXISTS "Coaches can view routine_items" ON routine_items;
CREATE POLICY "Coaches can view routine_items" ON routine_items
FOR SELECT USING (
    role_from_profiles() = 'admin' OR
    EXISTS (
        SELECT 1 FROM routines WHERE routines.id = routine_items.routine_id AND routines.coach_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Coaches can insert routine_items" ON routine_items;
CREATE POLICY "Coaches can insert routine_items" ON routine_items
FOR INSERT WITH CHECK (
    role_from_profiles() = 'admin' OR
    EXISTS (
        SELECT 1 FROM routines WHERE routines.id = routine_items.routine_id AND routines.coach_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Coaches can update routine_items" ON routine_items;
CREATE POLICY "Coaches can update routine_items" ON routine_items
FOR UPDATE USING (
    role_from_profiles() = 'admin' OR
    EXISTS (
        SELECT 1 FROM routines WHERE routines.id = routine_items.routine_id AND routines.coach_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Coaches can delete routine_items" ON routine_items;
CREATE POLICY "Coaches can delete routine_items" ON routine_items
FOR DELETE USING (
    role_from_profiles() = 'admin' OR
    EXISTS (
        SELECT 1 FROM routines WHERE routines.id = routine_items.routine_id AND routines.coach_id = auth.uid()
    )
);

-- -----------------------------------------------------
-- Table: assignments
-- -----------------------------------------------------

DROP POLICY IF EXISTS "Coaches can view their assignments" ON assignments;
CREATE POLICY "Coaches can view their assignments" ON assignments
FOR SELECT USING (
    role_from_profiles() = 'admin' OR
    coach_id = auth.uid()
);

DROP POLICY IF EXISTS "Members can view their assignments" ON assignments;
CREATE POLICY "Members can view their assignments" ON assignments
FOR SELECT USING (
    role_from_profiles() = 'admin' OR
    member_id = auth.uid()
);

DROP POLICY IF EXISTS "Coaches can insert their assignments" ON assignments;
CREATE POLICY "Coaches can insert their assignments" ON assignments
FOR INSERT WITH CHECK (
    role_from_profiles() = 'admin' OR
    coach_id = auth.uid()
);

DROP POLICY IF EXISTS "Coaches can update their assignments" ON assignments;
CREATE POLICY "Coaches can update their assignments" ON assignments
FOR UPDATE USING (
    role_from_profiles() = 'admin' OR
    coach_id = auth.uid()
);

DROP POLICY IF EXISTS "Members can update their assignments" ON assignments;
CREATE POLICY "Members can update their assignments" ON assignments
FOR UPDATE USING (
    role_from_profiles() = 'admin' OR
    member_id = auth.uid()
);

DROP POLICY IF EXISTS "Coaches can delete their assignments" ON assignments;
CREATE POLICY "Coaches can delete their assignments" ON assignments
FOR DELETE USING (
    role_from_profiles() = 'admin' OR
    coach_id = auth.uid()
);

-- -----------------------------------------------------
-- Table: diets
-- -----------------------------------------------------

DROP POLICY IF EXISTS "Coaches can view diets" ON diets;
CREATE POLICY "Coaches can view diets" ON diets
FOR SELECT USING (
    role_from_profiles() = 'admin' OR
    coach_id = auth.uid()
);

DROP POLICY IF EXISTS "Members can view their diets" ON diets;
CREATE POLICY "Members can view their diets" ON diets
FOR SELECT USING (
    role_from_profiles() = 'admin' OR
    member_id = auth.uid()
);

DROP POLICY IF EXISTS "Coaches can insert diets" ON diets;
CREATE POLICY "Coaches can insert diets" ON diets
FOR INSERT WITH CHECK (
    role_from_profiles() = 'admin' OR
    coach_id = auth.uid()
);

DROP POLICY IF EXISTS "Coaches can update diets" ON diets;
CREATE POLICY "Coaches can update diets" ON diets
FOR UPDATE USING (
    role_from_profiles() = 'admin' OR
    coach_id = auth.uid()
);

DROP POLICY IF EXISTS "Coaches can delete diets" ON diets;
CREATE POLICY "Coaches can delete diets" ON diets
FOR DELETE USING (
    role_from_profiles() = 'admin' OR
    coach_id = auth.uid()
);

-- -----------------------------------------------------
-- Table: diet_templates
-- -----------------------------------------------------

DROP POLICY IF EXISTS "Coaches can view diet_templates" ON diet_templates;
CREATE POLICY "Coaches can view diet_templates" ON diet_templates
FOR SELECT USING (
    role_from_profiles() = 'admin' OR
    coach_id = auth.uid()
);

DROP POLICY IF EXISTS "Coaches can insert diet_templates" ON diet_templates;
CREATE POLICY "Coaches can insert diet_templates" ON diet_templates
FOR INSERT WITH CHECK (
    role_from_profiles() = 'admin' OR
    coach_id = auth.uid()
);

DROP POLICY IF EXISTS "Coaches can update diet_templates" ON diet_templates;
CREATE POLICY "Coaches can update diet_templates" ON diet_templates
FOR UPDATE USING (
    role_from_profiles() = 'admin' OR
    coach_id = auth.uid()
);

DROP POLICY IF EXISTS "Coaches can delete diet_templates" ON diet_templates;
CREATE POLICY "Coaches can delete diet_templates" ON diet_templates
FOR DELETE USING (
    role_from_profiles() = 'admin' OR
    coach_id = auth.uid()
);

-- -----------------------------------------------------
-- Table: leads
-- -----------------------------------------------------

DROP POLICY IF EXISTS "Coaches can view their leads" ON leads;
CREATE POLICY "Coaches can view their leads" ON leads
FOR SELECT USING (
    role_from_profiles() = 'admin' OR
    coach_id = auth.uid()
);

DROP POLICY IF EXISTS "Coaches can insert leads" ON leads;
CREATE POLICY "Coaches can insert leads" ON leads
FOR INSERT WITH CHECK (
    role_from_profiles() = 'admin' OR
    coach_id = auth.uid()
);

DROP POLICY IF EXISTS "Coaches can update their leads" ON leads;
CREATE POLICY "Coaches can update their leads" ON leads
FOR UPDATE USING (
    role_from_profiles() = 'admin' OR
    coach_id = auth.uid()
);

DROP POLICY IF EXISTS "Coaches can delete their leads" ON leads;
CREATE POLICY "Coaches can delete their leads" ON leads
FOR DELETE USING (
    role_from_profiles() = 'admin' OR
    coach_id = auth.uid()
);

-- =====================================================
-- PHASE 4: Validation Queries
-- =====================================================

-- Validation 1: Check enum was updated
SELECT COUNT(*) as admin_enum_exists 
FROM pg_enum 
WHERE enumlabel = 'admin' 
AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role');
-- Expected: 1

-- Validation 2: Check column was added
SELECT COUNT(*) as coach_id_column_exists 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'coach_id';
-- Expected: 1

-- Validation 3: Check members have coach_id populated (or NULL if no assignments)
SELECT 
    COUNT(*) as total_members,
    COUNT(coach_id) as members_with_coach,
    COUNT(*) - COUNT(coach_id) as orphaned_members
FROM profiles 
WHERE role = 'member';

-- Validation 4: Check index was created
SELECT COUNT(*) as index_exists 
FROM pg_indexes 
WHERE tablename = 'profiles' AND indexname = 'idx_profiles_coach_id';
-- Expected: 1

-- =====================================================
-- NOTES
-- =====================================================
-- 1. Enum migration is IRREVERSIBLE in Postgres
-- 2. Members with no assignments will have coach_id = NULL (manual assignment needed)
-- 3. Admin role must be assigned manually via SQL (never via API)
-- 4. All RLS policies now support admin bypass
-- 5. Run Supabase Advisors after migration to verify RLS coverage
