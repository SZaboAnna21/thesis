import type { QuizQuestion } from "../../types/exercise";

export const quiz: QuizQuestion[] = [
  {
    question: "Melyik állítás igaz?",
    answers: ["$\\emptyset = \\{\\varepsilon\\}$", "$\\emptyset \\neq \\{\\varepsilon\\}$"],
    correct: 1,
    explanation:
      "Az üres nyelvben nincs szó, a $\\{\\varepsilon\\}$ nyelvben pontosan egy szó van: az üres szó.",
    difficulty: "easy",
  },
  {
    question: "Legyen $L = \\{a, ab, abb, abbb\\}$. Milyen nyelv $L$?",
    answers: ["véges", "végtelen"],
    correct: 0,
    explanation: "$L$ pontosan 4 szót tartalmaz, tehát véges nyelv.",
    difficulty: "easy",
  },
  {
    question: "Legyen $L_1 = \\{a, ab\\}$ és $L_2 = \\{ab, ba\\}$. Mennyi $L_1 \\cup L_2$?",
    answers: ["$\\{ab\\}$", "$\\{a, ab, ba\\}$", "$\\{a, ba\\}$"],
    correct: 1,
    explanation:
      "Az unióba minden szó bekerül, ami legalább az egyik nyelvben szerepel. Az $ab$ mindkettőben benne van, de csak egyszer számít.",
    difficulty: "easy",
  },
  {
    question:
      "Legyen $L_1 = \\{\\varepsilon, ab, abb\\}$ és $L_2 = \\{ab, bab\\}$. Mennyi $L_1 \\cap L_2$?",
    answers: ["$\\{ab\\}$", "$\\{\\varepsilon\\}$", "$\\{ab, bab\\}$"],
    correct: 0,
    explanation: "A metszetbe csak azok a szavak kerülnek, amelyek mindkét nyelvben szerepelnek: ez csak az $ab$.",
    difficulty: "easy",
  },
  {
    question: "Legyen $L_1 = \\{a\\}$ és $L_2 = \\{bb\\}$. Mennyi $L_1L_2$?",
    answers: ["$\\{abb\\}$", "$\\{bab\\}$", "$\\{abb, bab\\}$"],
    correct: 0,
    explanation: "A konkatenációban az $L_1$-beli szó áll elöl, utána jön az $L_2$-beli: $a \\cdot bb = abb$.",
    difficulty: "easy",
  },
  {
    question:
      "Legyen $V = \\{a\\}$ és $L = \\{a^{2n+1} \\mid n \\geq 0\\}$. Mit tartalmaz $\\overline{L}$?",
    answers: [
      "minden páros hosszú $a$-s szót, beleértve $\\varepsilon$-t",
      "minden páratlan hosszú $a$-s szót",
      "csak $\\varepsilon$-t",
    ],
    correct: 0,
    explanation:
      "A komplementer a teljes $V^*$-hoz képest értendő: $\\overline{L} = V^* - L = \\{a^{2n} \\mid n \\geq 0\\}$, és ebben $\\varepsilon = a^0$ is benne van.",
    difficulty: "hard",
  },
  {
    question: "Legyen $L_1 = \\{a\\}$ és $L_2 = \\{bb\\}$. Melyik igaz?",
    answers: ["$L_1L_2 = L_2L_1$", "$L_1L_2 \\neq L_2L_1$"],
    correct: 1,
    explanation:
      "A konkatenáció nem kommutatív: $L_1L_2 = \\{abb\\}$, de $L_2L_1 = \\{bba\\}$.",
    difficulty: "hard",
  },
  {
    question: "Legyen $L = \\{a\\}$. Mi $L^*$?",
    answers: [
      "$\\{a\\}$",
      "$\\{\\varepsilon, a, aa, aaa, \\dots\\}$",
      "$\\{\\varepsilon\\}$",
    ],
    correct: 1,
    explanation:
      "$L^* = \\bigcup_{i \\geq 0} L^i$, és ebben az $L^0 = \\{\\varepsilon\\}$ is benne van, így $L^* = \\{a^n \\mid n \\geq 0\\}$.",
    difficulty: "hard",
  },
  {
difficulty: "hard",
question:
"Legyen L₁={a,ab} és L₂={bc,c}. Mennyi |L₁L₂| ?",
answers: [
"2",
"3",
"4",
"5"
],
correct: 1,
explanation:
"abc kétféleképp áll elő: a·bc és ab·c, ezért csak három különböző szó lesz: {abc,ac,abbc}."
}
];
