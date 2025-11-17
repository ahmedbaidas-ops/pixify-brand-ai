-- Prompt Library Governance Tables

-- Prompt Templates table
CREATE TABLE public.prompt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'generate', 'optimize', 'motion', 'copy'
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'review', 'approved', 'archived'
  is_default BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[] DEFAULT ARRAY[]::text[],
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Prompt Versions table
CREATE TABLE public.prompt_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.prompt_templates(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  system_prompt TEXT,
  parameters JSONB DEFAULT '{}'::jsonb, -- temperature, max_tokens, etc.
  is_active BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(template_id, version_number)
);

-- A/B Test Configurations
CREATE TABLE public.prompt_ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  template_id UUID NOT NULL REFERENCES public.prompt_templates(id) ON DELETE CASCADE,
  variant_a_id UUID NOT NULL REFERENCES public.prompt_versions(id),
  variant_b_id UUID NOT NULL REFERENCES public.prompt_versions(id),
  traffic_split INTEGER DEFAULT 50 CHECK (traffic_split >= 0 AND traffic_split <= 100),
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'running', 'paused', 'completed'
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  success_metric TEXT DEFAULT 'user_satisfaction', -- 'user_satisfaction', 'completion_rate', 'token_efficiency'
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Prompt Usage Analytics
CREATE TABLE public.prompt_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES public.prompt_templates(id) ON DELETE CASCADE,
  version_id UUID REFERENCES public.prompt_versions(id),
  ab_test_id UUID REFERENCES public.prompt_ab_tests(id),
  user_id UUID REFERENCES auth.users(id),
  execution_time_ms INTEGER,
  tokens_used INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  user_feedback TEXT,
  result_metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_prompt_templates_org ON public.prompt_templates(organization_id);
CREATE INDEX idx_prompt_templates_status ON public.prompt_templates(status);
CREATE INDEX idx_prompt_templates_category ON public.prompt_templates(category);
CREATE INDEX idx_prompt_versions_template ON public.prompt_versions(template_id);
CREATE INDEX idx_prompt_ab_tests_org ON public.prompt_ab_tests(organization_id);
CREATE INDEX idx_prompt_ab_tests_status ON public.prompt_ab_tests(status);
CREATE INDEX idx_prompt_analytics_template ON public.prompt_analytics(template_id);
CREATE INDEX idx_prompt_analytics_created ON public.prompt_analytics(created_at DESC);

-- Enable RLS
ALTER TABLE public.prompt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Prompt Templates: Admins can manage, users can view approved
CREATE POLICY "Admins can manage prompt templates"
ON public.prompt_templates FOR ALL
TO authenticated
USING (has_role(auth.uid(), organization_id, 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), organization_id, 'admin'::app_role));

CREATE POLICY "Users can view approved prompts"
ON public.prompt_templates FOR SELECT
TO authenticated
USING (
  organization_id = get_user_org(auth.uid()) AND 
  status = 'approved'
);

-- Prompt Versions: Admins can manage, users can view versions of approved templates
CREATE POLICY "Admins can manage prompt versions"
ON public.prompt_versions FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.prompt_templates pt
    WHERE pt.id = prompt_versions.template_id
    AND has_role(auth.uid(), pt.organization_id, 'admin'::app_role)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.prompt_templates pt
    WHERE pt.id = prompt_versions.template_id
    AND has_role(auth.uid(), pt.organization_id, 'admin'::app_role)
  )
);

CREATE POLICY "Users can view versions of approved templates"
ON public.prompt_versions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.prompt_templates pt
    WHERE pt.id = prompt_versions.template_id
    AND pt.organization_id = get_user_org(auth.uid())
    AND pt.status = 'approved'
  )
);

-- A/B Tests: Admins only
CREATE POLICY "Admins can manage A/B tests"
ON public.prompt_ab_tests FOR ALL
TO authenticated
USING (has_role(auth.uid(), organization_id, 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), organization_id, 'admin'::app_role));

-- Analytics: Users can log their own usage, admins can view all
CREATE POLICY "Users can log prompt analytics"
ON public.prompt_analytics FOR INSERT
TO authenticated
WITH CHECK (
  organization_id = get_user_org(auth.uid()) AND
  user_id = auth.uid()
);

CREATE POLICY "Admins can view all analytics"
ON public.prompt_analytics FOR SELECT
TO authenticated
USING (has_role(auth.uid(), organization_id, 'admin'::app_role));

CREATE POLICY "Users can view their own analytics"
ON public.prompt_analytics FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Update triggers
CREATE TRIGGER update_prompt_templates_updated_at 
BEFORE UPDATE ON public.prompt_templates
FOR EACH ROW EXECUTE FUNCTION update_admin_updated_at_column();

CREATE TRIGGER update_prompt_ab_tests_updated_at 
BEFORE UPDATE ON public.prompt_ab_tests
FOR EACH ROW EXECUTE FUNCTION update_admin_updated_at_column();

-- Function to activate prompt version
CREATE OR REPLACE FUNCTION activate_prompt_version(p_version_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_template_id UUID;
BEGIN
  -- Get template_id
  SELECT template_id INTO v_template_id 
  FROM prompt_versions 
  WHERE id = p_version_id;
  
  -- Deactivate all other versions
  UPDATE prompt_versions 
  SET is_active = false 
  WHERE template_id = v_template_id;
  
  -- Activate this version
  UPDATE prompt_versions 
  SET is_active = true 
  WHERE id = p_version_id;
END;
$$;

-- Seed example prompts
INSERT INTO public.prompt_templates (
  organization_id, 
  name, 
  description, 
  category, 
  status, 
  is_default,
  tags
)
SELECT 
  o.id,
  'Brand-Aligned Social Post Generator',
  'Generates social media posts that match brand tone and visual identity',
  'generate',
  'approved',
  true,
  ARRAY['social-media', 'content-generation']
FROM public.organizations o
LIMIT 1;

INSERT INTO public.prompt_templates (
  organization_id, 
  name, 
  description, 
  category, 
  status,
  tags
)
SELECT 
  o.id,
  'Motion Asset Prompt Optimizer',
  'Enhances user prompts with brand context for motion generation',
  'motion',
  'approved',
  ARRAY['motion', 'video', 'optimization']
FROM public.organizations o
LIMIT 1;

INSERT INTO public.prompt_templates (
  organization_id, 
  name, 
  description, 
  category, 
  status,
  tags
)
SELECT 
  o.id,
  'Campaign Copy Assistant',
  'Creates campaign copy variations with brand tone consistency',
  'copy',
  'review',
  ARRAY['marketing', 'campaigns', 'copywriting']
FROM public.organizations o
LIMIT 1;