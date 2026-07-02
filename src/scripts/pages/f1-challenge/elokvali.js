function loadData(file, btn) {
  setActiveButton(btn);

  fetch(file + "?v=" + Date.now())
    .then(response => response.text())
    .then(text => renderTable(parseQualifyingData(text)));
}

function setActiveButton(btn) {
  document.querySelectorAll("button").forEach(button => button.classList.remove("active"));
  btn.classList.add("active");
}

function parseQualifyingData(text) {
  return text
    .trim()
    .split("\n")
    .map(parseQualifyingRow)
    .sort((x, y) => x.total - y.total);
}

function parseQualifyingRow(row) {
  const [country, name, p1, p2, p3] = row.split(",");
  const a = parseTime(p1);
  const b = parseTime(p2);
  const c = parseTime(p3);
  return { country, name, a, b, c, total: a + b + c };
}

function renderTable(data) {
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";

  const best = data[0]?.total || 0;
  data.forEach((item, index) => {
    tbody.appendChild(createQualifyingRow(item, index, best));
  });
}

function createQualifyingRow(item, index, best) {
  const tr = document.createElement("tr");
  tr.className = "row";

  const delta = index ? `<div class="delta">(+${(item.total - best).toFixed(3)} s)</div>` : "";
  tr.innerHTML = `
    <td class="pos rank-${index + 1} top-${index + 1}">${index + 1}</td>
    <td class="name top-${index + 1}">${createFlagImg(item.country)}${item.name}</td>
    <td class="time top-${index + 1}">${fmt(item.a)}</td>
    <td class="time top-${index + 1}">${fmt(item.b)}</td>
    <td class="time top-${index + 1}">${fmt(item.c)}</td>
    <td class="total top-${index + 1}">${fmt(item.total)}${delta}</td>`;

  return tr;
}

runWhenQualifyingReady(() => {
  const defaultFile = window.RAJTVONAL_QUALI_DEFAULT_FILE || "../../database/F1/elokvali.csv";
  loadData(defaultFile, document.getElementById("defaultBtn"));
});

function runWhenQualifyingReady(callback) {
  if (document.readyState === "loading") {
    window.addEventListener("load", callback);
    return;
  }

  callback();
}
