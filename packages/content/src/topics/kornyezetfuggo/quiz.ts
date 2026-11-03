import type { QuizQuestion } from "../../types/exercise";

export const quiz: QuizQuestion[] = [
  {
    question: "Melyik szabály NEM szerepelhet hossz-nemcsökkentő grammatikában?",
    answers: ["$aA \\to aBb$", "$AB \\to a$", "$A \\to BC$"],
    correct: 1,
    explanation:
      "Hossz-nemcsökkentő szabálynál $|u| \\leq |v|$ kell. Az $AB \\to a$ esetén $|AB| = 2 > 1 = |a|$, tehát a szabály rövidíti a mondatformát.",
    difficulty: "easy",
  },
  {
    question: "Hossz-nemcsökkentő grammatikában mikor megengedett az $S \\to \\varepsilon$ szabály?",
    answers: [
      "soha",
      "mindig",
      "ha $S$ nem szerepel egyik szabály jobb oldalán sem",
    ],
    correct: 2,
    explanation:
      "Az $S \\to \\varepsilon$ az egyetlen kivétel a hossz-nemcsökkentés alól, de csak akkor, ha $S$ nincs jobb oldalon, így az $\\varepsilon$ csak az üres szó levezetésére használható.",
    difficulty: "easy",
  },
  {
    question: "Melyik szabály NEM Kuroda-normálformájú?",
    answers: ["$AB \\to AC$", "$A \\to BC$", "$AB \\to CD$", "$BA \\to CA$"],
    correct: 2,
    explanation:
      "Kuroda-normálformában egy lépésben csak egy nemterminális változhat. Az $AB \\to CD$ egyszerre kettőt ír át, ezért segédváltozóval fel kell bontani.",
    difficulty: "easy",
  },
  {
    question: "Milyen típusú az $L = \\{a^nb^nc^n \\mid n \\geq 1\\}$ nyelv?",
    answers: [
      "környezetfüggetlen",
      "környezetfüggő, de nem környezetfüggetlen",
      "csak 0-típusú",
    ],
    correct: 1,
    explanation:
      "Megadható rá hossz-nemcsökkentő grammatika, tehát környezetfüggő, a Nagy Bar-Hillel lemma szerint viszont nem környezetfüggetlen.",
    difficulty: "easy",
  },
  {
    question: "Milyen a szóprobléma 0-típusú grammatikák esetén?",
    answers: [
      "eldönthető, polinomiális időben",
      "eldönthető, de csak exponenciális időben",
      "eldönthetetlen, csak parciálisan eldönthető",
    ],
    correct: 2,
    explanation:
      "Ha $u \\in L(G)$, a levezetések szisztematikus keresése megtalálja, de ha $u \\notin L(G)$, a keresés nem biztos, hogy megáll, mert a mondatformák hossza korlátlanul nőhet.",
    difficulty: "easy",
  },
  {
    question:
      "Az $S \\to abc \\mid aSBc$, $cB \\to Bc$, $bB \\to bb$ grammatikában melyik szabályt alkalmaztuk az $aabcBc \\Rightarrow aabBcc$ lépésben?",
    answers: ["$S \\to aSBc$", "$cB \\to Bc$", "$bB \\to bb$"],
    correct: 1,
    explanation:
      "A $cB$ részszó $Bc$-re cserélődött: a $B$ egy pozícióval balra, a $c$ elé került.",
    difficulty: "easy",
  },
  {
    question: "Melyik szabálytípus szerepelhet a 0-típusú normálformában, de környezetfüggő grammatikában nem?",
    answers: ["$AB \\to AC$", "$AB \\to B$", "$A \\to BC$"],
    correct: 1,
    explanation:
      "Az $AB \\to B$ csökkenti a mondatforma hosszát, ezért nem hossz-nemcsökkentő. A másik kettő a Kuroda-normálformában is megengedett.",
    difficulty: "hard",
  },
  {
    question: "Az $AB \\to CD$ szabály felbontásában mi a középső lépés?",
    answers: ["$AB \\to AW$", "$AW \\to CW$", "$CW \\to CD$"],
    correct: 1,
    explanation:
      "A felbontás $AB \\to AW$, $AW \\to CW$, $CW \\to CD$. A középső lépésben a $W$ környezetben az $A$ íródik át $C$-re, a másik két lépésben pedig a jobb oldali szimbólum változik.",
    difficulty: "hard",
  },
  {
    question: "Miért eldönthető a szóprobléma hossz-nemcsökkentő grammatikák esetén?",
    answers: [
      "mert minden ilyen grammatika Chomsky-normálformára hozható",
      "mert $u$ levezetésében a mondatformák hossza legfeljebb $|u|$, így csak véges sok mondatformát kell megvizsgálni",
      "mert minden levezetés legfeljebb $|u|$ lépésből áll",
    ],
    correct: 1,
    explanation:
      "A mondatformák hossza sosem csökken, így egy $u$-hoz vezető levezetésben egyik sem lehet $|u|$-nál hosszabb. Ilyen hosszú mondatformából véges sok van. A levezetés lépésszáma viszont lehet $|u|$-nál több, pl. a $cB \\to Bc$ cserék miatt.",
    difficulty: "hard",
  },
  {
    question: "Megengedett-e az $A \\to B$ ($A, B \\in N$) láncszabály Kuroda-normálformában?",
    answers: ["igen", "nem, csak a 0-típusú normálformában"],
    correct: 1,
    explanation:
      "A láncszabályokat a Kuroda-normálformára hozáskor megszüntetjük. Az $A \\to B$ alak csak a 0-típusú normálforma kiegészítő szabályai között szerepel.",
    difficulty: "hard",
  },
  {
    question: "Melyik állítás igaz a nyelvosztályokra?",
    answers: [
      "$\\mathcal{L}_2 = \\mathcal{L}_1$",
      "$\\mathcal{L}_1 \\subsetneq \\mathcal{L}_2$",
      "$\\mathcal{L}_2 \\subsetneq \\mathcal{L}_1$",
    ],
    correct: 2,
    explanation:
      "Minden környezetfüggetlen nyelv környezetfüggő, de fordítva nem: az $\\{a^nb^nc^n \\mid n \\geq 1\\}$ környezetfüggő, de nem környezetfüggetlen.",
    difficulty: "hard",
  },
];
