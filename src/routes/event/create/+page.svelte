<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { createEventSchema } from "./schema";
  import {
    superForm,
    fileProxy,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import IconPublish from "~icons/mdi/publish"
  import IconLoading from "~icons/mdi/loading"
  import EditEventFormFields from "$lib/components/EditEventFormFields.svelte";
	import type { PageProps } from "./$types";

  let { data }: PageProps = $props()
  let utcDate = $state("")
  
  const form = superForm(data.form, {
    onSubmit({ formData }) {
      formData.set('utcDate', `${utcDate}`);
    },
    clearOnSubmit: "none",
    multipleSubmits: "prevent",
    validators: zodClient(createEventSchema)
  })
  const { form: formData, enhance, delayed, message } = form

  const file = fileProxy(formData, "picture")

  $effect(() => {
    if ($formData.date === "") return
    utcDate = new Date($formData.date).toISOString()
  })
</script>
<div class="w-9/10 sm:w-4/5 md:w-3/4 lg:w-3/5 xl:w-1/2 max-w-2xl self-center">
  <form method="POST" enctype="multipart/form-data" use:enhance>
    <Card.Root class="my-2 md:my-16 p-4">
      <Card.Header>
        <Card.Title>Create an Event</Card.Title>
        <Card.Description>A simple event RSVP app. Create an event and see who are coming. No login needed.</Card.Description>
      </Card.Header>
      <Card.Content>
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
          {#if message}
            <p class="text-destructive text-xs font-semibold">{$message}</p>
          {/if}
          <EditEventFormFields form={form} formData={formData} isCreate={true} file={file}/>
        </div>
      </Card.Content>
      <Card.Footer>
        <Form.Button type="submit" disabled={!!$delayed}>
          <IconPublish /> Create Event
        </Form.Button>
      </Card.Footer>
    </Card.Root>
  </form>
</div>
