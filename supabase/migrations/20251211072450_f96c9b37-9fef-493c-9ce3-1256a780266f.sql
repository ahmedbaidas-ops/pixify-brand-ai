-- Add an INSERT policy for brands that allows users to create brands in their own organization
-- This is needed during onboarding when users don't have roles assigned yet

-- Drop the existing restrictive ALL policy and create separate policies
DROP POLICY IF EXISTS "Editors can manage brands" ON public.brands;

-- Create separate policies for each operation
CREATE POLICY "Users can insert brands in their org" 
ON public.brands 
FOR INSERT 
WITH CHECK (organization_id = get_user_org(auth.uid()));

CREATE POLICY "Users can update brands in their org" 
ON public.brands 
FOR UPDATE 
USING (organization_id = get_user_org(auth.uid()));

CREATE POLICY "Users can delete brands in their org" 
ON public.brands 
FOR DELETE 
USING (
  has_role(auth.uid(), organization_id, 'admin'::app_role) OR 
  has_role(auth.uid(), organization_id, 'editor'::app_role)
);