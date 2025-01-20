<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  let { form, formData, isCreate } = $props();
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
    <Form.Description>This is your key to edit this event, remember it in case you wish to change the details later.</Form.Description>
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
<Form.Field {form} name="detail">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label for="picture">Event Picture</Form.Label>
      <Input
        {...props}
        bind:value={$formData.picture}
        type="text"
        placeholder="Event Picture"
      />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
<Form.Field {form} name="date">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label for="date">
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