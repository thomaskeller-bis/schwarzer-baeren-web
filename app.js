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
let PROGRAMM = {};
let PRESSE = {};
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

/* ---------- Sprache Deutsch / Englisch ----------
   Jedes Textfeld kann eine englische Fassung im Feld «…_en» haben (z.B. titel_en).
   Fehlt sie, erscheint der deutsche Text. Der Schalter «EN / DE» oben rechts merkt sich die Wahl.
   Öffentlich erst, wenn im Admin unter Kontakt «Englisch zeigen» an ist (in ?vorschau/?ansicht immer).
   Zum Testen: ?lang=en oder ?lang=de */
function gewaehlteSprache() {
  const q = new URLSearchParams(location.search).get("lang");
  if (q === "en" || q === "de") return q;
  try { return localStorage.getItem("sprache") === "en" ? "en" : "de"; } catch (e) { return "de"; }
}
let EN = false;
/* ersetzt überall feld durch feld_en, wenn es eine englische Fassung gibt */
function aufEnglisch(o) {
  if (Array.isArray(o)) { o.forEach(aufEnglisch); return o; }
  if (o && typeof o === "object") {
    Object.keys(o).forEach((k) => {
      if (k.endsWith("_en")) {
        const v = o[k];
        if (v !== "" && v != null) o[k.slice(0, -3)] = v;
      } else aufEnglisch(o[k]);
    });
  }
  return o;
}
/* feste Texte der Seite: [Deutsch, Englisch] */
const TEXTE = {
  film: ["Film läuft", "Film is rolling"],
  fotos: ["Fotos folgen", "Photos to follow"],
  entwurf: ["Entwurf", "Draft"],
  entwurfLang: ["Entwurf, nicht öffentlich", "Draft, not public"],
  projekt: ["Projekt", "Project"],
  archiv: ["Archiv", "Archive"],
  archivUnter: ["Was wir schon gemacht haben.", "What we have done so far."],
  instagram: ["Mehr dazu auf Instagram", "More on Instagram"],
  musik: ["Musik anhören", "Listen to the music"],
  filmAnsehen: ["Film ansehen", "Watch the film"],
  player: ["Beim Klick lädt der Player von", "Clicking loads the player from"],
  programm: ["Programm", "Programme"],
  presse: ["Presse", "Press"],
  danke: ["Danke", "Thanks"],
  zurueck: ["Zurück zur Übersicht", "Back to overview"],
  impressum: ["Impressum", "Imprint"],
  nlTitel: ["Post vom Bären", "Post from the Bear"],
  nlUnter: ["Nicht oft, nur wenn es etwas zu erzählen gibt", "Not often, only when there is something to tell"],
  nlText: ["Wir schreiben dir, wenn etwas Neues entsteht: Projekte, Anlässe, die Eröffnung.", "We write to you when something new is happening: projects, events, the opening."],
  anmeldung: ["Anmeldung", "Sign up"],
  vorname: ["Vorname", "First name"],
  name: ["Name", "Last name"],
  mail: ["E-Mail", "Email"],
  anmelden: ["Anmelden", "Subscribe"],
  nichtVerbunden: ["Noch nicht verbunden: Im Admin unter Kontakt die Formular-Adresse eintragen.", "Not connected yet: enter the form address in the admin under Kontakt."],
  abmelden: ["Abmelden kannst du dich jederzeit über den Link in jedem Newsletter. Mehr dazu unter", "You can unsubscribe at any time via the link in every newsletter. More under"],
  datenschutz: ["Datenschutz", "Privacy"],
  pruefen: ["Bitte Vorname und eine gültige E-Mail-Adresse angeben.", "Please enter your first name and a valid email address."],
  sendet: ["Wird gesendet …", "Sending …"],
  fehler: ["Das hat leider nicht geklappt. Versuch es später nochmals oder schreib uns.", "Sorry, that didn't work. Please try again later or write to us."],
  schonDa: ["Diese Adresse ist schon angemeldet.", "This address is already subscribed."],
  anbieter: ["unserem Newsletter-Anbieter", "our newsletter provider"],
  bald: ["Wir sind bald online.", "We will be online soon."],
  zurTag: ["Zur Tag-Version", "Switch to day version"],
  zurNacht: ["Zur Nacht-Version", "Switch to night version"]
};
const tx = (k) => TEXTE[k][EN ? 1 : 0];

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

