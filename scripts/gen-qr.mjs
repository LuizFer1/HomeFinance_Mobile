/**
 * Gera `public/img/landing-qr.svg`: o QR Code que a landing mostra no computador,
 * apontando para ela mesma, para a pessoa abrir no celular.
 *
 * Gerado uma vez e commitado, como os icones: a URL e fixa, entao nao ha motivo
 * para a pagina carregar um codificador de QR, nem para chamar um servico externo
 * de QR — que veria cada visita. Rodar de novo so se a URL mudar:
 * `node scripts/gen-qr.mjs`.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";

export const LANDING_URL = "https://luizfer1.github.io/HomeFinance_Mobile/";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", "img", "landing-qr.svg");

// Modulos escuros sobre branco, com margem: leitor de camera precisa de
// contraste alto e da "zona quieta" em volta; o fundo Nocturne da pagina nao
// serve de margem.
const svg = await QRCode.toString(LANDING_URL, {
  type: "svg",
  errorCorrectionLevel: "M",
  margin: 2,
  color: { dark: "#161826", light: "#ffffff" },
});

// <title> para quem abre o SVG sozinho; na pagina o texto alternativo e o `alt`
// traduzido do <img>.
writeFileSync(out, svg.replace(/<svg([^>]*)>/, `<svg$1><title>QR code: ${LANDING_URL}</title>`));
console.log(`QR de ${LANDING_URL} gravado em ${out}`);
