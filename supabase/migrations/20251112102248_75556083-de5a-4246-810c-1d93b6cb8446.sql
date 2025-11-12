-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Create enum types
CREATE TYPE app_role AS ENUM ('admin', 'editor', 'viewer');
CREATE TYPE request_type AS ENUM ('design', 'copy', 'convert');
CREATE TYPE request_status AS ENUM ('new', 'in_progress', 'completed', 'cancelled');
CREATE TYPE asset_type AS ENUM ('logo', 'image', 'video', 'document', 'template', 'other');
CREATE TYPE guideline_section_type AS ENUM ('strategy', 'logo', 'color', 'typography', 'grid', 'imagery', 'motion', 'downloads');

-- Organizations table
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, organization_id)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _org_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND organization_id = _org_id
      AND role = _role
  );
$$;

-- Helper function to get user's org
CREATE OR REPLACE FUNCTION public.get_user_org(_user_id UUID)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id FROM public.profiles WHERE id = _user_id LIMIT 1;
$$;

-- Brands table
CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  purpose TEXT,
  values TEXT[],
  archetype TEXT,
  tone TEXT,
  audience TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Brand settings table
CREATE TABLE public.brand_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE UNIQUE,
  locales TEXT[] DEFAULT ARRAY['en'],
  permissions_policy JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.brand_settings ENABLE ROW LEVEL SECURITY;

-- Design tokens table
CREATE TABLE public.design_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- color, typography, spacing, radius, etc.
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.design_tokens ENABLE ROW LEVEL SECURITY;

-- Components table
CREATE TABLE public.components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  figma_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;

-- Assets table (DAM core)
CREATE TABLE public.assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  file_key TEXT NOT NULL,
  name TEXT NOT NULL,
  type asset_type NOT NULL DEFAULT 'other',
  storage_url TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  version INTEGER NOT NULL DEFAULT 1,
  parent_id UUID REFERENCES public.assets(id) ON DELETE SET NULL,
  checksum TEXT,
  metadata JSONB DEFAULT '{}',
  views INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Guideline sections table
CREATE TABLE public.guideline_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  type guideline_section_type NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.guideline_sections ENABLE ROW LEVEL SECURITY;

-- Requests table
CREATE TABLE public.requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  type request_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status request_status NOT NULL DEFAULT 'new',
  metadata JSONB DEFAULT '{}',
  result_url TEXT,
  requested_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- Playbooks table
CREATE TABLE public.playbooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  pdf_url TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.playbooks ENABLE ROW LEVEL SECURITY;

-- Vector items for AI search
CREATE TABLE public.vector_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  text TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.vector_items ENABLE ROW LEVEL SECURITY;

-- Event log for audit trail
CREATE TABLE public.event_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.event_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Organizations: users can view their own org
CREATE POLICY "Users can view their organization"
  ON public.organizations FOR SELECT
  TO authenticated
  USING (id = public.get_user_org(auth.uid()));

-- Profiles: users can view all profiles in their org, update their own
CREATE POLICY "Users can view profiles in their org"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (organization_id = public.get_user_org(auth.uid()));

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- User roles: admins can manage, all can view
CREATE POLICY "Users can view roles in their org"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (organization_id = public.get_user_org(auth.uid()));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), organization_id, 'admin'));

-- Brands: viewers can read, editors can write
CREATE POLICY "Users can view brands in their org"
  ON public.brands FOR SELECT
  TO authenticated
  USING (organization_id = public.get_user_org(auth.uid()));

CREATE POLICY "Editors can manage brands"
  ON public.brands FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), organization_id, 'admin') OR
    public.has_role(auth.uid(), organization_id, 'editor')
  );

-- Brand settings: same as brands
CREATE POLICY "Users can view brand settings"
  ON public.brand_settings FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.brands b
    WHERE b.id = brand_id AND b.organization_id = public.get_user_org(auth.uid())
  ));

CREATE POLICY "Editors can manage brand settings"
  ON public.brand_settings FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.brands b
    WHERE b.id = brand_id AND (
      public.has_role(auth.uid(), b.organization_id, 'admin') OR
      public.has_role(auth.uid(), b.organization_id, 'editor')
    )
  ));

-- Design tokens: same pattern
CREATE POLICY "Users can view design tokens"
  ON public.design_tokens FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.brands b
    WHERE b.id = brand_id AND b.organization_id = public.get_user_org(auth.uid())
  ));

CREATE POLICY "Editors can manage design tokens"
  ON public.design_tokens FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.brands b
    WHERE b.id = brand_id AND (
      public.has_role(auth.uid(), b.organization_id, 'admin') OR
      public.has_role(auth.uid(), b.organization_id, 'editor')
    )
  ));

