let calendarSourceText = "";
let calendarEvents = [];
let processedRaceStarts = new Set();
let processedRaceEnds = new Set();
let isReloadingCalendar = false;

async function initCalendarPage() {
  if (!document.getElementById("eventCalendar")) return;

  const text = await fetch(`../../database/SM/tracks.txt?v=${Date.now()}`).then(r => r.text());
  
  calendarEvents = parseEventTracks(text);
  renderEventCalendar(calendarEvents);

  setInterval(updateCountdowns, 1000);
}

async function reloadCalendarTracks(useCacheBust = true) {
  if (isReloadingCalendar) return;
  isReloadingCalendar = true;

  try {
    const cacheBust = useCacheBust ? "?v=" + Date.now() : "";
    const text = await fetch("../../database/SM/tracks.txt" + cacheBust).then(r => r.text());
    calendarSourceText = text;
    calendarEvents = parseEventTracks(text);

    renderEventCalendar(calendarEvents);
  } catch { return } finally {
    isReloadingCalendar = false;
  }
}

function runWhenSmCalendarReady(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
    return;
  }

  callback();
}

runWhenSmCalendarReady(initCalendarPage);
