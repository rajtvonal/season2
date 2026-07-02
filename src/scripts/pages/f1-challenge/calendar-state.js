const CALENDAR_STATE_KEY = "rajtvonal-f1-calendar-state-v1";
/*
function loadCalendarState(baseTracks, sourceText) {
  const saved = JSON.parse(localStorage.getItem(CALENDAR_STATE_KEY) || "null");
  if (saved?.sourceText === sourceText) return saved;
  return { ...baseTracks, processed: [], lastDraw: null, sourceText };
}
*/
/*
function saveCalendarState(state) {
  localStorage.setItem(CALENDAR_STATE_KEY, JSON.stringify(state));
}
*/

function updateCalendarState(state, raceDates) {
  raceDates.forEach(date => {
    const eventTime = date.getTime();
    if (eventTime <= Date.now() && !state.processed.includes(eventTime)) processRaceDraw(state, eventTime);
  });
  return state;
}

/*
function processRaceDraw(state, eventTime) {
  const selected = drawOne(state.trackpool);
  const extraExcluded = drawOne(state.trackpool);
  if (selected) state.excluded.push(selected);
  if (extraExcluded) state.excluded.push(extraExcluded);
  [drawOne(state.options), drawOne(state.options)].filter(Boolean).forEach(track => state.trackpool.push(track));
  state.lastDraw = { eventTime, selected };
  state.processed.push(eventTime);
}
*/
/*
function drawOne(list) {
  if (!list.length) return null;
  return list.splice(Math.floor(Math.random() * list.length), 1)[0];
}
*/
/*
function getActiveDraw(state) {
  if (!state.lastDraw) return null;
  return Date.now() - state.lastDraw.eventTime < DRAW_DISPLAY_MS ? state.lastDraw : null;
}
*/
function getNextRaceDate(raceDates) {
  return raceDates.find(date => date.getTime() > Date.now());
}
