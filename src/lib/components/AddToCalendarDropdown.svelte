<script lang="ts">
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import IconCalendarAdd from "~icons/mdi/calendar-plus";

  let { data, userTimeZone } = $props();

  function formatDateForCalendar(date: string) {
    return date.replace(/[-:]/g, "").split(".")[0] + "Z";
  }

  function getGoogleCalendarUrl () {
    const baseGoogleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE`;
    const eventTitle = encodeURIComponent(data.event.title);
    const eventDate = formatDateForCalendar(data.event.date);

    let googleCalendarUrl = `${baseGoogleCalendarUrl}&text=${eventTitle}&dates=${eventDate}&ctz=${userTimeZone}`;

    if (data.event.detail) {
      googleCalendarUrl += `&details=${encodeURIComponent(data.event.detail)}`;
    }

    if (data.event.address) {
      googleCalendarUrl += `&location=${encodeURIComponent(data.event.address)}`;
    }
    return googleCalendarUrl;
  }

  function generateICS() {
    const formattedStart = formatDateForCalendar(data.event.date);

    const icsContent = `
      BEGIN:VCALENDAR
      VERSION:2.0
      BEGIN:VEVENT
      SUMMARY:${data.event.title}
      DESCRIPTION:${data.event.detail || ""}
      LOCATION:${data.event.address || ""}
      DTSTART:${formattedStart}
      END:VEVENT
      END:VCALENDAR`.trim();

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.event.title.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger class={buttonVariants({ variant: "default", size: "default" })}>
    <IconCalendarAdd /> <span class="hidden md:inline">Add to Calendar</span>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item>
      <a 
        class="block w-full" 
        rel="noopener noreferrer" 
        target="_blank" href={getGoogleCalendarUrl()}
      >
        Google
      </a>
    </DropdownMenu.Item>
    <DropdownMenu.Item>
      <button onclick={generateICS}>Outlook/Apple</button>
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>