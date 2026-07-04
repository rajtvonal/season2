const favicon = document.createElement("link");
favicon.rel = "icon";
if (isHomePage(path)) { favicon.href = "./favicon.ico"; }
if (isLeagueMenu(path)) { favicon.href = "../favicon.ico"; }
if (isArchivePage(path)) { favicon.href = "../favicon.ico"; }
if (isArchiveResultsPage(path)) { favicon.href = "../../favicon.ico"; }
if (isSubPage(path)) { favicon.href = "../../favicon.ico"; }
if (isSubPage2(path)) { favicon.href = "../../../favicon.ico"; }
document.head.appendChild(favicon);
