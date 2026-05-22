function showIndividual(btn) {
  setActive(btn);
  hideRaceButtons();
  setClass("container results", "individual");

  const sorted = [...getCurrentData()].sort((a, b) => b.total - a.total);
  renderTable(sorted, "individual");
  updateHeader(["#", "Név", "Csapat", "Pont", "Gain"]);
}

function showTeams(btn) {
  setActive(btn);
  setClass("container results", "teams");
  hideRaceButtons();

  renderTeamsTable(createTeamStandings(getCurrentData()));
  updateHeader(["#", "Csapat", "Pilóták", "Pont"]);
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
    if (!teams[driver.team]) teams[driver.team] = { players: [], total: 0 };
    teams[driver.team].players.push(driver.name);
    teams[driver.team].total += driver.total;
  });

  return Object.entries(teams)
    .map(([team, teamData]) => ({ team, players: teamData.players, total: teamData.total }))
    .sort((a, b) => b.total - a.total);
}

function renderTeamsTable(teams) {
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";

  teams.forEach((team, index) => {
    const tr = document.createElement("tr");
    tr.className = "row";
    tr.innerHTML = `
      ${createPositionCell(index)}
      <td class="team top-${index + 1}">${team.team}</td>
      <td class="drivers top-${index + 1}" style="text-align:left">${team.players.join("<br>")}</td>
      <td class="total top-${index + 1}">${team.total}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderStatisticsTable(stats) {
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";

  if (stats.length === 0) {
    renderEmptyTable("Nincs megjeleníthető statisztika.");
    return;
  }

  stats.forEach((driver, index) => {
    const tr = document.createElement("tr");
    tr.className = "row";
    tr.innerHTML = `
      ${createPositionCell(index)}
      ${createNameCell(driver.name, index)}
      <td class="total top-${index + 1}">${driver.wins}</td>
      <td class="total top-${index + 1}">${driver.poles}</td>
      <td class="total top-${index + 1}">${formatAverage(driver.averagePoints)}</td>
      <td class="total top-${index + 1}">${formatAverage(driver.averageQualifying)}</td>
      <td class="gain top-${index + 1}" style="color:${getPositionGainColor(driver.averagePositionGain)}">${formatPositionGain(driver.averagePositionGain)}</td>
    `;
    tbody.appendChild(tr);
  });
}
