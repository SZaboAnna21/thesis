import type { ContentBlock } from "../../types/content";

export const theory: ContentBlock[] = [
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Nemdeterminisztikus véges automata",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A determinisztikus automata egy fegyelmezett katona: minden állapotból, minden betűre pontosan egy helyre léphet. A nemdeterminisztikus automata inkább egy határozatlan turista: lehet, hogy több felé is mehetne, lehet, hogy sehova, és ráadásul több helyről is elindulhat.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Véges nemdeterminisztikus automata (NVDA)",
    },
    content: {
      hu: "Egy $A = \\langle Q, \\Sigma, \\delta, Q_0, F \\rangle$ rendezett ötös, ahol",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "$Q$ az állapotok véges, nemüres halmaza," },
      { hu: "$\\Sigma$ az inputszimbólumok ábécéje," },
      { hu: "$\\delta : Q \\times \\Sigma \\to \\mathcal{P}(Q)$ az állapot-átmenet függvény (egy állapot-betű párhoz állapotok halmaza tartozik, akár üres is)," },
      { hu: "$Q_0 \\subseteq Q$ a kezdőállapotok halmaza," },
      { hu: "$F \\subseteq Q$ az elfogadó állapotok halmaza." },
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "A VDA ennek speciális esete: ha minden $(q, a)$-ra $|\\delta(q, a)| = 1$ (és egyetlen kezdőállapot van), akkor minden bemenetre pontosan egy működés van, és az elfogadás is ugyanazt jelenti.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Átmenetek szabályokkal",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Az átmeneteket átírási szabályokként is felírhatjuk. Minden $p \\in \\delta(q, a)$ esetén felvesszük a $qa \\to p$ szabályt:",
    },
  },
  {
    type: "formula",
    latex: "M_\\delta = \\{qa \\to p \\mid p, q \\in Q,\\ a \\in \\Sigma,\\ p \\in \\delta(q, a)\\}",
  },
  {
    type: "paragraph",
    text: {
      hu: "$A$ pontosan akkor determinisztikus, ha minden $(q, a)$ párhoz pontosan egy $p$ van, amire $qa \\to p \\in M_\\delta$.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Konfiguráció és redukció",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Konfiguráció",
    },
    content: {
      hu: "Egy $u \\in Q\\Sigma^*$ szó az automata konfigurációja: elöl az aktuális állapot, utána a még el nem olvasott bemenet.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Redukció",
    },
    content: {
      hu: "$A$ az $u$ konfigurációt egy lépésben a $v$-re redukálja ($u \\Rightarrow_A v$), ha van $qa \\to p \\in M_\\delta$ szabály és $w \\in \\Sigma^*$, hogy $u = qaw$ és $v = pw$. A $\\Rightarrow_A^*$ (többlépéses redukció) ennek reflexív, tranzitív lezártja: $u = v$, vagy van $u = w_0 \\Rightarrow_A w_1 \\Rightarrow_A \\dots \\Rightarrow_A w_k = v$ lánc ($k \\ge 1$).",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Determinisztikus esetben minden $u \\in Q\\Sigma^+$ konfigurációból pontosan egy lépés van. Nemdeterminisztikusan lehet több is, vagy egy sem (ilyenkor az a működés egyszerűen elakad).",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Elfogadott nyelv",
    },
    content: {
      hu: "$L(A) = \\{u \\in \\Sigma^* \\mid q_0u \\Rightarrow_A^* p$ valamely $q_0 \\in Q_0$-ra és $p \\in F$-re$\\}$.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "Elég egyetlen szerencsés út! Egy szó akkor is benne van $L(A)$-ban, ha a legtöbb működés elakad vagy rossz helyen köt ki, csak legyen legalább egy, ami elfogadó állapotban ér véget.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Táblázatnál ugyanaz a jelölés, mint a VDA-nál: → kezdőállapot, ← elfogadó, ⇆ mindkettő. Itt több → is lehet, a cellákban pedig halmazok állnak.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Kapcsolat a reguláris grammatikákkal",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A 3-as normálforma és az automata gyakorlatilag ugyanaz a dolog két jelmezben: $X \\to aY$ = „$X$-ből $a$-ra $Y$-ba lépek”, $X \\to \\varepsilon$ = „$X$-ben megállhatok”.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Automatából grammatika",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    statement: {
      hu: "Minden $A = \\langle Q, \\Sigma, \\delta, Q_0, F \\rangle$ NVDA-hoz van olyan 3-típusú $G$ grammatika, hogy $L(G) = L(A)$.",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "$N := Q \\cup \\{S\\}$," },
      { hu: "$q \\to ap \\in P \\iff qa \\to p \\in M_\\delta$," },
      { hu: "$S \\to ap \\in P \\iff q_0a \\to p \\in M_\\delta$ valamely $q_0 \\in Q_0$-ra," },
      { hu: "$p \\to \\varepsilon \\in P \\iff p \\in F$," },
      { hu: "$S \\to \\varepsilon \\in P \\iff F \\cap Q_0 \\neq \\emptyset$." },
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Az új $S$ azért kell, mert több kezdőállapot is lehet: $S$ az összes kezdőállapot kimenő szabályait egyben megkapja. Determinisztikus esetben ez fölösleges: $N := Q$, a kezdőszimbólum $q_0$, a szabályok $q \\to ap \\iff qa \\to p \\in M_\\delta$ és $p \\to \\varepsilon \\iff p \\in F$.",
    },
  },
  {
    type: "example",
    title: {
      hu: "VDA-hoz 3NF",
    },
    content: {
      hu: "A paritásos VDA-ból ($q_0$ kezdő, $q_1, q_2$ elfogadó): $q_0 \\to aq_2 \\mid bq_1$, $q_1 \\to aq_3 \\mid bq_0 \\mid \\varepsilon$, $q_2 \\to aq_0 \\mid bq_3 \\mid \\varepsilon$, $q_3 \\to aq_1 \\mid bq_2$. Soronként leolvasod a táblázatot, és kész.",
    },
  },
  {
    type: "example",
    title: {
      hu: "NVDA-hoz 3NF",
    },
    content: {
      hu: "Itt $Q_0 = \\{q_0, q_2\\}$, $F = \\{q_1, q_2\\}$:",
    },
  },
  {
    type: "table",
    headers: ["", "$a$", "$b$"],
    rows: [
      ["→ $q_0$", "$\\{q_1, q_2\\}$", "$\\{q_1\\}$"],
      ["← $q_1$", "$\\{q_3\\}$", "$\\{q_0, q_1\\}$"],
      ["⇆ $q_2$", "$\\{q_0\\}$", "$\\{q_3\\}$"],
      ["$q_3$", "$\\{q_1\\}$", "$\\{\\}$"],
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "A szabályok: $q_0 \\to aq_1 \\mid aq_2 \\mid bq_1$, $q_1 \\to aq_3 \\mid bq_0 \\mid bq_1 \\mid \\varepsilon$, $q_2 \\to aq_0 \\mid bq_3 \\mid \\varepsilon$, $q_3 \\to aq_1$. Az $S$ összeszedi $q_0$ és $q_2$ szabályait, és mivel $q_2 \\in F \\cap Q_0$, kap egy $\\varepsilon$-t is: $S \\to aq_1 \\mid aq_2 \\mid bq_1 \\mid aq_0 \\mid bq_3 \\mid \\varepsilon$.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Grammatikából automata",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    statement: {
      hu: "Minden 3-típusú $G = \\langle N, \\Sigma, P, S \\rangle$ grammatikához van olyan $A$ NVDA, hogy $L(G) = L(A)$.",
    },
  },
  {
    type: "list",
    ordered: true,
    items: [
      { hu: "Ha $G$ nem 3-as normálformájú, hozd normálformára (hosszredukció + láncmentesítés)." },
      { hu: "$Q := N$, $Q_0 := \\{S\\}$, $Xa \\to Y \\in M_\\delta \\iff X \\to aY \\in P$, és $X \\in F \\iff X \\to \\varepsilon \\in P$." },
    ],
  },
  {
    type: "example",
    title: {
      hu: "3NF-hez NVDA",
    },
    content: {
      hu: "$S \\to aA \\mid aB \\mid bB \\mid \\varepsilon$, $A \\to bS \\mid bB$, $B \\to aS \\mid aA \\mid \\varepsilon$. Minden nemterminális egy állapot, $S$ a kezdő, akinek van $\\varepsilon$-szabálya, az elfogadó:",
    },
  },
  {
    type: "table",
    headers: ["", "$a$", "$b$"],
    rows: [
      ["⇆ $S$", "$\\{A, B\\}$", "$\\{B\\}$"],
      ["$A$", "$\\{\\}$", "$\\{S, B\\}$"],
      ["← $B$", "$\\{S, A\\}$", "$\\{\\}$"],
    ],
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Determinizálás",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    statement: {
      hu: "Minden $A = \\langle Q, \\Sigma, \\delta, Q_0, F \\rangle$ NVDA-hoz megkonstruálható egy $A' = \\langle Q', \\Sigma, \\delta', q_0', F' \\rangle$ VDA, hogy $L(A) = L(A')$.",
    },
  },
  {
    type: "formula",
    latex: "Q' := \\mathcal{P}(Q), \\quad q_0' := Q_0, \\quad F' := \\{q' \\in Q' \\mid q' \\cap F \\neq \\emptyset\\}, \\quad \\delta'(q', a) := \\bigcup_{q \\in q'} \\delta(q, a)",
  },
  {
    type: "paragraph",
    text: {
      hu: "A trükk: ha nem tudod eldönteni, merre menj, menj mindenfelé egyszerre. Az új automata állapota az, hogy „melyik régi állapotokban lehetek most”. Ez egy halmaz, és mivel minden halmazra egyértelmű, hova lép, máris determinisztikus. Elfogad, ha a halmazban van legalább egy elfogadó állapot.",
    },
  },
  {
    type: "example",
    title: {
      hu: "NVDA-hoz VDA",
    },
    content: {
      hu: "Kiinduló NVDA, $Q_0 = \\{q_0, q_1\\}$, $F = \\{q_1, q_2\\}$:",
    },
  },
  {
    type: "table",
    headers: ["", "$a$", "$b$"],
    rows: [
      ["→ $q_0$", "$\\{\\}$", "$\\{q_1, q_2\\}$"],
      ["⇆ $q_1$", "$\\{q_0\\}$", "$\\{\\}$"],
      ["← $q_2$", "$\\{q_1\\}$", "$\\{q_2\\}$"],
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "I. megoldás: mind a $2^3 = 8$ részhalmazt felírjuk. Minden sorban a cella a halmaz elemeinek celláit uniózza össze, elfogadó minden halmaz, amiben van $q_1$ vagy $q_2$:",
    },
  },
  {
    type: "table",
    headers: ["", "$a$", "$b$"],
    rows: [
      ["$\\{\\}$", "$\\{\\}$", "$\\{\\}$"],
      ["$\\{q_0\\}$", "$\\{\\}$", "$\\{q_1, q_2\\}$"],
      ["← $\\{q_1\\}$", "$\\{q_0\\}$", "$\\{\\}$"],
      ["← $\\{q_2\\}$", "$\\{q_1\\}$", "$\\{q_2\\}$"],
      ["⇆ $\\{q_0, q_1\\}$", "$\\{q_0\\}$", "$\\{q_1, q_2\\}$"],
      ["← $\\{q_0, q_2\\}$", "$\\{q_1\\}$", "$\\{q_1, q_2\\}$"],
      ["← $\\{q_1, q_2\\}$", "$\\{q_0, q_1\\}$", "$\\{q_2\\}$"],
      ["← $\\{q_0, q_1, q_2\\}$", "$\\{q_0, q_1\\}$", "$\\{q_1, q_2\\}$"],
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "II. megoldás (összefüggő VDA): minek felírni azt, ahova úgysem jutunk el? Szélességi kereséssel indulunk a kezdőállapotból ($\\{q_0, q_1\\}$). Sorra kiszámoljuk a sorban álló halmazok átmeneteit, az újonnan felfedezett halmazokat a sor végére tesszük, és ha a sor kiürült, leállunk. A felfedezés sorrendje: $\\{q_0, q_1\\}$, $\\{q_0\\}$, $\\{q_1, q_2\\}$, $\\{\\}$, $\\{q_2\\}$, $\\{q_1\\}$.",
    },
  },
  {
    type: "table",
    headers: ["", "$a$", "$b$"],
    rows: [
      ["⇆ $\\{q_0, q_1\\}$", "$\\{q_0\\}$", "$\\{q_1, q_2\\}$"],
      ["$\\{q_0\\}$", "$\\{\\}$", "$\\{q_1, q_2\\}$"],
      ["← $\\{q_1, q_2\\}$", "$\\{q_0, q_1\\}$", "$\\{q_2\\}$"],
      ["$\\{\\}$", "$\\{\\}$", "$\\{\\}$"],
      ["← $\\{q_2\\}$", "$\\{q_1\\}$", "$\\{q_2\\}$"],
      ["← $\\{q_1\\}$", "$\\{q_0\\}$", "$\\{\\}$"],
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "8 helyett 6 állapot: a $\\{q_0, q_2\\}$ és a $\\{q_0, q_1, q_2\\}$ elérhetetlen, úgyhogy kimaradtak.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "Az üres halmaz is rendes állapot (egy „csapda”, ahonnan nincs menekvés), nem szabad kihagyni, különben a VDA nem lesz teljes. Kezdőállapot pedig $Q_0$ maga, egyetlen halmazként, nem külön a $q_0$!",
    },
  },
  {
    type: "funfact",
    text: {
      hu: "A determinizálás ára: $n$ állapotból akár $2^n$ is lehet, és vannak nyelvek, ahol ez tényleg nem úszható meg. A nemdeterminizmus tehát nem ad több erőt (ugyanazokat a nyelveket ismeri fel), csak sokkal tömörebb lehet.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "ε-átmenetek",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Kiegészítés: megengedhetjük azt is, hogy az automata betű olvasása nélkül, „ingyen” lépjen át egy másik állapotba, vagyis $\\delta : Q \\times (\\Sigma \\cup \\{\\varepsilon\\}) \\to \\mathcal{P}(Q)$. Ez kényelmes (például reguláris kifejezésből automatát építeni), de erőt ez sem ad: az $\\varepsilon$-átmenetek eltüntethetők.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Hogyan? Minden $q$-ra kiszámoljuk az $\\varepsilon$-lezártját: azon állapotok halmazát, ahova $q$-ból csak $\\varepsilon$-lépésekkel el lehet jutni ($q$-t is beleértve). Ugyanaz a rétegenkénti építés, mint a $H(A)$-nál a láncmentesítésben. Ezután az $a$-átmenet: lezárt, aztán $a$-lépés, aztán megint lezárt. Elfogadó lesz $q$, ha a lezártjában van elfogadó állapot.",
    },
  },
  {
    type: "funfact",
    text: {
      hu: "Ismerős? Az $\\varepsilon$-átmenet az automaták láncszabálya: $X \\to Y$ is betű nélkül lép át $X$-ből $Y$-ba. Ugyanaz a probléma, ugyanaz a megoldás.",
    },
  },
];
