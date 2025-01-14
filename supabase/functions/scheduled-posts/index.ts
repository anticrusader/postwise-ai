import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get posts that are scheduled for now or earlier
    const { data: posts, error: fetchError } = await supabaseClient
      .from('posts')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_for', new Date().toISOString())

    if (fetchError) throw fetchError

    for (const post of posts || []) {
      // Publish each post
      const { error: publishError } = await supabaseClient
        .from('posts')
        .update({ status: 'published' })
        .eq('id', post.id)

      if (publishError) throw publishError

      // Update analytics
      await supabaseClient
        .from('analytics')
        .insert({
          post_id: post.id,
          engagement: 0,
          reach: 0,
          date: new Date().toISOString(),
        })
    }

    return new Response(
      JSON.stringify({ success: true, processed: posts?.length || 0 }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})