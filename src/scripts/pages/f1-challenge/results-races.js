async function showRaceButtons() {
  const div = document.getElementById("raceButtons");
  div.style.display = "block";
  div.innerHTML = "";
  const buttons = await createRaceButtons(div);
  if (buttons.length > 0) buttons[0].click();
}

async function createRaceButtons(container) {
  const buttons = [];
  for (let i = 1; i <= 12; i++) {
    const button = await createRaceButton(i, buttons);
    if (!button) continue;

    buttons.push(button);
    container.appendChild(button);
  }

  return buttons;
}

async function createRaceButton(raceNumber, buttons) {
  const config = getResultsConfig();

  try {
    const res = await fetch(`${config.databasePath}/races/R${raceNumber}.csv`, { method: "HEAD" });
    if (!res.ok) return null;

    const button = document.createElement("button");
    button.innerText = "R" + raceNumber;
    button.onclick = () => selectRace(button, buttons, raceNumber);
    return button;
  } catch (exception) {
    return null;
  }
}

function selectRace(button, buttons, raceNumber) {
  const config = getResultsConfig();

  buttons.forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");

  fetch(`${config.databasePath}/races/R${raceNumber}.csv?v=${Date.now()}`)
    .then(response => response.text())
    .then(text => {
      renderRaceTable(parseRaceResults(text));
      updateHeader(["#", "Név", "Idő", "Leggyorsabb Kör", "Box"]);
    });
}

function parseRaceResults(text) {
  return text
    .trim()
    .split("\n")
    .map(line => {
      const [pos, name, total, best, pits] = line.split(",");
      return { pos: parseInt(pos), name, time: parseTime(total), best, pits: parseInt(pits) };
    })
    .sort((a, b) => a.pos - b.pos);
}

function renderRaceTable(data) {
  const tbody = document.getElementById("tbody");
  const leaderTime = data[0]?.time || 0;
  tbody.innerHTML = "";
  data.forEach((driver, index) => {
    tbody.appendChild(createRaceRow(driver, index, leaderTime));
  });
}

function createRaceRow(driver, index, leaderTime) {
  const tr = document.createElement("tr");
  tr.className = "row";

  tr.innerHTML = `
    <td class="pos rank-${index + 1} top-${index + 1}">${driver.pos || "-"}</td>
    ${createNameCell(driver.name, index)}
    <td class="time top-${index + 1}">${formatRaceTime(driver, index, leaderTime)}</td>
    <td class="time top-${index + 1}">${driver.best}</td>
    <td class="time top-${index + 1}">${driver.pits}</td>
  `;

  return tr;
}

function formatRaceTime(driver, index, leaderTime) {
  if (index === 0) return fmt(driver.time);

  const diff = driver.time - leaderTime;
  const lapTime = parseTime(driver.best);

  if (diff > lapTime) {
    return `+ ${(diff / lapTime).toFixed(0)} Kör`;
  }

  return `+ ${diff.toFixed(3)}`;
}
