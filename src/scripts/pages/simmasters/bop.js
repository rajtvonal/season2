function loadBopData() {
  const tbodyHyper = document.getElementById("hyper");
  const tbodyGT = document.getElementById("gt");
  fetch("../../database/SM/bop/BOP_hyper.csv?v=" + Date.now())
    .then(response => response.text())
    .then(text => renderBopTable(parseBopData(text), tbodyHyper));

  fetch("../../database/SM/bop/BOP_gt.csv?v=" + Date.now())
    .then(response => response.text())
    .then(text => renderBopTable(parseBopData(text), tbodyGT));
}

function parseBopData(text) {
  return text
    .trim()
    .split("\n")
    .filter(Boolean)
    .map(parseBopRow)
    .sort((a, b) => b.value - a.value);
}

function parseBopRow(row) {
  const separator = row.includes(",") ? "," : " - ";
  const [name, value] = row.split(separator);
  return { name: name.trim(), value: parseFloat(value) || 0 };
}

function renderBopTable(data, tbody) {
  tbody.innerHTML = "";
  data.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.className = "row search-item";
    tr.innerHTML = `
      <td class="pos rank-${index + 1} top-${index + 1}">${index + 1}</td>
      <td class="name top-${index + 1}">${item.name}</td>
      <td class="total top-${index + 1}">${item.value.toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  });
}

runWhenBopReady(loadBopData);

function runWhenBopReady(callback) {
  if (document.readyState === "loading") {
    window.addEventListener("load", callback);
    return;
  }

  callback();
}
