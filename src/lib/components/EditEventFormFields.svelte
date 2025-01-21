<!-- This component does not initiate its own form and needs it passed in. -->
<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";


  let { form, formData, isCreate, file } = $props();

  console.log($formData.picture)
  let previewUrl = $formData.existingPicture
</script>

<Form.Field {form} name="title">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>
        Event Title
        <span class="text-destructive">*</span>
      </Form.Label>
      <Input
        {...props}
        bind:value={$formData.title}
        type="text"
        placeholder="Event Title"
      />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
{#if isCreate}
  <Form.Field {form} name="password">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>
          Admin Password
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
    <Form.Description>This is your key to edit this event. Remember it in case you wish to change the event details later!</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
{/if}
<Form.Field {form} name="detail">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label for="detail">Event Detail</Form.Label>
      <Textarea
        {...props}
        bind:value={$formData.detail}
        placeholder="Event Detail"
      />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="picture">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label for="picture">Event Picture</Form.Label>
      {#if previewUrl && !$formData.picture}
        <img src={previewUrl} class="max-h-60" alt={$formData.title} />
      {/if}
      <input
        {...props}
        bind:files={$file}
        type="file"
        accept="image/*"
        placeholder="Event Picture"
        class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
      />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
<Form.Field {form} name="date">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>
        Date
        <span class="text-destructive">*</span>
      </Form.Label>
      <Input
        {...props}
        bind:value={$formData.date}
        type="datetime-local"
        placeholder="Date"
      />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
<Form.Field {form} name="address">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>Address</Form.Label>
      <Input 
        {...props}
        bind:value={$formData.address}
        type="text"
        placeholder="Address"
      />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>