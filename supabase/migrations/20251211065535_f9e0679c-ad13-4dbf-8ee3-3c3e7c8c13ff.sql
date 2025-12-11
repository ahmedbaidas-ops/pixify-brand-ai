-- Create workspace_profiles table for KYB data
CREATE TABLE public.workspace_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  business_type TEXT,
  industry TEXT,
  team_size TEXT,
  primary_goals TEXT[] DEFAULT ARRAY[]::TEXT[],
  manages_multiple_brands BOOLEAN DEFAULT FALSE,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_id)
);

-- Enable RLS
ALTER TABLE public.workspace_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their workspace profile"
  ON public.workspace_profiles FOR SELECT
  USING (organization_id = get_user_org(auth.uid()));

CREATE POLICY "Users can insert their workspace profile"
  ON public.workspace_profiles FOR INSERT
  WITH CHECK (organization_id = get_user_org(auth.uid()));

CREATE POLICY "Users can update their workspace profile"
  ON public.workspace_profiles FOR UPDATE
  USING (organization_id = get_user_org(auth.uid()));

-- Create brand_templates table for hidden templates like Qatar Airways
CREATE TABLE public.brand_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  default_colors JSONB DEFAULT '{}'::JSONB,
  default_typography JSONB DEFAULT '{}'::JSONB,
  default_guideline JSONB DEFAULT '{}'::JSONB,
  demo_assets JSONB DEFAULT '[]'::JSONB,
  hidden BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (only admins can see templates)
ALTER TABLE public.brand_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only system can view brand templates"
  ON public.brand_templates FOR SELECT
  USING (hidden = FALSE);

-- Add onboarding fields to profiles table
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS company_name TEXT,
  ADD COLUMN IF NOT EXISTS role TEXT;

-- Insert the hidden Qatar Airways template
INSERT INTO public.brand_templates (name, default_colors, default_typography, default_guideline, demo_assets, hidden)
VALUES (
  'Qatar Airways',
  '{
    "primary": "#5C0A3A",
    "secondary": "#CBB59C",
    "neutral": "#0F1020",
    "accent": "#A2A2A2"
  }'::JSONB,
  '{
    "display": "Cormorant Garamond",
    "body": "Inter",
    "weights": ["400", "500", "600", "700"]
  }'::JSONB,
  '{
    "strategy": {
      "mission": "To connect the world with warmth and excellence, offering unmatched hospitality and seamless journeys.",
      "vision": "To be the most trusted and admired airline worldwide.",
      "values": ["Hospitality", "Excellence", "Trust", "Cultural Pride", "Innovation"]
    },
    "archetype": "Caregiver + Explorer",
    "tone": {
      "primary": ["Warm", "Elegant", "Trustworthy"],
      "secondary": ["Adventurous", "Reassuring", "Professional"]
    },
    "audience": "Global travelers seeking premium comfort and authentic Arabian hospitality"
  }'::JSONB,
  '[
    {"type": "logo", "name": "Primary Logo", "url": "/qatar-airways-logo.png"},
    {"type": "hero", "name": "Brand Hero", "url": "/qatar-hero.jpg"}
  ]'::JSONB,
  TRUE
);

-- Create trigger for updated_at
CREATE TRIGGER update_workspace_profiles_updated_at
  BEFORE UPDATE ON public.workspace_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_brand_templates_updated_at
  BEFORE UPDATE ON public.brand_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();