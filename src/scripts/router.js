const scriptsBaseUrl = new URL("./", import.meta.url);
const projectRootUrl = new URL("../../", import.meta.url);
const networkTracker = installNetworkTracker();

showLoadingOverlay();

// ==== STYLE ====
const styleSheets = [
  "src/styles/theme.css",
  "src/styles/base.css",
  "src/styles/components.css",
  "src/styles/animations.css",
  "src/styles/pages.css",
  "src/styles/phone.css"
];

// ==== DEFAULT PAGE SETUP ====
const commonScripts = [
  "common/theme.js",
  "common/navigation.js",
  "common/fallingpx.js"
];

// ==== COMPONENTS ====
const utilityScripts = [
  "common/dom.js",
  "common/flags.js",
  "common/time.js"
];

const sponsorScripts = [
  "components/sponsor-paths.js",
  "components/sponsors.js"
];

const searchScripts = [
  "components/search-config.js",
  "components/search.js"
];

// const fallingPixelsScript = "common/fallingpx.js";

// ==== PAGE PACKEGES ====
const f1ResultsScripts = [
  "pages/f1-challenge/results-state.js",
  "pages/f1-challenge/results-render.js",
  "pages/f1-challenge/results-data.js",
  "pages/f1-challenge/results-loaders.js",
  "pages/f1-challenge/results-events.js",
  "pages/f1-challenge/results-build.js",
  "pages/f1-challenge/results-gains.js",
  "pages/f1-challenge/results-statistics.js",
  "pages/f1-challenge/results-teams.js",
  "pages/f1-challenge/results-views.js",
  "pages/f1-challenge/results-race-time.js",
  "pages/f1-challenge/results-races.js",
  "pages/f1-challenge/results-qualifying.js",
  "pages/f1-challenge/results-init.js"
];

const smResultsScripts = [
  "pages/simmasters/results-state.js",
  "pages/f1-challenge/results-render.js",
  "pages/f1-challenge/results-gains.js",
  "pages/f1-challenge/results-statistics.js",
  "pages/f1-challenge/results-views.js",
  "pages/simmasters/results-loader.js",
  "pages/simmasters/results-loaders-extra.js",
  "pages/simmasters/results-standings.js",
  "pages/simmasters/results-teams.js",
  "pages/simmasters/results-statistics.js",
  "pages/simmasters/results-races.js",
  "pages/simmasters/results-init.js"
];

const elokvaliScripts = [
  "pages/f1-challenge/elokvali.js",
  "pages/f1-challenge/elokvali-countdown.js"
];

const f1CalendarScripts = [
  "common/flags.js",
  "pages/f1-challenge/calendar-data.js",
  "pages/f1-challenge/calendar-state.js",
  "pages/f1-challenge/calendar-render.js",
  "pages/f1-challenge/calendar.js"
];

const smCalendarScripts = [
  "common/flags.js",
  "pages/simmasters/calendar-data.js",
  "pages/simmasters/calendar-render.js",
  "pages/simmasters/calendar.js"
 ];
 
const rulesScripts = [
  "common/dom.js",
  "components/rules.js"
];


