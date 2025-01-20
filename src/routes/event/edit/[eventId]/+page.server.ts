import type { PageServerLoad, Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { editEventSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";
import { supabase } from "$lib/supabaseClient";
import { customAlphabet } from "nanoid";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(editEventSchema)),
  };
}

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const form = await superValidate(formData, zod(editEventSchema));

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
    
    try {
      let pictureUrl = undefined;
      const uniqueFileName = `${id}-picture`;

      if (picture) {
        const { error } = await supabase.storage
          .from("rsvp_pictures")
          .upload(`${uniqueFileName}`, picture, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          console.error("Error uploading picture")
          console.error(error);
          return fail(500, { form, message: error.message });
        }
      }

      const { publicUrl } = supabase.storage.from("rsvp_pictures").getPublicUrl(uniqueFileName).data;

      if (picture) pictureUrl = publicUrl

      const { error: insertError } = await supabase.from("rsvp_event").insert([
        { id, password, title, detail, picture: pictureUrl, date: utcDate, address }
      ]);
  
      if (insertError) {
        console.error(insertError);
        return fail(500, { form, message: insertError.message });
      }
    } catch (error) {
      console.error(error);
      return fail(500, { form, message: "An error occurred while creating the event" })
    }

    throw redirect(302, `/event/success/${id}`);
  }
}