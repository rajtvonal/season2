function setActive(btn) {
  document.querySelectorAll("button").forEach(button => button.classList.remove("active"));
  btn.classList.add("active");
}

function hideRaceButtons() {
  document.getElementById("raceButtons").style.display = "none";
}

function updateHeader(cols) {
  const tr = document.querySelector("thead tr");
  tr.innerHTML = cols.map(col => `<th>${col}</th>`).join("");
}

function renderTable(data, mode = "main") {
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";

  data.forEach((driver, index) => {
    tbody.appendChild(createDriverRow(driver, index, mode));
  });
}

function renderEmptyTable(message) {
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = `<tr><td class="empty-state">${message}</td></tr>`;
}

function createDriverRow(driver, index, mode) {
  const tr = document.createElement("tr");
  tr.className = "row";

  tr.innerHTML = mode === "main"
    ? createMainDriverCells(driver, index)
    : createIndividualDriverCells(driver, index);

  return tr;
}

function createMainDriverCells(driver, index) {
  const config = getResultsConfig();
  const races = Array.from({ length: config.totalRaces }, (_, raceIndex) => {
    return `<td class="races race-${index + 1} top-${index + 1}">${driver.results[raceIndex] || "-"}</td>`;
  }).join("");

  return `
    ${createPositionCell(index)}
    ${createNameCell(driver.name, index)}
    <td class="team top-${index + 1}">${driver.team}</td>
    ${races}
    ${createTotalCell(driver.total, index)}
    ${createGainCell(driver.gain, index)}
  `;
}

function createIndividualDriverCells(driver, index) {
  return `
    ${createPositionCell(index)}
    ${createNameCell(driver.name, index)}
    <td class="team top-${index + 1}">${driver.team}</td>
    ${createTotalCell(driver.total, index)}
    ${createGainCell(driver.gain, index)}
  `;
}

function createPositionCell(index) {
  return `<td class="pos rank-${index + 1} top-${index + 1}">${index + 1}</td>`;
}

function createNameCell(name, index) {
  return `<td class="name top-${index + 1}"><img src="https://flagcdn.com/w20/hu.png" style="vertical-align:middle;margin-right:6px;">${name}</td>`;
}

function createTotalCell(total, index) {
  return `<td class="total top-${index + 1}">${total}</td>`;
}

function createGainCell(gain, index) {
  const color = gain > 0 ? "#4ade80" : gain < 0 ? "#ef4444" : "#888";
  const label = gain > 0 ? `+${gain}` : gain;
  return `<td class="gain top-${index + 1}" style="color:${color}">${label}</td>`;
}
