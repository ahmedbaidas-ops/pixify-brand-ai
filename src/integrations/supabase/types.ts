export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      assets: {
        Row: {
          brand_id: string
          checksum: string | null
          created_at: string
          downloads: number | null
          file_key: string
          id: string
          metadata: Json | null
          mime_type: string | null
          name: string
          parent_id: string | null
          size_bytes: number | null
          storage_url: string
          tags: string[] | null
          type: Database["public"]["Enums"]["asset_type"]
          updated_at: string
          uploaded_by: string | null
          version: number
          views: number | null
        }
        Insert: {
          brand_id: string
          checksum?: string | null
          created_at?: string
          downloads?: number | null
          file_key: string
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          name: string
          parent_id?: string | null
          size_bytes?: number | null
          storage_url: string
          tags?: string[] | null
          type?: Database["public"]["Enums"]["asset_type"]
          updated_at?: string
          uploaded_by?: string | null
          version?: number
          views?: number | null
        }
        Update: {
          brand_id?: string
          checksum?: string | null
          created_at?: string
          downloads?: number | null
          file_key?: string
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          name?: string
          parent_id?: string | null
          size_bytes?: number | null
          storage_url?: string
          tags?: string[] | null
          type?: Database["public"]["Enums"]["asset_type"]
          updated_at?: string
          uploaded_by?: string | null
          version?: number
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_settings: {
        Row: {
          brand_id: string
          created_at: string
          id: string
          locales: string[] | null
          permissions_policy: Json | null
          updated_at: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          id?: string
          locales?: string[] | null
          permissions_policy?: Json | null
          updated_at?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          id?: string
          locales?: string[] | null
          permissions_policy?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_settings_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: true
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          archetype: string | null
          audience: string | null
          created_at: string
          id: string
          name: string
          organization_id: string
          purpose: string | null
          tone: string | null
          updated_at: string
          values: string[] | null
        }
        Insert: {
          archetype?: string | null
          audience?: string | null
          created_at?: string
          id?: string
          name: string
          organization_id: string
          purpose?: string | null
          tone?: string | null
          updated_at?: string
          values?: string[] | null
        }
        Update: {
          archetype?: string | null
          audience?: string | null
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          purpose?: string | null
          tone?: string | null
          updated_at?: string
          values?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "brands_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      components: {
        Row: {
          brand_id: string
          created_at: string
          figma_id: string | null
          id: string
          metadata: Json | null
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          figma_id?: string | null
          id?: string
          metadata?: Json | null
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          figma_id?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "components_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      design_tokens: {
        Row: {
          brand_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          type: string
          updated_at: string
          value: Json
        }
        Insert: {
          brand_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string
          value: Json
        }
        Update: {
          brand_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "design_tokens_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      event_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          metadata: Json | null
          organization_id: string
          resource_id: string | null
          resource_type: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          metadata?: Json | null
          organization_id: string
          resource_id?: string | null
          resource_type: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          organization_id?: string
          resource_id?: string | null
          resource_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      guideline_sections: {
        Row: {
          brand_id: string
          content: Json
          created_at: string
          id: string
          order_index: number
          title: string
          type: Database["public"]["Enums"]["guideline_section_type"]
          updated_at: string
        }
        Insert: {
          brand_id: string
          content?: Json
          created_at?: string
          id?: string
          order_index?: number
          title: string
          type: Database["public"]["Enums"]["guideline_section_type"]
          updated_at?: string
        }
        Update: {
          brand_id?: string
          content?: Json
          created_at?: string
          id?: string
          order_index?: number
          title?: string
          type?: Database["public"]["Enums"]["guideline_section_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guideline_sections_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      playbooks: {
        Row: {
          brand_id: string
          content: Json
          created_at: string
          created_by: string
          id: string
          pdf_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          brand_id: string
          content?: Json
          created_at?: string
          created_by: string
          id?: string
          pdf_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          brand_id?: string
          content?: Json
          created_at?: string
          created_by?: string
          id?: string
          pdf_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "playbooks_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          organization_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          organization_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          organization_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      requests: {
        Row: {
          assigned_to: string | null
          brand_id: string
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          requested_by: string
          result_url: string | null
          status: Database["public"]["Enums"]["request_status"]
          title: string
          type: Database["public"]["Enums"]["request_type"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          brand_id: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          requested_by: string
          result_url?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          title: string
          type: Database["public"]["Enums"]["request_type"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          brand_id?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          requested_by?: string
          result_url?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          title?: string
          type?: Database["public"]["Enums"]["request_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "requests_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      vector_items: {
        Row: {
          brand_id: string
          created_at: string
          embedding: string | null
          id: string
          kind: string
          metadata: Json | null
          text: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          embedding?: string | null
          id?: string
          kind: string
          metadata?: Json | null
          text: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          embedding?: string | null
          id?: string
          kind?: string
          metadata?: Json | null
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "vector_items_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_org: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _org_id: string
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "viewer"
      asset_type: "logo" | "image" | "video" | "document" | "template" | "other"
      guideline_section_type:
        | "strategy"
        | "logo"
        | "color"
        | "typography"
        | "grid"
        | "imagery"
        | "motion"
        | "downloads"
      request_status: "new" | "in_progress" | "completed" | "cancelled"
      request_type: "design" | "copy" | "convert"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "viewer"],
      asset_type: ["logo", "image", "video", "document", "template", "other"],
      guideline_section_type: [
        "strategy",
        "logo",
        "color",
        "typography",
        "grid",
        "imagery",
        "motion",
        "downloads",
      ],
      request_status: ["new", "in_progress", "completed", "cancelled"],
      request_type: ["design", "copy", "convert"],
    },
  },
} as const
