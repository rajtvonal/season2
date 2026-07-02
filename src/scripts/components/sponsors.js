const SPONSOR_SECTIONS = {
  Bal: "left",
  Jobb: "right",
  Lent: "bottom"
};

async function loadSponsors() {
  const response = await fetch(getSponsorsPath());
  const text = await response.text();
  const sponsors = parseSponsors(text);

  renderSideSponsors(".container-sponsor-left", sponsors.left);
  renderSideSponsors(".container-sponsor-right", sponsors.right);
  renderBottomSponsors(".container-sponsor-bottom", sponsors.bottom);
}

function parseSponsors(text) {
  const groups = { left: [], right: [], bottom: [] };
  let currentSection = "";

  getSponsorLines(text).forEach(line => {
    if (SPONSOR_SECTIONS[line]) {
      currentSection = SPONSOR_SECTIONS[line];
      return;
    }

    if (!currentSection) return;
    groups[currentSection].push(createSponsorData(line));
  });

  return groups;
}

function getSponsorLines(text) {
  return text
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);
}

function createSponsorData(line) {
  const [name, link, image] = line.split(",");
  return { name, link, image };
}

function renderSideSponsors(selector, sponsors) {
  const container = document.querySelector(selector);
  if (!container) return;

  if (sponsors.length === 1) container.classList.add("single-sponsor");
  sponsors.forEach(sponsor => {
    container.appendChild(createSponsorElement(sponsor, "sponsor"));
  });
}

function renderBottomSponsors(selector, sponsors) {
  const container = document.querySelector(selector);
  if (!container) return;

  if (sponsors.length === 1) {
    container.classList.add("single-bottom");
    container.appendChild(createSponsorElement(sponsors[0], "sponsor-wide"));
    return;
  }

  sponsors.slice(0, 3).forEach((sponsor, index) => {
    const className = index === 1 ? "sponsor-wide" : "sponsor-small";
    container.appendChild(createSponsorElement(sponsor, className));
  });
}

function createSponsorElement(sponsor, className) {
  const wrapper = document.createElement("a");
  wrapper.className = className;
  wrapper.href = sponsor.link;
  wrapper.target = "_blank";
  wrapper.rel = "noopener noreferrer";

  const img = document.createElement("img");
  img.src = getImagePath(sponsor.image);
  img.alt = sponsor.name;

  const name = document.createElement("div");
  name.className = "sponsor-name";
  name.textContent = sponsor.name;

  const linkText = document.createElement("div");
  linkText.className = "sponsor-link";
  linkText.textContent = sponsor.link.replace(/^https?:\/\//, "");

  wrapper.appendChild(name);
  wrapper.appendChild(img);
  wrapper.appendChild(linkText);

  return wrapper;
}
