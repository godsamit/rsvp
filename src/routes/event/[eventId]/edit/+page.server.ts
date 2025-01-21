import type { PageServerLoad, Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms";
import { editEventSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";
import { supabase } from "$lib/supabaseClient";
import { error } from "@sveltejs/kit";
export const load: PageServerLoad = async ({ params, cookies, fetch }) => {
  const { eventId } = params;
  const isAuthenticated = cookies.get(`auth_event_${eventId}`);
  if (!isAuthenticated) {
    throw redirect(303, `/event/${eventId}?needPassword=true`);
  }

  // Fetch event details from Supabase
  const eventResponse = await fetch(`/api/event/${eventId}`);
  if (!eventResponse.ok) {
    throw error(404, 'Event not found');
  }
  const eventData = await eventResponse.json();

  const event = {
    ...eventData, 
    date: eventData.date.slice(0, 16),
    existingPicture: eventData.picture,
    picture: undefined,
  }

  const attendeesResponse = await fetch(`/api/event/${eventId}/attendees`);
  if (!attendeesResponse.ok) {
    throw error(404, 'Event not found');
  }
  const attendees = await attendeesResponse.json() || [];

  return {
    form: await superValidate(event, zod(editEventSchema)),
    event,
    attendees,
  };
}

export const actions: Actions = {
  default: async ({ request, params, cookies }) => {
    const formData = await request.formData();
    const form = await superValidate(formData, zod(editEventSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { title, detail, picture, date, address } = form.data;
    const id = params.eventId;

    // get timezone and convert to UTC to store in database
    const localDate = new Date(date);
    const timezoneOffset = Number(formData.get('timezoneOffset'))
    const utcDate = new Date(localDate.getTime() - timezoneOffset * 60000).toISOString();

    const password = cookies.get(`auth_event_${id}`);
    
    try {
      const { error: sessionError } = await supabase.rpc('set_session_var', {
        key: 'app.password',
        value: password
      });

      if (sessionError) {
        console.error('Error setting session variable:', sessionError);
        return message(form, 'Failed to authenticate', { status: 403 });
      }

      // Get the event to update (using title as identifier)
      const { data: existingEvent, error: fetchError } = await supabase
      .from('rsvp_event')
      .select('id, picture')
      .eq('id', id)
      .single();

      if (fetchError) {
        console.error(fetchError);
        return message(form, 'Event not found', { status: 404 });
      }

      let pictureUrl = existingEvent.picture;

      if (picture && picture instanceof File) {
        const uniqueFileName = `${existingEvent.id}-picture`;

        const { error: uploadError } = await supabase.storage
          .from('rsvp_pictures')
          .upload(uniqueFileName, picture, { cacheControl: '3600', upsert: true });

        if (uploadError) {
          console.error('Error uploading picture:', uploadError);
          return message(form, uploadError.message, { status: 500 });
        }

        const { publicUrl } = supabase.storage.from('rsvp_pictures').getPublicUrl(uniqueFileName).data;
        pictureUrl = publicUrl;
      }

      // Update the event in the database
      const { error: updateError } = await supabase
        .from('rsvp_event')
        .update({ id, title, detail, password, picture: pictureUrl, date: utcDate, address })
        .eq('id', existingEvent.id);

      if (updateError) {
        console.error(updateError);
        return message(form, updateError.message, { status: 500 });
      }
    } catch (error) {
      console.error(error);
      return message(form, "An error occurred when trying to edit this event", { status: 400 });
    }

    throw redirect(302, `/event/${id}`);
  }
}