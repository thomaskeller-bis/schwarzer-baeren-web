# Homepage «Zum Schwarzen Bären»

Statische Seite (HTML/CSS/JS, kein Build). GitHub → Vercel (Deploy automatisch nach jedem Push, ca. 1 Min).
Inhalte werden auch über Pages CMS (app.pagescms.org) vom Team bearbeitet.

## Wo was liegt
- `inhalt/projekte.json` – alle Projekte unter dem Schlüssel `projekte` (Liste)
- `inhalt/kontakt.json` – Name, Untertitel, Hinweis, Adresse, Mail, Instagram, `bald` (true = nur Bald-Seite mit `bald_text`, ganze Seite unter `/?vorschau` mit Entwürfen, `/?ansicht` ohne Entwürfe)
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
- Gestaltung bewusst zurückhaltend: weiss, eine Schrift: Schibsted Grotesk 400/500 (lokal in `schrift/`), keine Mono-Grossbuchstaben, keine externen Dienste.
- Nach Änderungen kurz lokal prüfen (`python3 -m http.server`) und dann committen + pushen.
- Commit-Nachrichten auf Deutsch, kurz.

## Textredaktion (Ablauf mit Christoph)
1. Neues Projekt zuerst als Entwurf anlegen (Status offline), Vorschau unter `/?vorschau`.
2. Texte als Word-Datei (.docx) ausgeben, gegliedert wie im CMS: Titel, Untertitel, Text, Listen («Name – Rolle · Link»), Bildlegenden.
3. Christoph korrigiert im Korrekturmodus und kommentiert offene Fragen.
4. Die korrigierte .docx übernehmen: Änderungen einsetzen, offensichtliche Tippfehler korrigieren, Kommentare als offene Punkte auflisten statt raten.
- Ansprache auf der Seite: Ihr-Form. Danke-Seite: Name = Betrieb (nur ohne Betrieb Personenname), Rolle in Stichworten, Ansprechpersonen am Schluss «mit Vorname».
