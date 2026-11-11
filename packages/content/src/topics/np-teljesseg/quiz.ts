import type { QuizQuestion } from "../../types/exercise";

export const quiz: QuizQuestion[] = [
  {
    question: "Ha $L_1 \\leq_p L_2$ és $L_2 \\in P$, mi következik?",
    answers: ["$L_1 \\in P$", "$L_1 \\in NP$", "Semmi, a visszavezetés iránya rossz."],
    correct: 0,
    explanation:
      "Ha $L_2$ polinom időben eldönthető, és $L_1$-et polinom időben visszavezettük $L_2$-re, akkor $L_1$-et is meg tudjuk oldani polinom időben.",
    difficulty: "easy",
  },
  {
    question: "Mikor NP-teljes egy $L$ nyelv?",
    answers: [
      "Ha minden $L' \\in NP$-re $L' \\leq_p L$.",
      "Ha NP-nehéz és $L \\in NP$.",
      "Ha $L \\in P$ és NP-nehéz.",
    ],
    correct: 1,
    explanation:
      "NP-teljes = NP-nehéz (minden NP-beli visszavezethető rá) ÉS maga is NP-beli. Az NP-beliség szükséges, enélkül csak NP-nehézséget látunk be.",
    difficulty: "easy",
  },
  {
    question: "Mi az első, bizonyítottan NP-teljes probléma?",
    answers: ["Hamilton-kör", "SAT (Cook–Levin tétel)", "Független ponthalmaz"],
    correct: 1,
    explanation:
      "A Cook–Levin tétel mondja ki, hogy SAT NP-teljes. A bizonyítás minden NP-beli nyelvet közvetlenül visszavezet SAT-ra: egy nemdeterminisztikus gép elfogadó számítását KNF-fel írja le.",
    difficulty: "easy",
  },
  {
    question: "2SAT P-beli vagy NP-teljes?",
    answers: ["P-beli", "NP-teljes", "NP-köztes"],
    correct: 0,
    explanation:
      "2SAT polinom időben megoldható (pl. erősen összefüggő komponensekkel). A 3 nem véletlen: 3SAT már NP-teljes, 2SAT még P-beli.",
    difficulty: "easy",
  },
  {
    question: "Melyik visszavezetéssel bizonyítjuk, hogy $L'$ NP-nehéz?",
    answers: ["$L' \\leq_p L$ (ahol $L$ ismert NP-teljes)", "$L \\leq_p L'$ (ahol $L$ ismert NP-teljes)", "Bármelyik irány jó."],
    correct: 1,
    explanation:
      "Az ismert NP-teljes $L$-et kell visszavezetni $L'$-re. Így ha $L'$ megoldható lenne, $L$ is az lenne. Az $L' \\leq_p L$ irány csak azt mondaná, hogy $L'$ legfeljebb olyan nehéz, mint $L$.",
    difficulty: "easy",
  },
  {
    question: "Igaz-e, hogy ha $L_1 \\leq_p L_2$ és $L_2 \\leq_p L_3$, akkor $L_1 \\leq_p L_3$?",
    answers: ["Igen, a polinom idejű visszavezetés tranzitív.", "Nem, a visszavezetés nem tranzitív.", "Csak ha $L_2$ NP-teljes."],
    correct: 0,
    explanation:
      "A két polinom idejű visszavezetési függvény kompozíciója is polinom idejű, ezért $L_1 \\leq_p L_3$.",
    difficulty: "easy",
  },
  {
    question: "Független ponthalmaz $\\leq_p$ Klikk visszavezetésben mi az $f(G, k)$?",
    answers: [
      "$(G, n-k)$, ahol $n$ a csúcsok száma",
      "$(\\overline{G}, k)$, ahol $\\overline{G}$ a komplementer gráf",
      "$(G, k+1)$",
    ],
    correct: 1,
    explanation:
      "Egy csúcshalmaz $G$-ben pontosan akkor független, ha $\\overline{G}$-ben klikk: ha köztük nincs él $G$-ben, akkor $\\overline{G}$-ben minden él megvan. A komplementer gráf polinom időben elkészíthető.",
    difficulty: "hard",
  },
  {
    question: "Miért kell az NP-teljességi bizonyításban az NP-beliséget külön megmutatni?",
    answers: [
      "Mert a visszavezetés iránya ezt nem adja meg.",
      "Mert ez garantálja, hogy a visszavezetés polinom idejű.",
      "Mert enélkül a visszavezetés iránya rossz.",
    ],
    correct: 0,
    explanation:
      "Az $L \\leq_p L'$ visszavezetés csak NP-nehézséget mutat: $L'$ legalább olyan nehéz, mint $L$. Az NP-beliséget (tanú + polinom idejű ellenőrzés) külön kell igazolni.",
    difficulty: "hard",
  },
  {
    question: "Ha egy NP-teljes $L$ problémára $L \\in P$, mi következik?",
    answers: ["$P = NP$", "$NP = coNP$", "Csak $L$ megoldható hatékonyan."],
    correct: 0,
    explanation:
      "Ha $L$ NP-teljes és $L \\in P$, akkor minden NP-beli probléma visszavezethető $L$-re (polinom időben), és $L$ polinom időben eldönthető, tehát minden NP-beli probléma is $P$-beli: $P = NP$.",
    difficulty: "hard",
  },
  {
    question: "Mit mond Ladner tétele?",
    answers: [
      "Ha $P \\neq NP$, léteznek NP-beli, de sem P-beli, sem NP-teljes problémák.",
      "Ha $P = NP$, minden NP-teljes probléma P-beli.",
      "SAT NP-teljes.",
    ],
    correct: 0,
    explanation:
      "Ha $P \\neq NP$, akkor az NP nem csak $P$-ből és az NP-teljes problémákból áll: léteznek NP-köztes problémák. Ismert jelöltek: Gráfizomorfizmus, Prímfaktorizáció.",
    difficulty: "hard",
  },
];
