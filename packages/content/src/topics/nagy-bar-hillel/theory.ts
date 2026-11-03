import type { ContentBlock } from "../../types/content";

export const theory: ContentBlock[] = [
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Nagy Bar-Hillel lemma",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A Kis Bar-Hillel lemma a reguláris nyelvekhez tartozó pumpáló lemma. Ennek környezetfüggetlen nyelvekre vonatkozó megfelelője a Nagy Bar-Hillel lemma, amelyet tipikusan annak bizonyítására használunk, hogy egy nyelv nem környezetfüggetlen.",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    name: {
      hu: "Nagy Bar-Hillel lemma",
    },
    statement: {
      hu: "Minden $L$ környezetfüggetlen nyelvhez meg tudunk adni két, $p$ és $q$ természetes számot úgy, hogy minden olyan szó $L$-ben, amely hosszabb, mint $p$, felírható $uxwyz$ alakban, ahol $|xwy| \\leq q$, $xy \\neq \\varepsilon$, továbbá ekkor minden $ux^iwy^iz$ ($i \\geq 0$) alakú szó is benne van az $L$ nyelvben.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Egyszerűbben: egy környezetfüggetlen nyelv minden elég hosszú szavában található két rész, $x$ és $y$, amelyeket azonos számban ismételhetünk vagy elhagyhatunk úgy, hogy a kapott szó továbbra is a nyelvben marad.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A kis lemmához képest két fontos különbség van: egyszerre két részt pumpálunk, és azok helyét nem mi választhatjuk meg. Csupán azt tudjuk, hogy az $xwy$ rész hossza legfeljebb $q$.",
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
      { hu: "Tegyük fel, hogy $L$ környezetfüggetlen, $p$ és $q$ a konstansok." },
      { hu: "Választunk egy $p$-nél hosszabb $s \\in L$ szót. A betűblokkokat érdemes $q$-nál hosszabbra venni, mert így $xwy$ legfeljebb két szomszédos blokkba lóghat bele." },
      { hu: "Választunk egy $i$-t, amire $ux^iwy^iz \\notin L$, és ezt az összes lehetséges elhelyezkedésre megmutatjuk. Ez ellentmondás, tehát $L$ nem CF." },
    ],
  },
  {
    type: "example",
    title: {
      hu: "$L = \\{a^nb^nc^n \\mid n \\in \\mathbb{N}\\}$ nem CF",
    },
    content: {
      hu: "Legyen $s = a^kb^kc^k$, ahol $k > \\max\\{p, q\\}$. Mivel $|xwy| \\leq q < k$, az $xy$ nem tartalmazhat $a$-t és $c$-t egyszerre. Legyen $i = 0$: az $uwz$ szóból legalább egy betű kiesett, de legfeljebb két fajtából, így valamelyik betűből $k$, egy másikból kevesebb marad. Tehát $uwz \\notin L$, ellentmondás.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "További nem CF nyelvek, amiket érdemes kipróbálni: $\\{a^{n^2}\\}$, $\\{a^nb^kc^nd^k\\}$, $\\{ww \\mid w \\in \\{a, b\\}^*\\}$.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Zártság és eldönthetőség",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "$\\{a^nb^nc^n\\} = \\{a^kb^nc^n\\} \\cap \\{a^nb^nc^k\\}$, ahol a jobb oldalon mindkét nyelv CF. Vagyis $\\mathcal{L}_2$ nem zárt a metszetre, és így a komplementerre sem. Egy CF és egy reguláris nyelv metszete viszont mindig CF.",
    },
  },
  {
    type: "table",
    headers: ["", "$\\mathcal{L}_3$", "$\\mathcal{L}_2$"],
    rows: [
      ["unió, konkatenáció, lezárás", "zárt", "zárt"],
      ["metszet, komplementer", "zárt", "nem zárt"],
      ["szóprobléma, üresség, végtelenség", "eldönthető", "eldönthető"],
      ["ekvivalencia, tartalmazás, diszjunktság", "eldönthető", "eldönthetetlen"],
    ],
  },
  {
    type: "warning",
    text: {
      hu: "Gyakori csapda: reguláris nyelvekre az ekvivalencia, a tartalmazás és a diszjunktság eldönthető, CF nyelvekre viszont nem!",
    },
  },
];