/* Links im Text: [Text](https://…) */
function links(s) {
  return s
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\[([^\]]+)\]\((#[a-z0-9-]+)\)/g, '<a href="$2">$1</a>');   /* Link auf ein anderes Projekt, z.B. (#tapas) */
}

function absaetze(text) {
  return (text || "")
    .trim()
    .split(/\n\s*\n/)
    .map((a) => {
      a = a.trim();
      return a.startsWith("## ")
        ? `<h2 class="zwischentitel mono">${esc(a.slice(3))}</h2>`
        : `<p>${links(esc(a))}</p>`;
    })
    .join("");
}

/* Cover: echtes Bild oder Platzhalter */
/* Video statt Titelbild: läuft stumm in Schleife. Das Titelbild dient als Vorschaubild. */
const RUHIG = matchMedia("(prefers-reduced-motion: reduce)").matches;
function videoHtml(src, poster, klasse) {
  return `<video class="${klasse}" src="${esc(pfad(src))}"${poster ? ` poster="${esc(pfad(poster))}"` : ""}
    width="720" height="900" muted loop playsinline preload="metadata"${RUHIG ? " controls" : " autoplay"}></video>`;
}

/* Safari startet Videos, die per JavaScript eingefügt werden, oft nicht von selbst.
   Darum: stumm schalten und aktiv starten, sonst beim ersten Tippen/Scrollen nochmals versuchen. */
function starteVideos(root = document) {
  if (RUHIG) return;
  const videos = [...root.querySelectorAll("video[autoplay]")];
  const los = () => videos.forEach((v) => {
    v.muted = true; v.defaultMuted = true; v.playsInline = true;
    const p = v.play(); if (p && p.catch) p.catch(() => {});
  });
  los();
  ["pointerdown", "touchstart", "scroll", "keydown"].forEach((e) =>
    window.addEventListener(e, los, { once: true, passive: true }));
}

function cover(p) {
  if (p.video) return videoHtml(p.video, p.cover, "bild");
  if (!p.cover) {
    return `<div class="bild platzhalter fotos">
      <span class="mono">${tx("film")}</span>
      <span class="mono gross">${tx("fotos")}</span>
    </div>`;
  }
  return `<img class="bild" src="${esc(pfad(p.cover))}" alt="${esc(p.titel)}">`;
}

/* ---------- Startseite ---------- */

/* Newsletter als Kachel zwischen den Projekten: öffentlich nur, wenn im Admin
   «Newsletter als Kachel auf der Startseite» an ist (in ?vorschau/?ansicht immer) */
function newsletterKachel() {
  const K = KONTAKT;
  if (!(K.newsletter || VORSCHAU || ANSICHT)) return null;
  if (!(K.newsletter_kachel || VORSCHAU || ANSICHT)) return null;
  const bild = K.newsletter_bild
    ? `<img class="bild" src="${esc(pfad(K.newsletter_bild))}" alt="${esc(K.newsletter_titel || "Newsletter")}">`
    : `<div class="bild platzhalter brief"><span class="gross">${esc(K.newsletter_uebertitel || "Newsletter")}</span></div>`;
  return { id: "newsletter", bild, titel: K.newsletter_bild ? K.newsletter_uebertitel || "Newsletter" : "", rechts: "", klasse: K.newsletter_bild ? "" : "punkt" };
}

function bauBuehne() {
  const kacheln = sichtbare.map((p) => {
    const nr = nummer(p);
    return { id: p.id, bild: cover(p), titel: p.titel, rechts: entwurf(p) ? tx("entwurf") + (nr ? " · " + nr : "") : nr };
  });
  const nl = newsletterKachel();
  if (nl) kacheln.push(nl);
  $("#buehne").innerHTML = kacheln.map((k, i) => {
    const pos = POSITIONEN[i % POSITIONEN.length];
    const w = SCHWEBEN[i % SCHWEBEN.length];
    /* der Newsletter-Punkt saust viermal so schnell herum (doppelte Strecke in halber Zeit) */
    const f = k.klasse === "punkt" ? 2 : 1;
    const strecke = (v) => parseFloat(weiter(v)) * f + (v.endsWith("deg") ? "deg" : "px");
    const zeit = (v) => (parseFloat(schneller(v)) / f).toFixed(1) + "s";
    return `<div class="projekt ${i % 2 ? "rechts" : "links"} ${k.klasse || ""}"
      style="left:${pos.x}%;top:${pos.y}%;--breite:${w.breite};--dx:${strecke(w.dx)};--dy:${strecke(w.dy)};--dr:${weiter(w.dr)};--dauer:${zeit(w.dauer)};--start:-${i * 3}s">
      <a href="#${esc(k.id)}">
        ${k.bild}
        ${k.titel ? `<span class="titel"><span>${esc(k.titel)}</span><span class="mono">${esc(k.rechts)}</span></span>` : ""}
      </a>
    </div>`;
  }).join("");
}

/* Zufällig verteilen, ohne dass sich Projekte überlappen */
function platziere() {
  const buehne = $("#buehne");
  if (!ZUFALL || matchMedia("(max-width: 720px), (max-height: 560px)").matches) return;

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
            ? String(e.link).startsWith("#")
              ? `<a href="${esc(e.link)}">${esc(e.name)}</a>`
              : `<a href="${esc(e.link)}" target="_blank" rel="noopener">${esc(e.name)}</a>`
            : esc(e.name)}</dt><dd>${esc(e.rolle || "")}</dd></div>`)
          .join("")}</dl>
      </div>`)
    .join("");
}

