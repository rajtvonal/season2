function showIndividual(btn) {
  setActive(btn);
  setClass("container results", "individual");
  showClassButtons("individual");
}

function showTeams(btn) {
  setActive(btn);
  setClass("container results", "teams");
  showClassButtons("teams");
}

function showStatistics(btn) {
  setActive(btn);
  setClass("container results", "statistics");
  showClassButtons("statistics");
}

function renderIndividualView(data) {
  renderTable(data, "individual");
  updateHeader(["#", "Név", "Csapat", "Pont", "Gap to First", "Gain"]);
}

function renderTeamView(data) {
  renderTeamsTable(createTeamStandings(data));
  updateHeader(["#", "Csapat", "Pilóták", "Pont", "Gap to First", "Gain"]);
}


function createTeamStandings(data) {
  const teams = groupDriversByTeam(data);
  const standings = Object.entries(teams).map(([team, drivers]) => ({
    team,
    players: drivers.map(driver => driver.name),
    total: calculateTeamTotal(drivers),
    previousTotal: calculateTeamPreviousTotal(drivers)
  })).sort((a, b) => b.total - a.total);

  return addTeamGapsAndGains(standings);
}

function groupDriversByTeam(data) {
  const groups = {};
  data.forEach(driver => {
    if (isIndependentTeam(driver.team)) return;
    if (!groups[driver.team]) groups[driver.team] = [];
    groups[driver.team].push(driver);
  });
  return groups;
}

function calculateTeamTotal(drivers) {
  let total = 0;
  for (let raceIndex = 0; raceIndex < smResultsConfig.totalRaces; raceIndex++) {
    total += getBestTwoTeamPoints(drivers, raceIndex);
  }
  return total;
}

function calculateTeamPreviousTotal(drivers) {
  const lastRace = getLastSmRaceIndex(drivers);
  let total = 0;
  for (let raceIndex = 0; raceIndex < lastRace; raceIndex++) {
    total += getBestTwoTeamPoints(drivers, raceIndex);
  }
  return total;
}

function getBestTwoTeamPoints(drivers, raceIndex) {
  return drivers.map(driver => Number(driver.racePoints[raceIndex] || 0))
    .sort((a, b) => b - a).slice(0, 2).reduce((sum, points) => sum + points, 0);
}

function addTeamGapsAndGains(standings) {
  const leader = standings[0]?.total || 0;
  const prevRank = createPreviousTeamRank(standings);
  return standings.map((team, index) => ({
    ...team,
    gapToFirst: leader - team.total,
    gain: (prevRank[team.team] || index + 1) - (index + 1)
  }));
}

function createPreviousTeamRank(standings) {
  const rank = {};
  [...standings].sort((a, b) => b.previousTotal - a.previousTotal)
    .forEach((team, index) => { rank[team.team] = index + 1; });
  return rank;
}

function getLastSmRaceIndex(drivers) {
  for (let i = smResultsConfig.totalRaces - 1; i >= 0; i--) {
    if (drivers.some(driver => driver.results[i])) return i;
  }
  return 0;
}

function isIndependentTeam(team) {
  return team.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === "fuggetlen";
}