-- Components: same pattern
CREATE POLICY "Users can view components"
  ON public.components FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.brands b
    WHERE b.id = brand_id AND b.organization_id = public.get_user_org(auth.uid())
  ));

CREATE POLICY "Editors can manage components"
  ON public.components FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.brands b
    WHERE b.id = brand_id AND (
      public.has_role(auth.uid(), b.organization_id, 'admin') OR
      public.has_role(auth.uid(), b.organization_id, 'editor')
    )
  ));

-- Assets: viewers can read, editors can write
CREATE POLICY "Users can view assets"
  ON public.assets FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.brands b
    WHERE b.id = brand_id AND b.organization_id = public.get_user_org(auth.uid())
  ));

CREATE POLICY "Editors can manage assets"
  ON public.assets FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.brands b
    WHERE b.id = brand_id AND (
      public.has_role(auth.uid(), b.organization_id, 'admin') OR
      public.has_role(auth.uid(), b.organization_id, 'editor')
    )
  ));

-- Guideline sections: same pattern
CREATE POLICY "Users can view guideline sections"
  ON public.guideline_sections FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.brands b
    WHERE b.id = brand_id AND b.organization_id = public.get_user_org(auth.uid())
  ));

CREATE POLICY "Editors can manage guideline sections"
  ON public.guideline_sections FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.brands b
    WHERE b.id = brand_id AND (
      public.has_role(auth.uid(), b.organization_id, 'admin') OR
      public.has_role(auth.uid(), b.organization_id, 'editor')
    )
  ));

-- Requests: all authenticated can create, creators and assigned can update
CREATE POLICY "Users can view requests in their org"
  ON public.requests FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.brands b
    WHERE b.id = brand_id AND b.organization_id = public.get_user_org(auth.uid())
  ));

CREATE POLICY "Users can create requests"
  ON public.requests FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.brands b
    WHERE b.id = brand_id AND b.organization_id = public.get_user_org(auth.uid())
  ));

CREATE POLICY "Users can update their own requests"
  ON public.requests FOR UPDATE
  TO authenticated
  USING (requested_by = auth.uid() OR assigned_to = auth.uid());

-- Playbooks: all can view, editors can create
CREATE POLICY "Users can view playbooks"
  ON public.playbooks FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.brands b
    WHERE b.id = brand_id AND b.organization_id = public.get_user_org(auth.uid())
  ));

CREATE POLICY "Editors can create playbooks"
  ON public.playbooks FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.brands b
    WHERE b.id = brand_id AND (
      public.has_role(auth.uid(), b.organization_id, 'admin') OR
      public.has_role(auth.uid(), b.organization_id, 'editor')
    )
  ));

-- Vector items: all can read, system can write
CREATE POLICY "Users can view vector items"
  ON public.vector_items FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.brands b
    WHERE b.id = brand_id AND b.organization_id = public.get_user_org(auth.uid())
  ));

-- Event logs: admins can view all, users can view their own
CREATE POLICY "Admins can view all event logs"
  ON public.event_logs FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), organization_id, 'admin'));

CREATE POLICY "Users can view their own event logs"
  ON public.event_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Trigger for profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON public.brands
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_brand_settings_updated_at BEFORE UPDATE ON public.brand_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_design_tokens_updated_at BEFORE UPDATE ON public.design_tokens
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_components_updated_at BEFORE UPDATE ON public.components
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON public.assets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guideline_sections_updated_at BEFORE UPDATE ON public.guideline_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON public.requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_playbooks_updated_at BEFORE UPDATE ON public.playbooks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_profiles_org ON public.profiles(organization_id);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_org ON public.user_roles(organization_id);
CREATE INDEX idx_brands_org ON public.brands(organization_id);
CREATE INDEX idx_design_tokens_brand ON public.design_tokens(brand_id);
CREATE INDEX idx_components_brand ON public.components(brand_id);
CREATE INDEX idx_assets_brand ON public.assets(brand_id);
CREATE INDEX idx_assets_tags ON public.assets USING GIN(tags);
CREATE INDEX idx_guideline_sections_brand ON public.guideline_sections(brand_id);
CREATE INDEX idx_requests_brand ON public.requests(brand_id);
CREATE INDEX idx_requests_status ON public.requests(status);
CREATE INDEX idx_playbooks_brand ON public.playbooks(brand_id);
CREATE INDEX idx_vector_items_brand ON public.vector_items(brand_id);
CREATE INDEX idx_event_logs_org ON public.event_logs(organization_id);
CREATE INDEX idx_event_logs_user ON public.event_logs(user_id);