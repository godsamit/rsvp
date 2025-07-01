<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { participateEventSchema } from "../../routes/event/[eventId]/schema";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import IconHand from "~icons/mdi/hand-front-right";

  let { data, eventId } = $props();
  let showForm = $state(false);

  const form = superForm(data.form, {
    validators: zodClient(participateEventSchema(data.attendees)),
    resetForm: true,
    onSubmit({ formData }) {
      formData.set('attendees', JSON.stringify(data.attendees));
    },
    onResult({ result }) {
      if (result.type === "success") {
        showForm = false;
      }
    }
  })

  const { form: formData, enhance } = form
</script>

{#if !showForm}
  <Button class="w-full text-lg" onclick={() => showForm = true}>
    <IconHand /> Attend This Event!
  </Button>
{:else}
  <form
    method="POST" 
    action="/event/{eventId}?/attend" 
    use:enhance
  >
    <div class="p-4 rounded-md border-input bg-accent border">
      <h2 class="font-bold mb-2">Attend This Event</h2>
      <div class="flex flex-col md:flex-row items-start gap-2">
        <Form.Field 
          {form}
          name="name"
          class="w-full md:basis-1/2"
        >
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>
                Your Name
                <span class="text-destructive">*</span>
              </Form.Label>
              <Input
                {...props}
                bind:value={$formData.name}
                type="text"
                placeholder="Your Name"
              />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field
          {form}
          name="password"
          class="w-full md:basis-1/2"
        >
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>
                Password (For Canceling)
                <span class="text-destructive">*</span>
              </Form.Label>
              <Input
                {...props}
                bind:value={$formData.password}
                type="password"
                placeholder="Password: At least 4 characters"
              />
            {/snippet}
          </Form.Control>
          <Form.Description class="max-w-[50ch]">
            If you change your mind later, you can use the password to delete your attendance.
          </Form.Description>
          <Form.FieldErrors />
        </Form.Field>
        <Button type="submit" class="mt-8">
          <IconAdd /> Attend
        </Button>
      </div>
    </div>
  </form>
{/if}
