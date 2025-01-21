<script lang="ts">
  import AddToCalendarDropdown from "$lib/components/AddToCalendarDropdown.svelte";
  import EditEventConfirmDialog from "$lib/components/EditEventConfirmDialog.svelte";

  import IconCalendar from "~icons/mdi/calendar";
  import IconLocation from "~icons/mdi/map-marker";
  import IconImage from "~icons/mdi/image";
  import SignUpForEventForm from "$lib/components/SignUpForEventForm.svelte";
	import type { PageProps } from "./$types";
  import { page } from "$app/state";

  let { data, form }: PageProps = $props()

  const needPassword = page.url.searchParams.get('needPassword')
  let editAuthOpen = $state(needPassword === 'true')

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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
      hour12: true,
    }).format(date);
  }

</script>
{#if data.event}
<div class="min-h-full w-full flex flex-col">
  <header class="flex-shrink-0">
    {#if data.event.picture}
      <img src={data.event.picture} alt={data.event.title} class="w-full h-64 object-cover" />
    {:else}
      <div class="w-full h-64 bg-gray-300 flex items-center justify-center">
        <IconImage class="text-gray-400" font-size="5rem" />
      </div>
    {/if}
  </header>
  <section class="flex-1 w-4/5 mx-auto bg-white flex flex-col gap-4 p-6 md:p-8 lg:p-12 xl:p-16 shadow-sm">
    <div class="flex justify-between">
      <h1 class="text-2xl md:text-3xl font-bold">{data.event.title}</h1>
      <div class="flex gap-2">
        <EditEventConfirmDialog form={form} isOpen={editAuthOpen ?? false}/>
        <AddToCalendarDropdown data={data} userTimeZone={userTimeZone} />
      </div>
    </div>
    <div>
      <span class="flex gap-2 items-center"><IconCalendar />
      <p><strong>Date:</strong> {formatToLocalTime(data.event.date, userTimeZone)}</p>
    </span> 
    </div>
    <div>
      <span class="flex  gap-2 items-center"><IconLocation /> 
        <p><strong>Location:</strong> {data.event.address ?? "The organizer has not provided a location."}</p>
      </span>
    </div>
    <p> {data.event.detail ?? "The organizer has not provided details for this event."}</p>
    <div class="flex flex-col justify-end">
      <p><strong>Attendees ({data.attendees.length ?? 0})</strong></p>
      {#if data.attendees.length === 0}
        <p>There is no attendees for this event. Sign up below!</p>
      {:else}
        <ul>
          {#each data.attendees as attendee, index}
            <li class={[
              "px-2 py-1 flex justify-between items-center",
              index % 2 !== 0 ? "bg-gray-100" : ""
            ]}>
              {attendee.name}
            </li>
          {/each}
        </ul>
      {/if}
      <div class="mt-2 w-full">
        <SignUpForEventForm data={data} eventId={data.event.id} />
      </div>
    </div>
  </section>
</div>
{:else}
  <p class="text-destructive">Event not found.</p>
{/if}