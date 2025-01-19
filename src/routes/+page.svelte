<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import IconDate from "~icons/mdi/calendar-plus";
</script>
<div class="flex items-center justify-center h-screen">
  <Card.Root class="max-w-sm p-4">
    <Card.Header>
      <Card.Title>RSVP</Card.Title>
      <Card.Description>A simple event RSVP app. Create an event and see who are coming. No login needed.</Card.Description>
    </Card.Header>
    <Card.Content>
      <Button>
        <IconDate />Create an event
      </Button>
    </Card.Content>
  </Card.Root>
</div>