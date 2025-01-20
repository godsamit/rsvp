<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import IconDate from "~icons/mdi/calendar-plus";
</script>

<Card.Root class="max-w-sm p-4 self-center">
  <Card.Header>
    <Card.Title>RSVP</Card.Title>
    <Card.Description>Create an event and see who are coming. No login needed.</Card.Description>
  </Card.Header>
  <Card.Content>
    <a href="/event/create">
      <Button>
        <IconDate /> Create an event
      </Button>
    </a>
  </Card.Content>
</Card.Root>