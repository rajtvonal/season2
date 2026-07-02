function showIndividual(btn) {
  setActive(btn);
  hideRaceButtons();
  setClass("container results", "individual");
  renderTable([...getCurrentData()].sort((a, b) => b.total - a.total), "individual");
  updateHeader(["#", "Név", "Csapat", "Pont", "Gap to First", "Gain"]);
}

function showTeams(btn) {
  setActive(btn);
  setClass("container results", "teams");
  hideRaceButtons();
  renderTeamsTable(createTeamStandings(getCurrentData()));
  updateHeader(["#", "Csapat", "Pilóták", "Pont", "Gap to First", "Gain"]);
}

function showStatistics(btn) {
  setActive(btn);
  hideRaceButtons();
  setClass("container results", "statistics");
  renderStatisticsTable(createStatistics(getCurrentData()));
  updateHeader(["Név", "Csapat", "Győzelmek", "Pole pozíciók", "Átlag pont/verseny", "Átlag kvali", "Átlag pozíciószerzés"]);
}

function showRaces(btn) {
  setActive(btn);
  setClass("container results", "races event-table");
  showRaceButtons();
}

function renderTeamsTable(teams) {
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";
  teams.forEach((team, index) => tbody.appendChild(createTeamRow(team, index)));
}

function createTeamRow(team, index) {
  const tr = document.createElement("tr");
  tr.className = "row";
  tr.innerHTML = `
    ${createPositionCell(index)}
    <td class="team top-${index + 1}">${team.team}</td>
    <td class="drivers top-${index + 1}" style="text-align:left">${team.players.join("<br>")}</td>
    <td class="total top-${index + 1}">${team.total}</td>
    <td class="gap top-${index + 1}">${formatGapToFirst(team.gapToFirst)}</td>
    ${createGainCell(team.gain, index)}
  `;
  return tr;
}

function renderStatisticsTable(stats) {
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";
  if (stats.length === 0) return renderEmptyTable("Nincs megjeleníthető statisztika.");
  stats.forEach((driver, index) => tbody.appendChild(createStatisticsRow(driver, index)));
}

function createStatisticsRow(driver, index) {
  const tr = document.createElement("tr");
  tr.className = "row";
  tr.innerHTML = `
    <td class="name">${createFlagImg(driver.country)}${driver.name}</td>
    <td class="team">${formatTeamName(driver.team)}</td>
    <td class="total">${driver.wins}</td>
    <td class="total">${driver.poles}</td>
    <td class="total">${formatAverage(driver.averagePoints)}</td>
    <td class="total">${formatAverage(driver.averageQualifying)}</td>
    <td class="gain" style="color:${getPositionGainColor(driver.averagePositionGain)}">${formatPositionGain(driver.averagePositionGain)}</td>
  `;
  return tr;
}
