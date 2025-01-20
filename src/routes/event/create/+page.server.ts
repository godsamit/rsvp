import type { PageServerLoad, Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { createEventSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";
import { supabase } from "$lib/supabaseClient";
import { customAlphabet } from "nanoid";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(createEventSchema)),
  };
}

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const form = await superValidate(formData, zod(createEventSchema));

    if (!form.valid) {
      return fail(400, { form });
    }
    
    const { password, title, detail, picture, date, address } = form.data;
    
    // get timezone and convert to UTC to store in database
    const localDate = new Date(date);
    const timezoneOffset = Number(formData.get('timezoneOffset'))
    const utcDate = new Date(localDate.getTime() - timezoneOffset * 60000).toISOString();
  
    // generate unique ID to store in database
    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 6);
    const id = nanoid();
  
    const { error } = await supabase.from("rsvp_event").insert([
      { id, password, title, detail, picture, date: utcDate, address }
    ]);

    if (error) {
      console.error(error);
      return fail(500, { form, message: error.message });
    }

    throw redirect(302, `/event/success/${id}`);
  }
}