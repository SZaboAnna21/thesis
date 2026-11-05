import type { QuizQuestion } from "../../types/exercise";

export const quiz: QuizQuestion[] = [
  {
    question: "Mikor aktív egy $X$ nemterminális?",
    answers: [
      "ha $S$-ből levezethető egy $X$-et tartalmazó mondatforma",
      "ha van olyan $w \\in \\Sigma^*$, hogy $X \\Rightarrow^* w$",
      "ha $X$ szerepel valamelyik szabály jobb oldalán",
    ],
    correct: 1,
    explanation:
      "Aktív az, amiből terminális szó vezethető le. Az első válasz az elérhetőség definíciója.",
    difficulty: "easy",
  },
  {
    question: "Milyen sorrendben töröljük a nem hasznos nemterminálisokat redukáláskor?",
    answers: [
      "először az elérhetetleneket, aztán az inaktívakat",
      "először az inaktívakat, aztán az elérhetetleneket",
      "mindegy, a sorrend nem számít",
    ],
    correct: 1,
    explanation:
      "Az inaktívak szabályainak törlése után más nemterminálisok elérhetetlenné válhatnak, ezért az elérhetőséget csak utána számoljuk.",
    difficulty: "easy",
  },
  {
    question: "Melyik szabály lehet Chomsky-normálformájú grammatikában?",
    answers: ["$A \\to aB$", "$A \\to B$", "$A \\to BC$"],
    correct: 2,
    explanation:
      "Chomsky-normálformában a jobb oldal pontosan két nemterminális vagy pontosan egy terminális. Az $A \\to aB$ vegyes, az $A \\to B$ láncszabály.",
    difficulty: "easy",
  },
  {
    question: "Mikor maradhat $S \\to \\varepsilon$ egy Chomsky-normálformájú grammatikában?",
    answers: [
      "soha",
      "ha $S$ nem szerepel egyik szabály jobb oldalán sem",
      "ha $S$-nek van $S \\to BC$ alakú szabálya is",
    ],
    correct: 1,
    explanation:
      "Az $S \\to \\varepsilon$ csak az üres szó levezetésére szolgálhat, ezért $S$ nem állhat jobb oldalon. Ha mégis ott áll, új $S'$ kezdőszimbólum kell: $S' \\to S \\mid \\varepsilon$.",
    difficulty: "easy",
  },
  {
    question: "Mi a normálformára hozás lépéseinek helyes sorrendje?",
    answers: [
      "álterminálisok, hosszredukció, $\\varepsilon$-mentesítés, láncmentesítés",
      "$\\varepsilon$-mentesítés, láncmentesítés, álterminálisok, hosszredukció",
      "láncmentesítés, $\\varepsilon$-mentesítés, hosszredukció, álterminálisok",
    ],
    correct: 0,
    explanation:
      "Az álterminálisok után csak nemterminálisok vannak a hosszú jobb oldalakon, a hosszredukció után ezek kéttagúak, és a láncmentesítés azért a végén van, mert az $\\varepsilon$-mentesítés új láncszabályokat gyárt.",
    difficulty: "easy",
  },
  {
    question: "Hány új nemterminális kell az $X \\to Y_1Y_2Y_3Y_4$ szabály hosszredukciójához?",
    answers: ["1", "2", "3"],
    correct: 1,
    explanation:
      "$k$ hosszú jobb oldalhoz $k - 2$ új nemterminális kell: $X \\to Y_1Z_1$, $Z_1 \\to Y_2Z_2$, $Z_2 \\to Y_3Y_4$.",
    difficulty: "easy",
  },
  {
    question:
      "$\\varepsilon$-mentesítéskor az $A \\to BC$ szabálynál $B \\in U$, de $C \\notin U$. Milyen szabályt veszünk fel?",
    answers: ["$A \\to B$", "$A \\to C$", "$A \\to B$ és $A \\to C$"],
    correct: 1,
    explanation:
      "A $B$-ből levezethető $\\varepsilon$, tehát eltűnhet, és ilyenkor csak a $C$ marad: $A \\to C$. A $C$ nem tűnhet el, így $A \\to B$ nem kell.",
    difficulty: "easy",
  },
  {
    question: "Legyen $S \\to AB \\mid c$, $A \\to a \\mid \\varepsilon$, $B \\to b \\mid \\varepsilon$. Mi az $U$ halmaz?",
    answers: ["$\\{A, B\\}$", "$\\{A, B, S\\}$", "$\\{S\\}$"],
    correct: 1,
    explanation:
      "$U_1 = \\{A, B\\}$ az $\\varepsilon$-szabályok miatt, $U_2 = \\{A, B, S\\}$, mert $S \\to AB$ jobb oldala csupa $U_1$-beli. Mivel $S \\in U$, $\\varepsilon \\in L(G)$.",
    difficulty: "hard",
  },
  {
    question: "Legyen $S \\to AB \\mid a$, $A \\to AA$, $B \\to b$. Mi marad a redukálás után?",
    answers: [
      "$S \\to a$",
      "$S \\to a$, $B \\to b$",
      "$S \\to AB \\mid a$, $B \\to b$",
    ],
    correct: 0,
    explanation:
      "Az $A$ inaktív, mert csak $A \\to AA$ szabálya van, így töröljük az $S \\to AB$ szabályt is. Ezután a $B$ elérhetetlen lesz, így az is kiesik.",
    difficulty: "hard",
  },
  {
    question: "Legyen $A \\to B \\mid a$, $B \\to C \\mid b$, $C \\to DD$. Mik lesznek $A$ szabályai a láncmentesítés után?",
    answers: [
      "$A \\to a$",
      "$A \\to a \\mid b$",
      "$A \\to a \\mid b \\mid DD$",
    ],
    correct: 2,
    explanation:
      "$H(A) = \\{A, B, C\\}$, mert $A \\to B \\to C$ láncszabályokkal elérhető. Az $A$ megkapja mindhárom nem-lánc szabályait: $a$, $b$ és $DD$.",
    difficulty: "hard",
  },
  {
    question: "Miért nem lehet a láncmentesítést az $\\varepsilon$-mentesítés előtt elvégezni?",
    answers: [
      "mert a láncmentesítés új $\\varepsilon$-szabályokat hoz létre",
      "mert az $\\varepsilon$-mentesítés új láncszabályokat hoz létre",
      "mert a láncmentesítés elrontja a hosszredukciót",
    ],
    correct: 1,
    explanation:
      "Ha $A \\to BC$ és $B \\in U$, akkor az $\\varepsilon$-mentesítés felveszi az $A \\to C$ láncszabályt, amit utána még el kell tüntetni.",
    difficulty: "hard",
  },
];
