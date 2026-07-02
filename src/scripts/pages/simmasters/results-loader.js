async function loadResults(btn) {
  setActive(btn);
  setClass("container results", "main");
  await loadSimMastersData();
  showClassButtons("main");
}

async function loadSimMastersData() {
  const [teams, drivers, races, qualis] = await Promise.all([
    loadTeams(),
    loadDrivers(),
    loadJsonSeries("races", "R"),
    loadJsonSeries("qualis", "Q")
  ]);
  smResultsState.teams = teams;
  smResultsState.drivers = drivers;
  smResultsState.races = races;
  smResultsState.qualis = qualis;
}

function showClassButtons(view) {
  smResultsState.activeView = view;
  const div = document.getElementById("raceButtons");
  div.style.display = "block";
  div.innerHTML = "";
  smResultsConfig.classes.forEach(className => div.appendChild(createClassButton(className)));
  renderActiveClassView();
}

function createClassButton(className) {
  const button = document.createElement("button");
  button.innerText = className;
  button.classList.toggle("active", className === smResultsState.activeClass);
  button.onclick = () => {
    smResultsState.activeClass = className;
    Array.from(button.parentElement.children).forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    renderActiveClassView();
  };
  return button;
}

function renderActiveClassView() {
  resetResultsTable();
  const data = addGapToFirst(calculateGains(buildDriverStandings(smResultsState.activeClass)));
  setCurrentData(data);
  if (smResultsState.activeView === "individual") return renderIndividualView(data);
  if (smResultsState.activeView === "teams") return renderTeamView(data);
  if (smResultsState.activeView === "statistics") return renderStatisticsView(data);
  renderTable(data, "main");
  updateHeader(createResultsHeader(smResultsConfig.totalRaces));
}

function resetResultsTable() {
  const container = document.querySelector(".container.results");
  if (container.querySelector("#tbody")) return;
  container.innerHTML = "<table><thead><tr></tr></thead><tbody id=\"tbody\"></tbody></table>";
}

function createResultsHeader(totalRaces) {
  const races = Array.from({ length: totalRaces }, (_, index) => `R${index + 1}`);
  return ["#", "Név", "Csapat", ...races, "Pont", "Gain"];
}
