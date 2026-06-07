document.addEventListener("DOMContentLoaded", initCalendarPage);

let calendarSourceText = "";
let calendarRaceDates = [];

async function initCalendarPage() {
  /*
  const [tracksText, calendarText] = await Promise.all([
    fetch("../../database/F1/tracks.txt").then(response => response.text()),
    fetch("../../database/F1/calendar.txt").then(response => response.text())
  ]);

  calendarSourceText = tracksText;
  calendarRaceDates = parseCalendarDates(calendarText);

  const baseTracks = parseTrackSections(tracksText);
  const state = updateCalendarState(loadCalendarState(baseTracks, tracksText), calendarRaceDates);
  //saveCalendarState(state);
  renderCalendarPage(state, calendarRaceDates);
  setInterval(() => {
    renderCalendarPage(loadCalendarState(baseTracks, tracksText), calendarRaceDates);
  }, 1000);
  */
  
  await refreshCalendar();

  setInterval(async () => {
    await refreshCalendar();
  }, 1000);
}


async function refreshCalendar() {
  const [tracksText, calendarText] = await Promise.all([
    fetch("../../database/F1/tracks.txt?v=" + Date.now()).then(r => r.text()),
    fetch("../../database/F1/calendar.txt?v=" + Date.now()).then(r => r.text())
  ]);

  calendarRaceDates = parseCalendarDates(calendarText);
  const state = parseTrackSections(tracksText);

  renderCalendarPage(state, calendarRaceDates);
}


async function resetF1CalendarTracks() {
  const tracksText = await fetch("../../database/F1/tracks.txt?v=" + Date.now()).then(response => response.text());
  calendarSourceText = tracksText;
  const baseTracks = parseTrackSections(tracksText);
  const state = { ...baseTracks, processed: [], lastDraw: null, sourceText: tracksText };
  //saveCalendarState(state);
  renderCalendarPage(state, calendarRaceDates);
  return state;
}

window.resetF1CalendarTracks = resetF1CalendarTracks;

/*
document.addEventListener("DOMContentLoaded", async () => {
    await resetF1CalendarTracks();
});
*/