// ==== PAGE SELECTION ====
const routes = [
  { /* /archívum/ */
    match: path => isArchivePage(path) && !isArchiveResultsPage(path),
    scripts: [
      ...commonScripts
    ]
  },
  { /* /archívum/xy_league */
    match: isArchiveResultsPage,
    scripts: [
      ...commonScripts,
      ...utilityScripts,
      ...f1ResultsScripts
    ]
  },
  { /* /root */
    match: isHomePage,
    scripts: [
      ...commonScripts,
      ...sponsorScripts,
    ],
    afterLoad: [loadSponsorsIfAvailable]
  },
  { /* /formulaseries  &&  /simmasters */
    match: isLeagueMenuPage,
    scripts: [
      ...commonScripts,
      ...sponsorScripts
    ],
    afterLoad: [loadSponsorsIfAvailable]
  },
  { /* /formulaseries/elokvali/bekuldes */
    match: path => isF1Page(path) && path.includes("/elokvali/bekuldes/"),
    scripts: [
      ...commonScripts,
    ]
  },
  { /* /simmasters/elokvali/bekuldes */
    match: path => isSMPage(path) && path.includes("/elokvali/bekuldes/"),
    scripts: [
      ...commonScripts
    ]
  },
  { /* /simmasters/bop/leiras */
    match: path => isSMPage(path) && path.includes("/bop/leiras/"),
    scripts: [
      ...commonScripts
    ]
  },
  { /* /formulaseries/elokvali */
    match: path => isF1Page(path) && path.includes("/elokvali/"),
    scripts: [
      ...sponsorScripts,
      ...utilityScripts,
      ...searchScripts,
      ...commonScripts,
      ...elokvaliScripts
    ],
    afterLoad: [
      loadSponsorsIfAvailable,
      () => initSearchIfAvailable("table")
    ]
  },
  { /* /simmasters/elokvali */
    match: path => isSMPage(path) && path.includes("/elokvali/"),
    beforeLoad: [
      () => {
        window.RAJTVONAL_QUALI_DEFAULT_FILE = "../../database/SM/elokvali/elokvali_hyper.csv";
      }
    ],
    scripts: [
      ...sponsorScripts,
      ...utilityScripts,
      ...searchScripts,
      ...commonScripts,
      ...elokvaliScripts
    ],
    afterLoad: [
      loadSponsorsIfAvailable,
      () => initSearchIfAvailable("table")
    ]
  },
  { /* /formulaseries/versenynaptar */
    match: path => isF1Page(path) && path.includes("/versenynaptar/"),
    scripts: [
      ...sponsorScripts,
      ...commonScripts,
      ...f1CalendarScripts
    ],
    afterLoad: [loadSponsorsIfAvailable]
  },
  { /* /simmasters/versenynaptar */
    match: path => isSMPage(path) && path.includes("/versenynaptar/"),
    scripts: [
      ...sponsorScripts,
      ...commonScripts,
      ...smCalendarScripts
    ],
    afterLoad: [loadSponsorsIfAvailable]
  },
  { /* /formulaseries/eredmenyek */
    match: path => isF1Page(path) && path.includes("/eredmenyek/"),
    scripts: [
      ...sponsorScripts,
      ...utilityScripts,
      ...commonScripts,
      ...f1ResultsScripts
    ],
    afterLoad: [loadSponsorsIfAvailable]
  },
  { /* /simmasters/eredmenyek */
    match: path => isSMPage(path) && path.includes("/eredmenyek/"),
    scripts: [
      ...sponsorScripts,
      ...utilityScripts,
      ...commonScripts,
      ...smResultsScripts
    ],
    afterLoad: [loadSponsorsIfAvailable]
  },
  { /* formulaseries/szabalyzat */
    match: path => isF1Page(path) && path.includes("/szabalyzat/"),
    beforeLoad: [
      () => {
        window.RAJTVONAL_RULES_DATABASE_PATH = "../../database/F1";
      }
    ],
    scripts: [
      ...rulesScripts,
      ...searchScripts,
      ...commonScripts,
      ...sponsorScripts
    ],
    afterLoad: [
      () => initSearchIfAvailable("rules"),
      loadSponsorsIfAvailable
    ]
  },
  {/* /simmasters/szabalyzat */
    match: path => isSMPage(path) && path.includes("/szabalyzat/"),
    beforeLoad: [
      () => {
        window.RAJTVONAL_RULES_DATABASE_PATH = "../../database/SM";
      }
    ],
    scripts: [
      ...rulesScripts,
      ...searchScripts,
      ...commonScripts,
      ...sponsorScripts
    ],
    afterLoad: [
      () => initSearchIfAvailable("rules"),
      loadSponsorsIfAvailable
    ]
  },
  { /* /formulaseries/verseny-beallitasok */
    match: path => isF1Page(path) && path.includes("/verseny-beallitasok/"),
    scripts: [
      ...sponsorScripts,
      ...commonScripts
    ],
    afterLoad: [loadSponsorsIfAvailable]
  },
  { /* /simmasters/verseny-beallitasok */
    match: path => isSMPage(path) && path.includes("/verseny-beallitasok/"),
    scripts: [
      ...sponsorScripts,
      ...commonScripts
    ],
    afterLoad: [loadSponsorsIfAvailable]
  },
  { /* /simmasters/bop */
    match: path => isSMPage(path) && path.includes("/bop/"),
    scripts: [
      ...sponsorScripts,
      ...searchScripts,
      ...commonScripts,
      "pages/simmasters/bop.js"
    ],
    afterLoad: [
      loadSponsorsIfAvailable,
      () => initSearchIfAvailable("table")
    ]
  },
  { /* /simmasters/idojaras */
    match: path => isSMPage(path) && path.includes("/idojaras/"),
    scripts: [
      ...sponsorScripts,
      ...commonScripts,
      "pages/simmasters/weather.js"
    ],
    afterLoad: [loadSponsorsIfAvailable]
  },
  { /* /admin/actions */
    match: path => path.includes("/admin/actions/"),
    externalScripts: ["admin/script.js"],
    beforeLoad: [
      () => {
        if (sessionStorage.getItem("admin-auth") !== btoa("1")) {
          location.replace("../");
          throw new Error("Unauthorized");
        }
      }
    ],
    scripts: [
      ...commonScripts,
      ...f1CalendarScripts
    ]
    
  },
  { /* /admin */
    match: path => path.includes("/admin/"),
    externalScripts: ["admin/script.js"],
    scripts: [...commonScripts]
  }
];




