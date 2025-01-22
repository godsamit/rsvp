<script lang="ts">
  import { Button, buttonVariants } from "./ui/button/index.js";
  import * as Dialog from "./ui/dialog/index.js";
  import IconTrash from "~icons/mdi/trash-can";
  import { enhance } from "$app/forms";
  import { page } from "$app/state";
  const { eventId } = page.params;
</script>

<Dialog.Root>
  <Dialog.Trigger
    class={[
      buttonVariants({ variant: "destructive", size: "icon" }),
      "w-full"
    ]}
    title="Cancel Attendance"
  >
    <IconTrash /> Delete Event
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Confirm Deletion</Dialog.Title>
      <Dialog.Description>
        Are you sure you want to delete this event? This action cannot be undone.
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer >
      <div class="w-full">
        <form method="POST" action="/event/{eventId}/edit?/delete" use:enhance>
          <Button type="submit" class="mt-6 w-full" variant="destructive">
            <IconTrash /> Delete Event
          </Button>
        </form>
      </div>
    </Dialog.Footer>
  </Dialog.Content>

</Dialog.Root>