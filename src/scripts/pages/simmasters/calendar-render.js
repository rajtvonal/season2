
function renderEventCalendar(events) {
  const container = document.getElementById("eventCalendar");
  container.innerHTML = "";
  const nextEvent = getNextEventDate(events);

  events.forEach(event => {
    container.appendChild(
      createEventCard(
        event,
        nextEvent && event.date.getTime() === nextEvent.date.getTime()
      )
    );
  });
}

function createEventCard(event, isNextEvent) {
  const card = document.createElement("div");

  card.className = "event-track-card";

  card.innerHTML = `
    <div class="track-card-info">
      ${createTrackFlagImg(getTrackCountry(event.track))}
      <div class="track-name">${event.track}</div>
    </div>
    <img
      class="track-map"
      src="${getTrackImage(event.track)}"
      alt="${event.track}">

    <div class="event-link-container">
      <a href="${event.link}" class="event-link" target="_blank" rel="noopener noreferrer">SIMGRID EVENT<br>[KATT]</a>
    </div>

    <div class="event-status ${isNextEvent ? 'event-next' : ''}">
      ${createEventStatus(event.date)}
    </div>
  `;

  card.eventDate = event.date;

  return card;
}

function createEventStatus(date) {
  const now = Date.now();
  const start = date.getTime();
  const end = start + LIVE_DURATION_MS;

  if (now < start) {
    return formatCountdown(date);
  }

  if (now < end) {
    return `<a href="https://www.youtube.com/@rajtvonalmagazinhu/streams" class="drawn-track-live" target="_blank" rel="noopener noreferrer" style="font-size:22px;">LIVE ●</a>`;
  }

  return `<div class="event-done">VÉGE</div>`;
}

function formatCountdown(date) {
  if (!date) return "-";
  const diff = Math.max(0, date.getTime() - Date.now());
  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / 60000) % 60;
  const hours = Math.floor(diff / 3600000) % 24;
  const days = Math.floor(diff / 86400000);

  if (days > 0) {
    return `${days} nap<br>${hours} óra : ${minutes} perc : ${seconds} s`;
  }
  if (hours > 0) {
    return `${hours} óra : ${minutes} perc : ${seconds} s`;
  }
  return `${minutes} perc : ${seconds} s`;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateCountdowns() {
  document.querySelectorAll(".event-track-card").forEach(card => {
      const status = card.querySelector(".event-status");
      status.innerHTML = createEventStatus(card.eventDate);
    });
}