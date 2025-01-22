import type { PageServerLoad, Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { z } from "zod";
import { superValidate } from "sveltekit-superforms";
import { participateEventSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";
import { supabase } from "$lib/supabaseClient";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params, fetch }) => {
  const { eventId } = params;

  // Fetch event details from Supabase
  const eventResponse = await fetch(`/api/event/${eventId}`);
  if (!eventResponse.ok) {
    throw error(404, 'Event not found');
  }
  const event = await eventResponse.json();

  const attendeesResponse = await fetch(`/api/event/${eventId}/attendees`);
  if (!attendeesResponse.ok) {
    throw error(404, 'Event not found');
  }
  const attendees = await attendeesResponse.json() || [];

  return {
    form: superValidate(zod(participateEventSchema(attendees))),
    event,
    attendees,
  };
}

export const actions: Actions = {
  attend: async ({ request, params }) => {
    const formData = await request.formData();

    const baseSchema = z.object({
      name: z.string().max(50),
      password: z.string().min(4),
    });

    const form = await superValidate(formData, zod(baseSchema));

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
      return fail(500, { form, message: "Failed to add participant"})
    }
  },
  confirmPassword: async ({ request, params, cookies }) => {
    const formData = await request.formData();
    const password = formData.get('password')?.toString();

    if (!password || password.length < 4) {
      return fail(400, { message: "Please enter a password with at least 4 characters" })
    }

    if (password === null) {
      return fail(400, { message: "Password is required" });
    }

    const { eventId } = params;

    const { data, error } = await supabase.rpc('validate_event_password', {
      event_id: eventId,
      input_password: password
    });

    if (error || !data) {
      console.log(error, data);
      return fail(403, { message: error });
    }

    cookies.set(`auth_event_${eventId}`, password, {
      path: '/',
      httpOnly: true,
      maxAge: 3600 * 24,
      secure: process.env.NODE_ENV === 'production'
    });

    throw redirect(303,`/event/${eventId}/edit`);
  },
  cancelAttendance: async ({ request, params }) => {
    const formData = await request.formData();
    const password = formData.get('password')?.toString();
    const name = formData.get('attendee')?.toString();

    if (!password || password.length < 4) {
      return fail(400, { message: "Please enter a password with at least 4 characters" })
    }

    if (password === null) {
      return fail(400, { message: "Password is required" });
    }

    const { eventId } = params;

    const { data, error } = await supabase.rpc('validate_attendance_password', {
      input_id: eventId,
      input_password: password,
      input_name: name,
    });

    if (error || !data) {
      return fail(403, { message: error });
    }

    const { error: sessionError } = await supabase.rpc('set_session_var', {
      key: 'app.password',
      value: password
    });

    if (sessionError) {
      console.error('Error setting session variable:', sessionError);
      return fail(403, { message: 'Failed to authenticate' });
    }

    const { error: removeError} = await supabase
      .from("rsvp_event_attendee")
      .delete()
      .eq("event_id", eventId)
      .eq("name", name);

    if (removeError) {
      return fail(500, { message: "Failed to remove participant" });
    }

  // Return JSON response to handle UI updates in Svelte
  return { success: true, removedAttendee: name };
  }
}
