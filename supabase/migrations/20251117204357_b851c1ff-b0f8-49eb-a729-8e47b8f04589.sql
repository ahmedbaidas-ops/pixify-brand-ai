-- Admin Module Phase 1: Core Tables (Fixed)

-- Plans table
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  entitlements JSONB NOT NULL DEFAULT '{"features": [], "quotas": {}}'::jsonb,
  stripe_price_id TEXT,
  price_monthly INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Update organizations to link to plans
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS plan_id UUID REFERENCES public.plans(id);
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Update brands to include compliance config
ALTER TABLE public.brands ADD COLUMN IF NOT EXISTS compliance_config JSONB DEFAULT '{"thresholds": {"color_match": 85, "contrast_ratio": 4.5, "logo_safe_zone": true}, "auto_fix": false}'::jsonb;

-- Abilities table
CREATE TABLE public.abilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Role-Ability mapping
CREATE TABLE public.role_abilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role app_role NOT NULL,
  ability_id UUID REFERENCES public.abilities(id) ON DELETE CASCADE,
  UNIQUE(role, ability_id)
);

-- Feature Flags table
CREATE TABLE public.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  enabled BOOLEAN DEFAULT false,
  rollout_percentage INTEGER DEFAULT 100 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  plan_gate TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(organization_id, key)
);

-- Quotas table
CREATE TABLE public.quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  limit_value INTEGER NOT NULL,
  current_usage INTEGER DEFAULT 0,
  reset_period TEXT DEFAULT 'monthly',
  last_reset_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_override BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(organization_id, key)
);

-- Secret Vault table
CREATE TABLE public.secret_vault (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value_encrypted TEXT NOT NULL,
  description TEXT,
  last_rotated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(organization_id, key)
);

-- Webhook Endpoints table
CREATE TABLE public.webhook_endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  secret TEXT NOT NULL,
  events TEXT[] DEFAULT ARRAY[]::text[],
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMP WITH TIME ZONE,
  failure_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Audit Logs table (append-only)
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  changes JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- System Metrics table
CREATE TABLE public.system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  value NUMERIC NOT NULL,
  organization_id UUID REFERENCES public.organizations(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes
CREATE INDEX idx_feature_flags_org ON public.feature_flags(organization_id);
CREATE INDEX idx_quotas_org ON public.quotas(organization_id);
CREATE INDEX idx_audit_logs_org_created ON public.audit_logs(organization_id, created_at DESC);
CREATE INDEX idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX idx_webhook_endpoints_org ON public.webhook_endpoints(organization_id);

-- Enable RLS
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_abilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.secret_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Plans: viewable by all authenticated users
CREATE POLICY "Anyone can view plans"
ON public.plans FOR SELECT
TO authenticated
USING (true);

-- Abilities: viewable by all authenticated users
CREATE POLICY "Anyone can view abilities"
ON public.abilities FOR SELECT
TO authenticated
USING (true);

-- Role Abilities: viewable by all authenticated users
CREATE POLICY "Anyone can view role abilities"
ON public.role_abilities FOR SELECT
TO authenticated
USING (true);

-- Feature Flags: Admins can manage, users can view their org
CREATE POLICY "Admins can manage feature flags"
ON public.feature_flags FOR ALL
TO authenticated
USING (has_role(auth.uid(), organization_id, 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), organization_id, 'admin'::app_role));

CREATE POLICY "Users can view their org feature flags"
ON public.feature_flags FOR SELECT
TO authenticated
USING (organization_id = get_user_org(auth.uid()));

-- Quotas: Admins can manage, users can view their org
CREATE POLICY "Admins can manage quotas"
ON public.quotas FOR ALL
TO authenticated
USING (has_role(auth.uid(), organization_id, 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), organization_id, 'admin'::app_role));

CREATE POLICY "Users can view their org quotas"
ON public.quotas FOR SELECT
TO authenticated
USING (organization_id = get_user_org(auth.uid()));

-- Secret Vault: Admins only
CREATE POLICY "Admins can manage secrets"
ON public.secret_vault FOR ALL
TO authenticated
USING (has_role(auth.uid(), organization_id, 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), organization_id, 'admin'::app_role));

-- Webhooks: Admins can manage, users can view their org
CREATE POLICY "Admins can manage webhooks"
ON public.webhook_endpoints FOR ALL
TO authenticated
USING (has_role(auth.uid(), organization_id, 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), organization_id, 'admin'::app_role));

