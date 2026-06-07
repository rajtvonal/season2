function getSponsorsPath() {
  const path = window.location.pathname.replace(/\/[^/]*$/, "/");
  if (isF1Page(path) && isSubPage(path)) return "../../database/sponsorsf1.txt";
  if (isF1Page(path) && isLeagueMenu(path)) return "../database/sponsorsf1.txt";
  if (isSMPage(path) && isSubPage(path)) return "../../database/sponsorssm.txt";
  if (isSMPage(path) && isLeagueMenu(path)) return "../database/sponsorssm.txt";
  return "database/sponsors.txt";
}

function getImagePath(imageName) {
  const path = window.location.pathname.replace(/\/[^/]*$/, "/");
  if (isSubPage(path)) return `../../database/${imageName}`;
  if (isLeagueMenu(path)) return `../database/${imageName}`;
  return `database/${imageName}`;
}

function isLeagueMenu(path) {
  return path.includes("/F1_Challenge/") || path.includes("/SimMasters/");
}

function isSubPage(path) {
  return [
    "/elokvali/",
    "/eredmenyek/",
    "/versenynaptar/",
    "/verseny-beallitasok/",
    "/szabalyzat/",
    "/BOP/",
    "/idojaras/"
  ].some(segment => path.includes(segment));
}

function isSubPage2(path) {
  return [
    "/bekuldes/"
  ].some(segment => path.includes(segment));
}

function isF1Page(path) {
  return path.includes("/F1_Challenge/");
}

function isSMPage(path) {
  return path.includes("/SimMasters/");
}