/* Programm: was als Nächstes ansteht (inhalt/programm.json).
   Termine mit «bis»-Datum verschwinden am Tag danach von selbst.
   Öffentlich erst, wenn im Admin «Programm öffentlich zeigen» an ist (in ?vorschau/?ansicht immer). */
function programmTermine() {
  const heute = new Date().toISOString().slice(0, 10);
  return (PROGRAMM.termine || []).filter((t) => t.titel && (!t.bis || String(t.bis).slice(0, 10) >= heute));
}
const programmSichtbar = () => programmTermine().length > 0 && (PROGRAMM.zeigen || VORSCHAU || ANSICHT);

function oeffneProgramm() {
  const zeilen = programmTermine().map((t) => {
    const p = t.projekt && [...sichtbare, ...archiv].find((x) => x.id === t.projekt);
    const inhalt = `
      <span class="programm-wann">${esc(t.wann || "")}</span>
      <span class="archiv-titel">${esc(t.titel)}</span>
      <span class="archiv-unter">${esc(t.info || "")}</span>`;
    return p
      ? `<a class="programm-zeile" href="#${esc(p.id)}">${inhalt}</a>`
      : `<div class="programm-zeile">${inhalt}</div>`;
  }).join("");
  zeigeDetail(`
    <div class="archiv programm">
      <h1>${esc(PROGRAMM.titel || tx("programm"))}</h1>
      <p class="unter">${esc(PROGRAMM.intro || "")}</p>
      <div class="archiv-liste">${zeilen}</div>
    </div>`, PROGRAMM.titel || tx("programm"));
}

/* Presse: Medienberichte (inhalt/presse.json), neueste zuerst, Links öffnen den Artikel.
   Öffentlich erst mit «zeigen» (in ?vorschau/?ansicht immer). */
const presseBerichte = () => (PRESSE.berichte || []).filter((b) => b.titel && b.link)
  .sort((a, b) => String(b.datum || "").localeCompare(String(a.datum || "")));
const presseSichtbar = () => presseBerichte().length > 0 && (PRESSE.zeigen || VORSCHAU || ANSICHT);
function datumKurz(iso) {
  const m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return String(iso || "");
  return EN ? `${+m[3]} ${["January","February","March","April","May","June","July","August","September","October","November","December"][+m[2] - 1]} ${m[1]}` : `${+m[3]}.${+m[2]}.${m[1]}`;
}
function oeffnePresse() {
  const zeilen = presseBerichte().map((b) => `
    <a class="programm-zeile" href="${esc(b.link)}" target="_blank" rel="noopener">
      <span class="programm-wann">${esc(datumKurz(b.datum))} · ${esc(b.medium || "")}</span>
      <span class="archiv-titel">${esc(b.titel)}</span>
      <span class="archiv-unter">${esc(b.text || "")}</span>
    </a>`).join("");
  zeigeDetail(`
    <div class="archiv programm">
      <h1>${esc(PRESSE.titel || tx("presse"))}</h1>
      <p class="unter">${esc(PRESSE.intro || "")}</p>
      <div class="archiv-liste">${zeilen}</div>
    </div>`, PRESSE.titel || tx("presse"));
}

