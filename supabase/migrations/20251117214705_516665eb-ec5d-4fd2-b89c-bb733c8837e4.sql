-- Create enum for roadmap status
CREATE TYPE roadmap_status AS ENUM ('DRAFT', 'REVIEW', 'ACTIVE', 'ARCHIVED');

-- Create enum for roadmap view
CREATE TYPE roadmap_view AS ENUM ('CANVAS', 'GANTT', 'KANBAN', 'LIST');

-- Create enum for milestone status
CREATE TYPE milestone_status AS ENUM ('PLANNED', 'IN_PROGRESS', 'BLOCKED', 'DONE');

-- Create enum for task status
CREATE TYPE task_status AS ENUM ('TODO', 'DOING', 'REVIEW', 'DONE');

-- Create enum for risk status
CREATE TYPE risk_status AS ENUM ('OPEN', 'MITIGATING', 'CLOSED');

-- Create enum for risk category
CREATE TYPE risk_category AS ENUM ('SCOPE', 'TIMELINE', 'QUALITY', 'RESOURCING', 'TECH', 'CLIENT');

-- Create enum for dependency type
CREATE TYPE dependency_type AS ENUM ('FS', 'SS', 'FF', 'SF');

-- Roadmaps table
CREATE TABLE public.roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL,
  status roadmap_status NOT NULL DEFAULT 'DRAFT',
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  view roadmap_view NOT NULL DEFAULT 'CANVAS',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Roadmap members table
CREATE TABLE public.roadmap_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 40,
  availability INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Stages table
CREATE TABLE public.roadmap_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  color TEXT DEFAULT '#5C0A3A',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Milestones table
CREATE TABLE public.roadmap_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  stage_id UUID REFERENCES public.roadmap_stages(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  status milestone_status NOT NULL DEFAULT 'PLANNED',
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  effort_hours INTEGER,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  position_x FLOAT DEFAULT 0,
  position_y FLOAT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tasks table
CREATE TABLE public.roadmap_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID NOT NULL REFERENCES public.roadmap_milestones(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  assignee_id UUID,
  status task_status NOT NULL DEFAULT 'TODO',
  estimate_hours INTEGER,
  due_date TIMESTAMPTZ,
  links JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Risks table
CREATE TABLE public.roadmap_risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category risk_category NOT NULL DEFAULT 'SCOPE',
  probability INTEGER NOT NULL DEFAULT 1 CHECK (probability >= 1 AND probability <= 5),
  impact INTEGER NOT NULL DEFAULT 1 CHECK (impact >= 1 AND impact <= 5),
  owner_id UUID,
  status risk_status NOT NULL DEFAULT 'OPEN',
  mitigation TEXT,
  triggers TEXT,
  position_x FLOAT DEFAULT 0,
  position_y FLOAT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Dependencies table
CREATE TABLE public.roadmap_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  from_type TEXT NOT NULL,
  from_id UUID NOT NULL,
  to_type TEXT NOT NULL,
  to_id UUID NOT NULL,
  type dependency_type NOT NULL DEFAULT 'FS',
  lag_days INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Approvals table
CREATE TABLE public.roadmap_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL,
  state_from TEXT NOT NULL,
  state_to TEXT NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Activity logs table
CREATE TABLE public.roadmap_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL,
  action TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_roadmaps_org ON public.roadmaps(organization_id);
CREATE INDEX idx_roadmaps_brand ON public.roadmaps(brand_id);
CREATE INDEX idx_roadmaps_owner ON public.roadmaps(owner_id);
CREATE INDEX idx_roadmap_members_roadmap ON public.roadmap_members(roadmap_id);
CREATE INDEX idx_roadmap_stages_roadmap ON public.roadmap_stages(roadmap_id);
CREATE INDEX idx_roadmap_milestones_roadmap ON public.roadmap_milestones(roadmap_id);
CREATE INDEX idx_roadmap_tasks_milestone ON public.roadmap_tasks(milestone_id);
CREATE INDEX idx_roadmap_risks_roadmap ON public.roadmap_risks(roadmap_id);
CREATE INDEX idx_roadmap_deps_roadmap ON public.roadmap_dependencies(roadmap_id);
CREATE INDEX idx_roadmap_activity_roadmap ON public.roadmap_activity(roadmap_id);

-- Enable RLS
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies for roadmaps
CREATE POLICY "Users can view roadmaps in their org"
ON public.roadmaps FOR SELECT
USING (organization_id = get_user_org(auth.uid()));

CREATE POLICY "Editors can create roadmaps"
ON public.roadmaps FOR INSERT
WITH CHECK (
  has_role(auth.uid(), organization_id, 'admin'::app_role) OR
  has_role(auth.uid(), organization_id, 'editor'::app_role)
);

CREATE POLICY "Editors can update roadmaps"
ON public.roadmaps FOR UPDATE
USING (
  organization_id = get_user_org(auth.uid()) AND (
    has_role(auth.uid(), organization_id, 'admin'::app_role) OR
    has_role(auth.uid(), organization_id, 'editor'::app_role) OR
    owner_id = auth.uid()
  )
);

CREATE POLICY "Admins can delete roadmaps"
ON public.roadmaps FOR DELETE
USING (has_role(auth.uid(), organization_id, 'admin'::app_role));

-- RLS Policies for roadmap_members
CREATE POLICY "Users can view roadmap members"
ON public.roadmap_members FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.roadmaps r
  WHERE r.id = roadmap_members.roadmap_id
  AND r.organization_id = get_user_org(auth.uid())
));

