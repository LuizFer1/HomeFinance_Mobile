export type Lang = "en" | "pt";

/** Mesmo prefixo `hf:` das outras preferencias do app nesta origem. */
export const LANG_KEY = "hf:lang";

const en = {
  "hero.eyebrow": "No account · No email · No spam",
  "hero.t1": "Your money.",
  "hero.t2": "Your phone.",
  "hero.t3": "Your email",
  "hero.t4": "Nobody's business.",
  "hero.lead":
    "A personal finance app that works offline and keeps every number on your device. Nothing to sign up for.",
  "cta.install": "Install app",
  "cta.browser": "Open in browser",
  "cta.open": "Open app",
  "hero.meta": "Free · Android and iPhone",
  "desk.lead":
    "HomeFinance is made for your phone. Scan the code with your camera to open this page there and install it.",
  "desk.note": "Made for phones: there's nothing to install on a computer.",
  "desk.qr": "QR code with the address of this page",
  "preview.label": "This month",
  "preview.balance": "$2,988",
  "preview.salary": "Salary",
  "preview.salaryValue": "+ $5,200",
  "preview.groceries": "Groceries",
  "preview.groceriesValue": "− $412",
  "preview.rent": "Rent",
  "preview.rentValue": "− $1,800",
  "story.title": "Why I built it",
  "story.quote":
    "I got tired of creating an account for everything and watching my inbox turn into a spam dump. So I built a finance app that just… doesn't ask.",
  "story.by": "— the developer",
  "feat.title": "What you get",
  "feat.account": "No account, ever",
  "feat.accountText": "Open it and start. No email, no password, no “verify your address”.",
  "feat.offline": "Works offline",
  "feat.offlineText": "No signal at the supermarket? Doesn't matter.",
  "feat.data": "Your data stays here",
  "feat.dataText": "No server, no tracking, no analytics.",
  "feat.light": "Tiny and fast",
  "feat.lightText": "Installs in seconds and opens instantly.",
  "steps.title": "Install in 10 seconds",
  "steps.android1": "Open this page in Chrome",
  "steps.android2": "Tap the ⋮ menu",
  "steps.android3": "Tap “Install app” (or “Add to Home screen”)",
  "steps.ios1": "Open this page in Safari",
  "steps.ios2": "Tap Share",
  "steps.ios3": "Tap “Add to Home Screen”",
  "faq.title": "Questions",
  "faq.freeQ": "Is it really free?",
  "faq.freeA":
    "Yes. No ads, no paid plan, no selling your data. If you want to help, there's an optional coffee.",
  "faq.lostQ": "What if I lose my phone?",
  "faq.lostA":
    "Your data only exists on your phone, so it goes with it. Backup and export are on the way.",
  "faq.storeQ": "Why isn't it in the app stores?",
  "faq.storeA":
    "It's a web app (PWA): it installs straight from the browser, needs no store account and updates itself.",
  "faq.twoQ": "Can I use it on two phones?",
  "faq.twoA":
    "For now each phone keeps its own data. Optional sync through your own computer, never a company's server, is on the way.",
  "foot.made": "Made by one tired inbox owner",
  "foot.coffee": "Buy me a coffee",
  "foot.source": "Source on GitHub",
  "sheet.title": "Before you install…",
  "sheet.body":
    "Like the idea of an app with no account and no spam? It's free and will stay that way. If you'd like to help, a coffee keeps the project going.",
  "sheet.coffee": "Buy me a coffee",
  "sheet.install": "Install without donating",
  "sheet.note": "Donating is optional. Installing never depends on it.",
  "sheet.close": "Close",
} as const;

export type MessageKey = keyof typeof en;

