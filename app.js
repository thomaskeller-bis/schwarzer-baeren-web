/* =========================================================
   ZUM SCHWARZEN BÄREN – LOGIK
   Normalerweise musst du hier nichts ändern.
   Inhalte liegen in inhalt/projekte.json und inhalt/kontakt.json
   (bearbeitbar über die Admin-Seite Pages CMS oder direkt in der Datei)
   ========================================================= */

/* ZUFALL = true: Bei jedem Aufruf liegen die Projekte an einem neuen Ort.
   ZUFALL = false: Es gelten die festen POSITIONEN unten. */
const ZUFALL = true;
const ABSTAND = 48; // Mindestabstand zwischen zwei Projekten in Pixel

/* Feste Positionen (werden gebraucht, wenn ZUFALL = false ist
   oder wenn der Zufall keinen freien Platz findet).
   Wo die Projekte auf der Startseite liegen, in Prozent (x, y).
   Projekt 1 bekommt Position 1, Projekt 2 Position 2 usw.
   Für mehr Projekte einfach weitere Positionen anhängen. */
const POSITIONEN = [
  { x: 18, y: 30 },
  { x: 60, y: 32 },
  { x: 78, y: 72 },
  { x: 40, y: 70 },
  { x: 88, y: 28 },
  { x: 62, y: 82 },
  { x: 12, y: 80 },
  { x: 50, y: 50 }
];

/* Schweben: 2 = doppelt so weit und schnell wie die Grundwerte unten. Zum Ausprobieren ?schweben=1.5 usw. an die Adresse hängen */
const SCHWEBEN_FAKTOR = parseFloat(new URLSearchParams(location.search).get("schweben")) || 2;
const weiter = (v) => parseFloat(v) * SCHWEBEN_FAKTOR + (v.endsWith("deg") ? "deg" : "px");
const schneller = (v) => (parseFloat(v) / SCHWEBEN_FAKTOR).toFixed(1) + "s";

/* leichte Unterschiede, damit nicht alles gleich schwebt */
const SCHWEBEN = [
  { breite: "19vw", dx: "14px", dy: "-9px",  dr: "0.5deg",  dauer: "13s" },
  { breite: "15vw", dx: "-10px", dy: "12px", dr: "-0.7deg", dauer: "17s" },
  { breite: "16vw", dx: "9px",  dy: "11px",  dr: "0.4deg",  dauer: "15s" },
  { breite: "17vw", dx: "-12px", dy: "-8px", dr: "-0.5deg", dauer: "19s" },
  { breite: "15vw", dx: "11px", dy: "-12px", dr: "0.6deg",  dauer: "16s" },
  { breite: "18vw", dx: "-9px", dy: "10px",  dr: "-0.4deg", dauer: "14s" },
  { breite: "16vw", dx: "12px", dy: "9px",   dr: "0.5deg",  dauer: "18s" }
];

const $ = (sel) => document.querySelector(sel);
let PROJEKTE = [];
let KONTAKT = {};
let DANKE = {};
let sichtbare = [];   // Status "aktuell": schweben auf der Startseite
let archiv = [];      // Status "archiv": im Archiv
/* Status eines Projekts: "aktuell", "archiv" oder "offline" */
const status = (p) => p.status || (p.sichtbar === false ? "offline" : "aktuell");

/* Vorschau: Mit «?vorschau» hinter der Adresse erscheinen auch die Entwürfe
   (Status «offline») auf der Startseite, markiert mit «Entwurf».
   Der Link ist nirgends auf der Seite verlinkt. */
const VORSCHAU = new URLSearchParams(location.search).has("vorschau");
const entwurf = (p) => status(p) === "offline";
/* Ansicht: Mit «?ansicht» sieht man die Seite genau so, wie sie öffentlich wird
   (ohne Entwürfe), auch solange die Bald-Seite eingeschaltet ist. */
const ANSICHT = new URLSearchParams(location.search).has("ansicht");

/* Bildpfad: "/bilder/x.jpg" und "bilder/x.jpg" funktionieren beide */
/* Projektnummer: eigenes Feld "nummer" gilt fest, sonst automatisch nach Reihenfolge */
function nummer(p) {
  const eigene = String(p.nummer || "").trim();
  if (eigene) return eigene;
  // ohne eigene Nummer: fortlaufend nach der höchsten vergebenen Nummer
  const hoechste = Math.max(0, ...PROJEKTE.map((x) => parseInt(x.nummer, 10) || 0));
  const ohne = PROJEKTE.filter((x) => !String(x.nummer || "").trim() && status(x) !== "offline");
  const i = ohne.indexOf(p);
  return i >= 0 ? String(hoechste + i + 1).padStart(2, "0") : "";
}

