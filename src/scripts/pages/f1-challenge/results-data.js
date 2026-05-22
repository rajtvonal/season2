function loadPoints() {
  const config = getResultsConfig();

  return fetch(`${config.databasePath}/pontrendszer.csv`)
    .then(response => response.text())
    .then(text => {
      text
        .trim()
        .split("\n")
        .forEach(line => {
          const [pos, pts] = line.split(",");
          f1ResultsState.pointsMap[pos.trim()] = parseInt(pts);
        });
    });
}

function loadResults(btn) {
  const config = getResultsConfig();

  setActive(btn);
  hideRaceButtons();
  setClass("container results", "main");

  fetch(`${config.databasePath}/${config.resultsFile}`)
    .then(response => response.ok ? response.text() : "")
    .catch(() => "")
    .then(text => {
      if (!text.trim()) {
        setCurrentData([]);
        renderEmptyTable("Nincs megjeleníthető eredmény.");
        updateHeader(["#"]);
        return;
      }

      const data = calculateGains(parseResults(text));
      setCurrentData(data);
      renderTable(data, "main");
      updateHeader(createResultsHeader(config.totalRaces));
    });
}

function createResultsHeader(totalRaces) {
  const races = Array.from({ length: totalRaces }, (_, index) => `R${index + 1}`);
  return ["#", "Név", "Csapat", ...races, "Pont", "Gain"];
}

function parseResults(text) {
  return text
    .trim()
    .split("\n")
    .map(parseResultRow)
    .sort((a, b) => b.total - a.total);
}

function parseResultRow(row) {
  const config = getResultsConfig();
  const cols = row.split(",");
  const name = cols[0];
  const team = cols[1];
  const results = cols.slice(2, 2 + config.totalRaces);
  const idomeroeredmenyek = cols.slice(2 + config.totalRaces, 2 + config.totalRaces * 2);
  const points = results.map(result => result ? getPointsForPosition(result) : "");
  const total = points.reduce((sum, point) => point === "" ? sum : sum + point, 0);

  return { name, team, results, points, total, idomeroeredmenyek };
}
