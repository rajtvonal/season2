function renderStatisticsView(data) {
  renderStatisticsTable(createStatistics(data));
  updateHeader(["Név", "Num", "Autó", "Győzelmek", "Pole pozíciók", "Átlag pont/verseny", "Átlag kvali", "Átlag pozíciószerzés"]);
}

function createStatistics(data) {
  return [...data].map(driver => ({
    name: driver.name,
    country: driver.country,
    carNum: driver.carNum || "-",
    car: driver.car || "-",
    wins: driver.raceDetails.filter(result => result?.position === 1).length,
    poles: driver.idomeroeredmenyek.filter(result => result === "1").length,
    averagePoints: calculateAveragePoints(driver),
    averageQualifying: average(getNumericPositions(driver.idomeroeredmenyek)),
    averagePositionGain: calculateAveragePositionGain(driver)
  })).sort((a, b) => b.wins - a.wins || b.poles - a.poles || b.averagePoints - a.averagePoints);
}

function createStatisticsRow(driver) {
  const tr = document.createElement("tr");
  tr.className = "row";
  tr.innerHTML = `
    <td class="name">${createFlagImg(driver.country)}${driver.name}</td>
    <td class="time">${driver.carNum}</td>
    <td class="team">${driver.car}</td>
    <td class="total">${driver.wins}</td>
    <td class="total">${driver.poles}</td>
    <td class="total">${formatAverage(driver.averagePoints)}</td>
    <td class="total">${formatAverage(driver.averageQualifying)}</td>
    <td class="gain" style="color:${getPositionGainColor(driver.averagePositionGain)}">${formatPositionGain(driver.averagePositionGain)}</td>
  `;
  return tr;
}
