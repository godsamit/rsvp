<script lang="ts">
  import { page } from "$app/state";
  import { onMount } from "svelte";

  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import IconCopy from "~icons/mdi/content-copy"

  let eventId = page.params.eventId;
  let eventLink = `${page.url.origin}/event/${eventId}`;

  function copyLink() {
    navigator.clipboard.writeText(eventLink);
    alert('Event link copied to clipboard!');
  }
  onMount(() => {
    const timer = setTimeout(() => {
      window.location.href = `/event/${eventId}`;
    }, 5000);

    return () => clearTimeout(timer);
  });
</script>
<Card.Root class="self-center">
  <Card.Header>
    <Card.Title>Your event has been created!</Card.Title>
  </Card.Header>
  <Card.Content>
    <h5 class="mb-2">Your event id is:</h5>
    <div class="flex w-full bg-muted p-4 text-xl font-bold tracking-widest align-center justify-between">
      <span>{eventId}</span>
      <button onclick={copyLink}>
        <IconCopy />
      </button>
    </div>
  </Card.Content>
  <Card.Footer>
    <a href={eventLink}>
      <Button>Go to your event</Button>
    </a>
  </Card.Footer>
</Card.Root>