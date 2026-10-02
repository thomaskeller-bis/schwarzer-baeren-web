# Homepage «Zum Schwarzen Bären»

Statische Seite (HTML/CSS/JS, kein Build). GitHub → Vercel (Deploy automatisch nach jedem Push, ca. 1 Min).
Inhalte werden auch über Pages CMS (app.pagescms.org) vom Team bearbeitet.

## Wo was liegt
- `inhalt/projekte.json` – alle Projekte unter dem Schlüssel `projekte` (Liste)
- `inhalt/kontakt.json` – Name, Untertitel, Hinweis, Adresse, Mail, Instagram
- `inhalt/danke.json` – Danke-Seite (Gruppen mit Einträgen)
- `bilder/<projekt-id>/` – Fotos, ca. 1600 px lange Seite, JPG
- `.pages.yml` – Felder der Admin-Seite. Bei neuen Feldern in den JSON-Dateien hier ebenfalls ergänzen.
- `app.js`, `style.css`, `index.html` – Darstellung
- `firma/index.html` – einfache Firmenseite Bär im Schafspelz GmbH (Inhalt direkt im HTML). `vercel.json` zeigt sie unter baerimschafspelz.ch an.

## Projekt-Felder
`status` (aktuell | archiv | offline = Entwurf, nur sichtbar unter `/?vorschau`), `titel`, `nummer` (fest, bleibt auch im Archiv; leer = nächste freie),
`cover`, `untertitel`, `text` (Leerzeile = Absatz, «## » = Zwischentitel), `instagram`,
`bilder` [{bild, text}], `listen` [{titel, eintraege: [{name, rolle, link}]}], `id` (Adresse #id).

## Arbeitsweise
- Immer zuerst `git pull`, weil das Team parallel im CMS speichert.
- Bestehende Nummern nie ändern.
- Ton: Deutsch (Schweiz, «ss» statt «ß»), schlicht, bescheiden, prozesshaft. Keine Werbesprache.
- Gestaltung bewusst zurückhaltend: weiss, Hanken Grotesk + IBM Plex Mono (lokal in `schrift/`), keine externen Dienste.
- Nach Änderungen kurz lokal prüfen (`python3 -m http.server`) und dann committen + pushen.
- Commit-Nachrichten auf Deutsch, kurz.
