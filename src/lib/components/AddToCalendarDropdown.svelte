<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

  let { data } = $props();

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  function formatToLocalTime(utcDateStr: string, timeZone: string) {
    const date = new Date(utcDateStr);
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timeZone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  }

  function formatToGoogleCalendarTime(isoDateStr: string, timeZone: string) {
    const date = new Date(isoDateStr);

    // Convert to local time based on the user's timezone
    const options = { 
      timeZone, 
      hour12: false, 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    };

    const formatDate = (d: Date) => {
      const formatted = new Intl.DateTimeFormat('en-US', options).formatToParts(d);
      return `${formatted[4].value}${formatted[2].value}${formatted[0].value}T${formatted[6].value}${formatted[8].value}${formatted[10].value}`;
    };

    // Format start date
    const localStartDate = formatDate(date);

    // Calculate end date (1-hour later)
    date.setMinutes(date.getMinutes() + 60);
    const localEndDate = formatDate(date);

    return `${localStartDate}/${localEndDate}`;
  }

  const formattedDateRange = formatToGoogleCalendarTime(data.event.date, userTimeZone);


  function getGoogleCalendarUrl () {
    const baseGoogleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE`;
    const eventTitle = encodeURIComponent(data.event.title);
    const eventDate = formattedDateRange;

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
  <DropdownMenu.Trigger class="underline text-primary">
    {formatToLocalTime(data.event.date, userTimeZone)}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item>
      <a 
        class="block w-full text-base" 
        rel="noopener noreferrer" 
        target="_blank" href={getGoogleCalendarUrl()}
      >
        Add to Google Calendar
      </a>
    </DropdownMenu.Item>
    <DropdownMenu.Item>
      <button class="text-base" onclick={generateICS}>Add to Outlook/Apple</button>
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>