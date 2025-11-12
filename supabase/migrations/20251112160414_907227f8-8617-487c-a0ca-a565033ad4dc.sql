-- Create motion projects table
CREATE TABLE IF NOT EXISTS public.motion_projects (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  brand_id uuid NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  title text NOT NULL,
  mode text NOT NULL CHECK (mode IN ('ANIMATE_THIS', 'SCRIPT_TO_VIDEO')),
  source_asset_id uuid REFERENCES public.assets(id) ON DELETE SET NULL,
  params jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create motion outputs table
CREATE TABLE IF NOT EXISTS public.motion_outputs (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES public.motion_projects(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'QUEUED' CHECK (status IN ('QUEUED', 'RENDERING', 'DONE', 'FAILED')),
  profile text NOT NULL DEFAULT 'landscape' CHECK (profile IN ('square', 'portrait', 'landscape')),
  url text,
  error_message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone
);

-- Enable RLS
ALTER TABLE public.motion_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_outputs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for motion_projects
CREATE POLICY "Users can view motion projects in their org"
  ON public.motion_projects
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM brands b
      WHERE b.id = motion_projects.brand_id
      AND b.organization_id = get_user_org(auth.uid())
    )
  );

CREATE POLICY "Editors can create motion projects"
  ON public.motion_projects
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands b
      WHERE b.id = motion_projects.brand_id
      AND (has_role(auth.uid(), b.organization_id, 'admin'::app_role) 
        OR has_role(auth.uid(), b.organization_id, 'editor'::app_role))
    )
  );

CREATE POLICY "Editors can manage motion projects"
  ON public.motion_projects
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM brands b
      WHERE b.id = motion_projects.brand_id
      AND (has_role(auth.uid(), b.organization_id, 'admin'::app_role) 
        OR has_role(auth.uid(), b.organization_id, 'editor'::app_role))
    )
  );

-- RLS Policies for motion_outputs
CREATE POLICY "Users can view motion outputs"
  ON public.motion_outputs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM motion_projects mp
      JOIN brands b ON b.id = mp.brand_id
      WHERE mp.id = motion_outputs.project_id
      AND b.organization_id = get_user_org(auth.uid())
    )
  );

CREATE POLICY "System can manage motion outputs"
  ON public.motion_outputs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger for motion_projects
CREATE TRIGGER update_motion_projects_updated_at
  BEFORE UPDATE ON public.motion_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_motion_projects_brand_id ON public.motion_projects(brand_id);
CREATE INDEX idx_motion_projects_created_at ON public.motion_projects(created_at DESC);
CREATE INDEX idx_motion_outputs_project_id ON public.motion_outputs(project_id);
CREATE INDEX idx_motion_outputs_status ON public.motion_outputs(status);