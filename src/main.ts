import "./style.css";

const yearEl = document.querySelector<HTMLElement>("#footer-year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const id = anchor.getAttribute("href");
    if (!id || id === "#") return;

    const target = document.querySelector<HTMLElement>(id);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", id);
    target.focus({ preventScroll: true });
  });
});

const header = document.querySelector<HTMLElement>(".site-header");
if (header) {
  const syncHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  window.addEventListener("scroll", syncHeader, { passive: true });
  syncHeader();
}

const APP_VIEWS = ["inicio", "servicos", "simular", "resumo"] as const;
type AppView = (typeof APP_VIEWS)[number];

function isAppView(view: string): view is AppView {
  return (APP_VIEWS as readonly string[]).includes(view);
}

function initAppMock(): void {
  const root = document.querySelector<HTMLElement>("[data-app-mock]");
  if (!root) return;

  const tabs = root.querySelectorAll<HTMLButtonElement>(".app-tab[data-app-view]");
  const views = root.querySelectorAll<HTMLElement>(".app-view[data-app-view]");
  const jumpButtons = root.querySelectorAll<HTMLButtonElement>("[data-app-nav]");

  const setView = (view: AppView) => {
    tabs.forEach((tab) => {
      const active = tab.dataset.appView === view;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    views.forEach((panel) => {
      const active = panel.dataset.appView === view;
      panel.classList.toggle("is-active", active);
      panel.toggleAttribute("hidden", !active);
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const view = tab.dataset.appView ?? "";
      if (isAppView(view)) setView(view);
    });
  });

  jumpButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.appNav ?? "";
      if (isAppView(view)) setView(view);
    });
  });

  setView("inicio");
}

initAppMock();
