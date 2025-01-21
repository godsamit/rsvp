<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { participateEventSchema } from "../../routes/event/[eventId]/schema";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import IconAdd from "~icons/mdi/plus";

  let { data, eventId } = $props();
  let showForm = $state(false);

  const form = superForm(data.form, {
    validators: zodClient(participateEventSchema(data.attendees)),
    resetForm: true,
    onResult({ result }) {
      if (result.type === "success") {
        showForm = false;
      }
    }
  })

  const { form: formData, enhance } = form
</script>


{#if !showForm}
  <Button class="w-full" onclick={() => showForm = true}>
    <IconAdd /> Attend This Event!
  </Button>
{:else}
  <form 
    method="POST" 
    action="/event/{eventId}?/attend" 
    use:enhance
  >
    <h2 class="font-bold mb-2">Attend the Event</h2>
    <div class="flex items-start gap-2">
      <Form.Field 
        {form} 
        name="name"
        class="basis-1/2"
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
        class="basis-1/2"
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
      <Form.Button class="mt-8" type="submit">
        <IconAdd /> Attend
      </Form.Button>
    </div>
  </form>
{/if}