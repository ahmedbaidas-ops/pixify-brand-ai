
-- 1. activate_prompt_version: add authorization
CREATE OR REPLACE FUNCTION public.activate_prompt_version(p_version_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_template_id UUID;
  v_org_id UUID;
BEGIN
  SELECT pv.template_id, pt.organization_id
    INTO v_template_id, v_org_id
  FROM prompt_versions pv
  JOIN prompt_templates pt ON pt.id = pv.template_id
  WHERE pv.id = p_version_id;

  IF v_template_id IS NULL THEN
    RAISE EXCEPTION 'Prompt version not found';
  END IF;

  IF NOT public.has_role(auth.uid(), v_org_id, 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;

  UPDATE prompt_versions SET is_active = false WHERE template_id = v_template_id;
  UPDATE prompt_versions SET is_active = true  WHERE id = p_version_id;
END;
$$;

-- 2. Webhook endpoints: admins-only SELECT
DROP POLICY IF EXISTS "Users can view their org webhooks" ON public.webhook_endpoints;
CREATE POLICY "Admins can view their org webhooks"
ON public.webhook_endpoints FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), organization_id, 'admin'::app_role));

-- 3. motion_outputs: replace permissive policy
DROP POLICY IF EXISTS "System can manage motion outputs" ON public.motion_outputs;
CREATE POLICY "Org members can manage motion outputs"
ON public.motion_outputs FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.motion_projects mp
    JOIN public.brands b ON b.id = mp.brand_id
    WHERE mp.id = motion_outputs.project_id
      AND b.organization_id = public.get_user_org(auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.motion_projects mp
    JOIN public.brands b ON b.id = mp.brand_id
    WHERE mp.id = motion_outputs.project_id
      AND b.organization_id = public.get_user_org(auth.uid())
  )
);

-- 4. roadmap_activity: restrict INSERT to authenticated org members
DROP POLICY IF EXISTS "System can log activity" ON public.roadmap_activity;
CREATE POLICY "Org members can log activity"
ON public.roadmap_activity FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.roadmaps r
    WHERE r.id = roadmap_activity.roadmap_id
      AND r.organization_id = public.get_user_org(auth.uid())
  )
);

-- 5. brand_templates: restrict to authenticated
DROP POLICY IF EXISTS "Only system can view brand templates" ON public.brand_templates;
CREATE POLICY "Authenticated users can view visible brand templates"
ON public.brand_templates FOR SELECT
TO authenticated
USING (hidden = false);

-- 6. Storage bucket: make private + org-scoped policies
UPDATE storage.buckets SET public = false WHERE id = 'brand-assets';

DROP POLICY IF EXISTS "Users can view brand assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload brand assets" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their brand assets" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their brand assets" ON storage.objects;

CREATE POLICY "Org members can view their brand assets"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'brand-assets'
  AND (storage.foldername(name))[1]::uuid = public.get_user_org(auth.uid())
);

CREATE POLICY "Org members can upload brand assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'brand-assets'
  AND (storage.foldername(name))[1]::uuid = public.get_user_org(auth.uid())
);

CREATE POLICY "Org members can update their brand assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'brand-assets'
  AND (storage.foldername(name))[1]::uuid = public.get_user_org(auth.uid())
);

CREATE POLICY "Org members can delete their brand assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'brand-assets'
  AND (storage.foldername(name))[1]::uuid = public.get_user_org(auth.uid())
);

-- 7. Pin search_path on remaining mutable function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_admin_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
