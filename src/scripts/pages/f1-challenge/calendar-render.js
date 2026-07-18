function renderCalendarPage(state, raceDates) {
  /*
  const updated = updateCalendarState(state, raceDates);
  //saveCalendarState(updated);
  renderNextRaceBox(updated, raceDates);
  renderTrackPool(updated.trackpool);
  renderTrackList("excludedTracks", updated.excluded);
  renderTrackList("optionTracks", updated.options);
  */

  renderNextRaceBox(state, raceDates);
  renderTrackPool(state.trackpool);
  renderTrackList("excludedTracks", state.excluded);
  renderTrackList("optionTracks", state.options);
}

/*
function renderNextRaceBox(state, raceDates) {
  const draw = getActiveDraw(state);
  document.getElementById("nextRaceBox").innerHTML = draw
    ? createDrawnTrackBox(draw.selected)
    : `<span>Következő verseny:</span><strong>${formatCountdown(getNextRaceDate(raceDates))}</strong>`;
}
*/

function updateCountdownOnly(raceDates) {
    const box = document.getElementById("nextRaceBox");
    if (box.querySelector(".drawn-track")) { return; }

    box.innerHTML = `<span>Következő verseny:</span><strong>${formatCountdown(getNextRaceDate(raceDates))}</strong>`;
}








function renderNextRaceBox(state, raceDates) {
  const container = document.getElementById("nextRaceBox");
  if (state.current) {
    container.innerHTML = createDrawnTrackBox(state.current);
    return;
  }
  container.innerHTML =
    `<span>Következő verseny:</span><strong>${formatCountdown(getNextRaceDate(raceDates))}</strong>`;
}

function createDrawnTrackBox(track) {
  return `
    <div class="drawn-track">
      <div class="drawn-track-flag">${createTrackFlagImg(getTrackCountry(track))}</div>
      <div class="drawn-track-info">
        <div class="drawn-track-name">${track}</div>
        <a class="drawn-track-live" href="https://www.youtube.com/watch?v=JRXXkELPBNA" target="_blank">Live ●</a>
      </div>
    </div>
  `;
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

function renderTrackPool(tracks) {
  const container = document.getElementById("trackpool");
  container.innerHTML = "";
  tracks.slice(0, 5).forEach(track => container.appendChild(createTrackCard(track)));
}

function createTrackCard(track) {
  const card = document.createElement("div");
  card.className = "track-card";
  card.innerHTML = `
    <div class="track-card-info">${createTrackFlagImg(getTrackCountry(track))}<div class="track-name">${track}</div></div>
    <img class="track-map" src="${getTrackImage(track)}" alt="${track}">
  `;
  card.querySelector(".track-map").onerror = event => { event.currentTarget.style.display = "none"; };
  return card;
}

const tableStates = {};

function renderTrackList(targetId, tracks) {
  /*
  const tbody = document.getElementById(targetId);
  tbody.innerHTML = "";
  tracks.forEach(track => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td class="name" style="display:none">${createFlagImg(getTrackCountry(track))}${track}</td>`;
    tbody.appendChild(tr);
  });
  */

  const tbody = document.getElementById(targetId);
  tbody.innerHTML = "";
  const hiddenRows = [];

  tracks.forEach((track, index) => {
    const tr = document.createElement("tr");
    if (index >= 5 && !tableStates[targetId]) {
      tr.style.display = "none";
      hiddenRows.push(tr)
    }

    tr.innerHTML = `
      <td class="name">
        ${createFlagImg(getTrackCountry(track))}
        ${track}
      </td>
    `;

    tbody.appendChild(tr);

    // LENYITÁS
    tbody.appendChild(tr);
    if (index === 4 && tracks.length > 5 && !tableStates[targetId]) {
      const expandRow = document.createElement("tr");
      expandRow.innerHTML = `
        <td class="name" style="cursor:pointer;text-align:center;">
          ▼ További pályák
        </td>
      `;

      expandRow.onclick = () => {
        tableStates[targetId] = true;
        renderTrackList(targetId, tracks);
      };
      tbody.appendChild(expandRow);
    }
    
  });

  // VISSZACSUKÁS
  if (tracks.length > 5 && tableStates[targetId]) {
      const collapseRow = document.createElement("tr");
      collapseRow.innerHTML = `
        <td class="name" style="cursor:pointer;text-align:center;">
          ▲ 
        </td>
      `;

      collapseRow.onclick = () => {
        tableStates[targetId] = false;
        renderTrackList(targetId, tracks);
      };

      tbody.appendChild(collapseRow);
    };
}
