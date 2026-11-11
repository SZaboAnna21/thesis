import type { ContentBlock } from "../../types/content";

export const theory: ContentBlock[] = [
  {
    type: "heading",
    level: 1,
    text: {
      hu: "NP-teljesség",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Nem tudjuk, hogy $P = NP$-e,de azt meg tudjuk mondani, melyek az NP osztály legnehezebb problémái. Ezeket NP-teljes problémáknak nevezzük. Az NP-teljes problémák különlegesek: ha akár egyetlen ilyen problémára találnánk polinom idejű algoritmust, akkor minden NP-beli problémát meg tudnánk oldani polinom időben."
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Polinom idejű visszavezetés",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Polinom idejű visszavezetés",
    },
    content: {
      hu: "$L_1$ polinom időben visszavezethető $L_2$-re ($L_1 \\leq_p L_2$), ha van olyan polinom időben kiszámítható $f$ függvény, hogy minden $w$-re $w \\in L_1 \\iff f(w) \\in L_2$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Szemléletesen: ha $L_1$-et gyorsan át tudjuk alakítani $L_2$-vé, akkor $L_2$ legalább olyan nehéz, mint $L_1$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Hasznos következmények:",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "Ha $L_1 \\leq_p L_2$ és $L_2 \\in P$, akkor $L_1 \\in P$." },
      { hu: "A visszavezetés tranzitív: ha $L_1 \\leq_p L_2$ és $L_2 \\leq_p L_3$, akkor $L_1 \\leq_p L_3$." },
    ],
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "NP-nehéz és NP-teljes",
    },
  },
  {
    type: "definition",
    term: {
      hu: "NP-nehéz, NP-teljes",
    },
    content: {
      hu: "Egy $L$ nyelv",
    },
    items: [
      { hu: "NP-nehéz, ha minden $L' \\in NP$ esetén $L' \\leq_p L$," },
      { hu: "NP-teljes, ha NP-nehéz és $L \\in NP$." },
    ],
  },
  {
    type: "theorem",
    kind: "tetel",
    statement: {
      hu: "Ha egy NP-teljes $L$ nyelvre $L \\in P$, akkor $P = NP$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Mivel ezt senki nem tudta eddig megmutatni, egy NP-teljes problémára nem érdemes általános, gyors, pontos algoritmust keresni. A gyakorlatban ilyenkor közelítő vagy heurisztikus módszereket, illetve speciális esetekre szabott algoritmusokat használunk.",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    name: {
      hu: "Cook–Levin",
    },
    statement: {
      hu: "$SAT = \\{\\langle \\varphi \\rangle \\mid \\varphi \\text{ kielégíthető nulladrendű KNF}\\}$ NP-teljes.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Ez az első NP-teljes probléma, a bizonyítás minden NP-beli nyelvet közvetlenül visszavezet SAT-ra: egy polinom idejű nemdeterminisztikus gép elfogadó számítását egy (polinom méretű) KNF-fel írja le. A többi problémánál már nem kell ezt megismételni, elég egy ismert NP-teljes problémát visszavezetni.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Hogyan bizonyítsunk NP-teljességet?",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    statement: {
      hu: "Ha $L$ NP-teljes, $L \\leq_p L'$ és $L' \\in NP$, akkor $L'$ is NP-teljes.",
    },
  },
  {
    type: "list",
    ordered: true,
    items: [
      { hu: "Megmutatjuk, hogy $L' \\in NP$: megadjuk a tanút, és belátjuk, hogy polinom időben ellenőrizhető." },
      { hu: "Kiválasztunk egy ismert NP-teljes $L$ problémát (pl. 3SAT, Független ponthalmaz)." },
      { hu: "Megadunk egy polinom idejű $f$ visszavezetést $L$-ről $L'$-re." },
      { hu: "Belátjuk mindkét irányt: $w \\in L \\Rightarrow f(w) \\in L'$ és $f(w) \\in L' \\Rightarrow w \\in L$." },
    ],
  },
  {
    type: "warning",
    text: {
      hu: "Vizsgacsapda: az ismert NP-teljes problémát kell visszavezetni az újra ($L \\leq_p L'$), nem fordítva! Enélkül csak NP-nehézséget látunk be, az NP-beliséget külön kell megmutatni.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Fontos NP-teljes problémák",
    },
  },
  {
    type: "table",
    headers: ["Probléma", "Bemenet", "Kérdés"],
    rows: [
      ["SAT", "KNF $\\varphi$", "kielégíthető-e $\\varphi$?"],
      ["3SAT", "KNF, minden klózban pontosan 3 literál", "kielégíthető-e?"],
      ["3Színezés", "$G$ gráf", "kiszínezhetők-e a csúcsok 3 színnel úgy, hogy szomszédosak ne legyenek azonos színűek?"],
      ["Független ponthalmaz", "$G$, $k$", "van-e $k$ csúcs, amelyek közül semelyik kettő nem szomszédos?"],
      ["Klikk", "$G$, $k$", "van-e $k$ csúcs, amelyek páronként szomszédosak?"],
      ["Lefogó ponthalmaz", "$G$, $k$", "van-e $k$ csúcs, hogy minden élnek legalább egyik végpontja köztük van?"],
      ["Hamilton-út / -kör", "$G$ gráf (irányított vagy irányítatlan)", "van-e minden csúcsot pontosan egyszer érintő út / kör?"],
      ["Részletösszeg", "$S$ számhalmaz, $K$", "van-e $S$-nek $K$ összegű részhalmaza?"],
      ["Partíció", "$S$ számhalmaz", "szétosztható-e $S$ két egyenlő összegű részre?"],
      ["Hátizsák", "tárgyak súllyal és értékkel, $b$ kapacitás, $k$", "választható-e legfeljebb $b$ súlyú, legalább $k$ értékű tárgyhalmaz?"],
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "A visszavezetések láncolata, ahogy az előadáson szerepelt:",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "$SAT \\leq_p 3SAT$" },
      { hu: "$3SAT \\leq_p$ 3Színezés, $3SAT \\leq_p$ Független ponthalmaz, $3SAT \\leq_p$ Részletösszeg" },
      { hu: "Független ponthalmaz $\\leq_p$ Klikk, Független ponthalmaz $\\leq_p$ Lefogó ponthalmaz" },
      { hu: "Részletösszeg $\\leq_p$ Partíció, Részletösszeg $\\leq_p$ Hátizsák" },
    ],
  },
  {
    type: "warning",
    text: {
      hu: "2SAT és 2Színezés P-beli! A „3” nem véletlen: a 2-es változatok polinom időben megoldhatók, a 3-as változatok már NP-teljesek.",
    },
  },
  {
    type: "heading",
    level: 3,
    text: {
      hu: "Egyszerű visszavezetések",
    },
  },
  {
    type: "example",
    title: {
      hu: "Független ponthalmaz $\\leq_p$ Klikk",
    },
    content: {
      hu: "Legyen $f(G, k) = (\\overline{G}, k)$, ahol $\\overline{G}$ a $G$ komplementer gráfja (pontosan ott van él, ahol $G$-ben nincs). Egy csúcshalmaz $G$-ben pontosan akkor független, ha $\\overline{G}$-ben klikk. A komplementer gráf polinom időben elkészíthető.",
    },
  },
  {
    type: "example",
    title: {
      hu: "Független ponthalmaz $\\leq_p$ Lefogó ponthalmaz",
    },
    content: {
      hu: "Egy $n$ csúcsú gráfban $H$ pontosan akkor független, ha a komplementere, $V \\setminus H$ lefogó: ha egy élnek mindkét vége kívül lenne $V \\setminus H$-n, akkor mindkét vége $H$-ban lenne. Így $f(G, k) = (G, n - k)$ jó visszavezetés.",
    },
  },
  {
    type: "example",
    title: {
      hu: "Hamilton-kör $\\leq_p$ Részgráfizomorfizmus",
    },
    content: {
      hu: "A Részgráfizomorfizmus kérdése, hogy $G_1$ izomorf-e $G_2$ egy részgráfjával. Legyen $G_1$ egy $|V(G)|$ csúcsú kör, $G_2 = G$. $G$-ben pontosan akkor van Hamilton-kör, ha ez a kör megtalálható benne.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "SAT, 3SAT és a klózok",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "$SAT \\leq_p 3SAT$: minden klózt 3 literálosra alakítunk új változók bevezetésével úgy, hogy a kielégíthetőség megmaradjon.",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "Rövid klóz: ismételjük a literált, pl. $\\ell \\to \\ell \\vee \\ell \\vee \\ell$, $\\ell_1 \\vee \\ell_2 \\to \\ell_1 \\vee \\ell_2 \\vee \\ell_2$." },
      { hu: "Hosszú klóz: új $y$ változókkal láncba vágjuk, pl. $\\ell_1 \\vee \\ell_2 \\vee \\ell_3 \\vee \\ell_4 \\to (\\ell_1 \\vee \\ell_2 \\vee y) \\wedge (\\neg y \\vee \\ell_3 \\vee \\ell_4)$." },
    ],
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "NP-köztes problémák",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Ha $P \\neq NP$, akkor léteznek olyan problémák, amelyek NP-ben vannak, de sem nem polinom időben megoldhatók, sem nem NP-teljesek. Ezeket NP-köztes problémáknak nevezzük. Ladner tétele szerint ilyen problémák biztosan léteznek, ha $P \\neq NP$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Gyakran említett jelöltek: Gráfizomorfizmus és Prímfaktorizáció. Ezek valószínűleg nehezebbek a P-beli problémáknál, de nem tűnnek olyan reménytelenül nehéznek, mint az NP-teljes problémák.",
    },
  },
  {
    type: "funfact",
    text: {
      hu: "Babai László 2017-ben megmutatta, hogy a Gráfizomorfizmus kvázipolinom időben ($2^{(\\log n)^c}$) megoldható. Ez jóval gyorsabb bármely exponenciális algoritmusnál, de még nem polinomiális.",
    },
  },
];
