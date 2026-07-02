function formatRaceTotal(driver, leader) {
  if (!hasRaceTime(driver)) return "-";
  if (!leader || driver === leader) return driver.total;

  const diff = parseTime(driver.total) - parseTime(leader.total);
  const bestLap = parseTime(driver.best);
  if (diff > 120 && Number.isFinite(bestLap)) return `+ ${Math.floor(diff / bestLap)} kör`;
  return `+ ${formatRaceGap(diff)}`;
}

function hasRaceTime(driver) {
  return driver.total && !["DNF", "DNS", "DSQ"].includes(String(driver.position).toUpperCase());
}

function formatRaceGap(diff) {
  if (diff >= 60) return fmt(diff);
  return diff.toFixed(3);
}
