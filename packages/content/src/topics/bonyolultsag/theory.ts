import type { ContentBlock } from "../../types/content";

export const theory: ContentBlock[] = [
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Bonyolultsági osztályok",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "z eldönthetetlen problémák után most olyan feladatokkal foglalkozunk, amelyekről tudjuk, hogy megoldhatók. A kérdés már nem az, hogy létezik-e algoritmus rájuk, hanem az, hogy mennyi erőforrás szükséges a megoldásukhoz. Elsősorban az időt (mennyi lépést végez a gép) és a tárat (mennyi memóriát használ) vizsgáljuk. Az azonos nagyságrendű erőforrásigényű problémákat bonyolultsági osztályokba soroljuk.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Aszimptotikus jelölések",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Egy algoritmus elemzésekor általában nem érdekel, hogy pontosan 1000 vagy 2000 lépést fut-e, mert ez csak konstans szorzónyi különbség. Sokkal fontosabb, hogy mi történik, ha a bemenet mérete nagy lesz. Az aszimptotikus jelölések ezt a növekedési ütemet írják le.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "$O$, $\\Omega$, $\\Theta$",
    },
    content: {
      hu: "Valamely $c > 0$ konstansra és $N$ küszöbindexre minden $n \\geq N$ esetén:",
    },
    items: [
      { hu: "$f(n) = O(g(n))$ (felső korlát), ha $f(n) \\leq c \\cdot g(n)$, " },
      { hu: "$f(n) = \\Omega(g(n))$ (alsó korlát), ha $f(n) \\geq c \\cdot g(n)$," },
      { hu: "$f(n) = \\Theta(g(n))$ (éles korlát), ha $f = O(g)$ és $f = \\Omega(g)$ is teljesül." },
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "A gyakorlatban a legkényelmesebb a hányados határértékét nézni (ha létezik):",
    },
  },
  {
    type: "table",
    headers: ["$\\lim f(n)/g(n)$", "Következmény"],
    rows: [
      ["$0$", "$f = O(g)$, de $f \\neq \\Omega(g)$ az első függvény lassabban nő"],
      ["$c > 0$ konstans", "$f = \\Theta(g)$ ugyanabba a nagyságrendbe tartoznak"],
      ["$+\\infty$", "$f = \\Omega(g)$, de $f \\neq O(g)$ az első függvény gyorsabban nő"],
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Hasznos szabályok:",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "Egy összeg nagyságrendjét a domináns tag adja: $f + g = \\Theta(\\max\\{f, g\\})$. Pl. $2n^2 + 3\\log n = \\Theta(n^2)$." },
      { hu: "Egy $k$-adfokú, pozitív főegyütthatójú polinom $\\Theta(n^k)$." },
      { hu: "A sorrend: $\\log n \\ll n^c \\ll d^n \\ll c^n$ (ha $c > d > 1$). Minden polinom $O(c^n)$, de nem $\\Omega(c^n)$." },
      { hu: "A logaritmus alapja nem számít: $\\log_a n = \\Theta(\\log_b n)$." },
      { hu: "$O$, $\\Omega$, $\\Theta$ tranzitív, és $f = O(g) \\iff g = \\Omega(f)$." },
    ],
  },
  {
    type: "example",
    title: {
      hu: "$f(n) = n^{1/100} \\cdot 2^{100}$ és $h(n) = 100n \\cdot n^{1/100}$",
    },
    content: {
      hu: "$\\frac{f(n)}{h(n)} = \\frac{2^{100}}{100} \\cdot \\frac{1}{n} \\to 0$, tehát $f(n) = O(h(n))$, de $h(n) \\neq O(f(n))$. A $2^{100}$ hatalmas konstans, de aszimptotikusan nem számít.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "Az $f = O(g)$ jelölésben az egyenlőségjel nem szimmetrikus! $n = O(n^2)$ igaz, de $n^2 = O(n)$ hamis.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Időbonyolultság",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Az időbonyolultság azt vizsgálja, hogy a bemenet méretének függvényében hány lépést kell végrehajtani a probléma megoldásához. Formálisan egy Turing-gép futási ideje egy adott bemeneten a megállásig végrehajtott lépések száma.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Időbonyolultsági osztályok",
    },
    content: {
      hu: "Egy $f : \\mathbb{N} \\to \\mathbb{N}$ függvényre:",
    },
    items: [
      { hu: "$TIME(f(n))$: az $O(f(n))$ időkorlátos determinisztikus Turing-géppel eldönthető nyelvek," },
      { hu: "$NTIME(f(n))$: ugyanez nemdeterminisztikus Turing-géppel," },
      { hu: "$P = \\bigcup_{k \\geq 1} TIME(n^k)$: polinom időben eldönthető nyelvek, ismert hatékony (polinom idejű) algoritmus" },
      { hu: "$NP = \\bigcup_{k \\geq 1} NTIME(n^k)$: nemdeterminisztikusan polinom időben eldönthető nyelvek, egy jó megoldás helyessége polinom időben ellenőrizhető" },
      { hu: "$EXPTIME = \\bigcup_{k \\geq 1} TIME(2^{n^k})$." },
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "$P$ osztályba a polinom időben megoldható problémák tartoznak, ezért ezeket tekintjük hatékonyan kezelhetőnek. Nyilván $P \\subseteq NP$, hiszen a determinisztikus gép a nemdeterminisztikus speciális esete. Egy nemdeterminisztikus gép determinisztikusan is szimulálható az összes számítási ág végigpróbálásával, ezért $NTIME(f(n)) \\subseteq TIME(2^{O(f(n))})$.Vagyis a nemdeterminizmus kiváltható, de általában exponenciális időveszteséggel.",
    },
  },
  {
    type: "heading",
    level: 3,
    text: {
      hu: "Az NP tanús jellemzése",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Az NP osztály egyik legfontosabb tulajdonsága, hogy egy megoldást gyorsan tudunk ellenőrizni, még akkor is, ha nem tudjuk gyorsan megtalálni. Formálisan egy probléma akkor NP-beli, ha minden „igen” válaszú bemenethez létezik egy polinom méretű tanú (bizonyíték), amelynek helyessége polinom időben ellenőrizhető. A nemdeterminisztikus gép ezt a tanút „megsejti”, majd determinisztikusan ellenőrzi.",
    },
  },
  { 
    type: "list",
    ordered: false,
    items: [
      { hu: "SAT: tanú egy kielégítő változóértékadás." },
      { hu: "Hamilton-kör: tanú a csúcsok megfelelő sorrendje." },
      { hu: "Klikk: tanú a kiválasztott csúcsok." },
    ],
  },
  {
    type: "funfact",
    text: {
      hu: "A  híres $P \\overset{?}{=} NP$ kérdés a számítástudomány leghíresebb nyitott problémája: a Clay Intézet egymillió dolláros díjat tűzött ki rá. A sejtés az, hogy $P \\neq NP$, vagyis megoldást ellenőrizni könnyebb, mint találni.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "A coNP osztály",
    },
  },{
    type: "paragraph",
    text: {
      hu: "Egy bonyolultsági osztály komplementerét a co előtaggal jelöljük:",
    },
  },
  {
    type: "definition",
    term: {
      hu: "co-osztály",
    },
    content: {
      hu: "Egy $\\mathcal{C}$ osztályra $co\\mathcal{C} = \\{L \\mid \\overline{L} \\in \\mathcal{C}\\}$. Tehát $coNP$ azoknak a nyelveknek az osztálya, amelyek komplementere NP-beli.",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "$P = coP$: a polinomidejű determinisztikus gépnél elég megcserélni az elfogadó és elutasító állapotokat $q_i$-t és $q_n$-t." },
      { hu: "$NP \\overset{?}{=} coNP$ nyitott, a sejtés az, hogy nem egyenlők." },
      { hu: "Nemdeterminisztikus gépeknél az elfogadó és elutasító állapotok felcserélése nem működik, mert a „van elfogadó ág” állítás negáltja nem az, hogy „van elutasító ág”, hanem hogy „minden ág elutasít”." },
      { hu: "Példák: $Unsat$ (kielégíthetetlen formulák) és $Taut$ (tautológiák) coNP-teljesek." },
    ],
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Tárbonyolultság",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A tárigényt offline Turing-géppel mérjük: a bemeneti szalag csak olvasható, így csak a munkaszalagokon használt cellákat számoljuk. Emiatt értelmet kapnak a lineárisnál kisebb tárkorlátok is, például a logaritmikus tár.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Tárbonyolultsági osztályok",
    },
    content: {
      hu: "Offline Turing-gépekkel:",
    },
    items: [
      { hu: "$SPACE(f(n))$, $NSPACE(f(n))$: $O(f(n))$ többlettárral determinisztikusan, illetve nemdeterminisztikusan eldönthető nyelvek," },
      { hu: "$L = SPACE(\\log n)$, $NL = NSPACE(\\log n)$," },
      { hu: "$PSPACE = \\bigcup_{k \\geq 1} SPACE(n^k)$, $NPSPACE = \\bigcup_{k \\geq 1} NSPACE(n^k)$." },
    ],
  },
  {
    type: "theorem",
    kind: "tetel",
    name: {
      hu: "Savitch",
    },
    statement: {
      hu: "Ha $f(n) \\geq \\log n$, akkor $NSPACE(f(n)) \\subseteq SPACE(f^2(n))$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Következmény: $PSPACE = NPSPACE$, hiszen egy polinom négyzete továbbra is polinom. Ez azt jelenti, hogy a nemdeterminizmus tárbonyolultság szempontjából legfeljebb négyzetes többletköltséget jelent. A bizonyítás alapötlete az, hogy egy konfigurációs gráfban az elérhetőséget rekurzívan, egy köztes konfiguráción keresztül vizsgáljuk.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Az osztályok kapcsolata",
    },
  },
  {
    type: "formula",
    latex: "L \\subseteq NL \\subseteq P \\subseteq NP \\subseteq PSPACE = NPSPACE \\subseteq EXPTIME",
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "Biztosan tudjuk, hogy $NL \\subsetneq PSPACE$ és $P \\subsetneq EXPTIME$." },
      { hu: "A sejtés, hogy a lánc minden tartalmazása valódi, de egyiket sem tudjuk bizonyítani (pl. $P \\overset{?}{=} NP$, $L \\overset{?}{=} NL$)." },
      { hu: "$NP \\subseteq PSPACE$, mert az összes lehetséges tanút egyesével, ugyanazon a polinom méretű táron végig lehet próbálni." },
    ],
  },
  {
    type: "warning",
    text: {
      hu: "Az idő legalább annyi, mint a tár: $t$ lépés alatt legfeljebb $t$ cellát lehet érinteni. Ezért $TIME(f(n)) \\subseteq SPACE(f(n))$, fordítva viszont nem igaz (a tár újrahasznosítható).",
    },
  },
];
