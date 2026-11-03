import type { ContentBlock } from "../../types/content";

export const theory: ContentBlock[] = [
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Hossz-nemcsökkentő grammatikák",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Bár a környezetfüggő grammatikák pontosan jellemzik az 1-es típusú nyelveket, a szabályaik alakja gyakran nehezen kezelhető. Emiatt gyakran a hossz-nemcsökkentő grammatikák fogalmát használjuk, amelyek ugyanazt a nyelvosztályt írják le egyszerűbb formában.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "hossz-nemcsökkentő grammatika",
    },
    content: {
      hu: "$G = \\langle N, \\Sigma, P, S \\rangle$ hossz-nemcsökkentő, ha minden szabálya $u \\to v$ alakú, ahol $u, v \\in (\\Sigma \\cup N)^+$ és $|u| \\leq |v|$. Kivétel lehet az $S \\to \\varepsilon$ szabály, de ekkor $S$ nem szerepelhet szabály jobb oldalán.",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    statement: {
      hu: "Minden hossz-nemcsökkentő grammatika környezetfüggő nyelvet generál.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Vagyis ha egy nyelvről azt kell megmutatni, hogy környezetfüggő, elég olyan grammatikát adni, amelynek egyik szabálya sem rövidíti a mondatformát.",
    },
  },
  {
    type: "example",
    title: {
      hu: "$L = \\{a^nb^nc^n \\mid n \\geq 1\\}$ környezetfüggő",
    },
    content: {
      hu: "A szabályok: $S \\to abc \\mid aSBc$, $cB \\to Bc$, $bB \\to bb$. Az $S \\to aSBc$ legyártja a betűket, a $cB \\to Bc$ a $B$-ket a $c$-k elé tolja, a $bB \\to bb$ pedig átírja őket. Például $n = 2$-re: $S \\Rightarrow aSBc \\Rightarrow aabcBc \\Rightarrow aabBcc \\Rightarrow aabbcc$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Ez a nyelv a Nagy Bar-Hillel lemma szerint nem környezetfüggetlen, tehát $\\mathcal{L}_2 \\subsetneq \\mathcal{L}_1$.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Kuroda-normálforma",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Kuroda-normálforma a Chomsky-normálforma megfelelője csak éppen a környezetfüggő grammatikákra.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Kuroda-normálforma",
    },
    content: {
      hu: "$G$ Kuroda-normálformájú, ha minden szabálya az alábbiak egyike: $A \\to a$, $A \\to BC$, $AB \\to AC$, $BA \\to CA$ (ahol $A, B, C \\in N$, $a \\in \\Sigma$), illetve $S \\to \\varepsilon$, ha $S$ nincs jobb oldalon.",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    statement: {
      hu: "Minden környezetfüggő grammatikához van vele ekvivalens Kuroda-normálformájú grammatika.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu:"Az átalakítás nagy része megegyezik a Chomsky-normálformánál megismert lépésekkel: álterminálisok bevezetésével, hosszredukcióval és láncszabályok megszüntetésével. Az egyetlen új nehézséget az $AB \\to CD$ alakú szabályok jelentik, mivel ezek egyszerre két nemterminálist írnak át. Ezért egy segédváltozó segítségével olyan szabályokra bontjuk őket, amelyekben egy lépésben mindig csak egyetlen szimbólum változik:"
    },
  },
  {
    type: "formula",
    latex: "AB \\to AW, \\qquad AW \\to CW, \\qquad CW \\to CD",
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "0-típusú grammatikák",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A 0-típusú grammatikákra is van normálforma. Ez a Kuroda-normálforma, kiegészítve az $A \\to B$ és az $AB \\to B$ alakú szabályokkal. Az utóbbi szabály csökkenti a mondatforma hosszát, ezért ilyen szabály környezetfüggő grammatikában nem szerepelhet.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A legfontosabb különbség a szóprobléma eldönthetőségében jelenik meg. Hossz-nemcsökkentő grammatikák esetén egy uuu szó levezetésében a mondatformák hossza nem haladhatja meg $|u|$-t, ezért csak véges sok esetet kell megvizsgálni, így a szóprobléma eldönthető. Ezzel szemben 0-típusú grammatikáknál a mondatformák hossza korlátlanul növekedhet, ezért a szóprobléma nem eldönthető, csak parciálisan eldönthető.",
  },
  },
  {
    type: "table",
    headers: ["Típus", "Szóprobléma"],
    rows: [
      ["3 (reguláris)", "eldönthető, lineáris időben"],
      ["2 (környezetfüggetlen)", "eldönthető, polinomiális időben (CYK)"],
      ["1 (környezetfüggő)", "eldönthető"],
      ["0", "eldönthetetlen, csak parciálisan eldönthető: ha $u \\in L(G)$, a keresés megtalálja, ha nem, nem biztos, hogy megáll"],
    ],
  },
];
