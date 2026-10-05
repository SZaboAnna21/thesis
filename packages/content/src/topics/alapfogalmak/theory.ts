import type { ContentBlock } from "../../types/content";

export const theory: ContentBlock[] = [
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Alapfogalmak és jelölések",
      en: "Basic Concepts and Notation",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Kezdjük az alapokkal: pár fogalom és jelölés, amit később folyton használni fog az anyag. Elsőre kicsit száraznak tűnhet, de ha ezeket érti az ember, a nehezebb témáknál sokkal kevesebbet fog gondolkodni és gyorsan érteni fogja. Szóval csak egy kis türelem, aztán jön az érdekesebb rész :)",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Ábécé",
    },
    content: {
      hu: "Egy véges, nem üres halmaz. Az elemeit betűknek hívjuk. Ennyi, nem kell túlgondolni.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Fontos, hogy itt a „betű” nem feltétlenül a magyar ábécé egy betűje. Lehet $0$ és $1$, lehet egy szín, egy emoji, bármi. A lényeg, hogy véges sok legyen belőle, és legalább egy legyen.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "V feletti szó (string)",
    },
    content: {
      hu: "A $V$ ábécé betűiből összerakott véges sorozat. Minden szó véges hosszú, de nincs olyan felső határ, aminél hosszabb szó ne létezne. A sorrend számít: az $ab$ és a $ba$ két különböző szó.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Egy $u$ szó hossza egyszerűen a betűinek a száma, jelölése $|u|$. Van egy különleges szó is: az üres szó, amiben egyetlen betű sincs. Ezt $\\varepsilon$-nal jelöljük, és persze $|\\varepsilon| = 0$. Furcsa, lehet elsőre, de később rengeteg helyen jól fog jönni, kb. úgy, mint a $0$ a számoknál.",
    },
  },
  {
    type: "example",
    title: {
      hu: "Példa",
    },
    content: {
      hu: "Legyen $V = \\{a, b\\}$. Ennek az ábécének két betűje van: $a$ és $b$. $V$ feletti szavak például: $abababaaaba$, $abbaab$, $b$, vagy akár $\\varepsilon$. Hosszok: $|abbaab| = 6$, $|b| = 1$, $|\\varepsilon| = 0$.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Az összes lehetséges szó",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Oké, szavakat már tudjuk. De mi van, ha nem egy-két konkrét szóra vagyunk kíváncsiak, hanem egyszerre az összesre? Ősszes lehetségesre? Erre van két nagyon gyakori jelölés, ezeket érdemes most megjegyezni, mert mindenhol ott lesznek.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "$V^*$",
    },
    content: {
      hu: "A $V$ ábécé feletti összes szó halmaza, az üres szót ($\\varepsilon$) is beleértve.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "$V^+$",
    },
    content: {
      hu: "A $V$ ábécé feletti összes nem üres szó halmaza. Vagyis ugyanaz, mint $V^*$, csak az üres szót kidobtuk: $V^+ = V^* \\setminus \\{\\varepsilon\\}$.",
    },
  },
  {
    type: "example",
    title: {
      hu: "Példa",
    },
    content: {
      hu: "Legyen ismét $V = \\{a, b\\}$. Ekkor $V^*$ elemei például: $\\varepsilon, a, b, aa, ab, ba, bb, aaa, aab, \\dots$ és így tovább a végtelenségig. A $V^+$ pontosan ugyanez, csak az $\\varepsilon$ nincs benne.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Ami elsőre meglepő lehet: hiába van csak két betűnk, a lehetséges szavakból végtelen sok van. Mindig tudsz írni egy eggyel hosszabbat. Viszont egy adott hosszúságú szóból csak véges sok van: $n$ hosszú szóból pont $|V|^n$ darab (két betűnél például $2^n$).",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Shortlex rendezés",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Shortlex rendezés",
    },
    content: {
      hu: "Először mindig a rövidebb szó jön. Ha két szó ugyanolyan hosszú, akkor szótárszerűen (lexikografikusan) hasonlítjuk össze őket, a betűk előre rögzített sorrendje alapján.",
    },
  },
  {
    type: "example",
    title: {
      hu: "Példa",
    },
    content: {
      hu: "Ha $V = \\{a, b\\}$ és $a$ van előrébb, mint $b$, akkor a sorrend így indul: $\\varepsilon, a, b, aa, ab, ba, bb, aaa, aab, aba, abb, baa, \\dots$",
    },
  },
  {
    type: "warning",
    text: {
      hu: "Miért nem jó a sima szótári sorrend? Mert ott $a$ után $aa$ jönne, aztán $aaa$, aztán $aaaa$... és a $b$-hez soha nem érnénk el. A shortlexben viszont minden szó véges sok lépés után sorra kerül, ezért ez a jó választás.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Konkatenáció: szavak összeragasztása",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A konkatenáció egy nagyon tudományos szó arra, hogy két szót leírunk egymás után. Tényleg ennyi.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Konkatenáció",
    },
    content: {
      hu: "Az $u$ és $v$ szavak konkatenációja az $uv$ szó: leírjuk $u$-t, és közvetlenül utána $v$ betűit. A hossza értelemszerűen $|uv| = |u| + |v|$.",
    },
  },
  {
    type: "example",
    title: {
      hu: "Példa",
    },
    content: {
      hu: "Legyen $u = abb$ és $v = aaaba$. Ekkor $uv = abbaaaba$, viszont $vu = aaabaabb$. Mindkettő 8 hosszú, de nem ugyanaz a szó.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Az üres szó itt is hozza a formáját: bármihez hozzáragasztva nem változtat semmit, $u\\varepsilon = \\varepsilon u = u$. Pont úgy viselkedik, mint a $0$ az összeadásnál vagy az $1$ a szorzásnál.",
    },
  },
  {
    type: "funfact",
    text: {
      hu: "A konkatenáció asszociatív: $u(vw) = (uv)w$, tehát a zárójelezés mindegy, nyugodtan elhagyhatjuk. Kommutatív viszont általában nem: $uv \\neq vu$. (Érdekesség: van, amikor mégis egyenlők, például ha $u = ab$ és $v = abab$. Ilyenkor mindkettő ugyanannak a szónak az ismétlése.)",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Szavak hatványa",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Hatványozás",
    },
    content: {
      hu: "Az $u^n$ jelölés azt jelenti, hogy az $u$ szót $n$-szer egymás után írjuk. Megállapodás szerint $u^0 = \\varepsilon$.",
    },
  },
  {
    type: "example",
    title: {
      hu: "Példa",
    },
    content: {
      hu: "$a^3 = aaa$, $(ab)^2 = abab$, $b^0 = \\varepsilon$. A hossz is könnyen számolható: $|u^n| = n \\cdot |u|$.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "$(ab)^3 = ababab$, míg $a^3b^3 = aaabbb$. A kettő nem ugyanaz! És figyelj a zárójelre is: $ab^3 = abbb$, mert a kitevő csak a közvetlenül előtte álló betűre vonatkozik. Ezt meglepően sokan benézik elsőre, ne légy te is köztük.",
    },
  },
];