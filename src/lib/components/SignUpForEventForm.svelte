<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import IconAdd from "~icons/mdi/plus";

  let { form, formData } = $props();
</script>

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
          Password
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