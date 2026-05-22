async function showRaceButtons() {
  await loadSimMastersData();

  const div = document.getElementById("raceButtons");
  div.style.display = "block";
  div.innerHTML = "";

  const races = smResultsState.races.filter(Boolean);
  races.forEach(race => div.appendChild(createSmRaceButton(race, races)));
  if (races.length > 0) div.querySelector("button").click();
}

function createSmRaceButton(race, races) {
  const button = document.createElement("button");
  button.innerText = "R" + race.raceNumber;
  button.onclick = () => {
    Array.from(button.parentElement.children).forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    renderSmRaceTable(race);
  };
  return button;
}

function renderSmRaceTable(race) {
  const data = [...race.data].sort((a, b) => a.position - b.position);
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";

  data.forEach((driver, index) => {
    tbody.appendChild(createSmRaceRow(driver, index));
  });

  updateHeader(["#", "Név", "Csapat", "Idő", "Legjobb kör", "Pont"]);
}

function createSmRaceRow(driver, index) {
  const tr = document.createElement("tr");
  tr.className = "row";
  tr.innerHTML = `
    <td class="pos rank-${index + 1} top-${index + 1}">${formatRacePosition(driver)}</td>
    ${createNameCell(driver.id, index)}
    <td class="team top-${index + 1}">${getDriverTeam(driver.id)}</td>
    <td class="time top-${index + 1}">${formatMs(driver.totalTime)}</td>
    <td class="time top-${index + 1}">${formatMs(driver.bestLap)}</td>
    <td class="total top-${index + 1}">${driver.pointTotal || 0}</td>
  `;
  return tr;
}

function formatRacePosition(driver) {
  if (driver.dns) return "DNS";
  if (driver.dnf) return "DNF";
  return driver.position || "-";
}

function formatMs(value) {
  if (!value || value <= 0) return "-";
  return fmt(value / 1000);
}
