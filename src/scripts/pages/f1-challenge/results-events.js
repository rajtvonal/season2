function createEventColumns(totalRaces, sprints) {
  const columns = [];

  for (let i = 1; i <= totalRaces; i++) {
    if (sprints[i - 1]) columns.push({ type: "sprint", raceNumber: i, label: `S${i}` });
    columns.push({ type: "race", raceNumber: i, label: `R${i}` });
  }

  return columns;
}

function getEventIndex(type, raceNumber) {
  return f1ResultsState.eventColumns.findIndex(column => {
    return column.type === type && column.raceNumber === raceNumber;
  });
}

function getRaceIndex(raceNumber) {
  return raceNumber - 1;
}

function createResultsHeader() {
  const events = f1ResultsState.eventColumns.map(column => column.label);
  return ["#", "Név", "Csapat", ...events, "Pont", "Gain"];
}