export async function router() {
  try {
    const path = getCurrentPath();
    const route = routes.find(candidate => candidate.match(path));

    await loadStyleSheets();

    if (!route) {
      console.warn("No script route configured for:", path);
      return;
    }

    for (const action of route.beforeLoad || []) await action();

    await loadScriptList(route.externalScripts || [], projectRootUrl);
    await loadScriptList(route.scripts || [], scriptsBaseUrl);
    await waitForDomReady();

    for (const action of route.afterLoad || []) await action();

    await waitForWindowLoad();
    await waitForNetworkIdle();
    await waitForImagesLoaded();
  } catch (error) {
    console.error("Router failed while loading page assets:", error);
  } finally {
    hideLoadingOverlay();
  }
}

async function loadScriptList(scripts, baseUrl) {
  for (const script of scripts) {
    await loadClassicScript(new URL(script, baseUrl).href);
  }
}

function loadClassicScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-router-src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.dataset.routerSrc = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Script load failed: ${src}`));
    document.body.appendChild(script);
  });
}

async function loadStyleSheets() {
  await Promise.all(styleSheets.map(styleSheet => {
    const href = new URL(styleSheet, projectRootUrl).href;

    if (document.querySelector(`link[data-router-href="${href}"]`)) {
      return Promise.resolve();
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.dataset.routerHref = href;
    document.head.appendChild(link);

    return new Promise(resolve => {
      link.onload = resolve;
      link.onerror = resolve;
    });
  }));
}

function loadSponsorsIfAvailable() {
  if (typeof window.loadSponsors === "function") {
    return window.loadSponsors();
  }
  return Promise.resolve();
}

function initSearchIfAvailable(mode) {
  if (typeof window.initSearch === "function") {
    window.initSearch({ inputId: "search", noResultId: "noResult", mode });
    return;
  }
  console.warn("Search module is loaded for this route, but window.initSearch is unavailable.");
}



// ==== LOAD TRACKING ====
function showLoadingOverlay() {
  if (document.getElementById("loadingOverlay")) return;

  const style = document.createElement("style");
  style.id = "routerLoadingStyle";
  style.textContent = `
    #loadingOverlay {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      display: grid;
      place-items: center;
      background: #0a0a12;
      opacity: 1;
      transition: opacity 320ms ease, visibility 320ms ease;
    }

    #loadingOverlay.is-hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .loader-wrapper {
      position: relative;
      width: 150px;
      height: 150px;
    }

    .loader-text {
      position: absolute;
      top: calc(100% + 24px);
      left: 50%;
      transform: translateX(-50%);
      font-family: system-ui, sans-serif;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 6px;
      white-space: nowrap;
      color: transparent;
      background:
        linear-gradient(
          110deg,
          #db0a40 0%,
          #db0a40 40%,
          #ff8a8a 50%,
          #ffb3b3 52%,
          #ff8a8a 54%,
          #db0a40 60%,
          #db0a40 100%
        );
      background-size: 200% 100%;
      background-position: 100% 0;
      background-clip: text;
      animation:
        loaderTextGlow 5s ease-in-out infinite,
        textSweep 5s linear infinite;
    }
      
    .loader-box {
      position: relative;
      width: 150px;
      height: 150px;
      display: grid;
      place-items: center;
      border: 1px solid rgba(219,10,64,0.3);
      border-radius: 18px;
      background:
        radial-gradient(circle at center, rgba(219, 10, 64, 0.16), transparent 58%),
        rgba(255, 255, 255, 0.025);
      box-shadow: 0 0 36px rgba(219, 10, 64, 0.22);
      animation: loaderBoxGlow 10s ease-in-out infinite;
      overflow: hidden;
    }

    .loader-triangles {
      position: relative;
      width: 96px;
      height: 96px;
      animation: routerLoaderSpin 5s linear infinite;
    }

    .loader-arm {
      position: absolute;
      inset: 0;
      transform-origin: center center;
    }
    .loader-arm:nth-child(1) { transform: rotate(0deg); }
    .loader-arm:nth-child(2) { transform: rotate(60deg); }
    .loader-arm:nth-child(3) { transform: rotate(120deg); }
    .loader-arm:nth-child(4) { transform: rotate(180deg); }
    .loader-arm:nth-child(5) { transform: rotate(240deg); }
    .loader-arm:nth-child(6) { transform: rotate(300deg); }

    .loader-triangle {
      position: absolute;
      left: 50%;
      top: 0;
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-bottom: 32px solid #db0a40;
      transform: translateX(-50%);
      filter: drop-shadow(0 0 8px rgba(219,10,64,0.7));
    }

    .loader-triangle:nth-child(1) { left: 30px; top: 0; transform: rotate(0deg); }
    .loader-triangle:nth-child(2) { left: 30px; top: 0; transform: rotate(60deg); }
    .loader-triangle:nth-child(3) { left: 30px; top: 0; transform: rotate(120deg); }
    .loader-triangle:nth-child(4) { left: 30px; top: 0; transform: rotate(180deg); }
    .loader-triangle:nth-child(5) { left: 30px; top: 0; transform: rotate(240deg); }
    .loader-triangle:nth-child(6) { left: 30px; top: 0; transform: rotate(300deg); }
   

    .loader-arm:nth-child(1) .loader-triangle { opacity: 0.75; }
    .loader-arm:nth-child(2) .loader-triangle { opacity: 0.75; }
    .loader-arm:nth-child(3) .loader-triangle { opacity: 0.75; }
    .loader-arm:nth-child(4) .loader-triangle { opacity: 0.75; }
    .loader-arm:nth-child(5) .loader-triangle { opacity: 0.75; }
    .loader-arm:nth-child(6) .loader-triangle { opacity: 0.75; }

    @keyframes routerLoaderSpin {
      from { transform: rotate(0deg) scale(1); }
      50% { transform: rotate(180deg) scale(1.15); }
      to { transform: rotate(360deg) scale(1); }
    }

    @keyframes loaderBoxGlow {
      0%, 100% { box-shadow: 0 0 18px rgba(219,10,64,0.18), 0 0 36px rgba(219,10,64,0.10); }
      50% { box-shadow: 0 0 24px rgba(219,10,64,0.45), 0 0 48px rgba(219,10,64,0.22); }
    }

    @keyframes loaderTextGlow {
      0% , 100% { text-shadow:
          0 0 4px rgba(219,10,64,0.35),
          0 0 8px rgba(219,10,64,0.25),
          0 0 16px rgba(219,10,64,0.15);
      }
      50% { text-shadow:
          0 0 8px rgba(219,10,64,0.75),
          0 0 16px rgba(219,10,64,0.65),
          0 0 32px rgba(219,10,64,0.45),
          0 0 48px rgba(219,10,64,0.25);
      }
    }

    @keyframes textSweep {
      from { background-position: -200% 0; }
      to { background-position: 200% 0; }
    }
  `;

  const overlay = document.createElement("div");
  overlay.id = "loadingOverlay";
  overlay.setAttribute("role", "status");
  overlay.setAttribute("aria-label", "Oldal betöltése");
  overlay.innerHTML = `
    <div class="loader-wrapper">
      <div class="loader-box">
        <div class="loader-triangles" aria-hidden="true">
          <span class="loader-arm"><span class="loader-triangle"></span></span>
          <span class="loader-arm"><span class="loader-triangle"></span></span>
          <span class="loader-arm"><span class="loader-triangle"></span></span>
          <span class="loader-arm"><span class="loader-triangle"></span></span>
          <span class="loader-arm"><span class="loader-triangle"></span></span>
          <span class="loader-arm"><span class="loader-triangle"></span></span>
        </div>
      </div>
      <div class="loader-text">BETÖLTÉS</div>
    </div>
  `;

  document.head.appendChild(style);
  document.body.appendChild(overlay);
}

function hideLoadingOverlay() {
  const overlay = document.getElementById("loadingOverlay");
  if (!overlay) return;

  overlay.classList.add("is-hidden");
  setTimeout(() => overlay.remove(), 360);
}

function installNetworkTracker() {
  const originalFetch = window.fetch.bind(window);
  const tracker = {
    pending: 0,
    listeners: new Set()
  };

  window.fetch = async (...args) => {
    tracker.pending++;
    notifyNetworkTracker(tracker);

    try {
      return await originalFetch(...args);
    } finally {
      tracker.pending = Math.max(0, tracker.pending - 1);
      notifyNetworkTracker(tracker);
    }
  };

  return tracker;
}

function notifyNetworkTracker(tracker) {
  tracker.listeners.forEach(listener => listener());
}

function waitForDomReady() {
  if (document.readyState !== "loading") return Promise.resolve();

  return new Promise(resolve => {
    document.addEventListener("DOMContentLoaded", resolve, { once: true });
  });
}

function waitForWindowLoad() {
  if (document.readyState === "complete") return Promise.resolve();

  return new Promise(resolve => {
    window.addEventListener("load", resolve, { once: true });
  });
}

function waitForNetworkIdle({ idleMs = 350, timeoutMs = 10000 } = {}) {
  return new Promise(resolve => {
    let settled = false;
    let idleTimer = null;

    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(idleTimer);
      networkTracker.listeners.delete(check);
      resolve();
    };

    const check = () => {
      clearTimeout(idleTimer);

      if (networkTracker.pending === 0) {
        idleTimer = setTimeout(finish, idleMs);
      }
    };

    networkTracker.listeners.add(check);
    setTimeout(finish, timeoutMs);
    check();
  });
}

function waitForImagesLoaded({ timeoutMs = 5000 } = {}) {
  const images = Array.from(document.images).filter(image => !image.complete);
  if (images.length === 0) return Promise.resolve();

  return new Promise(resolve => {
    let remaining = images.length;

    const finishOne = () => {
      remaining--;
      if (remaining <= 0) resolve();
    };

    images.forEach(image => {
      image.addEventListener("load", finishOne, { once: true });
      image.addEventListener("error", finishOne, { once: true });
    });

    setTimeout(resolve, timeoutMs);
  });
}



// ==== PATH SELECTION ====
function getCurrentPath() { return decodeURIComponent(window.location.pathname).replace(/\/[^/]*$/, "/").toLowerCase(); }
function isHomePage(path) { return !isF1Page(path) && !isSMPage(path) && !isArchivePage(path) && !path.includes("/admin/"); }
function isF1Page(path) { return path.includes("/formulaseries/"); }
function isSMPage(path) { return path.includes("/simmasters/"); }
function isArchivePage(path) { return path.includes("/arch\u00edvum/"); }
function isArchiveResultsPage(path) { return isArchivePage(path) && !path.endsWith("/arch\u00edvum/"); }
function isLeagueMenuPage(path) { return ( (isF1Page(path) || isSMPage(path)) && !isSubPage(path) ); }
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



router();
