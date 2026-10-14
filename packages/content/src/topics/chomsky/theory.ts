import type { ContentBlock } from "../../types/content";

export const theory: ContentBlock[] = [
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Grammatikák Chomsky-féle osztályozása",
    },
  },
  {
    type: "definition",
    term: {
      hu: "$i$-típusú grammatika",
    },
    content: {
      hu: "A $G = \\langle N, \\Sigma, P, S \\rangle$ grammatika $i$-típusú ($i = 0, 1, 2, 3$), ha $P$ szabályaira teljesül:",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "$i = 0$: nincs korlátozás." },
      { hu: "$i = 1$: minden szabály $u_1Au_2 \\to u_1vu_2$ alakú, ahol $u_1, u_2, v \\in (N \\cup \\Sigma)^*$, $A \\in N$ és $v \\neq \\varepsilon$. Egyetlen kivétel: $S \\to \\varepsilon$ megengedett, ha $S$ egyetlen szabály jobb oldalán sem fordul elő (KES)." },
      { hu: "$i = 2$: minden szabály $A \\to v$ alakú, ahol $A \\in N$ és $v \\in (N \\cup \\Sigma)^*$." },
      { hu: "$i = 3$: minden szabály $A \\to uB$ vagy $A \\to u$ alakú, ahol $A, B \\in N$ és $u \\in \\Sigma^*$." },
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Az $i$-típusú grammatikák osztályát $\\mathcal{G}_i$ jelöli.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Fordítsuk le emberi nyelvre. Az 1-es típusnál egyetlen $A$ nemterminálist cserélünk egy nemüres $v$ szóra, de csak akkor, ha körülötte ott van az $u_1$ és $u_2$ környezet (ami nem változik). A 2-esnél a bal oldalon egyedül áll egy nemterminális, környezet nélkül. A 3-asnál ráadásul a jobb oldalon is legfeljebb egy nemterminális lehet, és az is csak a legvégén.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Korlátozott $\\varepsilon$-szabály (KES)",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A KES teljesül, ha nincs $\\varepsilon$-szabály, kivéve esetleg $S \\to \\varepsilon$-t, amennyiben $S$ nem szerepel semelyik szabály jobb oldalán.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "A KES a szabályok összességére vonatkozik: $S \\to \\varepsilon$ és $S \\to ASB$ külön-külön rendben van, együtt viszont sértik a KES-t.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Hogyan soroljunk be egy grammatikát?",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Nézd meg lokálisan minden szabályt (melyik típus alakjának felel meg), majd ellenőrizd a KES-t. A lehetséges esetek:",
    },
  },
  {
    type: "table",
    headers: ["Szabályok (lokálisan)", "KES", "Eredmény"],
    rows: [
      ["mind 3-as", "teljesül", "$\\mathcal{G}_3, \\mathcal{G}_2, \\mathcal{G}_1, \\mathcal{G}_0$"],
      ["mind 3-as", "nem teljesül", "$\\mathcal{G}_3, \\mathcal{G}_2, \\mathcal{G}_0$"],
      ["mind 2-es, van nem 3-as", "teljesül", "$\\mathcal{G}_2, \\mathcal{G}_1, \\mathcal{G}_0$"],
      ["mind 2-es, van nem 3-as", "nem teljesül", "$\\mathcal{G}_2, \\mathcal{G}_0$"],
      ["mind 1-es, van nem 2-es", "teljesül", "$\\mathcal{G}_1, \\mathcal{G}_0$"],
      ["mind 1-es, van nem 2-es", "nem teljesül", "$\\mathcal{G}_0$"],
      ["van nem 1-es", "mindegy", "$\\mathcal{G}_0$"],
    ],
  },
  {
    type: "example",
    content: {
      hu: "$P = \\{S \\to ASB,\\ S \\to \\varepsilon,\\ AB \\to BA,\\ A \\to a,\\ B \\to b\\}$. Az $AB \\to BA$ nem 1-es alakú (nem egyetlen nemterminális cserélődik), ezért $G \\in \\mathcal{G}_0$, de egyik szűkebb osztályba sem tartozik.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Nyelvek Chomsky-féle osztályozása",
    },
  },
  {
    type: "definition",
    term: {
      hu: "$i$-típusú nyelv",
    },
    content: {
      hu: "$\\mathcal{L}_i := \\{L \\mid \\exists G \\in \\mathcal{G}_i : L = L(G)\\}$. Egy nyelv $i$-típusú, ha generálható $i$-típusú grammatikával.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "Ne keverd a grammatika típusát a nyelv típusával! Egy 0-típusú grammatika is generálhat 3-as típusú nyelvet. Például a fenti $AB \\to BA$-s grammatika csak 0-típusú, de ugyanazt a nyelvet egy 2-típusú grammatika ($S \\to SS \\mid aSb \\mid bSa \\mid \\varepsilon$) is generálja, tehát a nyelv 2-típusú. A nyelv típusa az, hogy létezik-e megfelelő grammatika, nem az, hogy épp milyet kaptál.",
    },
  },
  {
    type: "table",
    headers: ["Típus", "Grammatika neve", "Nyelvosztály neve"],
    rows: [
      ["0", "mondatszerkezetű (phrase-structure)", "rekurzívan felsorolható"],
      ["1", "környezetfüggő (context-sensitive)", "környezetfüggő"],
      ["2", "környezetfüggetlen (context-free)", "környezetfüggetlen"],
      ["3", "reguláris / véges állapotú", "reguláris"],
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "A nevek nem véletlenek. Környezetfüggő: az $A$-t csak az $u_1 \\_ u_2$ környezetben szabad lecserélni. Környezetfüggetlen: az $A$ bárhol, bármilyen környezetben cserélhető. Reguláris / véges állapotú: ezek pont a véges automatákkal vannak szoros kapcsolatban, erről később.",
    },
  },  {
    type: "theorem",
    kind: "tetel",
    name: {
      hu: "Chomsky-féle nyelvhierarchia",
    },
    statement: {
      hu: "$\\mathcal{L}_3 \\subset \\mathcal{L}_2 \\subset \\mathcal{L}_1 \\subset \\mathcal{L}_0$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A grammatikák alakjából rögtön jön $\\mathcal{L}_3 \\subseteq \\mathcal{L}_2 \\subseteq \\mathcal{L}_0$ és $\\mathcal{L}_1 \\subseteq \\mathcal{L}_0$. Két dolog viszont egyáltalán nem nyilvánvaló, ezeket később bizonyítjuk:",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "$\\mathcal{L}_2 \\subseteq \\mathcal{L}_1$: a 2-es grammatikákban lehetnek $A \\to \\varepsilon$ szabályok, amik az 1-esben tilosak. Meg kell mutatni, hogy ezektől (a KES kivételével) meg lehet szabadulni." },
      { hu: "A tartalmazások valódiak: mindegyik szinten van olyan nyelv, ami a kisebb osztályba már nem fér bele. Például $L_{EQ}$ (egyenlő számú $a$ és $b$) 2-típusú, de nem 3-típusú." },
    ],
  },
  {
    type: "warning",
    text: {
      hu: "A grammatika és a nyelv típusa nem ugyanaz: egy csak 0-típusú grammatika is generálhat például 2-típusú nyelvet. A nyelv típusát az dönti el, hogy létezik-e megfelelő grammatika.",
    },
  },
];
