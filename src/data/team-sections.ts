import type { TeamSection } from "@/types/team";

const CLOUDFRONT_URL = "https://dik6ttc5elg95.cloudfront.net";

export const teamSections: Record<number, TeamSection[]> = {
  1: [
    {
      id: "pressing",
      title: "Pressing",
      content: [
        { type: "heading", text: "Pressing Gegner" },
        {
          type: "paragraph",
          text: "TBD",
        },
        {
          type: "list",
          items: ["TBD"],
        },
        {
          type: "image",
          src: `${CLOUDFRONT_URL}/dsg-vienna-internationals/pressing_gegner.png`,
          alt: "TBD",
        },
        { type: "heading", text: "Pressing Sektor" },
        {
          type: "paragraph",
          text: "TBD",
        },
        {
          type: "list",
          items: ["TBD"],
        },
        {
          type: "image",
          src: `${CLOUDFRONT_URL}/dsg-vienna-internationals/pressing_sektor.png`,
          alt: "TBD",
        },
      ],
    },
    {
      id: "build_up",
      title: "Spielaufbau Gegner",
      content: [
        {
          type: "paragraph",
          text: "TBD",
        },
        {
          type: "image",
          src: "/images/build-up.png",
          alt: "TBD",
        },
      ],
    },
    {
      id: "set_pieces",
      title: "Standardsituationen",
      content: [
        { type: "heading", text: "Eckball gegen uns:" },
        {
          type: "list",
          items: [
            "Der Ball wird bevorzugt auf den zweiten Pfosten gespielt.",
            "Ein Spieler positioniert sich zunächst unauffällig im Rückraum und versucht, mit Tempo in den Strafraum einzulaufen.",
            "Sie versuchen, durch viel Bewegung und Gedränge im Zentrum Unordnung zu stiften und so zu Torchancen zu kommen.",
          ],
        },
        { type: "heading", text: "Eckball für uns:" },
        {
          type: "list",
          items: [
            "Der gegnerische Torwart agiert beim Herauslaufen eher zögerlich und bleibt meist passiv auf der Torlinie.",
            "In der Regel ein Spieler kurz, ein Spieler am kurzen Pfosten, der Rest in Manndeckung.",
            "Durch Kreuzen der Laufwege unserer Spieler können wir Verwirrung in der gegnerischen Zuordnung erzeugen.",
          ],
        },
        { type: "heading", text: "Elfmeter / Freistoß gegen uns:" },
        {
          type: "list",
          items: [
            "Nr. 8 ist der Hauptschütze bei direkten Freistößen und Elfmetern.",
            "Versucht den Ball bevorzugt in die aus Schützensicht linke Torecke zu platzieren.",
            "Siehe Elfmeter-/Freistoßanalyse aus dem Spiel gegen Wolf Park",
            "Nur kopfballstarke/große Spieler aufstellen. Die Mauer sollte aktiv springen.",
          ],
        },
        { type: "heading", text: "Anstoß:" },
        {
          type: "list",
          items: [
            "Sie versuchen häufig, den Anstoß direkt mit einem langen, hohen Ball auf einen der Flügel zu spielen.",
          ],
        },
        {
          type: "image",
          src: `${CLOUDFRONT_URL}/dsg-vienna-internationals/anstoß.png`,
          alt: "Formation vom Gegner",
        },
      ],
    },
    {
      id: "team_notes",
      title: "Spieleranalyse",
      content: [
        { type: "heading", text: "T (Torwart):" },
        {
          type: "list",
          items: [
            "Wenig auffällig im Spielverlauf.",
            "Zögert beim Herauslaufen aus dem Tor.",
            "Bei Standardsituationen (vor allem Ecken) bleibt er eher passiv auf der Linie.",
          ],
        },
        { type: "heading", text: "3 (IV/RV):" },
        {
          type: "list",
          items: [
            "Kopfballstark.",
            "Hauptposition Innenverteidiger (IV), kann aber auch als Rechtsverteidiger (RV) eingesetzt werden.",
            "Zeigt unter Druck Unsicherheiten in der Ballbehandlung und im Passspiel.",
          ],
        },
        { type: "heading", text: "2 (RV):" },
        {
          type: "list",
          items: [
            "Wirkt defensiv teilweise unsicher.",
            "Tendiert dazu, mit dem Ball von der Außenbahn ins Zentrum zu ziehen (potenzielles Pressingziel für uns).",
          ],
        },
        { type: "heading", text: "15 (IV):" },
        {
          type: "list",
          items: [
            "Zweiter Innenverteidiger.",
            "Kein schneller Innenverteidiger.",
            "Schwächen im Spielaufbau, insbesondere bei langen, hohen Bällen.",
            "Technisch nicht sehr versiert, anfällig bei hohem Druck.",
          ],
        },
        { type: "heading", text: "5 (LV):" },
        {
          type: "list",
          items: [
            "Linksverteidiger (LV).",
            "Ebenfalls eher langsam.",
            "Agieret taktisch diszipliniert und verfügt über eine gute Spielübersicht und Orientierung.",
          ],
        },
        { type: "heading", text: "8 (ZDM/ZM - Kapitän):" },
        {
          type: "list",
          items: [
            "Zentraler (defensiver) Mittelfeldspieler (6er/8er), Kapitän und Schlüsselspieler des Teams.",
            "Beidfüßig, technisch stark und ballsicher.",
            "Fungiert als Spielmacher und Organisator im Spielaufbau.",
          ],
        },
        { type: "heading", text: "14 (RF/LF):" },
        {
          type: "list",
          items: [
            "Flügelspieler (rechts oder links einsetzbar), Rechtsfuß.",
            "Verfügt über einen schnellen Antritt und gute Dribbling-Fähigkeiten.",
            "Sucht häufig das 1-gegen-1-Duell und den Pass in die Tiefe.",
            "Als RF (Rechter Flügel): Fokussiert sich eher darauf, Flanken von der Grundlinie zu schlagen.",
            "Als LF (Linker Flügel): Zieht nach Dribblings gerne nach innen und sucht den Torabschluss.",
            "Hält oft die Breite und agiert nah an der Seitenlinie.",
          ],
        },
        { type: "heading", text: "6 (ZM/ZDM/OM):" },
        {
          type: "list",
          items: [
            "Flexibel im zentralen Mittelfeld einsetzbar (6er/8er/10er).",
            "Agieret eher unauffällig, ohne herausragende Aktionen.",
          ],
        },
        { type: "heading", text: "10 (OM):" },
        {
          type: "list",
          items: [
            "Physisch präsenter, robuster offensiver Mittelfeldspieler (10er).",
            "Läuft im gegnerischen Pressing zusammen mit dem Stürmer die Abwehrspieler aggressiv und mit hohem Tempo an.",
          ],
        },
        { type: "heading", text: "18 (RF/LF):" },
        {
          type: "list",
          items: [
            "Weiterer Flügelspieler (rechts oder links).",
            "Sucht ebenfalls häufig das 1-gegen-1.",
            "Körperlich sehr robust und durchsetzungsstark.",
          ],
        },
        { type: "heading", text: "9 (ST):" },
        {
          type: "list",
          items: [
            "Stürmer.",
            "Lässt sich oft ins Mittelfeld fallen, um Bälle festzumachen, klatschen zu lassen oder auf die Flügel zu verteilen.",
            "Verfügt über eine gute Übersicht über das Spielfeld.",
            "Ist weniger ein Stürmer, der primär die tiefen Laufwege sucht.",
            "Besitzt einen guten Torabschluss.",
          ],
        },
        { type: "heading", text: "Taktische Merkmale / Spielweise" },
        {
          type: "list",
          items: [
            "Pressing: Agieren im Pressing meist in einer 4−1−4−14−1−4−1-Grundordnung. Situativ wird auch auf ein 4−4−1−14−4−1−1 umgestellt.",
            "Mittelfeldorganisation: Die zentralen Mittelfeldspieler (Nr. 8, Nr. 6, Nr. 10) rotieren und tauschen Positionen. Im Spielaufbau ist jedoch klar Nr. 8 der primäre Organisator und Ballverteiler.",
            "Physis: Die Mannschaft präsentiert sich konditionell und körperlich in einer sehr guten Verfassung.",
          ],
        },
      ],
    },
  ],

  // You can add more teams here:
  2: [
    /* … sections for team with id=2 … */
  ],
};
