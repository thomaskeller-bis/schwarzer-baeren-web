# Zum Schwarzen Bären – Homepage

Statische Seite (HTML, CSS, JavaScript). Kein Build, keine Datenbank.
Code auf GitHub, Hosting auf Vercel, Admin-Seite mit Pages CMS.

## Aufbau

```
index.html            Seite
style.css             Gestaltung (Farben und Schriften oben als Variablen)
app.js                Logik (zufällige Anordnung, Detailansicht)
inhalt/projekte.json  alle Projekte
inhalt/kontakt.json   Name, Adresse, Mail
inhalt/danke.json     Partner & Unterstützer*innen (Seite «Danke»)
bilder/               Fotos, ein Ordner pro Projekt
.pages.yml            Einstellungen für die Admin-Seite (Pages CMS)
```

## Einrichten (einmalig)

1. **GitHub:** Neues Repository anlegen (z.B. `schwarzer-baeren-web`), diesen Ordner hochladen.
2. **Vercel:** Mit GitHub anmelden → «Add New Project» → Repository wählen.
   Framework: «Other», kein Build Command, Output Directory leer lassen → Deploy.
3. **Domain:** In Vercel unter Settings → Domains `zumschwarzenbaeren.ch` (Hauptdomain, mit www) hinzufügen.
   Vercel zeigt die DNS-Einträge an; diese bei cyon im DNS der Domain eintragen.
   `schwarzerbären.ch` und `schwarzerbaeren.com` in Vercel ebenfalls hinzufügen
   und auf `zumschwarzenbaeren.ch` umleiten. MX-Einträge (Mail) bei cyon nicht löschen.
4. **Admin-Seite:** Auf https://app.pagescms.org mit GitHub anmelden, Repository öffnen.
   Die Datei `.pages.yml` ist schon da, Projekte und Kontakt erscheinen direkt.
5. **Team einladen:** In Pages CMS unter «Collaborators» die Mailadressen eintragen.
   Das Team braucht dafür kein GitHub-Konto.

## Im Alltag

- Das Team bearbeitet Projekte auf app.pagescms.org → «Save».
- Pages CMS speichert auf GitHub, Vercel stellt die Seite nach ca. 1 Minute online.
- Reihenfolge der Projekte = Reihenfolge in der Liste.
- Text: Leerzeile = neuer Absatz. Zeile mit `## ` beginnen = Zwischentitel.
- Kein Titelbild = Platzhalter «Fotos folgen».
- Status «Aktuell» = schwebt auf der Startseite.
- Status «Archiv» = verschwindet von der Startseite, bleibt im Archiv sichtbar (Link «Archiv» oben rechts).
- Status «Entwurf» (intern: offline) = auf der öffentlichen Seite nicht sichtbar.
- Vorschau mit Entwürfen: `?vorschau` an die Adresse hängen, z.B. https://www.zumschwarzenbaeren.ch/?vorschau
  Der Link ist nirgends verlinkt. Wirklich geheim ist er nicht: Wer ihn kennt, sieht die Entwürfe.

- Bald-Seite: Im Admin unter Kontakt «Bald-Seite zeigen» einschalten = Besucher*innen sehen nur einen kurzen Gruss.
  Ausschalten, sobald die Seite öffentlich sein soll.

## Lokal anschauen

Wegen der JSON-Dateien funktioniert Doppelklick auf `index.html` nicht mehr.
Stattdessen im Ordner im Terminal:

```
npx serve
```

und dann die angezeigte Adresse (z.B. http://localhost:3000) öffnen.
Oder in VS Code die Erweiterung «Live Server» nutzen.

## Einstellungen in app.js

```js
const ZUFALL = true;   // false = feste Positionen
const ABSTAND = 28;    // Mindestabstand zwischen Projekten in Pixel
```
