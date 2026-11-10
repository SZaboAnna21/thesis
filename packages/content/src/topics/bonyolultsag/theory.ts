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
      hu: "Az eldönthetetlenség után most olyan problémákkal foglalkozunk, amelyekről már tudjuk, hogy megoldhatók. A kérdés ilyenkor nem az, hogy létezik-e algoritmus rájuk, hanem az, hogy mennyi időre vagy tárhelyre van szükség a megoldásukhoz. A hasonló erőforrásigényű problémákat közös bonyolultsági osztályokba soroljuk.",
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
      hu: "Az erőforrásigényt általában nem pontosan adjuk meg, mert számunkra nem az a lényeg, hogy egy algoritmus például 1000 vagy 2000 lépést végez-e, hanem az, hogy a bemenet növekedésével milyen gyorsan nő az idő- vagy tárigénye. Ezt a növekedési ütemet írják le az aszimptotikus jelölések. Legyenek $f, g : \\mathbb{N} \\to \\mathbb{R}_0^+$ függvények.",
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
      { hu: "$f(n) = O(g(n))$ (felső korlát), ha $f(n) \\leq c \\cdot g(n)$," },
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
      ["$0$", "$f = O(g)$, de $f \\neq \\Omega(g)$"],
      ["$c > 0$ konstans", "$f = \\Theta(g)$"],
      ["$+\\infty$", "$f = \\Omega(g)$, de $f \\neq O(g)$"],
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
      hu: "Egy Turing-gép futási ideje egy $u$ szóra a megállásig megtett lépések száma. $M$ $f(n)$ időkorlátos, ha minden $u$ bemeneten legfeljebb $f(|u|)$ lépést tesz. Nemdeterminisztikus gépnél a leghosszabb számítási ágat nézzük.",
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
      { hu: "$P = \\bigcup_{k \\geq 1} TIME(n^k)$: polinom időben eldönthető nyelvek," },
      { hu: "$NP = \\bigcup_{k \\geq 1} NTIME(n^k)$: nemdeterminisztikusan polinom időben eldönthető nyelvek," },
      { hu: "$EXPTIME = \\bigcup_{k \\geq 1} TIME(2^{n^k})$." },
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "$P$-re úgy gondolunk, mint a gyakorlatban hatékonyan megoldható problémák osztályára. Nyilván $P \\subseteq NP$, mert a determinisztikus gép a nemdeterminisztikus speciális esete. Továbbá $NTIME(f(n)) \\subseteq TIME(2^{O(f(n))})$, mert a nemdeterminisztikus gép összes ágát végig lehet próbálni.",
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
      hu: "Egy probléma pontosan akkor NP-beli, ha minden „igen” bemenetéhez van polinom méretű tanú (bizonyíték), ami polinom időben ellenőrizhető. A nemdeterminisztikus gép ezt a tanút „megsejti”, majd determinisztikusan ellenőrzi.",
    },
  },
  {
    type: "example",
    title: {
      hu: "Tanúk",
    },
    content: {
      hu: "SAT: egy kielégítő interpretáció (behelyettesítjük, és kiértékeljük a formulát). Hamilton-kör: a csúcsok egy sorrendje (ellenőrizzük, hogy minden csúcs egyszer szerepel, és egymás utáni csúcsok szomszédosak). Klikk: $k$ darab csúcs (ellenőrizzük, hogy páronként szomszédosak).",
    },
  },
  {
    type: "funfact",
    text: {
      hu: "A $P \\overset{?}{=} NP$ kérdés a számítástudomány leghíresebb nyitott problémája: a Clay Intézet egymillió dolláros díjat tűzött ki rá. A sejtés az, hogy $P \\neq NP$, vagyis megoldást ellenőrizni könnyebb, mint találni.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "A coNP osztály",
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
      { hu: "$P = coP$: a polinomidejű determinisztikus gépnél elég megcserélni $q_i$-t és $q_n$-t." },
      { hu: "$NP \\overset{?}{=} coNP$ nyitott, a sejtés az, hogy nem egyenlők. Nemdeterminisztikus gépnél a csere nem működik, mert „van elfogadó ág” negáltja „minden ág elutasít”." },
      { hu: "Szemléletesen: coNP-ben a „nem” válaszhoz van rövid, gyorsan ellenőrizhető tanú (cáfolat)." },
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
      hu: "A tárigényt offline Turing-géppel mérjük: ennek az első (bemeneti) szalagja csak olvasható, és csak a munkaszalagokon használt cellákat számoljuk. Így az input hossza nem számít bele, és értelmet kap a lineárisnál kisebb tár is (pl. $\\log n$).",
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
      hu: "Következmény: $PSPACE = NPSPACE$, hiszen $n^k$ négyzete is polinom. Tárnál tehát a nemdeterminizmus legfeljebb négyzetes romlással kiváltható, időnél ilyet nem tudunk. A bizonyítás ötlete az $\\text{Elér}$ probléma (van-e út $s$-ből $t$-be) rekurzív megoldása a gép konfigurációs gráfján: van-e legfeljebb $2^i$ hosszú út $x$-ből $y$-ba $\\iff$ van olyan $z$ felezőpont, hogy mindkét fél legfeljebb $2^{i-1}$ hosszú.",
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