const pfad = (src) => String(src || "").replace(/^\/+/, "");

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function absaetze(text) {
  return (text || "")
    .trim()
    .split(/\n\s*\n/)
    .map((a) => {
      a = a.trim();
      return a.startsWith("## ")
        ? `<h2 class="zwischentitel mono">${esc(a.slice(3))}</h2>`
        : `<p>${esc(a)}</p>`;
    })
    .join("");
}

/* Cover: echtes Bild oder Platzhalter */
function cover(p) {
  if (!p.cover) {
    return `<div class="bild platzhalter fotos">
      <span class="mono">Film läuft</span>
      <span class="mono gross">Fotos folgen</span>
    </div>`;
  }
  return `<img class="bild" src="${esc(pfad(p.cover))}" alt="${esc(p.titel)}">`;
}

/* ---------- Startseite ---------- */

function bauBuehne() {
  $("#buehne").innerHTML = sichtbare.map((p, i) => {
    const pos = POSITIONEN[i];
    const w = SCHWEBEN[i % SCHWEBEN.length];
    const nr = nummer(p);
    return `<div class="projekt ${i % 2 ? "rechts" : "links"}"
      style="left:${pos.x}%;top:${pos.y}%;--breite:${w.breite};--dx:${weiter(w.dx)};--dy:${weiter(w.dy)};--dr:${weiter(w.dr)};--dauer:${schneller(w.dauer)};--start:-${i * 3}s">
      <a href="#${esc(p.id)}">
        ${cover(p)}
        <span class="titel"><span>${esc(p.titel)}</span><span class="mono">${entwurf(p) ? "Entwurf" + (nr ? " · " + nr : "") : nr}</span></span>
      </a>
    </div>`;
  }).join("");
}

/* Zufällig verteilen, ohne dass sich Projekte überlappen */
function platziere() {
  const buehne = $("#buehne");
  if (!ZUFALL || matchMedia("(max-width: 720px)").matches) return;

  const B = buehne.getBoundingClientRect();
  const items = [...buehne.querySelectorAll(".projekt")];
  const masse = items.map((el) => el.getBoundingClientRect());

  for (let runde = 0; runde < 60; runde++) {
    const gesetzt = [];
    for (const m of masse) {
      let platz = null;
      for (let versuch = 0; versuch < 200 && !platz; versuch++) {
        const x = m.width / 2 + Math.random() * Math.max(0, B.width - m.width);
        const y = m.height / 2 + Math.random() * Math.max(0, B.height - m.height);
        const frei = gesetzt.every((g) =>
          Math.abs(g.x - x) > (g.w + m.width) / 2 + ABSTAND ||
          Math.abs(g.y - y) > (g.h + m.height) / 2 + ABSTAND);
        if (frei) platz = { x, y, w: m.width, h: m.height };
      }
      if (!platz) break;
      gesetzt.push(platz);
    }
    if (gesetzt.length === items.length) {
      items.forEach((el, i) => {
        el.style.left = (gesetzt[i].x / B.width) * 100 + "%";
        el.style.top = (gesetzt[i].y / B.height) * 100 + "%";
      });
      return;
    }
  }
  /* kein Platz gefunden: feste Positionen bleiben */
}

/* erst verteilen, wenn die Bilder geladen sind (dann stimmen die Grössen) */
function verteileWennBereit() {
  const buehne = $("#buehne");
  const zeigen = () => buehne.classList.add("bereit");
  const bilder = [...buehne.querySelectorAll("img")];
  Promise.all(bilder.map((img) =>
    img.complete ? null : new Promise((ok) => { img.onload = img.onerror = ok; })
  )).then(() => { platziere(); zeigen(); });
  setTimeout(zeigen, 2500); // Sicherheit: nach 2.5 s auf jeden Fall zeigen

  let timer;
  window.addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(platziere, 300);
  });
}

/* ---------- Detailansicht ---------- */

let letzterFokus = null;

function listenHtml(listen) {
  return (listen || [])
    .map((l) => `<div class="liste">
        <h2 class="mono">${esc(l.titel)}</h2>
        <dl>${(l.eintraege || [])
          .map((e) => `<div class="zeile"><dt>${e.link
            ? `<a href="${esc(e.link)}" target="_blank" rel="noopener">${esc(e.name)}</a>`
            : esc(e.name)}</dt><dd>${esc(e.rolle || "")}</dd></div>`)
          .join("")}</dl>
      </div>`)
    .join("");
}

