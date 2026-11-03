import type { QuizQuestion } from "../../types/exercise";

export const quiz: QuizQuestion[] = [
  {
    question: "Mit lehet bizonyítani a Kis Bar-Hillel lemmával?",
    answers: [
      "hogy egy nyelv reguláris",
      "hogy egy nyelv nem reguláris",
      "mindkettőt",
    ],
    correct: 1,
    explanation:
      "A lemma csak szükséges feltétel: minden reguláris nyelv teljesíti, ezért ha egy nyelv nem teljesíti, akkor nem reguláris. Azt viszont nem lehet vele bizonyítani, hogy egy nyelv reguláris.",
    difficulty: "easy",
  },
  {
    question: "Mit tudunk a lemma által adott $y$ részszóról?",
    answers: [
      "$0 < |y| \\leq n$",
      "$|y| \\geq n$",
      "$y$ lehet üres is",
    ],
    correct: 0,
    explanation:
      "Az $y$ a $w'$ egy nem üres, legfeljebb $n$ hosszú részszava. Ennél többet nem tudunk róla, ezért az érvelésnek minden ilyen $y$-ra működnie kell.",
    difficulty: "easy",
  },
  {
    question: "A bizonyítás során mit választhatunk meg mi?",
    answers: [
      "az $n$ konstanst",
      "az $y$ részszót",
      "a $w$ szót, a $w = uw'v$ felbontást és az $i$ kitevőt",
    ],
    correct: 2,
    explanation:
      "Az $n$-et és az $y$-t a lemma adja, nekik nem adhatunk konkrét értéket. Mi az $n$-től függő $w$ szót, a felbontást és az ellentmondáshoz vezető $i$-t választjuk.",
    difficulty: "easy",
  },
  {
    question: "Miért ismételhető a lemmában szereplő $y$ rész?",
    answers: [
      "mert egy $n$ állapotú DVA legalább $n$ betű olvasása közben valamelyik állapotba kétszer jut el, és a közte bejárt út egy kör",
      "mert minden reguláris nyelv végtelen",
      "mert a reguláris nyelvek zártak a konkatenációra",
    ],
    correct: 0,
    explanation:
      "Az $n$ betű olvasása közben $n+1$ állapotot érintünk, így valamelyik ismétlődik. A két látogatás közti szakasz ($y$) egy kör, amit akárhányszor bejárhatunk vagy kihagyhatunk.",
    difficulty: "easy",
  },
  {
    question: "Hogyan döntjük el, hogy egy DVA által felismert nyelv üres-e?",
    answers: [
      "minden $n$-nél rövidebb szóra lefuttatjuk az automatát",
      "megnézzük, elérhető-e végállapot a kezdőállapotból",
      "minimalizáljuk az automatát, és megszámoljuk az állapotait",
    ],
    correct: 1,
    explanation:
      "$L = \\emptyset$ pontosan akkor, ha a kezdőállapotból egyetlen végállapot sem érhető el, ez egy egyszerű gráfbejárás.",
    difficulty: "easy",
  },
  {
    question: "Hogyan vezetjük vissza az $L_1 \\subseteq L_2$ kérdést az ürességre?",
    answers: [
      "$L_1 \\cap L_2 = \\emptyset$?",
      "$L_1 \\setminus L_2 = \\emptyset$?",
      "$L_1 \\cup L_2 = \\emptyset$?",
    ],
    correct: 1,
    explanation:
      "$L_1 \\subseteq L_2$ pontosan akkor, ha $L_1$-nek nincs olyan szava, ami ne lenne $L_2$-ben, vagyis $L_1 \\setminus L_2 = \\emptyset$.",
    difficulty: "easy",
  },
  {
    question:
      "Az $L = \\{a^kb^k\\}$ bizonyításában $w = a^nb^n$, $w' = a^n$, $y = a^k$ ($0 < k \\leq n$). Milyen szót kapunk $i = 0$ esetén?",
    answers: ["$a^nb^{n-k}$", "$a^{n-k}b^n$", "$a^{n+k}b^n$"],
    correct: 1,
    explanation:
      "$i = 0$ esetén az $y = a^k$ kiesik, így $a^{n-k}b^n$ marad. Ebben kevesebb az $a$, mint a $b$, tehát nincs $L$-ben.",
    difficulty: "hard",
  },
  {
    question: "Miért érdemes a $w'$ részt egyféle betűből választani (pl. $w' = a^n$)?",
    answers: [
      "mert így $w'$ rövidebb lesz $n$-nél",
      "mert így biztosan tudjuk, hogy $y = a^k$ alakú, és nem kell több esetet vizsgálni",
      "mert a lemma csak egyféle betűből álló részekre érvényes",
    ],
    correct: 1,
    explanation:
      "Az $y$ helyét nem mi választjuk. Ha $w'$ csak $a$-kból áll, akkor bárhol is van $y$, biztosan $a^k$ alakú, így egyetlen esettel lefedjük az összes lehetőséget.",
    difficulty: "hard",
  },
  {
    question:
      "Palindrómák esetén miért $w = a^nba^n$ a jó választás, és miért nem $w = a^{2n}$?",
    answers: [
      "mert $a^{2n}$-ből bármennyi $a$-t kivéve palindróma marad, így nem kapunk ellentmondást",
      "mert $a^{2n}$ nem palindróma",
      "mert $a^{2n}$ rövidebb $n$-nél",
    ],
    correct: 0,
    explanation:
      "Az $a^m$ alakú szavak mind palindrómák, így $a^{2n}$ pumpálásával sosem lépünk ki a nyelvből. A középső $b$ miatt viszont $a^{n-k}ba^n$ már nem palindróma.",
    difficulty: "hard",
  },
  {
    question: "Mennyi idő alatt dönthető el, hogy $u \\in L$, ha $L$-et egy DVA ismeri fel?",
    answers: ["lineáris időben", "polinomiális, de nem lineáris időben", "nem dönthető el"],
    correct: 0,
    explanation:
      "Lefuttatjuk az automatát $u$-n: minden betűre egy lépés, így $|u|$ lépés után kiderül, végállapotban vagyunk-e.",
    difficulty: "hard",
  },
];
