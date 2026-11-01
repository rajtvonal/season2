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
  const tableTitle = document.getElementById("tableTitle");
  if (tableTitle) {
    tableTitle.textContent = "Hivatalos bajnoki tabella";
    tableTitle.classList.add("level-1-title");
    Object.assign(tableTitle.style, {
        display: "flex",
        justifyContent: "center",
        paddingTop: "1px",
        paddingBottom: "0px",
        margin: "auto",
        fontSize: "36px"
    });
  }

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
    <td class="team top-${index + 1}">${formatTeamName(driver.team)}</td>
    ${results}
    ${createTotalCell(driver.total, index)}
    ${createGainCell(driver.gain, index)}
  `;
}

function createIndividualDriverCells(driver, index) {
  return `
    ${createPositionCell(index)}
    ${createNameCell(driver.name, index, driver.country)}
    <td class="team top-${index + 1}">${formatTeamName(driver.team)}</td>
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

function formatTeamName(team) {
  if (!team) return "-";
  const normalized = team.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return normalized === "fuggetlen" ? "-" : team;
}


function renderUnrankedDriversTable(data) {
  const container = document.querySelector(".container.results");
  if (!container || data.length === 0) return;

  const section = document.createElement("section");
  section.className = "unranked-standings";
  const title = document.createElement("h2");
  title.className = "level-1-title";
  title.style.display = "flex";
  title.style.fontSize = "36px";
  title.style.justifyContent = "center";
  title.style.paddingTop = "64px";
  title.textContent = "Nem rangsorolt (NC) versenyzők";
  section.appendChild(title);

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const header = document.createElement("tr");
  createResultsHeader(smResultsConfig.totalRaces).filter(label => label !== "Gain").forEach(label => {
    const th = document.createElement("th");
    th.textContent = label;
    header.appendChild(th);
  });
  thead.appendChild(header);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  [...data].sort((a, b) => b.total - a.total).forEach((driver, index) => {
    const tr = document.createElement("tr");
    tr.className = "row";
    const results = getResultColumns().map((column, eventIndex) => {
      const className = column.type || "race";
      return `<td class="races ${className}-${index + 1}">${driver.results[eventIndex] || "-"}</td>`;
    }).join("");
    tr.innerHTML = `
      <td class="pos">NC</td>
      <td class="name >${createFlagImg(driver.country)}${driver.name}</td>
      <td class="team">${formatTeamName(driver.team)}</td>
      ${results}
      <td class="total">${driver.total}</td>
    `;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  section.appendChild(table);
  container.appendChild(section);
}
