function setActive(btn) {
  document.querySelectorAll("button").forEach(button => button.classList.remove("active"));
  btn.classList.add("active");
}

function hideRaceButtons() {
  document.getElementById("raceButtons").style.display = "none";
}

function updateHeader(cols) {
  document.querySelector("thead tr").innerHTML = cols.map(col => `<th>${col}</th>`).join("");
}

function renderTable(data, mode = "main") {
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";
  data.forEach((driver, index) => tbody.appendChild(createDriverRow(driver, index, mode)));
}

function renderEmptyTable(message) {
  document.getElementById("tbody").innerHTML = `<tr><td class="empty-state">${message}</td></tr>`;
}

function createDriverRow(driver, index, mode) {
  const tr = document.createElement("tr");
  tr.className = "row";
  tr.innerHTML = mode === "main" ? createMainDriverCells(driver, index) : createIndividualDriverCells(driver, index);
  return tr;
}

function createMainDriverCells(driver, index) {
  const results = getResultColumns().map((column, eventIndex) => {
    const className = column.type || "race";
    return `<td class="races ${className}-${index + 1} top-${index + 1}">${driver.results[eventIndex] || "-"}</td>`;
  }).join("");

  return `
    ${createPositionCell(index)}
    ${createNameCell(driver.name, index, driver.country)}
    <td class="team top-${index + 1}">${driver.team}</td>
    ${results}
    ${createTotalCell(driver.total, index)}
    ${createGainCell(driver.gain, index)}
  `;
}

function createIndividualDriverCells(driver, index) {
  return `
    ${createPositionCell(index)}
    ${createNameCell(driver.name, index, driver.country)}
    <td class="team top-${index + 1}">${driver.team}</td>
    ${createTotalCell(driver.total, index)}
    <td class="gap top-${index + 1}">${formatGapToFirst(driver.gapToFirst)}</td>
    ${createGainCell(driver.gain, index)}
  `;
}

function getResultColumns() {
  if (typeof f1ResultsState !== "undefined" && f1ResultsState.eventColumns.length) return f1ResultsState.eventColumns;
  return Array.from({ length: getResultsConfig().totalRaces }, (_, index) => ({ type: "race", label: `R${index + 1}` }));
}

function createPositionCell(index) {
  return `<td class="pos rank-${index + 1} top-${index + 1}">${index + 1}</td>`;
}

function createNameCell(name, index, country = "hu") {
  return `<td class="name top-${index + 1}">${createFlagImg(country)}${name}</td>`;
}

function createTotalCell(total, index) {
  return `<td class="total top-${index + 1}">${total}</td>`;
}

function createGainCell(gain, index) {
  const color = gain > 0 ? "#4ade80" : gain < 0 ? "#ef4444" : "#888";
  const label = gain > 0 ? `+${gain}` : gain;
  return `<td class="gain top-${index + 1}" style="color:${color}">${label}</td>`;
}

function formatGapToFirst(gap) {
  if (!gap) return "-";
  return `-${gap}`;
}
