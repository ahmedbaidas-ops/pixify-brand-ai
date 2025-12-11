-- Create storage bucket for brand assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'brand-assets',
  'brand-assets',
  true,
  52428800, -- 50MB limit
  ARRAY['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp', 'application/pdf']
);

-- Storage policies for brand-assets bucket
CREATE POLICY "Users can view brand assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'brand-assets');

CREATE POLICY "Authenticated users can upload brand assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'brand-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their brand assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'brand-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their brand assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'brand-assets' AND auth.role() = 'authenticated');