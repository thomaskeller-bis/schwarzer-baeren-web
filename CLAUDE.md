# Homepage «Zum Schwarzen Bären»

Statische Seite (HTML/CSS/JS, kein Build). GitHub → Vercel (Deploy automatisch nach jedem Push, ca. 1 Min).
Inhalte werden auch über Pages CMS (app.pagescms.org) vom Team bearbeitet.

## Wo was liegt
- `inhalt/projekte.json` – alle Projekte unter dem Schlüssel `projekte` (Liste)
- `inhalt/kontakt.json` – Name, Untertitel, Hinweis, Adresse, Mail, Instagram, `bald` (true = nur Bald-Seite mit `bald_text`, ganze Seite unter `/?vorschau` mit Entwürfen, `/?ansicht` ohne Entwürfe)
- Instagram: `instagram` in `kontakt.json` = Profil-Link im Fuss, öffentlich nur mit `instagram_zeigen: true` (sonst nur in `?vorschau`/`?ansicht`). Pro Projekt: Feld `instagram` = Link zum Beitrag («Mehr dazu auf Instagram»).
- `inhalt/danke.json` – Danke-Seite (Gruppen mit Einträgen)
- Newsletter: `newsletter` in `kontakt.json` = Formular-Adresse von Mailchimp oder MailerLite. Seite `#newsletter` (Vorname, Name, Mail; MailerLite Gratis-Version ohne Double-Opt-in, dafür Willkommensmail per Automation), Link im Fuss erst sichtbar, wenn eingetragen (in `?vorschau`/`?ansicht` immer). Datenschutz-Absatz erscheint automatisch. Übertitel, Titel, Untertitel, Text und Bild der Seite: Felder `newsletter_*` in `kontakt.json`; die Seite ist gleich aufgebaut wie ein Projekt. Kachel auf der Startseite (Postkarte oder `newsletter_bild`): öffentlich nur mit `newsletter_kachel: true`, sonst nur in `?vorschau`/`?ansicht`.
- `bilder/<projekt-id>/` – Fotos, ca. 1600 px lange Seite, JPG
- `.pages.yml` – Felder der Admin-Seite. Bei neuen Feldern in den JSON-Dateien hier ebenfalls ergänzen.
- `app.js`, `style.css`, `index.html` – Darstellung
- Teil-Links: `zumschwarzenbaeren.ch/<projekt-id>` (z.B. /tapas) zeigt in WhatsApp & Co. Titel, Untertitel und Titelbild des Projekts und leitet auf `/#<id>` weiter. Die Seite selbst zeigt beim offenen Projekt ebenfalls `/<id>` in der Adresszeile (app.js `route()`/`adresse()`), so kann man direkt aus dem Browser kopieren. Gemacht von `api/teilen.js` (Vercel-Funktion, liest projekte.json live) und der Weiterleitung in `vercel.json`. Entwürfe → Startseite.
- Nacht-Version (vorerst nur in `?vorschau`): schwarz-weiss, auch Fotos. Von selbst ab bürgerlicher Dämmerung in Basel, Schalter «Nacht / Tag» oben rechts (gilt bis der Tab zu ist), `?vorschau&nacht` / `?vorschau&tag` zum Testen. Code: Skript im `<head>` von `index.html`, Farben `:root.nacht` in `style.css`.
- `firma/index.html` – einfache Firmenseite Bär im Schafspelz GmbH (Inhalt direkt im HTML). `vercel.json` leitet baerimschafspelz.ch auf /firma/ weiter.

## Projekt-Felder
`status` (aktuell | archiv | offline = Entwurf, nur sichtbar unter `/?vorschau`), `titel`, `nummer` (fest, bleibt auch im Archiv; leer = nächste freie),
`cover`, `video` (optional MP4, ersetzt das Titelbild, läuft stumm in Schleife; cover = Vorschaubild; vorher mit ffmpeg auf ca. 720 px verkleinern), `untertitel`, `text` (Leerzeile = Absatz, «## » = Zwischentitel, `[Text](https://…)` = Link), `instagram`,
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

## Instagram-Pakete: /media/
`media/index.html` baut für jedes Projekt automatisch ein Paket aus `inhalt/projekte.json`: Titelkachel (Canvas, 1080×1350), Video (`video_instagram` falls vorhanden, sonst `video`), alle Fotos auf 4:5 zugeschnitten, Textvorschlag mit Kopierknopf. Nicht verlinkt, noindex. Entwürfe nur mit `/media/?vorschau`.
Nach dem Posten den Link zum Beitrag im Feld `instagram` des Projekts eintragen.