function oeffneDanke() {
  zeigeDetail(`
    <div class="archiv danke">
      <h1>${esc(DANKE.titel || tx("danke"))}</h1>
      <p class="unter">${esc(DANKE.intro || "")}</p>
      <div class="danke-gruppen">${listenHtml(DANKE.gruppen)}</div>
    </div>`, DANKE.titel || tx("danke"));
}

/* Impressum & Datenschutz (Angaben aus dem Handelsregister Basel-Stadt) */
function oeffneImpressum() {
  if (EN) return oeffneImpressumEn();
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
        <p>Wir sammeln über diese Seite keine Daten über euch, ausser ihr meldet euch für den Newsletter an. Es gibt keine Cookies und kein Tracking. Die Schriften liegen auf unserem eigenen Server.</p>
        <p>Musik und Filme: Auf einigen Projektseiten gibt es Musik von Spotify und Filme von YouTube. Diese Player laden erst, wenn ihr auf den Play-Knopf klickt. Erst dann werden Daten (zum Beispiel eure IP-Adresse) an Spotify oder YouTube (Google) übertragen, und diese können Cookies setzen. Es gelten die Datenschutzbestimmungen von <a href="https://www.spotify.com/ch-de/legal/privacy-policy/" target="_blank" rel="noopener">Spotify</a> und <a href="https://policies.google.com/privacy?hl=de" target="_blank" rel="noopener">Google</a>.</p>
        ${KONTAKT.newsletter ? `<p>Newsletter: Wenn ihr euch anmeldet, speichern wir Vorname, Name und E-Mail-Adresse bei ${esc(newsletterAnbieter())}, nur um euch den Newsletter zu schicken.${newsletterAnbieter() === "MailerLite" ? " MailerLite speichert die Daten in der EU." : ""} Abmelden könnt ihr euch jederzeit über den Link in jedem Newsletter, dann löschen wir eure Angaben.</p>` : ""}
        <p>Die Seite wird bei Vercel Inc. gehostet. Beim Aufruf speichert Vercel technisch notwendige Angaben wie IP-Adresse und Zeitpunkt, um die Seite auszuliefern und vor Missbrauch zu schützen.</p>
        <p>Wenn ihr uns eine Mail schreibt, verwenden wir eure Angaben nur, um zu antworten. Unsere Mails laufen über Google Workspace.</p>
        <p>Fragen dazu: <a href="mailto:info@baerimschafspelz.ch">info@baerimschafspelz.ch</a></p>
      </div>
    </div>`, "Impressum & Datenschutz");
}

function oeffneImpressumEn() {
  zeigeDetail(`
    <div class="archiv impressum">
      <h1>Imprint &amp; privacy</h1>
      <div class="liste"><h2 class="mono">Operator</h2>
        <p>Zum Schwarzen Bären is run by</p>
        <p><a href="https://www.baerimschafspelz.ch" target="_blank" rel="noopener">Bär im Schafspelz GmbH</a><br>
        Sperrstrasse 91, 4057 Basel, Switzerland<br>
        <a href="mailto:info@baerimschafspelz.ch">info@baerimschafspelz.ch</a><br>
        UID: CHE-390.420.636</p>
        <p>Management: Christoph Schön (chair), Nora Garberson, Valentin Ismail, Thomas Keller</p>
        <p>More about us: <a href="https://www.baerimschafspelz.ch" target="_blank" rel="noopener">baerimschafspelz.ch</a></p>
      </div>
      <div class="liste"><h2 class="mono">Privacy</h2>
        <p>The controller is Bär im Schafspelz GmbH, address above.</p>
        <p>We do not collect any data about you through this site unless you sign up for the newsletter. There are no cookies and no tracking. The fonts are hosted on our own server.</p>
        <p>Music and films: some project pages include music from Spotify and films from YouTube. These players only load when you click the play button. Only then is data (for example your IP address) sent to Spotify or YouTube (Google), and they may set cookies. The privacy policies of <a href="https://www.spotify.com/ch-en/legal/privacy-policy/" target="_blank" rel="noopener">Spotify</a> and <a href="https://policies.google.com/privacy?hl=en" target="_blank" rel="noopener">Google</a> apply.</p>
        ${KONTAKT.newsletter ? `<p>Newsletter: when you sign up, we store your first name, last name and email address with ${esc(newsletterAnbieter())}, solely to send you the newsletter.${newsletterAnbieter() === "MailerLite" ? " MailerLite stores the data in the EU." : ""} You can unsubscribe at any time via the link in every newsletter; we then delete your details.</p>` : ""}
        <p>The site is hosted by Vercel Inc. When you visit, Vercel stores technically necessary information such as IP address and time in order to deliver the site and protect it from abuse.</p>
        <p>If you send us an email, we only use your details to reply. Our email runs on Google Workspace.</p>
        <p>Questions: <a href="mailto:info@baerimschafspelz.ch">info@baerimschafspelz.ch</a></p>
      </div>
    </div>`, "Imprint & privacy");
}

/* ---------- Newsletter ----------
   Im Admin unter Kontakt die Formular-Adresse des Anbieters eintragen (Mailchimp oder MailerLite).
   Leer = kein Newsletter-Link (ausser in der Vorschau). Ein Willkommensmail verschickt der Anbieter (Automation). */
function newsletterAnbieter() {
  const u = String(KONTAKT.newsletter || "");
  if (/list-manage\.com/.test(u)) return "Mailchimp";
  if (/mailerlite\.com/.test(u)) return "MailerLite";
  return u ? tx("anbieter") : "";
}

function oeffneNewsletter() {
  const bereit = !!KONTAKT.newsletter;
  const K = KONTAKT;
  const bild = K.newsletter_bild
    ? `<div class="detail-bilder"><figure><img src="${esc(pfad(K.newsletter_bild))}" alt=""></figure></div>` : "";
  zeigeDetail(`
    <div class="detail-text newsletter">
      <p class="mono" style="color:var(--grau);margin:0 0 14px">${esc(K.newsletter_uebertitel || "Newsletter")}</p>
      <h1>${esc(K.newsletter_titel || tx("nlTitel"))}</h1>
      <p class="unter">${esc(K.newsletter_untertitel || tx("nlUnter"))}</p>
      ${absaetze(K.newsletter_text || tx("nlText"))}
      <div class="liste">
        <h2 class="mono">${tx("anmeldung")}</h2>
        <form class="nl-formular" id="nl-formular" novalidate>
          <label class="zeile"><span>${tx("vorname")}</span><input name="vorname" autocomplete="given-name" required></label>
          <label class="zeile"><span>${tx("name")}</span><input name="name" autocomplete="family-name"></label>
          <label class="zeile"><span>${tx("mail")}</span><input name="mail" type="email" autocomplete="email" required></label>
          <input class="nl-falle" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
          <button type="submit"${bereit ? "" : " disabled"}>${tx("anmelden")}</button>
          <p class="nl-meldung" id="nl-meldung" role="status">${bereit ? "" : tx("nichtVerbunden")}</p>
        </form>
      </div>
      <p class="mono nl-klein">${tx("abmelden")} <a href="#impressum">${tx("datenschutz")}</a>.</p>
    </div>${bild}`, "Newsletter");
  if (bereit) $("#nl-formular").addEventListener("submit", sendeNewsletter);
}

function sendeNewsletter(e) {
  e.preventDefault();
  const f = e.target, meldung = $("#nl-meldung"), knopf = f.querySelector("button");
  const d = Object.fromEntries(new FormData(f));
  if (d.website) return; // Spam-Falle
  if (!d.vorname.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.mail.trim())) {
    meldung.textContent = tx("pruefen");
    return;
  }
  knopf.disabled = true;
  meldung.textContent = tx("sendet");
  const fertig = () => {
    f.reset();
    meldung.textContent = EN
      ? `Thank you, you are subscribed with ${d.mail.trim()}. A short welcome email is on its way. If it doesn't arrive, check your spam folder or check the address and sign up again.`
      : `Danke, du bist angemeldet mit ${d.mail.trim()}. Gleich kommt ein kurzes Willkommensmail. Falls nicht: Schau im Spam nach oder prüf die Adresse und melde dich nochmals an.`;
    knopf.disabled = false;
  };
  const fehler = (text) => {
    meldung.textContent = text || tx("fehler");
    knopf.disabled = false;
  };
  const url = String(KONTAKT.newsletter);

  if (newsletterAnbieter() === "Mailchimp") {
    /* Mailchimp: Antwort per JSONP, damit man auf der Seite bleibt */
    const cb = "nl" + Date.now();
    const q = new URLSearchParams({ EMAIL: d.mail.trim(), FNAME: d.vorname.trim(), LNAME: (d.name || "").trim() });
    const s = document.createElement("script");
    window[cb] = (r) => {
      delete window[cb]; s.remove();
      if (r && r.result === "success") return fertig();
      const msg = String((r && r.msg) || "");
      if (/already subscribed|bereits/i.test(msg)) return fehler(tx("schonDa"));
      fehler();
    };
    s.src = url.replace("/post?", "/post-json?") + "&" + q + "&c=" + cb;
    s.onerror = () => fehler();
    document.body.appendChild(s);
    return;
  }

  /* MailerLite und andere: Formular direkt an den Anbieter schicken */
  const fd = new FormData();
  fd.append("fields[email]", d.mail.trim());
  fd.append("fields[name]", d.vorname.trim());
  fd.append("fields[last_name]", (d.name || "").trim());
  fd.append("ml-submit", "1");
  fd.append("anticsrf", "true");
  fetch(url, { method: "POST", body: fd, mode: "no-cors" }).then(fertig, () => fehler());
}

