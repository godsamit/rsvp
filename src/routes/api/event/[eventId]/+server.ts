import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export async function GET({ params }) {
  const { eventId } = params;

  const { data, error } = await supabase
    .from('rsvp_event')
    .select('id, title, detail, picture, date, address')
    .eq('id', eventId)
    .single();

  if (error || !data) {
    return json({ error: 'Event not found' }, { status: 404 });
  }

  return json(data, {
    headers: {
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
    }
  });
}