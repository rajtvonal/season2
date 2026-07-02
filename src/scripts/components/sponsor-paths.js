const sponsorPath = getCurrentPath();

function getSponsorsPath() {
  if (isF1Page(sponsorPath) && isSubPage(sponsorPath)) return "../../database/sponsorsf1.txt";
  if (isF1Page(sponsorPath) && isLeagueMenu(sponsorPath)) return "../database/sponsorsf1.txt";
  if (isSMPage(sponsorPath) && isSubPage(sponsorPath)) return "../../database/sponsorssm.txt";
  if (isSMPage(sponsorPath) && isLeagueMenu(sponsorPath)) return "../database/sponsorssm.txt";
  return "database/sponsors.txt";
}

function getImagePath(imageName) {
  if (isSubPage(sponsorPath)) return `../../database/${imageName}`;
  if (isLeagueMenu(sponsorPath)) return `../database/${imageName}`;
  return `database/${imageName}`;
}


function getCurrentPath() {
  return decodeURIComponent(window.location.pathname)
    .replace(/\/[^/]*$/, "/")
    .toLowerCase();
}

function isHomePage(path) { return !isF1Page(path) && !isSMPage(path); }
function isF1Page(path) { return path.includes("/formulaseries/"); }
function isSMPage(path) { return path.includes("/simmasters/"); }
function isLeagueMenu(path) { return ( (isF1Page(path) || isSMPage(path)) && !isSubPage(path) );}
function isSubPage(path) {
  return [
    "/elokvali/",
    "/eredmenyek/",
    "/versenynaptar/",
    "/verseny-beallitasok/",
    "/szabalyzat/",
    "/bop/",
    "/idojaras/"
  ].some(segment => path.includes(segment));
}