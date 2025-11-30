-- ============================================================================
-- VocalWell.ai Complete Database Schema
-- Run this entire script in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for location data (if needed in future)
-- CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================================================
-- 2. CUSTOM TYPES
-- ============================================================================

-- Risk level enum
CREATE TYPE risk_level AS ENUM ('low', 'moderate', 'high');

-- Report status enum
CREATE TYPE report_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- ============================================================================
-- 3. TABLES
-- ============================================================================

-- -----------------------------------------------------------------------------
-- User Profiles Table (extends auth.users)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  occupation TEXT,
  medical_history JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.profiles IS 'Extended user profile information';
COMMENT ON COLUMN public.profiles.medical_history IS 'JSON object containing relevant medical history';
COMMENT ON COLUMN public.profiles.preferences IS 'User preferences for UI, notifications, etc.';

-- -----------------------------------------------------------------------------
-- Voice Analysis Reports Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Report metadata
  report_path TEXT NOT NULL,
  plot_path TEXT,
  audio_path TEXT,
  
  -- Analysis results
  class TEXT NOT NULL,
  risk_level risk_level,
  prediction TEXT NOT NULL,
  confidence_score DECIMAL(5, 2) CHECK (confidence_score >= 0 AND confidence_score <= 100),
  
  -- Acoustic features (stored as JSON for flexibility)
  features JSONB DEFAULT '{}',
  
  -- Processing status
  status report_status DEFAULT 'completed',
  processing_time_ms INTEGER,
  
  -- Metadata
  notes TEXT,
  tags TEXT[],
  is_archived BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.reports IS 'Voice pathology analysis reports';
COMMENT ON COLUMN public.reports.features IS 'JSON containing jitter, shimmer, HNR, formants, etc.';
COMMENT ON COLUMN public.reports.confidence_score IS 'AI model confidence percentage (0-100)';

-- -----------------------------------------------------------------------------
-- Analysis History Table (tracks all analysis attempts)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.analysis_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  report_id UUID REFERENCES public.reports(id) ON DELETE SET NULL,
  
  -- Input details
  audio_duration_seconds DECIMAL(10, 2),
  audio_format TEXT,
  audio_size_bytes BIGINT,
  
  -- Processing details
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status report_status DEFAULT 'pending',
  error_message TEXT,
  
  -- Results
  raw_prediction JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.analysis_history IS 'Complete history of all voice analysis attempts';

-- -----------------------------------------------------------------------------
-- User Settings Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  
  -- Notification preferences
  email_notifications BOOLEAN DEFAULT TRUE,
  report_reminders BOOLEAN DEFAULT TRUE,
  marketing_emails BOOLEAN DEFAULT FALSE,
  
  -- UI preferences
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  
  -- Privacy settings
  data_sharing_consent BOOLEAN DEFAULT FALSE,
  anonymous_analytics BOOLEAN DEFAULT TRUE,
  
  -- Other settings
  settings_json JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.user_settings IS 'User preferences and settings';

-- ============================================================================
-- 4. INDEXES
-- ============================================================================

-- Reports indexes
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON public.reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_class ON public.reports(class);
CREATE INDEX IF NOT EXISTS idx_reports_risk_level ON public.reports(risk_level);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_archived ON public.reports(is_archived) WHERE is_archived = FALSE;

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Analysis history indexes
CREATE INDEX IF NOT EXISTS idx_analysis_history_user_id ON public.analysis_history(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_history_created_at ON public.analysis_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analysis_history_status ON public.analysis_history(status);

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- Profiles RLS Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- Reports RLS Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can view own reports"
  ON public.reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports"
  ON public.reports FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports"
  ON public.reports FOR DELETE
  USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- Analysis History RLS Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can view own analysis history"
  ON public.analysis_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analysis history"
  ON public.analysis_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- User Settings RLS Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can view own settings"
  ON public.user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON public.user_settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON public.user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 6. FUNCTIONS
-- ============================================================================

-- -----------------------------------------------------------------------------
-- Auto-update updated_at timestamp
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.handle_updated_at IS 'Automatically updates updated_at timestamp';

-- -----------------------------------------------------------------------------
-- Create user profile on sign up
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.handle_new_user IS 'Creates profile and settings when new user signs up';

-- -----------------------------------------------------------------------------
-- Get user statistics
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_reports', COUNT(*),
    'latest_report_date', MAX(created_at),
    'risk_distribution', json_build_object(
      'low', COUNT(*) FILTER (WHERE risk_level = 'low'),
      'moderate', COUNT(*) FILTER (WHERE risk_level = 'moderate'),
      'high', COUNT(*) FILTER (WHERE risk_level = 'high')
    ),
    'class_distribution', json_object_agg(class, count)
  ) INTO result
  FROM (
    SELECT class, COUNT(*) as count
    FROM public.reports
    WHERE user_id = user_uuid AND is_archived = FALSE
    GROUP BY class
  ) subquery,
  public.reports
  WHERE user_id = user_uuid AND is_archived = FALSE;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_user_stats IS 'Returns aggregated statistics for a user';

-- ============================================================================
-- 7. TRIGGERS
-- ============================================================================

-- Auto-update updated_at for profiles
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Auto-update updated_at for reports
CREATE TRIGGER set_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Auto-update updated_at for user_settings
CREATE TRIGGER set_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create profile on user sign up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 8. STORAGE POLICIES
-- ============================================================================

-- Note: These policies are for storage buckets. Make sure buckets are created first.

-- Policy for voice-reports bucket
-- INSERT POLICY "Authenticated users can upload reports" ON storage.objects
-- FOR INSERT WITH CHECK (
--   bucket_id = 'voice-reports' AND
--   auth.role() = 'authenticated'
-- );

-- INSERT POLICY "Anyone can read reports" ON storage.objects
-- FOR SELECT USING (bucket_id = 'voice-reports');

-- ============================================================================
-- 9. SAMPLE DATA (Optional - Remove in production)
-- ============================================================================

-- Uncomment to insert sample data for testing
/*
-- Insert sample report
INSERT INTO public.reports (
  user_id,
  report_path,
  plot_path,
  class,
  risk_level,
  prediction,
  confidence_score,
  features
) VALUES (
  auth.uid(),
  '/reports/sample-report.pdf',
  '/plots/sample-plot.png',
  'Healthy',
  'low',
  'Your voice shows no indication of vocal pathology',
  95.5,
  '{
    "jitter": 0.82,
    "shimmer": 2.15,
    "hnr": 15.3,
    "f0_mean": 125.5,
    "formants": [720, 1220, 2650]
  }'::jsonb
);
*/

-- ============================================================================
-- 10. GRANTS & PERMISSIONS
-- ============================================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant access to tables
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reports TO authenticated;
GRANT SELECT, INSERT ON public.analysis_history TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_settings TO authenticated;

-- Grant access to functions
GRANT EXECUTE ON FUNCTION public.get_user_stats TO authenticated;

-- ============================================================================
-- SCRIPT COMPLETE
-- ============================================================================

-- Verify tables were created
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Database schema created successfully!';
  RAISE NOTICE '📊 Tables: profiles, reports, analysis_history, user_settings';
  RAISE NOTICE '🔒 RLS policies enabled on all tables';
  RAISE NOTICE '⚡ Triggers and functions created';
  RAISE NOTICE '🎉 Your VocalWell.ai database is ready!';
END $$;
