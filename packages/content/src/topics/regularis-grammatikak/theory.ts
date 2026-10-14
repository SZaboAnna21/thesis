import type { ContentBlock } from "../../types/content";

export const theory: ContentBlock[] = [
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Lineáris grammatikák",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A 3-as típusnál a jobb oldalon legfeljebb egy nemterminális lehet, és az is a legvégén ül, mindig. Most megnézzük, mi történik, ha leülhet máshova is.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Lineáris grammatika",
    },
    content: {
      hu: "Egy $G = \\langle N, \\Sigma, P, S \\rangle$ környezetfüggetlen grammatika lineáris, ha minden szabálya $A \\to u$ vagy $A \\to u_1Bu_2$ alakú ($A, B \\in N$, $u, u_1, u_2 \\in \\Sigma^*$). Bal-lineáris, ha mindig $u_1 = \\varepsilon$, jobb-lineáris, ha mindig $u_2 = \\varepsilon$.",
    },
  },
  {
    type: "table",
    headers: ["Grammatika", "Típus"],
    rows: [
      ["$S \\to aSb \\mid \\varepsilon$", "lineáris (a nemterminális középen trónol)"],
      ["$S \\to Saa \\mid b$", "bal-lineáris"],
      ["$S \\to aS \\mid bbS \\mid c$", "jobb-lineáris"],
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Spoiler: a jobb-lineáris grammatika pontosan a 3-as típusú grammatika, csak felvett egy másik nevet is.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "Bal- és jobb-lineárist egy grammatikán belül keverni tilos, vagyis szabad, csak akkor elszáll a regularitás. $S \\to aA \\mid \\varepsilon$, $A \\to Sb$ együtt $\\{a^nb^n\\}$-t adja, ami egyáltalán nem reguláris.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Bal-lineáris = jobb-lineáris",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    statement: {
      hu: "Minden bal-lineáris grammatika reguláris nyelvet generál.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A bal-lineáris grammatika hátrafelé írja a szót, jobbról balra. Ha a levezetést egyszerűen visszafelé tekerjük, pont egy jobb-lineárisat kapunk. Feltesszük, hogy $S$ nincs jobb oldalon (ha mégis, jön egy $S \\to S'$ és megoldottuk). Az átírás:",
    },
  },
  {
    type: "table",
    headers: ["Bal-lineáris $G$", "Jobb-lineáris $G'$"],
    rows: [
      ["$S \\to u$", "$S \\to u$"],
      ["$A_k \\to u$", "$S \\to uA_k$"],
      ["$A_k \\to A_ju$", "$A_j \\to uA_k$"],
      ["$S \\to A_ju$", "$A_j \\to u$"],
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Memóriatrükk: minden fordítva van. Ami eddig a vég volt, most a kezdet ($S$-ből indul), ami a kezdet volt, most a vég, a középen lévő nyilak pedig megfordulnak.",
    },
  },
  {
    type: "theorem",
    kind: "kovetkezmeny",
    statement: {
      hu: "$\\mathcal{L}_3$ zárt a tükrözésre, és minden reguláris nyelv generálható bal-lineáris grammatikával.",
    },
    proof: {
      hu: "Jobb-lineáris grammatikában fordítsunk meg minden jobb oldalt ($A \\to uB$ helyett $A \\to Bu^R$, $A \\to u$ helyett $A \\to u^R$), így bal-lineáris grammatikát kapunk a tükörképre. A tétel szerint ez is reguláris. Kétszer tükrözve visszakapjuk az eredeti nyelvet, most már bal-lineárisan.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "A 3-as normálforma",
    },
  },
  {
    type: "definition",
    term: {
      hu: "3-as normálforma",
    },
    content: {
      hu: "$G$ 3-as normálformájú, ha minden szabálya $X \\to aY$ ($X, Y \\in N$, $a \\in \\Sigma$) vagy $X \\to \\varepsilon$ alakú.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Vagyis lépésenként pontosan egy betű, se több, se kevesebb. Ez gyanúsan hasonlít egy véges automatára, látni fogod később.",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    statement: {
      hu: "Minden reguláris nyelv generálható 3-as normálformájú grammatikával.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "1. lépés: hosszredukció",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "$A \\to a_1 \\cdots a_nB$ ($n \\ge 2$): felszeleteljük, mint a szalámit, friss nemterminálisokkal: $A \\to a_1Z_1,\\ Z_1 \\to a_2Z_2,\\ \\dots,\\ Z_{n-1} \\to a_nB$." },
      { hu: "$A \\to a_1 \\cdots a_m$ ($m \\ge 1$): ugyanígy, de a végén egy közös $E$-be futunk, és $E \\to \\varepsilon$." },
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "A $Z_i$-k minden szabályhoz újak, így két szalámi szeletei nem keveredhetnek. Ami ezután még kilóg, az az $X \\to Y$ láncszabály.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "2. lépés: láncmentesítés",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Minden $A$-ra összegyűjtjük, hova lehet eljutni belőle csak láncon: $H(A) = \\{B \\mid A \\Rightarrow^* B\\}$.",
    },
  },
  {
    type: "formula",
    latex: "H_0(A) = \\{A\\}, \\qquad H_{i+1}(A) = H_i(A) \\cup \\{B \\mid \\exists C \\in H_i(A) : C \\to B \\in P\\}",
  },
  {
    type: "paragraph",
    text: {
      hu: "Ha már nem nő, kész. Ezután a láncszabályok mennek a kukába, és $A$ megörökli minden $B \\in H(A)$ nem-lánc szabályát: ha $B \\to w$, akkor $A \\to w$.",
    },
  },
  {
    type: "example",
    title: {
      hu: "Teljes példa",
    },
    content: {
      hu: "$S \\to abS \\mid B$, $B \\to bB \\mid V$, $V \\to aa \\mid b$. Hosszredukció: $S \\to aZ_1 \\mid B$, $Z_1 \\to bS$, $V \\to aZ_2 \\mid bE$, $Z_2 \\to aE$, $E \\to \\varepsilon$ ($B$ szabályai maradnak). Láncok: $H(S) = \\{S, B, V\\}$, $H(B) = \\{B, V\\}$. Eredmény: $S \\to aZ_1 \\mid bB \\mid aZ_2 \\mid bE$, $B \\to bB \\mid aZ_2 \\mid bE$, $V \\to aZ_2 \\mid bE$, $Z_1 \\to bS$, $Z_2 \\to aE$, $E \\to \\varepsilon$.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "A láncszabályokat ki kell dobni, nem elég az újakat mellé pakolni! Ha közben valaki elérhetetlen lesz (itt a $V$), nyugodtan ott maradhat, csak árválkodik.",
    },
  },
];
