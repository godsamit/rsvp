import { json } from "@sveltejs/kit";

export async function GET({ params, cookies }) {
  const { eventId } = params;

  const isAuthenticated = cookies.get(`auth_event_${eventId}`);

  return json({ isAuthenticated });
}