CREATE POLICY "Users can view their org webhooks"
ON public.webhook_endpoints FOR SELECT
TO authenticated
USING (organization_id = get_user_org(auth.uid()));

-- Audit Logs: Admins can view all, users can view their own actions
CREATE POLICY "Admins can view all audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (has_role(auth.uid(), organization_id, 'admin'::app_role));

CREATE POLICY "Users can view their own audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (actor_id = auth.uid());

-- System Metrics: Admins only
CREATE POLICY "Admins can view system metrics"
ON public.system_metrics FOR SELECT
TO authenticated
USING (
  organization_id IS NULL OR 
  has_role(auth.uid(), organization_id, 'admin'::app_role)
);

-- Seed default plans
INSERT INTO public.plans (name, slug, entitlements, price_monthly) VALUES
('Starter', 'starter', '{"features": ["library", "generate"], "quotas": {"ai_tokens_monthly": 100000, "render_seconds_daily": 60, "storage_gb": 50}}'::jsonb, 0),
('Pro', 'pro', '{"features": ["library", "generate", "optimize", "motion", "calendar", "marketing"], "quotas": {"ai_tokens_monthly": 300000, "render_seconds_daily": 180, "storage_gb": 200}}'::jsonb, 49),
('Enterprise', 'enterprise', '{"features": ["library", "generate", "optimize", "motion", "calendar", "marketing", "webhooks", "api", "sso"], "quotas": {"ai_tokens_monthly": 1000000, "render_seconds_daily": 600, "storage_gb": 1000}}'::jsonb, 199);

-- Seed default abilities
INSERT INTO public.abilities (name, description, category) VALUES
('asset.create', 'Upload and create new assets', 'assets'),
('asset.edit', 'Edit asset metadata and properties', 'assets'),
('asset.delete', 'Delete assets', 'assets'),
('asset.publish', 'Publish assets for external use', 'assets'),
('motion.render', 'Generate motion/video assets', 'motion'),
('motion.approve', 'Approve motion renders for use', 'motion'),
('brand.edit', 'Edit brand guidelines and tokens', 'brand'),
('brand.sync', 'Sync design tokens from Figma', 'brand'),
('generate.create', 'Use AI to generate content', 'ai'),
('generate.approve', 'Approve AI-generated content', 'ai'),
('campaign.create', 'Create marketing campaigns', 'marketing'),
('campaign.publish', 'Publish marketing campaigns', 'marketing'),
('admin.users', 'Manage users and roles', 'admin'),
('admin.billing', 'View and manage billing', 'admin'),
('admin.settings', 'Manage organization settings', 'admin'),
('admin.features', 'Manage feature flags', 'admin'),
('admin.quotas', 'Manage quotas and limits', 'admin'),
('admin.integrations', 'Manage integrations and secrets', 'admin'),
('admin.audit', 'View audit logs', 'admin'),
('admin.webhooks', 'Manage webhooks', 'admin');

-- Seed role-ability mappings
INSERT INTO public.role_abilities (role, ability_id)
SELECT 'admin'::app_role, id FROM public.abilities;

INSERT INTO public.role_abilities (role, ability_id)
SELECT 'editor'::app_role, id FROM public.abilities 
WHERE name IN (
  'asset.create', 'asset.edit', 'asset.publish',
  'motion.render', 'brand.edit', 'generate.create',
  'campaign.create', 'campaign.publish'
);

INSERT INTO public.role_abilities (role, ability_id)
SELECT 'viewer'::app_role, id FROM public.abilities 
WHERE category NOT IN ('admin');

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_admin_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON public.plans
FOR EACH ROW EXECUTE FUNCTION update_admin_updated_at_column();

CREATE TRIGGER update_feature_flags_updated_at BEFORE UPDATE ON public.feature_flags
FOR EACH ROW EXECUTE FUNCTION update_admin_updated_at_column();

CREATE TRIGGER update_quotas_updated_at BEFORE UPDATE ON public.quotas
FOR EACH ROW EXECUTE FUNCTION update_admin_updated_at_column();

CREATE TRIGGER update_secret_vault_updated_at BEFORE UPDATE ON public.secret_vault
FOR EACH ROW EXECUTE FUNCTION update_admin_updated_at_column();

CREATE TRIGGER update_webhook_endpoints_updated_at BEFORE UPDATE ON public.webhook_endpoints
FOR EACH ROW EXECUTE FUNCTION update_admin_updated_at_column();