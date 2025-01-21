<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import IconDate from "~icons/mdi/calendar-plus";
</script>

<Card.Root class="w-3/5 lg:w-1/2 max-w-xl p-4 self-center">
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