function zeigeDetail(html, titel) {
  $("#detail-inhalt").innerHTML = html;
  starteVideos($("#detail-inhalt"));
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
      <h1>${tx("archiv")}</h1>
      <p class="unter">${tx("archivUnter")}</p>
      <div class="archiv-liste">${zeilen}</div>
    </div>`, tx("archiv"));
}

/* Musik und Filme im Projekt (Feld «medien»: Liste mit titel + link zu Spotify oder YouTube).
   Die Player laden erst nach einem Klick auf den Play-Knopf, vorher gibt es keine Verbindung
   zu Spotify oder YouTube (kein Tracking, solange niemand klickt). Siehe auch Datenschutz. */
function spotifyEmbed(url) {
  const m = String(url || "").match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(artist|album|track|playlist|episode|show)\/([A-Za-z0-9]+)/);
  if (!m) return "";
  const dunkel = document.documentElement.classList.contains("nacht");
  return `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator${dunkel ? "&theme=0" : ""}`;
}
function youtubeEmbed(url) {
  const m = String(url || "").match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1&rel=0` : "";
}
function musikHtml(p) {
  return (p.medien || []).map((m) => {
    const art = spotifyEmbed(m.link) ? "spotify" : youtubeEmbed(m.link) ? "youtube" : "";
    if (!art) return "";
    const dienst = art === "spotify" ? "Spotify" : "YouTube";
    return `<div class="musik" data-art="${art}" data-url="${esc(m.link)}">
      <button class="musik-knopf" type="button"><span class="musik-punkt" aria-hidden="true"></span><span>${esc(m.titel || (art === "spotify" ? tx("musik") : tx("filmAnsehen")))}</span></button>
      <p class="musik-hinweis mono">${tx("player")} ${dienst}.</p>
    </div>`;
  }).join("");
}
function starteMusik(knopf) {
  const box = knopf.closest(".musik");
  box.innerHTML = box.dataset.art === "youtube"
    ? `<iframe class="film-player" src="${esc(youtubeEmbed(box.dataset.url))}" title="YouTube"
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe>`
    : `<iframe class="musik-player" src="${esc(spotifyEmbed(box.dataset.url))}" height="152" loading="lazy" title="Spotify"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
}

function oeffne(p) {
  const imArchiv = status(p) === "archiv";
  const nr = nummer(p);

  const liste = listenHtml(p.listen);
  const insta = p.instagram
    ? `<p class="insta"><a href="${esc(p.instagram)}" target="_blank" rel="noopener">${tx("instagram")}</a></p>`
    : "";

  const film = p.video ? `<figure>${videoHtml(p.video, p.cover, "")}</figure>` : "";
  const bilder = film + (p.bilder && p.bilder.length
    ? p.bilder
        .map((b, i) => `<figure>
          <img src="${esc(pfad(b.bild))}" alt="${esc(b.text || p.titel + " " + (i + 1))}" loading="lazy">
          <figcaption class="mono"><span>${nr ? nr + "–" : ""}${String(i + 1).padStart(2, "0")}</span>${b.text ? `<span>${esc(b.text)}</span>` : ""}</figcaption>
        </figure>`)
        .join("")
    : (film ? "" : `<figure>${cover({ ...p, cover: "" })}</figure>`));

  zeigeDetail(`
    <div class="detail-text">
      <p class="mono" style="color:var(--grau);margin:0 0 14px">${imArchiv
        ? `<a href="#archiv">${tx("archiv")}</a>${nr ? " · " + esc(nr) : ""}`
        : entwurf(p) ? `${tx("entwurfLang")}${nr ? " · " + esc(nr) : ""}`
        : `${tx("projekt")} ${esc(nr)}`}</p>
      <h1>${esc(p.titel)}</h1>
      <p class="unter">${esc(p.untertitel || "")}</p>
      ${absaetze(p.text)}
      ${musikHtml(p)}
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

/* Projekte haben eine eigene Adresse ohne # (z.B. /tapas), damit beim Teilen in WhatsApp & Co.
   das Bild des Projekts erscheint (siehe api/teilen.js). Intern läuft alles weiter über #. */
function aktuelleId() {
  const h = decodeURIComponent(location.hash.slice(1));
  if (h) return h;
  const pfad = location.pathname.replace(/^\/+|\/+$/g, "");
  return pfad && !pfad.includes("/") && !pfad.includes(".") ? decodeURIComponent(pfad) : "";
}

function adresse(ziel) {
  const url = ziel.startsWith("/") ? ziel + location.search : "/" + location.search + ziel;
  if (url === location.pathname + location.search + location.hash) return;
  try { history.replaceState(history.state, "", url); } catch (e) {}
}

function route() {
  const id = aktuelleId();
  if (id === "archiv" && archiv.length) { oeffneArchiv(); return adresse("#archiv"); }
  if (id === "impressum") { oeffneImpressum(); return adresse("#impressum"); }
  if (id === "newsletter" && (KONTAKT.newsletter || VORSCHAU || ANSICHT)) { oeffneNewsletter(); return adresse("#newsletter"); }
  if (id === "programm" && programmSichtbar()) { oeffneProgramm(); return adresse("#programm"); }
  if (id === "presse" && presseSichtbar()) { oeffnePresse(); return adresse("#presse"); }
  if (id === "danke" && DANKE.gruppen && DANKE.gruppen.length) { oeffneDanke(); return adresse("#danke"); }
  const p = [...sichtbare, ...archiv].find((x) => x.id === id);
  if (p) { oeffne(p); return adresse("/" + encodeURIComponent(p.id)); }
  schliesse();
  adresse("");
}

/* Laufschrift unter dem Namen (z.B. «In Entstehung · Work in Progress»):
   öffentlich nur, wenn im Admin «Laufschrift zeigen» an ist (in ?vorschau/?ansicht immer) */
function zeigeLaufschrift() {
  const text = String(KONTAKT.laufschrift || "").trim();
  if (!text || !(KONTAKT.laufschrift_zeigen || VORSCHAU || ANSICHT)) return;
  const stueck = `<span>${esc(text)}</span>`.repeat(4);
  document.querySelectorAll(".laufschrift").forEach((el) => {   /* Startseite und Projekte */
    el.innerHTML = `<span class="laufschrift-band">${stueck}${stueck}</span>`;
    el.hidden = false;
  });
}

function zurStartseite() {
  try { history.pushState("", KONTAKT.name, "/" + location.search); }
  catch (e) { location.hash = ""; }
  route();
}

/* ---------- Start ---------- */

/* Schalter EN / DE neben dem Nacht-Symbol, und die festen Texte in index.html */
function zeigeSprachSchalter(erlaubt) {
  const knopf = $("#sprache-schalter");
  if (erlaubt) {
    knopf.hidden = false;
    knopf.textContent = EN ? "DE" : "EN";
    knopf.lang = EN ? "de" : "en";
    knopf.setAttribute("aria-label", EN ? "Auf Deutsch lesen" : "Read in English");
    knopf.addEventListener("click", () => {
      const q = new URLSearchParams(location.search);
      q.delete("lang");
      try { localStorage.setItem("sprache", EN ? "de" : "en"); }
      catch (e) { if (!EN) q.set("lang", "en"); }   /* ohne Speicher: Sprache in der Adresse mitgeben */
      const rest = q.toString().replace(/=(&|$)/g, "$1");
      location.href = location.pathname + (rest ? "?" + rest : "") + location.hash;
    });
  }
  if (!EN) return;
  $("#zurueck").textContent = tx("zurueck");
  $("#impressum-link").textContent = tx("impressum");
  $("#archiv-link").textContent = tx("archiv");
  $("#programm-link").textContent = tx("programm");
  $("#danke-link").textContent = tx("danke");
  $("#presse-link").textContent = tx("presse");
  $("#detail").setAttribute("aria-label", tx("projekt"));
  const nacht = $("#nacht-schalter");
  const nachtLabel = () => nacht.setAttribute("aria-label",
    document.documentElement.classList.contains("nacht") ? tx("zurTag") : tx("zurNacht"));
  nachtLabel();
  nacht.addEventListener("click", () => setTimeout(nachtLabel));
}

function zeigeBald() {
  document.title = KONTAKT.name;
  const zeilen = String(KONTAKT.bald_text || tx("bald")).trim().split(/\n\s*\n/)
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
  [pj, KONTAKT, DANKE, PROGRAMM, PRESSE] = await Promise.all([
    laden("inhalt/projekte.json"),
    laden("inhalt/kontakt.json"),
    laden("inhalt/danke.json").catch(() => ({})),
    laden("inhalt/programm.json").catch(() => ({})),
    laden("inhalt/presse.json").catch(() => ({}))
  ]);
  PROJEKTE = Array.isArray(pj) ? pj : pj.projekte || [];

  /* Englisch: nur wenn gewählt und freigegeben */
  const englischErlaubt = !!(KONTAKT.englisch_zeigen || VORSCHAU || ANSICHT);
  EN = englischErlaubt && gewaehlteSprache() === "en";
  if (EN) [PROJEKTE, KONTAKT, DANKE, PROGRAMM, PRESSE].forEach(aufEnglisch);
  document.documentElement.lang = EN ? "en" : "de-CH";

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
  const programmLink = $("#programm-link");
  programmLink.hidden = !programmSichtbar();
  if (PROGRAMM.titel) programmLink.textContent = PROGRAMM.titel;
  $("#presse-link").hidden = !presseSichtbar();
  if (PRESSE.titel) $("#presse-link").textContent = PRESSE.titel;
  const dankeLink = $("#danke-link");
  dankeLink.hidden = !(DANKE.gruppen && DANKE.gruppen.length);
  if (DANKE.titel) dankeLink.textContent = DANKE.titel;

  zeigeSprachSchalter(englischErlaubt);

  bauBuehne();
  starteVideos($("#buehne"));
  verteileWennBereit();
  document.querySelectorAll("[data-name]").forEach((el) => (el.textContent = KONTAKT.name));
  $("#adresse").textContent = KONTAKT.adresse;
  if (KONTAKT.untertitel) $("#untertitel").textContent = KONTAKT.untertitel;
  $("#hinweis").textContent = KONTAKT.hinweis || "";
  const mail = $("#mail");
  mail.textContent = KONTAKT.mail;
  mail.href = "mailto:" + KONTAKT.mail;
  const ig = $("#instagram");
  /* Instagram-Link im Fuss: öffentlich erst, wenn im Admin «Instagram-Link öffentlich zeigen» an ist */
  if (KONTAKT.instagram && (KONTAKT.instagram_zeigen || VORSCHAU || ANSICHT)) { ig.href = KONTAKT.instagram; ig.hidden = false; }
  $("#newsletter-link").hidden = !(KONTAKT.newsletter || VORSCHAU || ANSICHT);

  $("#zurueck").addEventListener("click", zurStartseite);
  $("#detail-inhalt").addEventListener("click", (e) => {
    const knopf = e.target.closest(".musik-knopf");
    if (knopf) starteMusik(knopf);
  });
  zeigeLaufschrift();
  /* Klick auf «Zum Schwarzen Bären» (oben und im Projekt) = zurück zur Startseite */
  document.querySelectorAll("a.wortmarke").forEach((marke) => {
    marke.href = "/" + location.search;
    marke.addEventListener("click", (e) => { e.preventDefault(); zurStartseite(); });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$("#detail").hidden) $("#zurueck").click();
  });
  window.addEventListener("hashchange", route);
  window.addEventListener("popstate", route);
  route();
}

start();
