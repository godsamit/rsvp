<script lang="ts">
  let title = $state('');
  let detail = $state('');
  let picture = $state('');
  let date = $state('');
  let address = $state('');

  async function submitEvent(event: SubmitEvent) {
    event.preventDefault();
    const res = await fetch('/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, detail, picture, date, address })
    })

    const result = await res.json();
    if (result.error) {
      alert(result.error);
    } else {
      alert ("Event created successfully!");
    }
  }
</script>

<form onsubmit={submitEvent}>
  <input type="text" bind:value={title} placeholder="Title">
  <input type="text" bind:value={detail} placeholder="Detail">
  <input type="text" bind:value={picture} placeholder="Picture">
  <input type="text" bind:value={date} placeholder="Date">
  <input type="text" bind:value={address} placeholder="Address">
  <button type="submit">Submit</button>
</form>