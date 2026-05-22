function createTeamStandings(data) {
  const teams = {};

  Object.entries(groupDriversByTeam(data)).forEach(([team, drivers]) => {
    teams[team] = {
      team,
      players: drivers.map(driver => driver.name),
      total: calculateTeamTotal(drivers)
    };
  });

  return Object.values(teams).sort((a, b) => b.total - a.total);
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

function isIndependentTeam(team) {
  return team.toLowerCase() === "független";
}

function calculateTeamTotal(drivers) {
  let total = 0;

  for (let raceIndex = 0; raceIndex < smResultsConfig.totalRaces; raceIndex++) {
    const bestTwo = drivers
      .map(driver => Number(driver.racePoints[raceIndex] || 0))
      .sort((a, b) => b - a)
      .slice(0, 2);

    total += bestTwo.reduce((sum, points) => sum + points, 0);
  }

  return total;
}
