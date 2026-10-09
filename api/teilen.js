/* Teil-Link für ein Projekt: zumschwarzenbaeren.ch/<id>
   WhatsApp, Signal, Instagram usw. lesen nur das HTML ohne JavaScript und sehen den #-Teil
   einer Adresse nicht. Darum liefert diese Funktion eine kleine Seite mit Titel, Untertitel
   und Titelbild des Projekts als Vorschau und leitet Menschen gleich auf /#<id> weiter.
   Liest immer die aktuelle inhalt/projekte.json, Änderungen im CMS gelten also sofort. */

const ORDNER = ["api", "firma", "media", "entwurf", "inhalt", "bilder", "schrift"];

const esc = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

module.exports = async (req, res) => {
  const id = String((req.query && req.query.id) || "").toLowerCase();
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const basis = (req.headers["x-forwarded-proto"] || "https") + "://" + host;

  if (ORDNER.includes(id)) { res.writeHead(308, { Location: "/" + id + "/" }); return res.end(); }

  let projekt = null, name = "Zum Schwarzen Bären";
  try {
    const [pj, k] = await Promise.all([
      fetch(basis + "/inhalt/projekte.json").then((r) => r.json()),
      fetch(basis + "/inhalt/kontakt.json").then((r) => r.json()).catch(() => ({}))
    ]);
    if (k && k.name) name = k.name;
    const liste = Array.isArray(pj) ? pj : pj.projekte || [];
    projekt = liste.find((p) => p.id === id && ["aktuell", "archiv"].includes(String(p.status || "aktuell")));
  } catch (e) { /* weiter ohne Projekt */ }

  if (!projekt) { res.writeHead(302, { Location: "/" }); return res.end(); }

  const ziel = "/#" + encodeURIComponent(id);
  const bild = projekt.cover
    ? basis + "/" + String(projekt.cover).replace(/^\/+/, "").split("/").map(encodeURIComponent).join("/")
    : basis + "/vorschau.jpg";
  const titel = projekt.titel + " – " + name;
  const text = projekt.untertitel || "Essen und Trinken an der Rheingasse, Basel.";

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=86400");
  res.end(`<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titel)}</title>
<meta name="description" content="${esc(text)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(name)}">
<meta property="og:title" content="${esc(titel)}">
<meta property="og:description" content="${esc(text)}">
<meta property="og:url" content="${esc(basis + "/" + id)}">
<meta property="og:image" content="${esc(bild)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta http-equiv="refresh" content="0; url=${esc(ziel)}">
<script>location.replace(${JSON.stringify(ziel)});</script>
</head>
<body style="font-family:sans-serif;padding:24px"><a href="${esc(ziel)}">${esc(projekt.titel)}</a></body>
</html>`);
};
