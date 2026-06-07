document.addEventListener("DOMContentLoaded", initCalendarPage);

let calendarSourceText = "";
let calendarRaceDates = [];

async function initCalendarPage() {
  /*
  await refreshCalendar();
  setInterval(async () => {
    await refreshCalendar();
  }, 1000);
  */
  await refreshCalendar();

  setInterval(refreshCalendar, 1000);
}

async function refreshCalendar() {
  const text = await fetch("../../database/SM/tracks.txt?v=" + Date.now()).then(r => r.text());

  renderEventCalendar(parseEventTracks(text));
}
