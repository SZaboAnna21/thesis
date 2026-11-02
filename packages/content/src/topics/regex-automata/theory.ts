import type { ContentBlock } from "../../types/content";

export const theory: ContentBlock[] = [
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Kleene tétele",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    name: {
      hu: "Kleene tétele",
    },
    statement: {
      hu: "Minden reguláris kifejezés reguláris nyelvet ír le, és minden reguláris nyelvhez van őt leíró reguláris kifejezés.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Vagyis a reguláris grammatika, a DVA, az NDVA és a reguláris kifejezés mind ugyanazt tudja. A gyakorlatban az a kérdés, hogyan alakítjuk át egyiket a másikba. Ezt nézzük meg mindkét irányban.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Reguláris kifejezésből automata",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Az ötlet: engedjük meg, hogy az élekre ne csak betűk, hanem egész reguláris kifejezések kerüljenek (ez az általánosított automata). Egyetlen éllel indulunk, és addig szedjük szét a címkéket, amíg csak betűk és $\\varepsilon$-ok maradnak.",
    },
  },
  {
    type: "list",
    ordered: true,
    items: [
      { hu: "Kiindulás: két állapot, $q_S$ (kezdő) és $q_V$ (elfogadó), köztük egyetlen $R$ címkéjű él." },
      { hu: "Élek szétszedése az alábbi táblázat szerint, amíg minden címke $\\Sigma \\cup \\{\\varepsilon\\}$-beli nem lesz. Így $\\varepsilon$NDVA-t kapunk." },
      { hu: "Az $\\varepsilon$-átmenetek eltüntetése: így NDVA lesz belőle." },
      { hu: "Ha DVA kell: determinizálás részhalmaz-konstrukcióval (lásd NDVA)." },
    ],
  },
  {
    type: "table",
    headers: ["Él", "Helyette"],
    rows: [
      ["$q_1 \\xrightarrow{R_1 + R_2} q_2$", "két párhuzamos él: $q_1 \\xrightarrow{R_1} q_2$ és $q_1 \\xrightarrow{R_2} q_2$"],
      ["$q_1 \\xrightarrow{R_1 R_2} q_2$", "új állapoton át: $q_1 \\xrightarrow{R_1} q_{\\text{új}} \\xrightarrow{R_2} q_2$"],
      ["$q_1 \\xrightarrow{R^*} q_2$", "$q_1 \\xrightarrow{\\varepsilon} q_{\\text{új}} \\xrightarrow{\\varepsilon} q_2$, és hurok: $q_{\\text{új}} \\xrightarrow{R} q_{\\text{új}}$"],
    ],
  },
  {
    type: "warning",
    text: {
      hu: "A csillagnál az új állapot nem spórolható meg! Ha a hurkot egyből $q_1$-re tennénk, és $q_1$-nek más élei is vannak, akkor azok is használhatnák a hurkot. Pl. $q_S \\xrightarrow{a} q_1$, $q_1 \\xrightarrow{b^*} q_2$, $q_1 \\xrightarrow{c} q_3$ esetén egy $q_1$-en lévő $b$-hurokkal az $abc$ is átjutna $q_3$-ba, pedig $a$ után rögtön $c$ kellett.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Egyszerűsítés: ha egy állapotba csak egy él jön be, és csak egy él megy ki belőle, és ezek közül legalább az egyik $\\varepsilon$, akkor az állapot elhagyható, a két élt pedig egybevonjuk.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Az $\\varepsilon$-átmenetek eltüntetése",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "Minden $q$-ra $H(q)$: ahová $q$-ból csak $\\varepsilon$-élekkel eljutunk ($q$-t is beleértve)." },
      { hu: "Új betűs átmenet: $q \\xrightarrow{t} r$, ha valamely $q' \\in H(q)$-ra $q' \\xrightarrow{t} r$ eredeti él volt. Tehát „$\\varepsilon$-ok, aztán egy betű”." },
      { hu: "Új elfogadó állapotok: $q$ elfogadó, ha $H(q)$-ban van elfogadó állapot." },
    ],
  },
  {
    type: "warning",
    text: {
      hu: "Az elfogadó állapotok bővítését ne felejtsd el! A szó végi $\\varepsilon$-lépéseket csak ez helyettesíti, nélküle pl. a csillagok 0-szoros ismétlése elveszhet.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Példa",
    },
  },
  {
    type: "example",
    content: {
      hu: "$R = a(b + c)^*$. Kezdetben $q_S \\xrightarrow{a(b+c)^*} q_V$. Konkatenáció: $q_S \\xrightarrow{a} q_1 \\xrightarrow{(b+c)^*} q_V$. Csillag: $q_1 \\xrightarrow{\\varepsilon} q_2 \\xrightarrow{\\varepsilon} q_V$, és hurok $q_2 \\xrightarrow{b + c} q_2$. Unió: a hurokból két hurok lesz, $q_2 \\xrightarrow{b} q_2$ és $q_2 \\xrightarrow{c} q_2$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "$q_1$-be csak az $a$-él jön, és belőle csak az $\\varepsilon$-él megy ki, így $q_1$ elhagyható: $q_S \\xrightarrow{a} q_2$. Az $\\varepsilon$NDVA:",
    },
  },
  {
    type: "table",
    headers: ["", "$a$", "$b$", "$c$", "$\\varepsilon$"],
    rows: [
      ["→ $q_S$", "$\\{q_2\\}$", "$\\emptyset$", "$\\emptyset$", "$\\emptyset$"],
      ["$q_2$", "$\\emptyset$", "$\\{q_2\\}$", "$\\{q_2\\}$", "$\\{q_V\\}$"],
      ["← $q_V$", "$\\emptyset$", "$\\emptyset$", "$\\emptyset$", "$\\emptyset$"],
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "$H(q_S) = \\{q_S\\}$, $H(q_2) = \\{q_2, q_V\\}$, $H(q_V) = \\{q_V\\}$. A betűs átmenetek nem változnak (mert $q_V$-ből nem indul él), de $q_2$ elfogadó lesz. A $q_V$ így elérhetetlen, elhagyjuk:",
    },
  },
  {
    type: "table",
    headers: ["", "$a$", "$b$", "$c$"],
    rows: [
      ["→ $q_S$", "$q_2$", "–", "–"],
      ["← $q_2$", "–", "$q_2$", "$q_2$"],
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Ez már determinisztikus. Teljes DVA-hoz még egy csapdaállapot kell a hiányzó átmenetekhez.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Automatából reguláris kifejezés",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Minden $q$ állapothoz egy $X_q$ ismeretlent veszünk fel: azokat a szavakat, amelyekkel $q$-ból elfogadó állapotba jutunk. Egy ilyen szó vagy egy $t$ betűvel kezdődik, és a maradékát már $\\delta(q, t)$-ből kell elfogadni, vagy üres (ha $q$ elfogadó). Ebből minden állapotra kapunk egy egyenletet:",
    },
  },
  {
    type: "formula",
    latex: "X_q = \\sum_{t \\in \\Sigma} t\\, X_{\\delta(q, t)} \\;+\\; \\begin{cases} \\varepsilon & \\text{ha } q \\in F \\\\ \\emptyset & \\text{ha } q \\notin F \\end{cases}",
  },
  {
    type: "paragraph",
    text: {
      hu: "A táblázatból soronként leolvasható: ahány sor, annyi egyenlet. Ezt Arden tételével és behelyettesítéssel megoldjuk (lásd Reguláris kifejezések), és a kezdőállapot $X_{q_0}$ értéke lesz a válasz.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "Itt az ismeretlen jobbra kerül ($X = QX + R$), ezért a megoldás $X = Q^*R$, nem $RQ^*$! A csapdaállapot ismeretlenje $\\emptyset$, a rá mutató tagok egyszerűen kiesnek.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Példa",
    },
  },
  {
    type: "table",
    headers: ["", "$a$", "$b$", "$c$"],
    rows: [
      ["→ $q_0$", "$q_1$", "$q_2$", "$q_3$"],
      ["$q_1$", "$q_4$", "$q_2$", "$q_4$"],
      ["$q_2$", "$q_0$", "$q_4$", "$q_3$"],
      ["← $q_3$", "$q_4$", "$q_3$", "$q_4$"],
      ["$q_4$", "$q_4$", "$q_4$", "$q_4$"],
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Legyen $X, Y, Z, V$ a $q_0, q_1, q_2, q_3$ ismeretlenje. A $q_4$ csapda, így kimarad:",
    },
  },
  {
    type: "formula",
    latex: "\\begin{aligned} X &= aY + bZ + cV \\\\ Y &= bZ \\\\ Z &= aX + cV \\\\ V &= bV + \\varepsilon \\end{aligned}",
  },
  {
    type: "paragraph",
    text: {
      hu: "Ardennel $V = b^*$, így $Z = aX + cb^*$ és $Y = b(aX + cb^*)$. Az első egyenletbe beírva: $X = ab(aX + cb^*) + b(aX + cb^*) + cb^*$, rendezve $X = (aba + ba)X + (abc + bc + c)b^*$. Még egy Arden:",
    },
  },
  {
    type: "formula",
    latex: "L(A) = X = (aba + ba)^*(abc + bc + c)b^*",
  },
  {
    type: "paragraph",
    text: {
      hu: "Ellenőrzés kiolvasással: $q_0$-ból $ba$ vagy $aba$ visz vissza $q_0$-ba, $c$, $bc$ vagy $abc$ visz $q_3$-ba, és ott $b$-vel lehet körözni.",
    },
  },
];
