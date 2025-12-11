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
      abilities: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
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
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          changes: Json | null
          created_at: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          organization_id: string
          resource_id: string | null
          resource_type: string
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          changes?: Json | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          organization_id: string
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          changes?: Json | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          organization_id?: string
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_metrics: {
        Row: {
          asset_library_usage: number
          brand_consistency_score: number
          brand_id: string
          campaign_performance: number
          created_at: string
          id: string
          team_activity: number
          updated_at: string
        }
        Insert: {
          asset_library_usage?: number
          brand_consistency_score?: number
          brand_id: string
          campaign_performance?: number
          created_at?: string
          id?: string
          team_activity?: number
          updated_at?: string
        }
        Update: {
          asset_library_usage?: number
          brand_consistency_score?: number
          brand_id?: string
          campaign_performance?: number
          created_at?: string
          id?: string
          team_activity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_metrics_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: true
            referencedRelation: "brands"
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
      brand_templates: {
        Row: {
          created_at: string
          default_colors: Json | null
          default_guideline: Json | null
          default_typography: Json | null
          demo_assets: Json | null
          hidden: boolean | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_colors?: Json | null
          default_guideline?: Json | null
          default_typography?: Json | null
          demo_assets?: Json | null
          hidden?: boolean | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_colors?: Json | null
          default_guideline?: Json | null
          default_typography?: Json | null
          demo_assets?: Json | null
          hidden?: boolean | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      brands: {
        Row: {
          archetype: string | null
          audience: string | null
          compliance_config: Json | null
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
          compliance_config?: Json | null
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
          compliance_config?: Json | null
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
      feature_flags: {
        Row: {
          created_at: string | null
          enabled: boolean | null
          id: string
          key: string
          metadata: Json | null
          organization_id: string
          plan_gate: string | null
          rollout_percentage: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          key: string
          metadata?: Json | null
          organization_id: string
          plan_gate?: string | null
          rollout_percentage?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          key?: string
          metadata?: Json | null
          organization_id?: string
          plan_gate?: string | null
          rollout_percentage?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_flags_organization_id_fkey"
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
      motion_outputs: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          metadata: Json | null
          profile: string
          project_id: string
          status: string
          url: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          profile?: string
          project_id: string
          status?: string
          url?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          profile?: string
          project_id?: string
          status?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "motion_outputs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "motion_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      motion_projects: {
        Row: {
          brand_id: string
          created_at: string
          id: string
          mode: string
          params: Json | null
          source_asset_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          id?: string
          mode: string
          params?: Json | null
          source_asset_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          id?: string
          mode?: string
          params?: Json | null
          source_asset_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "motion_projects_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "motion_projects_source_asset_id_fkey"
            columns: ["source_asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          plan_id: string | null
          stripe_customer_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          plan_id?: string | null
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          plan_id?: string | null
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizations_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          created_at: string | null
          entitlements: Json
          id: string
          is_active: boolean | null
          name: string
          price_monthly: number | null
          slug: string
          stripe_price_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          entitlements?: Json
          id?: string
          is_active?: boolean | null
          name: string
          price_monthly?: number | null
          slug: string
          stripe_price_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          entitlements?: Json
          id?: string
          is_active?: boolean | null
          name?: string
          price_monthly?: number | null
          slug?: string
          stripe_price_id?: string | null
          updated_at?: string | null
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
          company_name: string | null
          created_at: string
          display_name: string | null
          id: string
          organization_id: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          organization_id?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          organization_id?: string | null
          role?: string | null
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
      prompt_ab_tests: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          organization_id: string
          start_date: string | null
          status: string
          success_metric: string | null
          template_id: string
          traffic_split: number | null
          updated_at: string | null
          variant_a_id: string
          variant_b_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          organization_id: string
          start_date?: string | null
          status?: string
          success_metric?: string | null
          template_id: string
          traffic_split?: number | null
          updated_at?: string | null
          variant_a_id: string
          variant_b_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          organization_id?: string
          start_date?: string | null
          status?: string
          success_metric?: string | null
          template_id?: string
          traffic_split?: number | null
          updated_at?: string | null
          variant_a_id?: string
          variant_b_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompt_ab_tests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_ab_tests_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "prompt_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_ab_tests_variant_a_id_fkey"
            columns: ["variant_a_id"]
            isOneToOne: false
            referencedRelation: "prompt_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_ab_tests_variant_b_id_fkey"
            columns: ["variant_b_id"]
            isOneToOne: false
            referencedRelation: "prompt_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_analytics: {
        Row: {
          ab_test_id: string | null
          created_at: string | null
          error_message: string | null
          execution_time_ms: number | null
          id: string
          organization_id: string
          result_metadata: Json | null
          success: boolean | null
          template_id: string
          tokens_used: number | null
          user_feedback: string | null
          user_id: string | null
          user_rating: number | null
          version_id: string | null
        }
        Insert: {
          ab_test_id?: string | null
          created_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          organization_id: string
          result_metadata?: Json | null
          success?: boolean | null
          template_id: string
          tokens_used?: number | null
          user_feedback?: string | null
          user_id?: string | null
          user_rating?: number | null
          version_id?: string | null
        }
        Update: {
          ab_test_id?: string | null
          created_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          organization_id?: string
          result_metadata?: Json | null
          success?: boolean | null
          template_id?: string
          tokens_used?: number | null
          user_feedback?: string | null
          user_id?: string | null
          user_rating?: number | null
          version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_analytics_ab_test_id_fkey"
            columns: ["ab_test_id"]
            isOneToOne: false
            referencedRelation: "prompt_ab_tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_analytics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_analytics_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "prompt_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_analytics_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "prompt_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_templates: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          category: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_default: boolean | null
          metadata: Json | null
          name: string
          organization_id: string
          status: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          category: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          metadata?: Json | null
          name: string
          organization_id: string
          status?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          metadata?: Json | null
          name?: string
          organization_id?: string
          status?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_versions: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          notes: string | null
          parameters: Json | null
          system_prompt: string | null
          template_id: string
          version_number: number
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          parameters?: Json | null
          system_prompt?: string | null
          template_id: string
          version_number: number
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          parameters?: Json | null
          system_prompt?: string | null
          template_id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "prompt_versions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "prompt_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      quotas: {
        Row: {
          created_at: string | null
          current_usage: number | null
          id: string
          is_override: boolean | null
          key: string
          last_reset_at: string | null
          limit_value: number
          organization_id: string
          reset_period: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_usage?: number | null
          id?: string
          is_override?: boolean | null
          key: string
          last_reset_at?: string | null
          limit_value: number
          organization_id: string
          reset_period?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_usage?: number | null
          id?: string
          is_override?: boolean | null
          key?: string
          last_reset_at?: string | null
          limit_value?: number
          organization_id?: string
          reset_period?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotas_organization_id_fkey"
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
      roadmap_activity: {
        Row: {
          action: string
          actor_id: string
          created_at: string
          id: string
          payload: Json
          roadmap_id: string
        }
        Insert: {
          action: string
          actor_id: string
          created_at?: string
          id?: string
          payload?: Json
          roadmap_id: string
        }
        Update: {
          action?: string
          actor_id?: string
          created_at?: string
          id?: string
          payload?: Json
          roadmap_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_activity_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_approvals: {
        Row: {
          actor_id: string
          comment: string | null
          created_at: string
          id: string
          roadmap_id: string
          state_from: string
          state_to: string
        }
        Insert: {
          actor_id: string
          comment?: string | null
          created_at?: string
          id?: string
          roadmap_id: string
          state_from: string
          state_to: string
        }
        Update: {
          actor_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          roadmap_id?: string
          state_from?: string
          state_to?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_approvals_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_dependencies: {
        Row: {
          created_at: string
          from_id: string
          from_type: string
          id: string
          lag_days: number | null
          roadmap_id: string
          to_id: string
          to_type: string
          type: Database["public"]["Enums"]["dependency_type"]
        }
        Insert: {
          created_at?: string
          from_id: string
          from_type: string
          id?: string
          lag_days?: number | null
          roadmap_id: string
          to_id: string
          to_type: string
          type?: Database["public"]["Enums"]["dependency_type"]
        }
        Update: {
          created_at?: string
          from_id?: string
          from_type?: string
          id?: string
          lag_days?: number | null
          roadmap_id?: string
          to_id?: string
          to_type?: string
          type?: Database["public"]["Enums"]["dependency_type"]
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_dependencies_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_members: {
        Row: {
          availability: number | null
          capacity: number
          created_at: string
          id: string
          roadmap_id: string
          role: string
          user_id: string
        }
        Insert: {
          availability?: number | null
          capacity?: number
          created_at?: string
          id?: string
          roadmap_id: string
          role: string
          user_id: string
        }
        Update: {
          availability?: number | null
          capacity?: number
          created_at?: string
          id?: string
          roadmap_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_members_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roadmap_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_milestones: {
        Row: {
          created_at: string
          description: string | null
          effort_hours: number | null
          end_date: string | null
          id: string
          name: string
          owner_id: string | null
          position_x: number | null
          position_y: number | null
          progress: number
          roadmap_id: string
          stage_id: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["milestone_status"]
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          effort_hours?: number | null
          end_date?: string | null
          id?: string
          name: string
          owner_id?: string | null
          position_x?: number | null
          position_y?: number | null
          progress?: number
          roadmap_id: string
          stage_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["milestone_status"]
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          effort_hours?: number | null
          end_date?: string | null
          id?: string
          name?: string
          owner_id?: string | null
          position_x?: number | null
          position_y?: number | null
          progress?: number
          roadmap_id?: string
          stage_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["milestone_status"]
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_milestones_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roadmap_milestones_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "roadmap_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_risks: {
        Row: {
          category: Database["public"]["Enums"]["risk_category"]
          created_at: string
          id: string
          impact: number
          mitigation: string | null
          owner_id: string | null
          position_x: number | null
          position_y: number | null
          probability: number
          roadmap_id: string
          status: Database["public"]["Enums"]["risk_status"]
          title: string
          triggers: string | null
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["risk_category"]
          created_at?: string
          id?: string
          impact?: number
          mitigation?: string | null
          owner_id?: string | null
          position_x?: number | null
          position_y?: number | null
          probability?: number
          roadmap_id: string
          status?: Database["public"]["Enums"]["risk_status"]
          title: string
          triggers?: string | null
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["risk_category"]
          created_at?: string
          id?: string
          impact?: number
          mitigation?: string | null
          owner_id?: string | null
          position_x?: number | null
          position_y?: number | null
          probability?: number
          roadmap_id?: string
          status?: Database["public"]["Enums"]["risk_status"]
          title?: string
          triggers?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_risks_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_stages: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
          order_index: number
          roadmap_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
          order_index?: number
          roadmap_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          order_index?: number
          roadmap_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_stages_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_tasks: {
        Row: {
          assignee_id: string | null
          created_at: string
          due_date: string | null
          estimate_hours: number | null
          id: string
          links: Json | null
          milestone_id: string
          name: string
          status: Database["public"]["Enums"]["task_status"]
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          created_at?: string
          due_date?: string | null
          estimate_hours?: number | null
          id?: string
          links?: Json | null
          milestone_id: string
          name: string
          status?: Database["public"]["Enums"]["task_status"]
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          created_at?: string
          due_date?: string | null
          estimate_hours?: number | null
          id?: string
          links?: Json | null
          milestone_id?: string
          name?: string
          status?: Database["public"]["Enums"]["task_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_tasks_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "roadmap_milestones"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmaps: {
        Row: {
          brand_id: string | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          organization_id: string
          owner_id: string
          start_date: string | null
          status: Database["public"]["Enums"]["roadmap_status"]
          title: string
          updated_at: string
          view: Database["public"]["Enums"]["roadmap_view"]
        }
        Insert: {
          brand_id?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          organization_id: string
          owner_id: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["roadmap_status"]
          title: string
          updated_at?: string
          view?: Database["public"]["Enums"]["roadmap_view"]
        }
        Update: {
          brand_id?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          organization_id?: string
          owner_id?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["roadmap_status"]
          title?: string
          updated_at?: string
          view?: Database["public"]["Enums"]["roadmap_view"]
        }
        Relationships: [
          {
            foreignKeyName: "roadmaps_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roadmaps_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      role_abilities: {
        Row: {
          ability_id: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          ability_id?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          ability_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: [
          {
            foreignKeyName: "role_abilities_ability_id_fkey"
            columns: ["ability_id"]
            isOneToOne: false
            referencedRelation: "abilities"
            referencedColumns: ["id"]
          },
        ]
      }
      secret_vault: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          last_rotated_at: string | null
          organization_id: string
          updated_at: string | null
          value_encrypted: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          last_rotated_at?: string | null
          organization_id: string
          updated_at?: string | null
          value_encrypted: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          last_rotated_at?: string | null
          organization_id?: string
          updated_at?: string | null
          value_encrypted?: string
        }
        Relationships: [
          {
            foreignKeyName: "secret_vault_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      system_metrics: {
        Row: {
          created_at: string | null
          id: string
          key: string
          metadata: Json | null
          organization_id: string | null
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          metadata?: Json | null
          organization_id?: string | null
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          metadata?: Json | null
          organization_id?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "system_metrics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
      webhook_endpoints: {
        Row: {
          created_at: string | null
          events: string[] | null
          failure_count: number | null
          id: string
          is_active: boolean | null
          last_triggered_at: string | null
          organization_id: string
          secret: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          events?: string[] | null
          failure_count?: number | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          organization_id: string
          secret: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          events?: string[] | null
          failure_count?: number | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          organization_id?: string
          secret?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_endpoints_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_profiles: {
        Row: {
          business_type: string | null
          created_at: string
          id: string
          industry: string | null
          manages_multiple_brands: boolean | null
          onboarding_complete: boolean | null
          organization_id: string
          primary_goals: string[] | null
          team_size: string | null
          updated_at: string
        }
        Insert: {
          business_type?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          manages_multiple_brands?: boolean | null
          onboarding_complete?: boolean | null
          organization_id: string
          primary_goals?: string[] | null
          team_size?: string | null
          updated_at?: string
        }
        Update: {
          business_type?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          manages_multiple_brands?: boolean | null
          onboarding_complete?: boolean | null
          organization_id?: string
          primary_goals?: string[] | null
          team_size?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      activate_prompt_version: {
        Args: { p_version_id: string }
        Returns: undefined
      }
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
      dependency_type: "FS" | "SS" | "FF" | "SF"
      guideline_section_type:
        | "strategy"
        | "logo"
        | "color"
        | "typography"
        | "grid"
        | "imagery"
        | "motion"
        | "downloads"
      milestone_status: "PLANNED" | "IN_PROGRESS" | "BLOCKED" | "DONE"
      request_status: "new" | "in_progress" | "completed" | "cancelled"
      request_type: "design" | "copy" | "convert"
      risk_category:
        | "SCOPE"
        | "TIMELINE"
        | "QUALITY"
        | "RESOURCING"
        | "TECH"
        | "CLIENT"
      risk_status: "OPEN" | "MITIGATING" | "CLOSED"
      roadmap_status: "DRAFT" | "REVIEW" | "ACTIVE" | "ARCHIVED"
      roadmap_view: "CANVAS" | "GANTT" | "KANBAN" | "LIST"
      task_status: "TODO" | "DOING" | "REVIEW" | "DONE"
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
      dependency_type: ["FS", "SS", "FF", "SF"],
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
      milestone_status: ["PLANNED", "IN_PROGRESS", "BLOCKED", "DONE"],
      request_status: ["new", "in_progress", "completed", "cancelled"],
      request_type: ["design", "copy", "convert"],
      risk_category: [
        "SCOPE",
        "TIMELINE",
        "QUALITY",
        "RESOURCING",
        "TECH",
        "CLIENT",
      ],
      risk_status: ["OPEN", "MITIGATING", "CLOSED"],
      roadmap_status: ["DRAFT", "REVIEW", "ACTIVE", "ARCHIVED"],
      roadmap_view: ["CANVAS", "GANTT", "KANBAN", "LIST"],
      task_status: ["TODO", "DOING", "REVIEW", "DONE"],
    },
  },
} as const
