<script lang="ts">
  import AddToCalendarDropdown from "$lib/components/AddToCalendarDropdown.svelte";
  import EditEventConfirmDialog from "$lib/components/EditEventConfirmDialog.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import IconCalendar from "~icons/mdi/calendar";
  import IconLocation from "~icons/mdi/map-marker";
  import IconImage from "~icons/mdi/image";
  import IconHome from "~icons/mdi/home";
  import SignUpForEventForm from "$lib/components/SignUpForEventForm.svelte";
	import type { PageProps } from "./$types";
  import { page } from "$app/state";
  import { onMount } from "svelte";
	import AttendanceRow from "$lib/components/AttendanceRow.svelte";

  let { data, form }: PageProps = $props();
  let isMobile = false;
  onMount(() => {
    if (typeof navigator !== 'undefined') {
        isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
  });

  const needPassword = page.url.searchParams.get('needPassword');
  let editAuthOpen = $state(needPassword === 'true');

  const googleMapsUrl = `https://www.google.com/maps/search/?q=${encodeURIComponent(data.event.address)}`;
  const mobileMapsUrl = `geo:0,0?q=${encodeURIComponent(data.event.address)}`;

  const handleClick = () => {
    if (isMobile) {
      window.location.href = mobileMapsUrl; // Opens in mobile maps app
    } else {
      window.open(googleMapsUrl, '_blank');
    }
  };
</script>
<a class="fixed top-8 left-8 md:left-16 lg:left-30 xl:left-48 z-50 shadow-lg" href="/">
  <Button title="Home" class="w-12 h-12 p-2">
    <IconHome font-size="2rem" />
  </Button>
</a>
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
  <section class="flex-1 w-9/10 sm:w-4/5 md:w-3/4 lg:w-3/5 xl:w-1/2 mx-auto bg-white flex flex-col gap-4 p-6 md:p-8 lg:p-12 xl:p-16 shadow-sm">
    <div class="flex justify-between">
      <h1 class="text-2xl md:text-3xl font-bold">{data.event.title}</h1>
      <EditEventConfirmDialog form={form} isOpen={editAuthOpen ?? false}/>
    </div>
    <div>
      <span class="flex gap-2 items-center"><IconCalendar />
        <p><strong>Date:</strong> <AddToCalendarDropdown data={data} /></p>
      </span> 
    </div>
    <div>
      <span class="flex  gap-2 items-center"><IconLocation /> 
        <p><strong>Location:</strong>         
          {#if data.event.address}
            <button class="underline text-primary" onclick={handleClick}>
              {data.event.address}
            </button>
          {:else}
            The organizer has not provided a location.
          {/if}
      </span>
    </div>
    <p class="whitespace-pre-wrap"> {data.event.detail ?? "The organizer has not provided details for this event."}</p>
    <div class="flex flex-col justify-end gap-2">
      <p><strong>Attendees ({data.attendees.length ?? 0})</strong></p>
      {#if data.attendees.length === 0}
        <p>There is no attendees for this event. Sign up below!</p>
      {:else}
        <ul>
          {#each data.attendees as attendee, index}
            <AttendanceRow attendee={attendee} index={index} form={form} />
          {/each}
        </ul>
      {/if}
      <div class="mt-4 w-full">
        <SignUpForEventForm data={data} eventId={data.event.id} />
      </div>
    </div>
  </section>
</div>
{:else}
  <p class="text-destructive">Event not found.</p>
{/if}
