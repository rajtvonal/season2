const path = window.location.pathname.replace(/\/[^/]*$/, "/").toLowerCase();

let buttonText = "Vissza";

function createBackButton() {
  if (isHomePage(path)) { return }
  if (isLeagueMenu(path)) { buttonText = "Liga Választó"; }
  if (isArchivePage(path)) { buttonText = "Aktuális Ligák"; }

  const button = document.createElement("div");
  button.className = "back-button";
  button.innerHTML = `← ${buttonText}`;
  button.onclick = goBack;

  document.body.appendChild(button);

  return button;
}

function goBack() {
  window.location.href = "../";
}

function isHomePage(path) { return !isF1Page(path) && !isSMPage(path) && !isArchivePage(path) && !path.includes("/admin/"); }
function isLeagueMenu(path) { return ( (isF1Page(path) || isSMPage(path) || isArchivePage(path))  &&  !isSubPage(path) && !isArchiveResultsPage(path) ); }
function isF1Page(path) { return path.includes("/formulaseries/"); }
function isSMPage(path) { return path.includes("/simmasters/"); }
function isArchivePage(path) { return path.includes("/archívum/"); }
function isArchiveResultsPage(path) { return isArchivePage(path) && !path.endsWith("/arch\u00edvum/"); }
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
function isSubPage2(path) {
  return [
    "/leiras/",
    "/bekuldes/"
  ].some(segment => path.includes(segment));
}

createBackButton();
