async function showRaceButtons() {
  await loadSimMastersData();
  setClass("container results", "races event-table sm-event-table");
  const div = document.getElementById("raceButtons");
  div.style.display = "block";
  div.innerHTML = "";
  smResultsState.races.filter(Boolean).forEach(race => div.appendChild(createSmRaceButton(race)));
  if (div.querySelector("button")) div.querySelector("button").click();
}

function createSmRaceButton(race) {
  const button = document.createElement("button");
  button.innerText = "R" + race.raceNumber;
  button.onclick = () => {
    Array.from(button.parentElement.children).forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    renderSmRaceTables(race);
  };
  return button;
}

function renderSmRaceTables(race) {
  const container = document.querySelector(".container.results");
  container.innerHTML = "";
  race.groups.forEach(group => container.appendChild(createClassRaceTable(group)));
}

function createClassRaceTable(group) {
  const wrapper = document.createElement("div");
  wrapper.className = "race-class-block";
  wrapper.innerHTML = `<div class="level-1-title">${group.className}</div>${createRaceTableMarkup()}`;
  const tbody = wrapper.querySelector("tbody");
  [...group.result].sort((a, b) => a.position - b.position)
    .forEach((driver, index) => tbody.appendChild(createSmRaceRow(driver, index)));
  return wrapper;
}

function createRaceTableMarkup() {
  return `<table><thead><tr>
    <th>#</th><th>Név</th><th>Num</th><th>Autó</th><th>Csapat</th>
    <th>Idő</th><th>Megtett körök</th><th>Legjobb kör</th><th>Pont</th>
  </tr></thead><tbody></tbody></table>`;
}

function createSmRaceRow(driver, index) {
  const tr = document.createElement("tr");
  tr.className = "row";
  tr.innerHTML = `
    <td class="pos rank-${index + 1} top-${index + 1}">${formatRacePosition(driver)}</td>
    ${createNameCell(driver.id, index, getDriverCountry(driver.id))}
    <td class="time top-${index + 1}">${driver.carNum || "-"}</td>
    <td class="team top-${index + 1}">${driver.car || "-"}</td>
    <td class="team top-${index + 1}">${formatTeamName(getDriverTeam(driver.id))}</td>
    <td class="time top-${index + 1}">${formatMs(driver.totalTime)}</td>
    <td class="time top-${index + 1}">${driver.totalLaps || 0}</td>
    <td class="time top-${index + 1}">${formatMs(driver.bestLap)}</td>
    <td class="total top-${index + 1}">${driver.pointTotal || 0}</td>
  `;
  return tr;
}

function formatRacePosition(driver) {
  if (driver.dns || driver.dnf) return "DNF";
  return driver.position || "-";
}

function formatMs(value) {
  if (!value || value <= 0) return "-";
  return fmt(value / 1000);
}
