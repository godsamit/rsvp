import type { PageServerLoad, Actions } from "./$types";
import { fail } from "@sveltejs/kit";
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
    .select('id, title, detail, picture, date, address')
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
    form: superValidate(zod(participateEventSchema)),
    event: data,
    attendees: attendees || [],
  };
}

export const actions: Actions = {
  attend: async ({ request, params }) => {
    console.log("attend")
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
  },
  confirmPassword: async ({ request, params }) => {
    console.log("confirmPassword")
    const formData = await request.formData();
    const password = formData.get('password');

    const { eventId } = params;

    const { data, error } = await supabase.rpc('validate_event_password', {
      event_id: eventId,
      input_password: password
    })

    if (error || !data) {
      fail(403, { message: "Invalid password" })
    }

    console.log("confirmed")
  }
}
