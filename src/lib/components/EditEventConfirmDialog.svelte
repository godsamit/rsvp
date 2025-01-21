<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import IconEdit from "~icons/mdi/edit";
  import { page } from "$app/state";
  import { enhance } from "$app/forms";

  const eventId = page.params.eventId;
  console.log("edit dialog", eventId)

</script>

<Dialog.Root>
  <Dialog.Trigger class={buttonVariants({ variant: "secondary", size: "default" })}>
    <IconEdit />
  </Dialog.Trigger>
  <form method="POST" action="/event/{eventId}?/confirmPassword" use:enhance>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Enter your password</Dialog.Title>
        <Dialog.Description>
          Confirm your password to edit the event!
        </Dialog.Description>
      </Dialog.Header>
      <Input name="password" placeholder="Password" type="password" />
      <Dialog.Footer>
        <Button type="submit">
          Confirm Password
        </Button>
      </Dialog.Footer>
    </Dialog.Content>
  </form>
</Dialog.Root>