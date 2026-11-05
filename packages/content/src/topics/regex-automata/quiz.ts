import type { QuizQuestion } from "../../types/exercise";

export const quiz: QuizQuestion[] = [
  {
    question: "Mit mond ki Kleene tétele?",
    answers: [
      "minden reguláris kifejezés reguláris nyelvet ír le, és minden reguláris nyelvhez van reguláris kifejezés",
      "minden NDVA determinizálható",
      "minden környezetfüggetlen nyelvhez van reguláris kifejezés",
    ],
    correct: 0,
    explanation:
      "Kleene tétele szerint a reguláris kifejezések pontosan a reguláris nyelveket írják le, vagyis ugyanazt tudják, mint a véges automaták.",
    difficulty: "easy",
  },
  {
    question: "Mivel helyettesítjük az általánosított automatában a $q_1 \\xrightarrow{R_1 + R_2} q_2$ élt?",
    answers: [
      "két párhuzamos éllel: $q_1 \\xrightarrow{R_1} q_2$ és $q_1 \\xrightarrow{R_2} q_2$",
      "egy új állapoton át: $q_1 \\xrightarrow{R_1} q_{\\text{új}} \\xrightarrow{R_2} q_2$",
      "egy $R_1$ és egy $R_2$ hurokkal $q_1$-en",
    ],
    correct: 0,
    explanation:
      "Az unió választást jelent, ezért két párhuzamos él kell. Az új állapoton átmenő út a konkatenációé.",
    difficulty: "easy",
  },
  {
    question: "Mivel helyettesítjük a $q_1 \\xrightarrow{R_1R_2} q_2$ élt?",
    answers: [
      "két párhuzamos éllel",
      "egy új állapoton át: $q_1 \\xrightarrow{R_1} q_{\\text{új}} \\xrightarrow{R_2} q_2$",
      "egy $\\varepsilon$-éllel és egy $R_1R_2$ hurokkal",
    ],
    correct: 1,
    explanation: "A konkatenációnál előbb $R_1$-et, aztán $R_2$-t olvassuk, ezért kell közéjük egy új állapot.",
    difficulty: "easy",
  },
  {
    question: "A csillag ($q_1 \\xrightarrow{R^*} q_2$) szétszedésénél miért kell új állapot a hurokhoz?",
    answers: [
      "mert különben $q_1$ többi éle is használhatná a hurkot",
      "mert egy állapotra nem tehető hurok",
      "mert különben az $R$ legalább egyszer kötelező lenne",
    ],
    correct: 0,
    explanation:
      "Ha a hurok $q_1$-en lenne, akkor a $q_1$-ből induló többi él előtt is lehetne ismételni $R$-et, így olyan szavakat is elfogadnánk, amik nincsenek a nyelvben.",
    difficulty: "easy",
  },
  {
    question: "Az $\\varepsilon$-átmenetek eltüntetésekor mikor lesz $q$ elfogadó?",
    answers: [
      "ha $q$-ból indul $\\varepsilon$-él",
      "ha $H(q)$-ban van elfogadó állapot",
      "csak ha eredetileg is elfogadó volt",
    ],
    correct: 1,
    explanation:
      "A szó végi $\\varepsilon$-lépéseket csak ez helyettesíti: ha $q$-ból $\\varepsilon$-okkal elfogadóba jutunk, $q$ maga is elfogadó lesz.",
    difficulty: "easy",
  },
  {
    question: "Az automata egyenletrendszerében mikor szerepel $+\\,\\varepsilon$ az $X_q$ egyenletében?",
    answers: ["ha $q$ a kezdőállapot", "ha $q$ elfogadó állapot", "ha $q$-nak van hurka"],
    correct: 1,
    explanation:
      "$X_q$ azokat a szavakat jelöli, amelyekkel $q$-ból elfogadóba jutunk. Az üres szó pontosan akkor ilyen, ha $q$ maga elfogadó.",
    difficulty: "easy",
  },
  {
    question: "Mi az $X = aX + b$ egyenlet megoldása?",
    answers: ["$ba^*$", "$a^*b$", "$(a + b)^*$"],
    correct: 1,
    explanation:
      "Arden tétele szerint $X = QX + R$ megoldása $Q^*R$, ha $\\varepsilon \\notin Q$. Itt $Q = a$, $R = b$, tehát $X = a^*b$.",
    difficulty: "easy",
  },
  {
    question: "Az egyenletrendszerben mi a csapdaállapot ismeretlenje?",
    answers: ["$\\varepsilon$", "$\\emptyset$", "$\\Sigma^*$"],
    correct: 1,
    explanation:
      "A csapdaállapotból nem lehet elfogadóba jutni, ezért az ismeretlenje $\\emptyset$, és a rá mutató tagok kiesnek.",
    difficulty: "hard",
  },
  {
    question:
      "Az $\\varepsilon$NDVA-ban $p \\xrightarrow{\\varepsilon} q$ és $q \\xrightarrow{a} r$. Milyen új átmenet kerül be az $\\varepsilon$-mentesítéskor?",
    answers: ["$p \\xrightarrow{a} q$", "$p \\xrightarrow{a} r$", "$q \\xrightarrow{a} p$"],
    correct: 1,
    explanation:
      "$q \\in H(p)$, és $q$-ból $a$-val $r$-be jutunk, tehát „$\\varepsilon$-ok, aztán egy betű” szerint $p \\xrightarrow{a} r$.",
    difficulty: "hard",
  },
  {
    question: "Legyen $X = aY + \\varepsilon$ és $Y = bX$. Mi $X$?",
    answers: ["$(ab)^*$", "$a^*b^*$", "$(ab)^*a$"],
    correct: 0,
    explanation:
      "Behelyettesítve $X = abX + \\varepsilon$, és Arden tételével $X = (ab)^*\\varepsilon = (ab)^*$.",
    difficulty: "hard",
  },
  {
    question: "Mikor hagyható el egy állapot az általánosított automatából?",
    answers: [
      "ha nincs hurka",
      "ha csak egy él jön be és csak egy megy ki belőle, és legalább az egyik $\\varepsilon$",
      "ha nem elfogadó állapot",
    ],
    correct: 1,
    explanation:
      "Ekkor a két él egybevonható: egy $\\varepsilon$ és egy $R$ címke konkatenációja egyszerűen $R$.",
    difficulty: "hard",
  },
];
