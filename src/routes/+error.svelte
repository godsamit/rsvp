<script lang="ts">
  import { page } from '$app/state';
  import ArrowLeftIcon from '~icons/mdi/keyboard-backspace';
  import { Button } from '$lib/components/ui/button/index.js';
</script>
<section class="self-center flex flex-col gap-4">
  <div class="flex flex-col gap-2">
    <h1 class="text-2xl font-semibold tracking-tight">{page.status}</h1>
    <p>{page.error?.message}</p>
  </div>
  <a href="/">
    <Button>
      <ArrowLeftIcon style="font-size: 1.5rem;" /> Back to home page
    </Button>
  </a>
</section>