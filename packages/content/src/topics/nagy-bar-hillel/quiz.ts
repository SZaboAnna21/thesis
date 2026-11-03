import type { QuizQuestion } from "../../types/exercise";

export const quiz: QuizQuestion[] = [
  {
    question: "Mire használjuk tipikusan a Nagy Bar-Hillel lemmát?",
    answers: [
      "annak bizonyítására, hogy egy nyelv környezetfüggetlen",
      "annak bizonyítására, hogy egy nyelv nem környezetfüggetlen",
      "annak bizonyítására, hogy egy nyelv reguláris",
    ],
    correct: 1,
    explanation:
      "A lemma minden CF nyelvre teljesül, így ha egy nyelvre megmutatjuk, hogy nem teljesül, akkor az nem CF.",
    difficulty: "easy",
  },
  {
    question: "Az $uxwyz$ felbontásban melyik feltételnek kell teljesülnie?",
    answers: [
      "$|xwy| \\leq q$ és $xy \\neq \\varepsilon$",
      "$|uxw| \\leq q$ és $x \\neq \\varepsilon$",
      "$|xwy| \\geq p$ és $w \\neq \\varepsilon$",
    ],
    correct: 0,
    explanation:
      "A lemma szerint $|xwy| \\leq q$, és a pumpált részek közül legalább az egyik nem üres: $xy \\neq \\varepsilon$.",
    difficulty: "easy",
  },
  {
    question: "Mi a lényeges különbség a Kis és a Nagy Bar-Hillel lemma között?",
    answers: [
      "a nagy lemmánál egyszerre két részt pumpálunk, azonos kitevővel",
      "a nagy lemmánál a pumpált rész helyét mi választhatjuk meg",
      "a nagy lemma csak véges nyelvekre érvényes",
    ],
    correct: 0,
    explanation:
      "A nagy lemmánál az $x$ és $y$ részt egyszerre, ugyanazzal az $i$-vel ismételjük: $ux^iwy^iz$. A részek helyét nem mi választjuk, csak annyit tudunk, hogy $|xwy| \\leq q$.",
    difficulty: "easy",
  },
  {
    question: "Melyik nyelv környezetfüggetlen?",
    answers: [
      "$\\{a^nb^nc^n \\mid n \\in \\mathbb{N}\\}$",
      "$\\{a^nb^n \\mid n \\in \\mathbb{N}\\}$",
      "$\\{ww \\mid w \\in \\{a, b\\}^*\\}$",
    ],
    correct: 1,
    explanation:
      "Az $\\{a^nb^n\\}$ nyelvet az $S \\to aSb \\mid \\varepsilon$ grammatika generálja. A másik kettő a Nagy Bar-Hillel lemmával megmutathatóan nem CF.",
    difficulty: "easy",
  },
  {
    question: "Zárt-e $\\mathcal{L}_2$ a metszetre?",
    answers: ["igen", "nem"],
    correct: 1,
    explanation:
      "$\\{a^nb^nc^n\\} = \\{a^kb^nc^n\\} \\cap \\{a^nb^nc^k\\}$, ahol a jobb oldalon mindkét nyelv CF, a bal oldali viszont nem.",
    difficulty: "easy",
  },
  {
    question: "Legyen $L_1$ környezetfüggetlen, $L_2$ reguláris. Mit tudunk $L_1 \\cap L_2$-ről?",
    answers: [
      "mindig reguláris",
      "mindig környezetfüggetlen",
      "nem feltétlenül környezetfüggetlen",
    ],
    correct: 1,
    explanation:
      "Bár $\\mathcal{L}_2$ nem zárt a metszetre, egy CF és egy reguláris nyelv metszete mindig CF.",
    difficulty: "easy",
  },
  {
    question: "Melyik probléma eldönthetetlen környezetfüggetlen grammatikákra?",
    answers: ["szóprobléma", "üresség", "ekvivalencia"],
    correct: 2,
    explanation:
      "CF nyelvekre a szóprobléma, az üresség és a végtelenség eldönthető, az ekvivalencia, a tartalmazás és a diszjunktság viszont nem. Reguláris nyelvekre mind eldönthető.",
    difficulty: "hard",
  },
  {
    question:
      "Az $a^kb^kc^k$ szóval végzett bizonyításban miért választjuk $k$-t $q$-nál nagyobbra?",
    answers: [
      "hogy a szó hosszabb legyen $p$-nél",
      "hogy az $xy$ ne tartalmazhasson egyszerre $a$-t és $c$-t",
      "hogy $xy \\neq \\varepsilon$ teljesüljön",
    ],
    correct: 1,
    explanation:
      "Mivel $|xwy| \\leq q < k$, az $xwy$ legfeljebb két szomszédos blokkba lóghat bele, így pumpáláskor valamelyik betű száma változatlan marad.",
    difficulty: "hard",
  },
  {
    question:
      "Az $s = a^kb^kc^k$ szóra $i = 0$ választással mi történik az $uwz$ szóval?",
    answers: [
      "mindhárom betűből ugyanannyi esik ki, így $uwz \\in L$",
      "legalább egy, de legfeljebb két fajta betű száma csökken, így $uwz \\notin L$",
      "$uwz = s$, így nem kapunk ellentmondást",
    ],
    correct: 1,
    explanation:
      "Mivel $xy \\neq \\varepsilon$, legalább egy betű kiesik, de az $xy$ nem tartalmaz egyszerre $a$-t és $c$-t, így valamelyik betűből $k$ marad, egy másikból kevesebb.",
    difficulty: "hard",
  },
  {
    question: "Zárt-e $\\mathcal{L}_2$ a komplementerképzésre?",
    answers: [
      "igen, mert zárt az unióra",
      "nem, mert akkor a metszetre is zárt lenne",
    ],
    correct: 1,
    explanation:
      "$L_1 \\cap L_2 = \\overline{\\overline{L_1} \\cup \\overline{L_2}}$. Ha $\\mathcal{L}_2$ zárt lenne a komplementerre, az unióra való zártság miatt a metszetre is zárt lenne, ami nem igaz.",
    difficulty: "hard",
  },
  {
    question:
      "Ha egy nyelv minden elég hosszú szava pumpálható a Nagy Bar-Hillel lemma szerint, következik-e, hogy a nyelv környezetfüggetlen?",
    answers: ["igen", "nem"],
    correct: 1,
    explanation:
      "A lemma csak szükséges feltétel: minden CF nyelv teljesíti, de van olyan nem CF nyelv is, amelyik teljesíti. Ezért csak arra jó, hogy megmutassuk, egy nyelv nem CF.",
    difficulty: "hard",
  },
];
