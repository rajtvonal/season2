runWhenF1CalendarReady(initCalendarPage);

let calendarSourceText = "";
let calendarRaceDates = [];
let currentState = null;
let lastReloadedRace = null;
let lastPostRaceReload = null;


async function initCalendarPage() {
  if (!document.getElementById("nextRaceBox")) return;

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
  
  /*
  await refreshCalendar();

  setInterval(async () => {
    await refreshCalendar();
  }, 1000);
  */

  const [tracksText, calendarText] = await Promise.all([
    fetch("../../database/F1/tracks.txt").then(r => r.text()),
    fetch("../../database/F1/calendar.txt").then(r => r.text())
  ]);

  calendarSourceText = tracksText;
  calendarRaceDates = parseCalendarDates(calendarText);
  currentState = parseTrackSections(tracksText);
  
  renderCalendarPage(currentState, calendarRaceDates);

  setInterval(tickCalendar, 1000);
}


async function tickCalendar() {
    updateCountdownOnly(calendarRaceDates);

    const now = Date.now();
    const raceStart = calendarRaceDates.find(date => date.getTime() <= now && now < date.getTime() + DRAW_DISPLAY_MS );
    if (raceStart && lastReloadedRace !== raceStart.getTime()) {
        lastReloadedRace = raceStart.getTime();
        await reloadTracks();
    }

    const raceEnd = calendarRaceDates.find(date => now >= date.getTime() + DRAW_DISPLAY_MS);
    if (raceEnd && lastPostRaceReload !== raceEnd.getTime()) {
        lastPostRaceReload = raceEnd.getTime();
        await reloadTracks();
    }

    /*
    const raceEnd = calendarRaceDates.find(date => now >= date.getTime() + DRAW_DISPLAY_MS && now < date.getTime() + DRAW_DISPLAY_MS + 2000);
    if (raceEnd && lastPostRaceReload !== raceEnd.getTime()) {
        lastPostRaceReload = raceEnd.getTime();
        await reloadTracks();
    }
    */
}

async function reloadTracks() {
    const tracksText = await fetch("../../database/F1/tracks.txt?v=" + Date.now()).then(r => r.text());
    currentState = parseTrackSections(tracksText);

    renderCalendarPage(currentState, calendarRaceDates);
}


/*
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
*/

//window.resetF1CalendarTracks = resetF1CalendarTracks;

/*
document.addEventListener("DOMContentLoaded", async () => {
    await resetF1CalendarTracks();
});
*/

function runWhenF1CalendarReady(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
    return;
  }

  callback();
}
