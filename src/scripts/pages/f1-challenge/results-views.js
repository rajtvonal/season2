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
  updateHeader(["#", "Csapat", "Pilóták", "Pont", "Gap to First"]);
}

function showStatistics(btn) {
  setActive(btn);
  hideRaceButtons();
  setClass("container results", "statistics");
  renderStatisticsTable(createStatistics(getCurrentData()));
  updateHeader(["#", "Név", "Győzelmek", "Pole pozíciók", "Átlag pont/verseny", "Átlag kvali", "Átlag pozíciószerzés"]);
}

function showRaces(btn) {
  setActive(btn);
  setClass("container results", "races");
  showRaceButtons();
}

function createTeamStandings(data) {
  const teams = {};
  data.forEach(driver => {
    if (isIndependentTeam(driver.team)) return;
    if (!teams[driver.team]) teams[driver.team] = { players: [], total: 0 };
    teams[driver.team].players = f1ResultsState.teamRosters[driver.team] || [driver.name];
    teams[driver.team].total += driver.total;
  });

  const leader = Math.max(...Object.values(teams).map(team => team.total), 0);
  return Object.entries(teams)
    .map(([team, teamData]) => ({ team, ...teamData, gapToFirst: leader - teamData.total }))
    .sort((a, b) => b.total - a.total);
}

function isIndependentTeam(team) {
  return team.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === "fuggetlen";
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
    ${createPositionCell(index)}
    ${createNameCell(driver.name, index, driver.country)}
    <td class="total top-${index + 1}">${driver.wins}</td>
    <td class="total top-${index + 1}">${driver.poles}</td>
    <td class="total top-${index + 1}">${formatAverage(driver.averagePoints)}</td>
    <td class="total top-${index + 1}">${formatAverage(driver.averageQualifying)}</td>
    <td class="gain top-${index + 1}" style="color:${getPositionGainColor(driver.averagePositionGain)}">${formatPositionGain(driver.averagePositionGain)}</td>
  `;
  return tr;
}
