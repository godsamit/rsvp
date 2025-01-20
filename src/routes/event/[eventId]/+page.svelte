<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { participateEventSchema, type IParticipateEventSchema } from "./schema";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import IconCalendarAdd from "~icons/mdi/calendar-plus";
  import SignUpForEventForm from "$lib/components/SignUpForEventForm.svelte";

  type IEvent = {
    id: string;
    title: string;  
    picture?: string;  
    detail?: string;  
    date: string;  
    address?: string;
  }

  type IAttendee = {
    name: string;
  }

  let { data }: { data: { 
    event: IEvent, 
    attendees: IAttendee[], 
    form: SuperValidated<Infer<IParticipateEventSchema>> 
  }} = $props()

  console.log(data.attendees);

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  const form = superForm(data.form, {
    multipleSubmits: "prevent",
    validators: zodClient(participateEventSchema)
  })

  const { form: formData, enhance } = form

  function formatToLocalTime(utcDateStr: string, timeZone: string) {
    const date = new Date(utcDateStr);
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timeZone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(date);
  }
  function formatDateForCalendar(date: string) {
    return date.replace(/[-:]/g, "").split(".")[0] + "Z";
  }
  function getGoogleCalendarUrl () {
    const baseGoogleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE`;
    const eventTitle = encodeURIComponent(data.event.title);
    const eventDate = formatDateForCalendar(data.event.date);

    let googleCalendarUrl = `${baseGoogleCalendarUrl}&text=${eventTitle}&dates=${eventDate}&ctz=${userTimeZone}`;

    if (data.event.detail) {
      googleCalendarUrl += `&details=${encodeURIComponent(data.event.detail)}`;
    }

    if (data.event.address) {
      googleCalendarUrl += `&location=${encodeURIComponent(data.event.address)}`;
    }
    return googleCalendarUrl;
  }
  function generateICS() {
    const formattedStart = formatDateForCalendar(data.event.date);

    const icsContent = `
      BEGIN:VCALENDAR
      VERSION:2.0
      BEGIN:VEVENT
      SUMMARY:${data.event.title}
      DESCRIPTION:${data.event.detail || ""}
      LOCATION:${data.event.address || ""}
      DTSTART:${formattedStart}
      END:VEVENT
      END:VCALENDAR`.trim();

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.event.title.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

</script>
{#if data.event}
<div class="min-h-full w-full flex flex-col">
  <header class="flex-shrink-0">
    <img src={data.event.picture} alt={data.event.title} class="w-full h-64 object-cover" />
  </header>
  <section class="flex-1 w-4/5 mx-auto bg-white flex flex-col gap-4 p-5 shadow-sm">
    <div class="flex justify-between">
      <h1 class="text-3xl font-bold">{data.event.title}</h1>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button>
            <IconCalendarAdd /> Add to Calendar
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>
            <a 
              class="block w-full" 
              rel="noopener noreferrer" 
              target="_blank" href={getGoogleCalendarUrl()}
            >
              Google
            </a>
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <button onclick={generateICS}>Outlook/Apple</button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
    <p><strong>Date:</strong> {formatToLocalTime(data.event.date, userTimeZone)}</p>
    <p><strong>Location:</strong> {data.event.address ?? "The organizer has not provided a location."}</p>
    <p><strong>Details:</strong> {data.event.detail ?? "The organizer has not provided details for this event."}</p>
    <div class="flex flex-col justify-end">
      <p><strong>Attendees ({data.attendees.length ?? 0})</strong></p>
      {#if data.attendees.length === 0}
        <p>There is no attendees for this event. Sign up below!</p>
      {/if}
      {#each data.attendees as attendee}
        <p>{attendee.name}</p>
      {/each}
      <form method="POST" use:enhance>
        <SignUpForEventForm form={form} formData={formData} />
      </form>
    </div>
  </section>
</div>
{:else}
  <p class="text-red-500">Event not found.</p>
{/if}