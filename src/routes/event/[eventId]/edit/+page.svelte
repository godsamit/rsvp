<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { editEventSchema } from "./schema";
  import {
    superForm,
    fileProxy,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import IconSync from "~icons/mdi/sync"
  import IconBackArrow from "~icons/mdi/keyboard-backspace";
  import IconLoading from "~icons/mdi/loading"
  import EditEventFormFields from "$lib/components/EditEventFormFields.svelte";
	import type { PageProps } from "./$types";
  import { page } from "$app/state";
	import { goto } from "$app/navigation";
  import IconTrash from "~icons/mdi/trash-can";

  let { data }: PageProps = $props()
  const { eventId }= page.params
  
  let timezoneOffset = new Date().getTimezoneOffset();
  let utcDate = $state(new Date(data.event.date).toISOString())
  
  const form = superForm(data.form, {
    onSubmit({ formData }) {
      formData.set('utcDate', `${utcDate}`);
    },
    clearOnSubmit: "none",
    multipleSubmits: "prevent",
    validators: zodClient(editEventSchema)
  })
  const { form: formData, enhance, delayed, message } = form

  $effect(() => {
    // indicates form reload
    if ($formData.date.length > 16) {
      // get timezone and convert to UTC to store in database
      const date = new Date($formData.date);
      const localDate = new Date(date.getTime() - timezoneOffset * 60000).toISOString().slice(0, 16);
      $formData.date = localDate;
    }
  })

  $effect(() => {
    utcDate = new Date($formData.date).toISOString()
  })

  const file = fileProxy(formData, "picture")

</script>
<div class="w-9/10 sm:w-4/5 md:w-3/4 lg:w-3/5 xl:w-1/2 max-w-2xl self-center">
  <Card.Root class="my-2 md:my-16  p-4">
    <Card.Header>
      <Card.Title>Edit Your Event</Card.Title>
    </Card.Header>
    <Card.Content>
      <form method="POST" action="/event/{eventId}/edit?/update" enctype="multipart/form-data" use:enhance>
        <div
          class={[
            "flex flex-col gap-2 relative",
            $delayed && "pointer-events-none"
          ]}
        >
          {#if $delayed}
            <div class="absolute -p-6 top-0 left-0 w-full h-full bg-gray-200 opacity-50 z-10 flex items-center justify-center">
              <IconLoading font-size="3rem" class="mt-1/2 z-20 animate-spin" />
            </div>
          {/if}
          {#if $message}
            <p class="text-destructive text-xs font-semibold">{$message}</p>
          {/if}
          <EditEventFormFields form={form} formData={formData} isCreate={false} file={file}/>
        </div>
        <div class="my-6 flex justify-between">
          <Form.Button type="button" variant="secondary" onclick={() => goto(`/event/${eventId}`)}>
            <IconBackArrow /> Cancel Editing
          </Form.Button>
          <Form.Button type="submit" disabled={!!$delayed}>
            <IconSync /> Update Event
          </Form.Button>
        </div>
      </form>
      {#if data.attendees.length > 0}
        <h1 class="text-2xl font-semibold mt-4 tracking-tight leading-none">Manage Attendees:</h1>
        <ul class="py-4">
          {#each data.attendees as attendee, index}
            <form method="POST" action="/event/{eventId}/edit?/cancelAttendance" use:enhance>
              <li class={[
                "px-2 py-1 flex justify-between items-center",
                index % 2 !== 0 ? "bg-gray-100" : ""
              ]}>
                {attendee.name}
                <input type="hidden" name="attendee" value={attendee.name} />
                <Button type="submit" size="icon" variant="destructive" class="w-6 h-6" title="Remove Attendance">
                  <IconTrash />
                </Button>
              </li>
            </form>
          {/each}
        </ul>
      {/if}
    </Card.Content>
  </Card.Root>
</div>
