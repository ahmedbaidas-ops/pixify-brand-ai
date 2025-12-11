import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useQatarTemplate = () => {
  const [loading, setLoading] = useState(false);

  const retrieveQatarAirwaysTemplate = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("You must be logged in to retrieve templates");
        return null;
      }

      const response = await supabase.functions.invoke("retrieve-template", {
        body: { templateName: "Qatar Airways" },
      });

      if (response.error) {
        toast.error(response.error.message || "Failed to retrieve template");
        return null;
      }

      const data = response.data;
      
      if (data.success) {
        toast.success(data.message);
        return data.brandId;
      } else {
        toast.error(data.error || "Failed to retrieve template");
        return null;
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    retrieveQatarAirwaysTemplate,
    loading,
  };
};