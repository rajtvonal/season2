async function showRaceButtons() {
  await loadF1Data();
  setClass("container results", "races");
  const div = resetEventButtons();

  createRaceEventList().forEach(event => div.appendChild(createEventButton(event)));
  if (div.querySelector("button")) div.querySelector("button").click();
}

async function showQualifying(btn) {
  setActive(btn);
  await loadF1Data();
  setClass("container results", "qualifying");
  const div = resetEventButtons();

  f1ResultsState.qualis.filter(Boolean).forEach(quali => {
    div.appendChild(createEventButton({ type: "quali", raceNumber: quali.raceNumber, data: quali.rows }));
  });
  if (div.querySelector("button")) div.querySelector("button").click();
}

function resetEventButtons() {
  const div = document.getElementById("raceButtons");
  div.style.display = "block";
  div.innerHTML = "";
  return div;
}

function createRaceEventList() {
  const events = [];
  for (let i = 1; i <= getResultsConfig().totalRaces; i++) {
    if (f1ResultsState.sprints[i - 1]) events.push({ type: "sprint", raceNumber: i, data: f1ResultsState.sprints[i - 1].rows });
    if (f1ResultsState.races[i - 1]) events.push({ type: "race", raceNumber: i, data: f1ResultsState.races[i - 1].rows });
  }
  return events;
}

function createEventButton(event) {
  const button = document.createElement("button");
  button.innerText = getEventLabel(event);
  button.onclick = () => selectEventButton(button, event);
  return button;
}

function getEventLabel(event) {
  const prefix = event.type === "quali" ? "Q" : event.type === "sprint" ? "S" : "R";
  return prefix + event.raceNumber;
}

function selectEventButton(button, event) {
  Array.from(button.parentElement.children).forEach(item => item.classList.remove("active"));
  button.classList.add("active");
  if (event.type === "quali") return renderQualifyingTable(event.data);
  renderRaceTable(event.data.map(parseRaceRow));
}

function renderRaceTable(data) {
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";
  data.forEach((driver, index) => tbody.appendChild(createRaceRow(driver, index)));
  updateHeader(["#", "Név", "Idő", "Leggyorsabb Kör", "Box"]);
}

function createRaceRow(driver, index) {
  const tr = document.createElement("tr");
  tr.className = "row";
  tr.innerHTML = `
    <td class="pos rank-${index + 1} top-${index + 1}">${driver.position}</td>
    ${createNameCell(driver.name, index, getDriverMeta(driver.name).country)}
    <td class="time top-${index + 1}">${driver.total}</td>
    <td class="time top-${index + 1}">${driver.best}</td>
    <td class="time top-${index + 1}">${driver.pits}</td>
  `;
  return tr;
}

function renderQualifyingTable(rows) {
  const data = rows.map(parseQualiRow).sort((a, b) => Number(a.position) - Number(b.position));
  const best = getBestQualifyingLap(data);
  document.getElementById("tbody").innerHTML = "";
  data.forEach((driver, index) => {
    document.getElementById("tbody").appendChild(createQualifyingResultRow(driver, index, best));
  });
  updateHeader(["#", "Név", "Köridő", "Gumi", "Gap to First"]);
}

function createQualifyingResultRow(driver, index, best) {
  const tr = document.createElement("tr");
  tr.className = "row";
  tr.innerHTML = `
    <td class="pos rank-${index + 1} top-${index + 1}">${driver.position}</td>
    ${createNameCell(driver.name, index, getDriverMeta(driver.name).country)}
    <td class="time top-${index + 1}">${driver.lap}</td>
    <td class="time top-${index + 1}">${driver.tyre}</td>
    <td class="gain top-${index + 1}" style="color:#ef4444">${formatQualifyingGap(driver, best)}</td>
  `;
  return tr;
}
