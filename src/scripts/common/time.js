function parseTime(t) {
  const [m, s] = t.split(":");
  return Number(m) * 60 + parseFloat(s);
}

function fmt(s) {
  const m = Math.floor(s / 60);
  const sec = (s % 60).toFixed(3).padStart(6, "0");
  return `${m}:${sec}`;
}