const pt: Record<MessageKey, string> = {
  "hero.eyebrow": "Sem conta · Sem e-mail · Sem spam",
  "hero.t1": "Seu dinheiro.",
  "hero.t2": "Seu celular.",
  "hero.t3": "Seu e-mail",
  "hero.t4": "Não é da conta de ninguém.",
  "hero.lead":
    "Um app de finanças pessoais que funciona offline e guarda cada número no seu aparelho. Nada para cadastrar.",
  "cta.install": "Instalar app",
  "cta.browser": "Usar no navegador",
  "cta.open": "Abrir o app",
  "hero.meta": "Grátis · Android e iPhone",
  "desk.lead":
    "O HomeFinance foi feito para o celular. Aponte a câmera para o código, abra esta página lá e instale.",
  "desk.note": "Feito para celular: não há o que instalar no computador.",
  "desk.qr": "QR Code com o endereço desta página",
  "preview.label": "Este mês",
  "preview.balance": "R$ 2.988",
  "preview.salary": "Salário",
  "preview.salaryValue": "+ R$ 5.200",
  "preview.groceries": "Mercado",
  "preview.groceriesValue": "− R$ 412",
  "preview.rent": "Aluguel",
  "preview.rentValue": "− R$ 1.800",
  "story.title": "Por que eu fiz isso",
  "story.quote":
    "Cansei de criar conta para tudo e ver minha caixa de e-mail virar depósito de spam. Então fiz um app de finanças que simplesmente… não pede.",
  "story.by": "— o desenvolvedor",
  "feat.title": "O que você ganha",
  "feat.account": "Sem conta, nunca",
  "feat.accountText": "Abra e comece. Sem e-mail, sem senha, sem “confirme seu endereço”.",
  "feat.offline": "Funciona offline",
  "feat.offlineText": "Sem sinal no mercado? Não faz diferença.",
  "feat.data": "Seus dados ficam aqui",
  "feat.dataText": "Sem servidor, sem rastreio, sem analytics.",
  "feat.light": "Leve e rápido",
  "feat.lightText": "Instala em segundos e abre na hora.",
  "steps.title": "Instale em 10 segundos",
  "steps.android1": "Abra esta página no Chrome",
  "steps.android2": "Toque no menu ⋮",
  "steps.android3": "Toque em “Instalar app” (ou “Adicionar à tela inicial”)",
  "steps.ios1": "Abra esta página no Safari",
  "steps.ios2": "Toque em Compartilhar",
  "steps.ios3": "Toque em “Adicionar à Tela de Início”",
  "faq.title": "Perguntas",
  "faq.freeQ": "É grátis mesmo?",
  "faq.freeA":
    "Sim. Sem anúncios, sem plano pago, sem venda de dados. Se quiser ajudar, tem um café opcional.",
  "faq.lostQ": "E se eu perder o celular?",
  "faq.lostA":
    "Seus dados só existem no seu celular, então vão junto com ele. Backup e exportação estão a caminho.",
  "faq.storeQ": "Por que não está na loja de apps?",
  "faq.storeA":
    "É um app web (PWA): instala direto do navegador, não pede conta na loja e se atualiza sozinho.",
  "faq.twoQ": "Posso usar em dois celulares?",
  "faq.twoA":
    "Por enquanto cada celular guarda os próprios dados. A sincronização opcional pelo seu próprio computador, nunca pelo servidor de uma empresa, está a caminho.",
  "foot.made": "Feito por alguém cansado de spam",
  "foot.coffee": "Me pague um café",
  "foot.source": "Código no GitHub",
  "sheet.title": "Antes de instalar…",
  "sheet.body":
    "Gostou da ideia de um app sem conta e sem spam? Ele é gratuito e vai continuar assim. Se quiser ajudar, um café mantém o projeto andando.",
  "sheet.coffee": "Me pague um café",
  "sheet.install": "Instalar sem doar",
  "sheet.note": "Doar é opcional. A instalação nunca depende disso.",
  "sheet.close": "Fechar",
};

export const messages: Record<Lang, Record<MessageKey, string>> = { en, pt };

export function isMessageKey(key: string): key is MessageKey {
  return key in en;
}

/**
 * Escolha salva vence; depois o idioma do navegador; ingles e o padrao. So
 * "pt*" vira portugues — um navegador em espanhol le melhor ingles do que
 * portugues de Portugal fingindo ser neutro.
 */
export function pickLang(stored: string | null, browserLang: string | undefined): Lang {
  if (stored === "en" || stored === "pt") return stored;
  return browserLang?.toLowerCase().startsWith("pt") ? "pt" : "en";
}

/**
 * Troca o texto de todo elemento marcado. `data-i18n` troca o conteudo,
 * `data-i18n-label` o `aria-label`, `data-i18n-alt` o `alt`. So texto puro —
 * nunca innerHTML, entao nada aqui vira marcacao.
 */
export function applyLang(root: Document, lang: Lang): void {
  const dict = messages[lang];
  root.documentElement.lang = lang === "pt" ? "pt-BR" : "en";

  const swap = (attr: string, write: (el: Element, text: string) => void) => {
    for (const el of root.querySelectorAll(`[${attr}]`)) {
      const key = el.getAttribute(attr);
      if (key && isMessageKey(key)) write(el, dict[key]);
    }
  };
  swap("data-i18n", (el, text) => {
    el.textContent = text;
  });
  swap("data-i18n-label", (el, text) => {
    el.setAttribute("aria-label", text);
  });
  swap("data-i18n-alt", (el, text) => {
    el.setAttribute("alt", text);
  });
}