function oeffneDanke() {
  zeigeDetail(`
    <div class="archiv danke">
      <h1>${esc(DANKE.titel || "Danke")}</h1>
      <p class="unter">${esc(DANKE.intro || "")}</p>
      <div class="danke-gruppen">${listenHtml(DANKE.gruppen)}</div>
    </div>`, DANKE.titel || "Danke");
}

/* Impressum & Datenschutz (Angaben aus dem Handelsregister Basel-Stadt) */
function oeffneImpressum() {
  zeigeDetail(`
    <div class="archiv impressum">
      <h1>Impressum &amp; Datenschutz</h1>
      <div class="liste"><h2 class="mono">Betrieb</h2>
        <p>Zum Schwarzen Bären wird betrieben von der</p>
        <p><a href="https://www.baerimschafspelz.ch" target="_blank" rel="noopener">Bär im Schafspelz GmbH</a><br>
        Sperrstrasse 91, 4057 Basel<br>
        <a href="mailto:info@baerimschafspelz.ch">info@baerimschafspelz.ch</a><br>
        UID: CHE-390.420.636</p>
        <p>Geschäftsführung: Christoph Schön (Vorsitz), Nora Garberson, Valentin Ismail, Thomas Keller</p>
        <p>Mehr über uns: <a href="https://www.baerimschafspelz.ch" target="_blank" rel="noopener">baerimschafspelz.ch</a></p>
      </div>
      <div class="liste"><h2 class="mono">Datenschutz</h2>
        <p>Verantwortlich ist die Bär im Schafspelz GmbH, Adresse oben.</p>
        <p>Wir sammeln über diese Seite keine Daten über euch. Es gibt keine Cookies, kein Tracking und keine eingebundenen Dienste von Dritten. Die Schriften liegen auf unserem eigenen Server.</p>
        <p>Die Seite wird bei Vercel Inc. gehostet. Beim Aufruf speichert Vercel technisch notwendige Angaben wie IP-Adresse und Zeitpunkt, um die Seite auszuliefern und vor Missbrauch zu schützen.</p>
        <p>Wenn ihr uns eine Mail schreibt, verwenden wir eure Angaben nur, um zu antworten. Unsere Mails laufen über Google Workspace.</p>
        <p>Fragen dazu: <a href="mailto:info@baerimschafspelz.ch">info@baerimschafspelz.ch</a></p>
      </div>
    </div>`, "Impressum & Datenschutz");
}

function zeigeDetail(html, titel) {
  $("#detail-inhalt").innerHTML = html;
  const detail = $("#detail");
  if (detail.hidden) letzterFokus = document.activeElement;
  detail.hidden = false;
  detail.scrollTop = 0;
  document.body.style.overflow = "hidden";
  document.title = `${titel} · ${KONTAKT.name}`;
  $("#zurueck").focus({ preventScroll: true });
}

function oeffneArchiv() {
  const zeilen = archiv.map((p) => `
    <a class="archiv-zeile" href="#${esc(p.id)}">
      ${p.cover ? `<img src="${esc(pfad(p.cover))}" alt="">` : `<span class="archiv-leer"></span>`}
      <span class="archiv-titel">${nummer(p) ? `<span class="mono archiv-nr">${esc(nummer(p))}</span>` : ""}${esc(p.titel)}</span>
      <span class="archiv-unter">${esc(p.untertitel || "")}</span>
    </a>`).join("");
  zeigeDetail(`
    <div class="archiv">
      <h1>Archiv</h1>
      <p class="unter">Was wir schon gemacht haben.</p>
      <div class="archiv-liste">${zeilen}</div>
    </div>`, "Archiv");
}

function oeffne(p) {
  const imArchiv = status(p) === "archiv";
  const nr = nummer(p);

  const liste = listenHtml(p.listen);
  const insta = p.instagram
    ? `<p class="insta"><a href="${esc(p.instagram)}" target="_blank" rel="noopener">Mehr dazu auf Instagram</a></p>`
    : "";

  const bilder = p.bilder && p.bilder.length
    ? p.bilder
        .map((b, i) => `<figure>
          <img src="${esc(pfad(b.bild))}" alt="${esc(b.text || p.titel + " " + (i + 1))}" loading="lazy">
          <figcaption class="mono"><span>${nr ? nr + "–" : ""}${String(i + 1).padStart(2, "0")}</span>${b.text ? `<span>${esc(b.text)}</span>` : ""}</figcaption>
        </figure>`)
        .join("")
    : `<figure>${cover({ ...p, cover: "" })}</figure>`;

  zeigeDetail(`
    <div class="detail-text">
      <p class="mono" style="color:var(--grau);margin:0 0 14px">${imArchiv
        ? `<a href="#archiv">Archiv</a>${nr ? " · " + esc(nr) : ""}`
        : entwurf(p) ? `Entwurf, nicht öffentlich${nr ? " · " + esc(nr) : ""}`
        : `Projekt ${esc(nr)}`}</p>
      <h1>${esc(p.titel)}</h1>
      <p class="unter">${esc(p.untertitel || "")}</p>
      ${absaetze(p.text)}
      ${insta}
      ${liste}
    </div>
    <div class="detail-bilder">${bilder}</div>`, p.titel);
}

