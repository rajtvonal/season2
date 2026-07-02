const WEATHER_TYPES = {
  napos: { icon: "☀️", label: "Napos" },
  "kicsit felhős": { icon: "🌤️", label: "Kicsit Felhős" },
  kicsitfelhős: { icon: "🌤️", label: "Kicsit Felhős" },
  felhős: { icon: "☁️", label: "Felhős" },
  felhos: { icon: "☁️", label: "Felhős" },
  "esős": { icon: "🌦️", label: "Eső" },
  esos: { icon: "🌦️", label: "Eső" },
  "szakadó esős": { icon: "🌧️", label: "Szakadó eső" },
  szakadoeso: { icon: "🌧️", label: "Szakadó eső" },
  szakadóeső: { icon: "🌧️", label: "Szakadó eső" }
};

function loadWeather() {
  fetch("../../database/SM/idojaras.txt?v=" + Date.now())
    .then(response => response.text())
    .then(text => renderWeather(parseWeather(text)));
}

function parseWeather(text) {
  const lines = text.split("\n").map(line => line.trim()).filter(Boolean);
  const firstLine = lines[0].split(",");
  
  const data = {
    countryCode: firstLine[0]?.trim().toLowerCase() || "hu",
    track: firstLine[1]?.trim() || "Aktuális pálya",
    weather: firstLine[2]?.trim() || "Napos",
    temperatureMin: firstLine[3]?.trim() || "18",
    temperatureMax: firstLine[4]?.trim() || "21",
    details: lines.slice(1)
  };

  lines.forEach(line => applyWeatherField(data, line));
  if (data.details.length === 0) data.details = createDefaultWeatherDetails(data.weather);

  return data;
}

function applyWeatherField(data, line) {
  const [key, ...rest] = line.split(":");
  if (rest.length === 0) return;

  const value = rest.join(":").trim();
  const normalizedKey = key.trim().toLowerCase();

  if (normalizedKey === "palya" || normalizedKey === "pálya") data.track = value;
  if (normalizedKey === "zaszlo" || normalizedKey === "zászló") data.countryCode = value.toLowerCase();
  if (normalizedKey === "idojaras" || normalizedKey === "időjárás") data.weather = value;
  if (normalizedKey === "homerseklet" || normalizedKey === "hőmérséklet") data.temperature = value;
}


function renderWeather(data) {
  document.getElementById("weatherTrackFlag").src = `https://flagcdn.com/w80/${data.countryCode}.png`;
  document.getElementById("weatherTrackName").textContent = data.track;
  document.getElementById("weatherIcon").textContent = getWeatherType(data.weather).icon;
  document.getElementById("weatherLabel").textContent = getWeatherType(data.weather).label;
  document.getElementById("temperatureValue").textContent = `${data.temperatureMin}-${data.temperatureMax} °C`;
  renderWeatherDetails(data.details);
}

function getWeatherType(weather) {
  const key = weather.toLowerCase().replace(/\s+/g, " ").trim();
  const compactKey = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "");
  return WEATHER_TYPES[key] || WEATHER_TYPES[compactKey] || { icon: "☁️", label: weather };
}

function renderWeatherDetails(details) {
  const list = document.getElementById("weatherDetails");
  list.innerHTML = "";

  details.forEach(detail => {
    const item = document.createElement("div");
    item.className = "level-2";
    item.innerHTML = `<span>${detail}</span>`;
    list.appendChild(item);
  });
}

runWhenWeatherReady(loadWeather);

function runWhenWeatherReady(callback) {
  if (document.readyState === "loading") {
    window.addEventListener("load", callback);
    return;
  }

  callback();
}
