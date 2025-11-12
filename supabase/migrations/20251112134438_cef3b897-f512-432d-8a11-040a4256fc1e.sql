-- Create brand_metrics table to store performance metrics
CREATE TABLE public.brand_metrics (
  id UUID NOT NULL DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  brand_consistency_score INTEGER NOT NULL DEFAULT 0 CHECK (brand_consistency_score >= 0 AND brand_consistency_score <= 100),
  asset_library_usage INTEGER NOT NULL DEFAULT 0 CHECK (asset_library_usage >= 0 AND asset_library_usage <= 100),
  campaign_performance INTEGER NOT NULL DEFAULT 0 CHECK (campaign_performance >= 0 AND campaign_performance <= 100),
  team_activity INTEGER NOT NULL DEFAULT 0 CHECK (team_activity >= 0 AND team_activity <= 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(brand_id)
);

-- Enable Row Level Security
ALTER TABLE public.brand_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view brand metrics"
ON public.brand_metrics
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.brands b
    WHERE b.id = brand_metrics.brand_id
    AND b.organization_id = get_user_org(auth.uid())
  )
);

CREATE POLICY "Editors can manage brand metrics"
ON public.brand_metrics
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.brands b
    WHERE b.id = brand_metrics.brand_id
    AND (
      has_role(auth.uid(), b.organization_id, 'admin'::app_role)
      OR has_role(auth.uid(), b.organization_id, 'editor'::app_role)
    )
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_brand_metrics_updated_at
BEFORE UPDATE ON public.brand_metrics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert seed data for Qatar Airways brand (assuming it exists)
INSERT INTO public.brand_metrics (
  brand_id,
  brand_consistency_score,
  asset_library_usage,
  campaign_performance,
  team_activity
)
SELECT 
  id,
  87,
  92,
  78,
  85
FROM public.brands
WHERE name = 'Qatar Airways'
ON CONFLICT (brand_id) DO NOTHING;