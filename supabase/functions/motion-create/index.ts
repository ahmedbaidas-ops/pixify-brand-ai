import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use service role key for system-level operations (bypasses RLS securely)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Also create a client with user auth for validation
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { title, brandId, sourceAssetId, mode, params } = await req.json();

    // Validate input
    if (!title || !brandId || !mode) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: title, brandId, mode' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create motion project
    const { data: project, error: projectError } = await supabaseClient
      .from('motion_projects')
      .insert({
        title,
        brand_id: brandId,
        source_asset_id: sourceAssetId,
        mode,
        params: params || {}
      })
      .select()
      .single();

    if (projectError) {
      console.error('Error creating motion project:', projectError);
      return new Response(
        JSON.stringify({ error: 'Failed to create motion project', details: projectError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create motion output using admin client (system-level operation)
    const { data: output, error: outputError } = await supabaseAdmin
      .from('motion_outputs')
      .insert({
        project_id: project.id,
        status: 'QUEUED',
        profile: 'landscape'
      })
      .select()
      .single();

    if (outputError) {
      console.error('Error creating motion output:', outputError);
      return new Response(
        JSON.stringify({ error: 'Failed to create motion output', details: outputError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // TODO: In production, this would call Runway Gen-3 API
    // For now, simulate processing with a mock response
    console.log('Motion generation stubbed - would call Runway API here');
    console.log('Project params:', params);

    // Simulate processing by updating status after a delay using admin client
    setTimeout(async () => {
      await supabaseAdmin
        .from('motion_outputs')
        .update({ 
          status: 'RENDERING',
          metadata: { 
            provider: 'runway-gen3-stub',
            startedAt: new Date().toISOString()
          }
        })
        .eq('id', output.id);

      // Simulate completion after 10 seconds
      setTimeout(async () => {
        await supabaseAdmin
          .from('motion_outputs')
          .update({ 
            status: 'DONE',
            url: 'https://placehold.co/1920x1080/5C0A3A/CBB59C.mp4', // Placeholder
            completed_at: new Date().toISOString(),
            metadata: {
              provider: 'runway-gen3-stub',
              duration: 5,
              resolution: '1920x1080',
              fps: 30
            }
          })
          .eq('id', output.id);
      }, 10000);
    }, 2000);

    return new Response(
      JSON.stringify({ 
        project,
        output,
        message: 'Motion generation started (mock mode)'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in motion-create function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});