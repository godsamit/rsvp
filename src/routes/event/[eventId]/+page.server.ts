import type { PageServerLoad, Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { participateEventSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";
import { supabase } from "$lib/supabaseClient";
import { error } from "@sveltejs/kit"


export const load: PageServerLoad = async ({ params }) => {
  const { eventId } = params;

  // Fetch event details from Supabase
  const { data, error: fetchError } = await supabase
    .from('rsvp_event')
    .select('*')
    .eq('id', eventId)
    .single();

  if (fetchError) {
    throw error(404, 'Event not found');
  }

  const { data: attendees, error: attendeesError } = await supabase
    .from('rsvp_event_attendee')
    .select("name")
    .eq('event_id', eventId);

  if (attendeesError) {
    console.error(attendeesError)
  }

  return {
    form: superValidate(data, zod(participateEventSchema)),
    event: data,
    attendees: attendees || [],
  };
}

export const actions: Actions = {
  default: async ({ request, params }) => {
    const formData = await request.formData();
    const form = await superValidate(formData, zod(participateEventSchema));

    if (!form.valid) {
      return fail(400, { form });
    }
  
    const { password, name } = form.data;
  
    const { eventId } = params;

    const { error } = await supabase
      .from('rsvp_event_attendee')
      .insert({ event_id: eventId, name, password });

    if (error) {
      console.error(error)
      fail(500, { form, message: "Failed to add participant"})
    }
    throw redirect(303, `/event/${eventId}`);
  }
}
