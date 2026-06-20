function createTeamStandings(data) {
  const teams = {};
  data.forEach(driver => {
    if (isIndependentTeam(driver.team)) return;
    if (!teams[driver.team]) teams[driver.team] = { players: [], total: 0 };
    teams[driver.team].players = f1ResultsState.teamRosters[driver.team] || [driver.name];
    teams[driver.team].total += driver.total;
  });
  return addTeamGapsAndGains(teams);
}

function addTeamGapsAndGains(teams) {
  const current = Object.entries(teams).map(([team, teamData]) => ({ team, ...teamData }));
  current.sort((a, b) => b.total - a.total);
  const leader = current[0]?.total || 0;
  const prevRank = createTeamPreviousRank(teams);
  return current.map((team, index) => ({
    ...team,
    gapToFirst: leader - team.total,
    gain: (prevRank[team.team] || index + 1) - (index + 1)
  }));
}

function createTeamPreviousRank(teams) {
  const lastEvent = getLastEventIndex(getCurrentData());
  const previous = Object.entries(teams).map(([team, teamData]) => ({
    team,
    total: teamData.players.reduce((sum, driverName) => {
      const driver = getDriverByName(driverName);
      return sum + (driver ? driver.points.slice(0, lastEvent).reduce((a, b) => a + Number(b || 0), 0) : 0);
    }, 0)
  })).sort((a, b) => b.total - a.total);

  const rank = {};
  previous.forEach((team, index) => { rank[team.team] = index + 1; });
  return rank;
}

function isIndependentTeam(team) {
  return team.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === "fuggetlen";
}
