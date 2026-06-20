const DRAW_DISPLAY_MS =  2 * 60 * 60 * 1000;

const TRACK_COUNTRIES = {
  "Bahrain": "bh",
  "Szaudi Arábia": "sa",
  "Ausztrália": "au",
  "Azerbajdzsán": "az",
  "USA (Miami)": "us",
  "Portugália": "pt",
  "Kína": "cn",
  "Olaszország (Imola)": "it",
  "Spanyol": "es",
  "Ausztria": "at",
  "Egyesült Királyság": "gb",
  "Kanada": "ca",
  "Magyarország": "hu",
  "Belgium": "be",
  "Hollandia": "nl",
  "Olaszország (Monza)": "it",
  "Szingapúr": "sg",
  "Japán": "jp",
  "Katar": "qa",
  "USA (Ausztin)": "us",
  "Mexikó": "mx",
  "Brazília": "br",
  "USA (Las Vegas)": "us",
  "Abu Dhabi": "ae",
  "Franciaország": "fr"
};

function parseTrackSections(text) {
  const sections = {Current: [], Trackpool: [], Excluded: [], Options: [] };
  let current = "";
  text.split("\n").map(line => line.trim()).filter(Boolean).forEach(line => {
    if (sections.hasOwnProperty(line)) {
      current = line;
      return;
    }
    if (current && line) {
      sections[current].push(line);
    }
    /*if (sections[line]) return current = line;
    if (current) sections[current].push(line);*/
  });
  return { current: sections.Current[0] || "", trackpool: sections.Trackpool, excluded: sections.Excluded, options: sections.Options };
}

function parseCalendarDates(text) {
  return text.split("\n").map(line => line.trim()).filter(Boolean).map(parseCalendarDate).sort((a, b) => a - b);
}

function parseCalendarDate(value) {
  const match = value.match(/^(\d{4})\.(\d{2})\.(\d{2})\s+(\d{2}):(\d{2})$/);
  if (!match) return new Date(value);
  const [, year, month, day, hour, minute] = match.map(Number);
  return new Date(year, month - 1, day, hour, minute);
}

function getTrackCountry(track) {
  return TRACK_COUNTRIES[track] || "hu";
}

function getTrackImage(track) {
  return `../../database/images/f1-tracks/${encodeURIComponent(track.toLowerCase())}.png`;
}