function schliesse() {
  $("#detail").hidden = true;
  document.body.style.overflow = "";
  document.title = KONTAKT.name;
  if (letzterFokus) letzterFokus.focus({ preventScroll: true });
}

function route() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (id === "archiv" && archiv.length) return oeffneArchiv();
  if (id === "impressum") return oeffneImpressum();
  if (id === "danke" && DANKE.gruppen && DANKE.gruppen.length) return oeffneDanke();
  const p = [...sichtbare, ...archiv].find((x) => x.id === id);
  p ? oeffne(p) : schliesse();
}

/* ---------- Start ---------- */

function zeigeBald() {
  document.title = KONTAKT.name;
  const zeilen = String(KONTAKT.bald_text || "Wir sind bald online.").trim().split(/\n\s*\n/)
    .map((t) => `<p>${esc(t).replace(/\n/g, "<br>")}</p>`).join("");
  document.body.innerHTML = `
    <main class="bald">
      <p class="wortmarke">${esc(KONTAKT.name)}</p>
      <div class="bald-text">${zeilen}</div>
      <p class="mono">${esc(KONTAKT.adresse || "")}</p>
    </main>`;
}

async function start() {
  const laden = (datei) => fetch(datei, { cache: "no-cache" }).then((r) => r.json());
  let pj;
  [pj, KONTAKT, DANKE] = await Promise.all([
    laden("inhalt/projekte.json"),
    laden("inhalt/kontakt.json"),
    laden("inhalt/danke.json").catch(() => ({}))
  ]);
  PROJEKTE = Array.isArray(pj) ? pj : pj.projekte || [];

  /* «Bald online»: Solange im Admin unter Kontakt «Bald-Seite» eingeschaltet ist,
     sehen Besucher*innen nur einen kurzen Gruss. Mit ?vorschau sieht man die ganze Seite. */
  if (KONTAKT.bald && !VORSCHAU && !ANSICHT) return zeigeBald();
  if (ANSICHT && KONTAKT.bald) document.head.insertAdjacentHTML("beforeend", '<meta name="robots" content="noindex">');
  sichtbare = PROJEKTE.filter((p) => status(p) === "aktuell" || (VORSCHAU && entwurf(p))).slice(0, POSITIONEN.length);
  if (VORSCHAU) {
    document.body.classList.add("vorschau");
    document.querySelector('meta[name="robots"]') || document.head.insertAdjacentHTML("beforeend", '<meta name="robots" content="noindex">');
  }
  archiv = PROJEKTE.filter((p) => status(p) === "archiv");
  $("#archiv-link").hidden = archiv.length === 0;
  const dankeLink = $("#danke-link");
  dankeLink.hidden = !(DANKE.gruppen && DANKE.gruppen.length);
  if (DANKE.titel) dankeLink.textContent = DANKE.titel;

  bauBuehne();
  verteileWennBereit();
  document.querySelectorAll("[data-name]").forEach((el) => (el.textContent = KONTAKT.name));
  $("#adresse").textContent = KONTAKT.adresse;
  if (KONTAKT.untertitel) $("#untertitel").textContent = KONTAKT.untertitel;
  $("#hinweis").textContent = KONTAKT.hinweis || "";
  const mail = $("#mail");
  mail.textContent = KONTAKT.mail;
  mail.href = "mailto:" + KONTAKT.mail;
  const ig = $("#instagram");
  if (KONTAKT.instagram) { ig.href = KONTAKT.instagram; ig.hidden = false; }

  $("#zurueck").addEventListener("click", () => {
    try { history.pushState("", document.title, location.pathname + location.search); }
    catch (e) { location.hash = ""; }
    route();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$("#detail").hidden) $("#zurueck").click();
  });
  window.addEventListener("hashchange", route);
  window.addEventListener("popstate", route);
  route();
}

start();
