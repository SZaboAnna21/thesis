import type { ContentBlock } from "../../types/content";

export const theory: ContentBlock[] = [
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Kis Bar-Hillel lemma",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Ha egy nyelvhez nem sikerül automatát készíteni, abból még nem következik, hogy a nyelv nem reguláris. Ahhoz, hogy egy nyelvről bizonyítani tudjuk, hogy nem reguláris, szükség van egy erősebb eszközre. Ezt adja a Kis Bar-Hillel lemma (más néven pumpáló lemma).",
    },
  },
  {
    type: "theorem",
    kind: "lemma",
    name: {
      hu: "Kis Bar-Hillel lemma",
    },
    statement: {
      hu: "Minden $L \\in \\mathcal{L}_3$ nyelvhez van olyan $n \\in \\mathbb{N}$ konstans úgy, hogy minden $w \\in L$ szó esetén ha tekintjük egy tetszőleges olyan $w = uw'v$ felbontását, ahol $|w'| \\geq n$, akkor létezik $w'$-nek olyan $y$ részszava ($w' = xyz$), hogy $0 < |y| \\leq n$, és minden $i \\geq 0$ esetén $uxy^izv \\in L$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "egy reguláris nyelv minden elég hosszú szavának minden elég hosszú részében található egy rövid, nem üres szakasz, amely tetszőleges sokszor ismételhető vagy akár el is hagyható úgy, hogy a kapott szó továbbra is a nyelvhez tartozzon.Ennek oka, hogy ha egy DVA-nak nnn állapota van, akkor legalább nnn betű feldolgozása közben valamelyik állapotba szükségképpen kétszer jutunk el. A két látogatás között bejárt út egy körnek felel meg, amely tetszőleges sokszor ismételhető.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Hogyan használjuk?",
    },
  },
  {
    type: "list",
    ordered: true,
    items: [
      { hu: "Tegyük fel indirekt, hogy $L$ reguláris, és legyen $n$ a lemma konstansa." },
      { hu: "Választunk egy $n$-től függő $w \\in L$ szót és egy $w = uw'v$ felbontást, ahol $|w'| \\geq n$. A $w'$-t érdemes úgy választani, hogy csak egyféle betűből álljon." },
      { hu: "A lemma ad egy $y$-t, amiről csak annyit tudunk, hogy $0 < |y| \\leq n$ és $w'$-ben van. Pl. ha $w' = a^n$, akkor $y = a^k$, ahol $0 < k \\leq n$." },
      { hu: "Választunk egy $i$-t (általában $0$ vagy $2$), amire $uxy^izv \\notin L$. Ez ellentmondás, tehát $L$ nem reguláris." },
    ],
  },
  {
    type: "warning",
    text: {
      hu: "Az $n$-et és az $y$-t nem mi választjuk! $n$-nek nem adhatunk konkrét értéket, és az érvelésnek minden lehetséges $y$-ra működnie kell.",
    },
  },
  {
    type: "example",
    title: {
      hu: "$L = \\{a^kb^k \\mid k \\geq 0\\}$ nem reguláris",
    },
    content: {
      hu: "Tegyük fel, hogy $L$ reguláris, $n$ a konstans. Legyen $w = a^nb^n$, és $u = \\varepsilon$, $w' = a^n$, $v = b^n$. A lemma szerint $y = a^k$, ahol $0 < k \\leq n$. Legyen $i = 0$: $uxzv = a^{n-k}b^n \\notin L$, mert kevesebb benne az $a$, mint a $b$. Ellentmondás, tehát $L$ nem reguláris.",
    },
  },
  {
    type: "example",
    title: {
      hu: "Palindrómák nem regulárisak",
    },
    content: {
      hu: "Ugyanígy: $w = a^nba^n$, $w' = a^n$, $v = ba^n$. Kihagyva $y = a^k$-t az $a^{n-k}ba^n$ szót kapjuk, ami nem palindróma. A középső $b$ azért kell, mert $a^{2n}$-ből bármennyi $a$-t kivéve palindróma maradna, és nem jutnánk ellentmondásra.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "A lemma csak szükséges feltétel: azt lehet vele bizonyítani, hogy egy nyelv nem reguláris, de azt nem, hogy reguláris.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Eldönthetőségi kérdések",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Egy kérdés eldönthető, ha van rá olyan algoritmus, amely minden bemenetre megáll és helyes választ ad. Reguláris nyelveknél a fontos kérdések mind eldönthetők. A trükk mindig az, hogy DVA-t készítünk, és a kérdést az ürességre vezetjük vissza:",
    },
  },
  {
    type: "table",
    headers: ["Kérdés", "Hogyan?"],
    rows: [
      ["$L = \\emptyset$?", "elérhető-e végállapot a kezdőállapotból (gráfbejárás)"],
      ["$L_1 \\cap L_2 = \\emptyset$?", "a metszet automatájának üressége"],
      ["$L_1 \\subseteq L_2$?", "$L_1 \\setminus L_2 = \\emptyset$?"],
      ["$L_1 = L_2$?", "$L_1 \\subseteq L_2$ és $L_2 \\subseteq L_1$"],
      ["$u \\in L$?", "lefuttatjuk az automatát $u$-n, ez lineáris idő"],
    ],
  },
];
