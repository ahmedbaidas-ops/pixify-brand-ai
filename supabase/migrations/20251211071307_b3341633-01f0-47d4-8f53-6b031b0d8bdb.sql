-- Create ai_logs table for tracking AI interactions
CREATE TABLE public.ai_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  query TEXT NOT NULL,
  response_summary TEXT,
  tokens_used INTEGER,
  execution_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own AI logs
CREATE POLICY "Users can view their own AI logs"
  ON public.ai_logs
  FOR SELECT
  USING (user_id = auth.uid());

-- Users can insert their own AI logs
CREATE POLICY "Users can insert AI logs"
  ON public.ai_logs
  FOR INSERT
  WITH CHECK (user_id = auth.uid() AND organization_id = get_user_org(auth.uid()));

-- Admins can view all logs in their org
CREATE POLICY "Admins can view org AI logs"
  ON public.ai_logs
  FOR SELECT
  USING (has_role(auth.uid(), organization_id, 'admin'));

-- Create index for efficient queries
CREATE INDEX idx_ai_logs_org_brand ON public.ai_logs(organization_id, brand_id);
CREATE INDEX idx_ai_logs_user ON public.ai_logs(user_id);
CREATE INDEX idx_ai_logs_created ON public.ai_logs(created_at DESC);