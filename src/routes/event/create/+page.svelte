<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { createEventSchema, type ICreateEventSchema } from "./schema";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  
  import EditEventForm from "$lib/components/EditEventForm.svelte";

  let { data }: { data: { form: SuperValidated<Infer<ICreateEventSchema>> } } = $props()
  let timezoneOffset = new Date().getTimezoneOffset();
  
  const form = superForm(data.form, {
    onSubmit({ formData }) {
      formData.set('timezoneOffset', `${timezoneOffset}`);
      // console.log(formData.entries())
      // return formData
    },
    validators: zodClient(createEventSchema)
  })
  const { form: formData, enhance } = form

</script>

<form method="POST" use:enhance>
  <Card.Root class="max-w-sm p-4">
    <Card.Header>
      <Card.Title>Create an event</Card.Title>
      <Card.Description>A simple event RSVP app. Create an event and see who are coming. No login needed.</Card.Description>
    </Card.Header>
    <Card.Content>
      <div class="flex flex-col gap-2">
        <EditEventForm form={form} formData={formData} isCreate={true}/>
      </div>
    </Card.Content>
    <Card.Footer>
      <Form.Button type="submit">Submit</Form.Button>
    </Card.Footer>
  </Card.Root>
</form>
