import "./landing.css";
import { applyLang, LANG_KEY, type Lang, pickLang } from "./i18n";
import { createInstallFlow, type InstallPromptEvent } from "./install";
import { detectPlatform, type Platform } from "./platform";

const root = document.documentElement;

/*
 * Storage so para lembrar o idioma. Referenciar `localStorage` ja lanca em aba
 * privada ou com cookies bloqueados; a pagina tem que funcionar igual sem ele.
 */
function readLang(): string | null {
  try {
    return window.localStorage.getItem(LANG_KEY);
  } catch {
    return null;
  }
}

function saveLang(lang: Lang): void {
  try {
    window.localStorage.setItem(LANG_KEY, lang);
  } catch {}
}

function setLang(lang: Lang): void {
  applyLang(document, lang);
  for (const button of document.querySelectorAll<HTMLButtonElement>("[data-lang]")) {
    button.setAttribute("aria-pressed", String(button.dataset.lang === lang));
  }
}

function selectTab(tab: "android" | "ios"): void {
  for (const button of document.querySelectorAll<HTMLButtonElement>("[data-tab]")) {
    const selected = button.dataset.tab === tab;
    button.setAttribute("aria-selected", String(selected));
    const panel = document.getElementById(button.getAttribute("aria-controls") ?? "");
    if (panel) panel.hidden = !selected;
  }
}

function markInstalled(): void {
  root.dataset.installed = "";
}

// --- Plataforma -------------------------------------------------------------

const platform: Platform = detectPlatform({
  userAgent: navigator.userAgent,
  maxTouchPoints: navigator.maxTouchPoints,
  coarse: window.matchMedia("(pointer: coarse)").matches,
});
root.dataset.platform = platform;
selectTab(platform === "ios" ? "ios" : "android");

if (window.matchMedia("(display-mode: standalone)").matches) markInstalled();

// --- Idioma -----------------------------------------------------------------

const initial = pickLang(readLang(), navigator.language);
// O HTML ja sai em ingles: trocar so quando precisa evita reescrever a pagina
// inteira no carregamento de quem le em ingles.
if (initial !== "en") setLang(initial);

for (const button of document.querySelectorAll<HTMLButtonElement>("[data-lang]")) {
  button.addEventListener("click", () => {
    const lang = button.dataset.lang === "pt" ? "pt" : "en";
    setLang(lang);
    saveLang(lang);
  });
}

for (const button of document.querySelectorAll<HTMLButtonElement>("[data-tab]")) {
  button.addEventListener("click", () => {
    selectTab(button.dataset.tab === "ios" ? "ios" : "android");
  });
}

// --- Instalacao -------------------------------------------------------------

const flow = createInstallFlow();

window.addEventListener("beforeinstallprompt", (event) => {
  flow.capture(event as InstallPromptEvent);
});
window.addEventListener("appinstalled", markInstalled);

const sheet = document.getElementById("donate") as HTMLDialogElement | null;

/** Sem prompt do navegador, a pagina ensina o caminho pelo menu. */
function showManualSteps(): void {
  const how = document.getElementById("how");
  if (!how) return;
  how.scrollIntoView({ behavior: "smooth", block: "start" });
  const panel = how.querySelector<HTMLElement>(".steps:not([hidden])");
  panel?.classList.remove("flash");
  // Reflow entre remover e recolocar a classe: sem ele a animacao nao reinicia
  // num segundo toque.
  void panel?.offsetWidth;
  panel?.classList.add("flash");
}

for (const button of document.querySelectorAll<HTMLButtonElement>("[data-install]")) {
  button.addEventListener("click", () => {
    // Sem <dialog> (navegador muito velho), a doacao sai do caminho: instalar
    // nunca depende de ver o convite.
    if (sheet && typeof sheet.showModal === "function") sheet.showModal();
    else void installNow();
  });
}

async function installNow(): Promise<void> {
  sheet?.close();
  const result = await flow.install();
  if (result === "accepted") markInstalled();
  else if (result === "manual") showManualSteps();
}

document.querySelector("[data-install-now]")?.addEventListener("click", () => {
  // O prompt() precisa deste clique como gesto do usuario: nada de await antes.
  void installNow();
});

sheet?.querySelector("[data-close]")?.addEventListener("click", () => sheet.close());
// Toque no fundo escurecido fecha. O ::backdrop nao e elemento: o clique nele
// chega com alvo no proprio <dialog> — mas o padding da folha tambem. So a
// posicao fora do retangulo separa um do outro.
sheet?.addEventListener("click", (event) => {
  if (event.target !== sheet) return;
  const r = sheet.getBoundingClientRect();
  const inside =
    event.clientX >= r.left &&
    event.clientX <= r.right &&
    event.clientY >= r.top &&
    event.clientY <= r.bottom;
  if (!inside) sheet.close();
});
