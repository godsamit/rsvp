<script lang="ts">
  import { page } from "$app/state";
  import { Button, buttonVariants } from "./ui/button/index.js";
  import { Input } from "./ui/input/index.js";
  import { enhance } from "$app/forms";
  import * as Dialog from "./ui/dialog/index.js";
  import IconTrash from "~icons/mdi/trash-can";

  let { attendee, index, form } = $props();
  const { eventId } = page.params;

  let open = $state(false);
</script>

<li class={[
  "px-2 py-1 flex justify-between items-center",
  index % 2 !== 0 ? "bg-gray-100" : ""
]}>
  {attendee.name}
  <Dialog.Root bind:open={() => open, (newOpen) => open = newOpen}>
    <Dialog.Trigger
      class={[
        buttonVariants({ variant: "destructive", size: "icon" }),
        "w-6 h-6"
      ]}
      title="Cancel Attendance"
    >
      <IconTrash />
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Cancel Attendance</Dialog.Title>
        <Dialog.Description>
          You need to enter your password to remove your attendance.
        </Dialog.Description>
      </Dialog.Header>
      {#if form?.message}
        <p class="text-destructive text-xs font-semibold">{form.message}</p>
      {/if}
      <form method="POST" action="/event/{eventId}?/cancelAttendance" use:enhance>
        <div class="flex flex-col gap-4">
          <Input name="password" placeholder="Password" type="password" />
          <input type="hidden" name="attendee" value={attendee.name} />
          <Button type="submit">
            Confirm Password
          </Button>
        </div>
      </form>
    </Dialog.Content>
  </Dialog.Root>
</li>