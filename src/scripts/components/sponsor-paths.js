function getSponsorsPath() {
  const path = window.location.pathname.replace(/\/[^/]*$/, "/");
  if (isSponsorSubPage(path)) return "../../database/sponsors.txt";
  if (isLeagueMenu(path)) return "../database/sponsors.txt";
  return "database/sponsors.txt";
}

function getImagePath(imageName) {
  const path = window.location.pathname.replace(/\/[^/]*$/, "/");
  if (isSponsorSubPage(path)) return `../../database/${imageName}`;
  if (isLeagueMenu(path)) return `../database/${imageName}`;
  return `database/${imageName}`;
}

function isLeagueMenu(path) {
  return path.includes("/F1_Challenge/") || path.includes("/SimMasters/");
}

function isSponsorSubPage(path) {
  return [
    "/elokvali/",
    "/eredmenyek/",
    "/versenynaptar/",
    "/verseny-beallitasok/",
    "/BOP/",
    "/idojaras/"
  ].some(segment => path.includes(segment));
}
