// YYYY-MM-DDTHH:MM:SS
const targetDate = new Date("2026-07-09T23:59:59");
const countdownEl = document.getElementById("nextRaceBox");

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;
  if (diff <= 0) {
    countdownEl.innerHTML = `
      <strong style>Az előkvalifikáció véget ért!</strong>
    `;
    clearInterval(timer);
    return;
  }

  countdownEl.innerHTML = `
    <span style="font-size: 30px; color: var(--text-primary)">Július 10.-ig</span>
    <strong style="letter-spacing: normal;">${formatCountdown(targetDate)}</strong>
  `;
}

function formatCountdown(date) {
  if (!date) return "-";
  const diff = Math.max(0, date.getTime() - Date.now());
  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / 60000) % 60;
  const hours = Math.floor(diff / 3600000) % 24;
  const days = Math.floor(diff / 86400000);

  if (days > 0) {
    return `${days} nap<br>${hours} óra : ${minutes} perc : ${seconds} s`;
  }
  if (hours > 0) {
    return `${hours} óra : ${minutes} perc : ${seconds} s`;
  }
  return `${minutes} perc : ${seconds} s`;
}

updateCountdown();
const timer = setInterval(updateCountdown, 1000);
