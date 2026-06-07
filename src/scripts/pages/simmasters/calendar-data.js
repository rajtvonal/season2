const LIVE_DURATION_MS =  3 * 60 * 60 * 1000; /*2*60*1000;*/

const TRACK_COUNTRIES = {
  "Bahrain":"bh",
  "Bahrain (outer)":"bh",
  "Bahrain (endurance)":"bh",
  "Circuit de la Sarthe":"fr",
  "Circuit Paul Ricard":"fr",
  "Circuit Paul Ricard (egyenes)":"fr",
  "COTA":"us",
  "Fuji":"jp",
  "Imola":"it",
  "Interlagos":"br",
  "Lusail International":"qa",
  "Monza":"it",
  "Monza (egyenes)":"it",
  "Portimao":"",
  "Sebring":"us",
  "Silverstone International":"gb",
  "Spa":"be"
};

function parseEventTracks(text) {
  return text.split("\n").map(x => x.trim()).filter(Boolean).map(line => {
    const firstComma = line.indexOf(",");
    const secondComma = line.indexOf(",", firstComma + 1);
    return {
      track: line.substring(0, firstComma).trim(),
      date: parseCalendarDate(line.substring(firstComma + 1, secondComma).trim()),
      link: line.substring(secondComma + 1).trim()
    };
  });
}
  



function parseCalendarDates(text) {
  return text.split("\n").map(line => line.trim()).filter(Boolean).map(parseCalendarDate).sort((a, b) => a - b);
}

function parseCalendarDate(value) {
  const match = value.match(/^(\d{4})\.(\d{2})\.(\d{2})\s+(\d{2}):(\d{2})$/);
  if (!match) return new Date(value);
  const [, y, m, d, h, min] = match.map(Number);
  return new Date(y, m - 1, d, h, min);
}

function getNextEventDate(events) {
  return events
    .filter(event => event.date.getTime() + LIVE_DURATION_MS > Date.now())
    .sort((a, b) => a.date - b.date)[0];
}

function getTrackCountry(track) {
  return TRACK_COUNTRIES[track] || "hu";
}

function getTrackImage(track) {
  return `../../database/images/sm-tracks/${encodeURIComponent(track.toLowerCase())}.png`;
}

