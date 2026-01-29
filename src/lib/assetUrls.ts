import { supabase } from "@/integrations/supabase/client";

export const resolveBrandAssetUrl = async (
  storageUrlOrPath: string,
  expiresInSeconds = 60 * 60
): Promise<string> => {
  if (!storageUrlOrPath) return storageUrlOrPath;

  // External URLs (already public)
  if (
    storageUrlOrPath.startsWith("http://") ||
    storageUrlOrPath.startsWith("https://")
  ) {
    return storageUrlOrPath;
  }

  // Public file from /public (e.g. /qatar-airways-logo.png)
  if (storageUrlOrPath.startsWith("/")) return storageUrlOrPath;

  // Otherwise assume this is an object path inside the brand-assets bucket.
  const { data, error } = await supabase.storage
    .from("brand-assets")
    .createSignedUrl(storageUrlOrPath, expiresInSeconds);

  if (error || !data?.signedUrl) return storageUrlOrPath;
  return data.signedUrl;
};
