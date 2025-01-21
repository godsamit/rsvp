<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import IconEdit from "~icons/mdi/edit";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { enhance } from "$app/forms";

  let { form, isOpen } = $props();

  const eventId = page.params.eventId;

  async function checkAuthAndNavigate() {
    const response = await fetch(`/api/event/${eventId}/auth-check`);
    const { isAuthenticated } = await response.json();

    if (isAuthenticated) {
      goto(`/event/${eventId}/edit`);
    } else {
      isOpen = true;
    }
  }
</script>

<Dialog.Root bind:open={
  () => isOpen, 
  (newOpen) => {
    if (newOpen === true) {
      checkAuthAndNavigate()
    } else {
      isOpen = false;
    }
  }}
>
  <Dialog.Trigger
    class={buttonVariants({ variant: "secondary", size: "default" })}
  >
    <IconEdit />
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Enter your password</Dialog.Title>
      <Dialog.Description>
        Confirm your password to edit the event!
      </Dialog.Description>
    </Dialog.Header>
    {#if form?.message}
      <p class="text-destructive text-xs font-semibold">{form.message}</p>
    {/if}
    <form method="POST" action="/event/{eventId}?/confirmPassword" use:enhance>
      <div class="flex flex-col gap-4">
        <Input name="password" placeholder="Password" type="password" />
        <Button type="submit">
          Confirm Password
        </Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>