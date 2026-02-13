(function(){
  // Year
  document.querySelectorAll("[data-year]").forEach(el=>{
    el.textContent = new Date().getFullYear();
  });

  // Mobile drawer
  const hamburger = document.getElementById("hamburger");
  const drawer = document.getElementById("drawer");
  const closeDrawer = document.getElementById("closeDrawer");

  function openDrawer(){
    if(!drawer) return;
    drawer.style.display = "block";
    drawer.setAttribute("aria-hidden","false");
    if(hamburger) hamburger.setAttribute("aria-expanded","true");
  }
  function hideDrawer(){
    if(!drawer) return;
    drawer.style.display = "none";
    drawer.setAttribute("aria-hidden","true");
    if(hamburger) hamburger.setAttribute("aria-expanded","false");
  }

  if(hamburger){ hamburger.addEventListener("click", openDrawer); }
  if(closeDrawer){ closeDrawer.addEventListener("click", hideDrawer); }
  if(drawer){
    drawer.addEventListener("click", (e)=>{ if(e.target === drawer) hideDrawer(); });
    document.addEventListener("keydown", (e)=>{ if(e.key === "Escape") hideDrawer(); });
  }

  // Active nav/tab based on current file
  const path = (location.pathname || "").split("/").pop() || "index.html";
  document.querySelectorAll('[data-nav]').forEach(a=>{
    const href = (a.getAttribute("href") || "").split("/").pop();
    if(href === path) a.classList.add("active");
  });

  // Smooth scroll for hash links on same page
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener("click", (e)=>{
      const id = a.getAttribute("href");
      if(!id || id === "#") return;
      const el = document.querySelector(id);
      if(el){
        e.preventDefault();
        el.scrollIntoView({behavior:"smooth", block:"start"});
        history.pushState(null, "", id);
      }
    });
  });

  // --- Cookie consent (RGPD) ---
  const CONSENT_KEY = "nb_consent_v1";

  function getConsent() {
    try { return JSON.parse(localStorage.getItem(CONSENT_KEY) || "null"); }
    catch { return null; }
  }
  function setConsent(consent) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  }

  function loadAnalytics() {
    // PLAUSIBLE (inject only after consent)
    const s = document.createElement("script");
    s.defer = true;
    s.src = "https://plausible.io/js/script.js";
    s.setAttribute("data-domain", "neptunebusiness.com");
    document.head.appendChild(s);
  }

  function ensureConsentUI() {
    const banner = document.getElementById("cookieBanner");
    if (!banner) return;

    const btnAcceptAll = document.getElementById("cookieAcceptAll");
    const btnReject = document.getElementById("cookieReject");
    const btnSave = document.getElementById("cookieSave");
    const toggleAnalytics = document.getElementById("toggleAnalytics");

    let analyticsOn = false;

    const existing = getConsent();
    if (!existing) {
      banner.style.display = "block";
      banner.setAttribute("aria-hidden", "false");
    } else {
      if (existing.analytics) loadAnalytics();
      return;
    }

    function setToggle(el, on) {
      if (!el) return;
      on ? el.classList.add("on") : el.classList.remove("on");
      el.setAttribute("aria-checked", on ? "true" : "false");
    }

    setToggle(toggleAnalytics, analyticsOn);

    if (toggleAnalytics) {
      toggleAnalytics.addEventListener("click", () => {
        analyticsOn = !analyticsOn;
        setToggle(toggleAnalytics, analyticsOn);
      });
      toggleAnalytics.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          analyticsOn = !analyticsOn;
          setToggle(toggleAnalytics, analyticsOn);
        }
      });
    }

    function closeBanner() {
      banner.style.display = "none";
      banner.setAttribute("aria-hidden", "true");
    }

    if (btnAcceptAll) {
      btnAcceptAll.addEventListener("click", () => {
        const consent = { necessary: true, analytics: true, ts: Date.now() };
        setConsent(consent);
        loadAnalytics();
        closeBanner();
      });
    }

    if (btnReject) {
      btnReject.addEventListener("click", () => {
        const consent = { necessary: true, analytics: false, ts: Date.now() };
        setConsent(consent);
        closeBanner();
      });
    }

    if (btnSave) {
      btnSave.addEventListener("click", () => {
        const consent = { necessary: true, analytics: !!analyticsOn, ts: Date.now() };
        setConsent(consent);
        if (consent.analytics) loadAnalytics();
        closeBanner();
      });
    }
  }

  ensureConsentUI();
})();