CREATE POLICY "Editors can manage roadmap members"
ON public.roadmap_members FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.roadmaps r
  WHERE r.id = roadmap_members.roadmap_id
  AND r.organization_id = get_user_org(auth.uid())
  AND (has_role(auth.uid(), r.organization_id, 'admin'::app_role) OR has_role(auth.uid(), r.organization_id, 'editor'::app_role))
));

-- RLS Policies for roadmap_stages
CREATE POLICY "Users can view roadmap stages"
ON public.roadmap_stages FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.roadmaps r
  WHERE r.id = roadmap_stages.roadmap_id
  AND r.organization_id = get_user_org(auth.uid())
));

CREATE POLICY "Editors can manage roadmap stages"
ON public.roadmap_stages FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.roadmaps r
  WHERE r.id = roadmap_stages.roadmap_id
  AND r.organization_id = get_user_org(auth.uid())
  AND (has_role(auth.uid(), r.organization_id, 'admin'::app_role) OR has_role(auth.uid(), r.organization_id, 'editor'::app_role))
));

-- RLS Policies for roadmap_milestones
CREATE POLICY "Users can view roadmap milestones"
ON public.roadmap_milestones FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.roadmaps r
  WHERE r.id = roadmap_milestones.roadmap_id
  AND r.organization_id = get_user_org(auth.uid())
));

CREATE POLICY "Members can manage roadmap milestones"
ON public.roadmap_milestones FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.roadmaps r
  WHERE r.id = roadmap_milestones.roadmap_id
  AND r.organization_id = get_user_org(auth.uid())
  AND (
    has_role(auth.uid(), r.organization_id, 'admin'::app_role) OR 
    has_role(auth.uid(), r.organization_id, 'editor'::app_role) OR
    auth.uid() IN (SELECT user_id FROM public.roadmap_members WHERE roadmap_id = r.id)
  )
));

-- RLS Policies for roadmap_tasks
CREATE POLICY "Users can view roadmap tasks"
ON public.roadmap_tasks FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.roadmap_milestones m
  JOIN public.roadmaps r ON r.id = m.roadmap_id
  WHERE m.id = roadmap_tasks.milestone_id
  AND r.organization_id = get_user_org(auth.uid())
));

CREATE POLICY "Members can manage roadmap tasks"
ON public.roadmap_tasks FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.roadmap_milestones m
  JOIN public.roadmaps r ON r.id = m.roadmap_id
  WHERE m.id = roadmap_tasks.milestone_id
  AND r.organization_id = get_user_org(auth.uid())
  AND (
    has_role(auth.uid(), r.organization_id, 'admin'::app_role) OR 
    has_role(auth.uid(), r.organization_id, 'editor'::app_role) OR
    auth.uid() IN (SELECT user_id FROM public.roadmap_members WHERE roadmap_id = r.id)
  )
));

-- RLS Policies for roadmap_risks
CREATE POLICY "Users can view roadmap risks"
ON public.roadmap_risks FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.roadmaps r
  WHERE r.id = roadmap_risks.roadmap_id
  AND r.organization_id = get_user_org(auth.uid())
));

CREATE POLICY "Members can manage roadmap risks"
ON public.roadmap_risks FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.roadmaps r
  WHERE r.id = roadmap_risks.roadmap_id
  AND r.organization_id = get_user_org(auth.uid())
  AND (
    has_role(auth.uid(), r.organization_id, 'admin'::app_role) OR 
    has_role(auth.uid(), r.organization_id, 'editor'::app_role) OR
    auth.uid() IN (SELECT user_id FROM public.roadmap_members WHERE roadmap_id = r.id)
  )
));

-- RLS Policies for roadmap_dependencies
CREATE POLICY "Users can view roadmap dependencies"
ON public.roadmap_dependencies FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.roadmaps r
  WHERE r.id = roadmap_dependencies.roadmap_id
  AND r.organization_id = get_user_org(auth.uid())
));

CREATE POLICY "Members can manage roadmap dependencies"
ON public.roadmap_dependencies FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.roadmaps r
  WHERE r.id = roadmap_dependencies.roadmap_id
  AND r.organization_id = get_user_org(auth.uid())
  AND (
    has_role(auth.uid(), r.organization_id, 'admin'::app_role) OR 
    has_role(auth.uid(), r.organization_id, 'editor'::app_role) OR
    auth.uid() IN (SELECT user_id FROM public.roadmap_members WHERE roadmap_id = r.id)
  )
));

-- RLS Policies for roadmap_approvals
CREATE POLICY "Users can view roadmap approvals"
ON public.roadmap_approvals FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.roadmaps r
  WHERE r.id = roadmap_approvals.roadmap_id
  AND r.organization_id = get_user_org(auth.uid())
));

CREATE POLICY "Users can create approvals"
ON public.roadmap_approvals FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.roadmaps r
  WHERE r.id = roadmap_id
  AND r.organization_id = get_user_org(auth.uid())
));

-- RLS Policies for roadmap_activity
CREATE POLICY "Users can view roadmap activity"
ON public.roadmap_activity FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.roadmaps r
  WHERE r.id = roadmap_activity.roadmap_id
  AND r.organization_id = get_user_org(auth.uid())
));

CREATE POLICY "System can log activity"
ON public.roadmap_activity FOR INSERT
WITH CHECK (true);

-- Triggers for updated_at
CREATE TRIGGER update_roadmaps_updated_at
  BEFORE UPDATE ON public.roadmaps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_roadmap_milestones_updated_at
  BEFORE UPDATE ON public.roadmap_milestones
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_roadmap_tasks_updated_at
  BEFORE UPDATE ON public.roadmap_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_roadmap_risks_updated_at
  BEFORE UPDATE ON public.roadmap_risks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();