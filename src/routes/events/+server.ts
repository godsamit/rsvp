import { supabase } from "$lib/supabaseClient";
import { json } from "@sveltejs/kit";

export async function POST({ request }: { request: Request }) {
  const { title, detail, picture, date, address } = await request.json();

  const { data, error } = await supabase.from("events").insert([
    { title, detail, picture, date, address }
  ]);

  if (error) {
    console.error(error);
    return json({ error: error.message }, { status: 500 });
  }
  return json({ message: 'Event created successfully' }, { status: 201 }, data);
}