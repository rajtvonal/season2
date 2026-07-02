function getDriverCountryCode(country) {
  return (country || "hu").trim().toLowerCase() || "hu";
}

function createFlagImg(country) {
  const code = getDriverCountryCode(country);
  return `<img src="https://flagcdn.com/w20/${code}.png" alt="${code}" class="driver-flag">`;
}

function createTrackFlagImg(country) {
  const code = getDriverCountryCode(country);
  return `<img src="https://flagcdn.com/w320/${code}.png" alt="${code}" class="driver-flag">`;
}