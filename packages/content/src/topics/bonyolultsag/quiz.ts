import type { QuizQuestion } from "../../types/exercise";

export const quiz: QuizQuestion[] = [
  {
    question: "Mit jelent $f(n) = O(g(n))$?",
    answers: [
      "van $c > 0$ és $N$, hogy minden $n \\geq N$-re $f(n) \\leq c \\cdot g(n)$",
      "van $c > 0$ és $N$, hogy minden $n \\geq N$-re $f(n) \\geq c \\cdot g(n)$",
      "$f$ és $g$ azonos nagyságrendűek",
    ],
    correct: 0,
    explanation:
      "$O$ felső korlátot jelöl: $f$ legfeljebb $c$-szeres állandóval $g$ fölé nőhet. Az alsó korlát $\\Omega$, a kétoldalú korlát $\\Theta$.",
    difficulty: "easy",
  },
  {
    question: "Melyik aszimptotikus összefüggés igaz?",
    answers: [
      "$2n^2 + 3\\log n = \\Theta(n^2)$",
      "$2n^2 + 3\\log n = \\Theta(\\log n)$",
      "$2n^2 + 3\\log n = O(n)$",
    ],
    correct: 0,
    explanation:
      "Az összeg nagyságrendjét a domináns tag adja. Mivel $n^2 \\gg \\log n$, az egész kifejezés $\\Theta(n^2)$.",
    difficulty: "easy",
  },
  {
    question: "Igaz-e, hogy $P \\subseteq NP$?",
    answers: [
      "Igen, mert a determinisztikus gép a nemdeterminisztikus speciális esete.",
      "Nem, $P$ és $NP$ diszjunkt.",
      "Nem tudjuk.",
    ],
    correct: 0,
    explanation:
      "Minden determinisztikus gép felfogható nemdeterminisztikusként (egyetlen ággal), így $TIME(f(n)) \\subseteq NTIME(f(n))$, ebből $P \\subseteq NP$.",
    difficulty: "easy",
  },
  {
    question: "Mi az NP tanús jellemzése?",
    answers: [
      "Minden bemenetre polinom időben elfogadó választ ad egy determinisztikus gép.",
      "Minden 'igen' bemenetre létezik polinom méretű tanú, amelynek helyessége polinom időben ellenőrizhető.",
      "A gép exponenciális időben nemdeterminisztikusan megtalálja a megoldást.",
    ],
    correct: 1,
    explanation:
      "Az NP-beli problémáknál a nehézség a megoldás keresése, de ha valaki megmutat egy tanút (pl. kielégítő értékadást), azt gyorsan leellenőrizhetjük.",
    difficulty: "easy",
  },
  {
    question: "Mit állít Savitch tétele?",
    answers: [
      "$PSPACE = NP$",
      "$NSPACE(f(n)) \\subseteq SPACE(f^2(n))$, ha $f(n) \\geq \\log n$",
      "$NP \\subseteq P$",
    ],
    correct: 1,
    explanation:
      "Savitch tétele szerint nemdeterminizmus a tárban legfeljebb négyzetes többletköltséggel szimulálható. Következmény: $PSPACE = NPSPACE$.",
    difficulty: "easy",
  },
  {
    question: "Melyik két tartalmazás bizonyítottan valódi a $L \\subseteq NL \\subseteq P \\subseteq NP \\subseteq PSPACE \\subseteq EXPTIME$ láncban?",
    answers: [
      "$P \\subsetneq NP$ és $NP \\subsetneq PSPACE$",
      "$NL \\subsetneq PSPACE$ és $P \\subsetneq EXPTIME$",
      "$L \\subsetneq NL$ és $P \\subsetneq NP$",
    ],
    correct: 1,
    explanation:
      "Biztosan tudjuk, hogy $NL \\subsetneq PSPACE$ és $P \\subsetneq EXPTIME$. A $P \\overset{?}{=} NP$ és $L \\overset{?}{=} NL$ kérdések nyitottak.",
    difficulty: "hard",
  },
  {
    question: "Miért nem bizonyítja a $coNP \\subseteq NP$-t az, hogy a nemdeterminisztikus gépen felcseréljük az elfogadó és elutasító állapotokat?",
    answers: [
      "Mert nemdeterminisztikus gépen a 'van elfogadó ág' negáltja nem 'van elutasító ág', hanem 'minden ág elutasít'.",
      "Mert a nemdeterminisztikus gép nem tud elutasítani.",
      "Mert az állapotok felcserélése megváltoztatja a bonyolultsági osztályt.",
    ],
    correct: 0,
    explanation:
      "Az NP-beli gép elfogad, ha valamelyik ága elfogad. Az állapotcsere olyan gépet adna, ami elfogad, ha van elutasító ág – ez más feltétel, mint 'minden ág elutasít'.",
    difficulty: "hard",
  },
  {
    question: "Mi igaz az idő- és tárbonyolultság kapcsolatáról?",
    answers: [
      "$SPACE(f(n)) \\subseteq TIME(f(n))$",
      "$TIME(f(n)) \\subseteq SPACE(f(n))$",
      "Nincs köztük összefüggés.",
    ],
    correct: 1,
    explanation:
      "$t$ lépés alatt legfeljebb $t$ cellát lehet megérinteni, ezért a tárigény legfeljebb akkora, mint az időigény. Fordítva nem igaz, mert a tár újrahasznosítható.",
    difficulty: "hard",
  },
  {
    question: "Miért igaz, hogy $NP \\subseteq PSPACE$?",
    answers: [
      "Mert minden NP-beli problémára létezik polinom tárban futó nemdeterminisztikus algoritmus.",
      "Mert az összes lehetséges tanút egyesével végig lehet próbálni polinom méretű tár újrahasznosításával.",
      "Mert Savitch tétele közvetlenül ezt mondja ki.",
    ],
    correct: 1,
    explanation:
      "Minden tanú polinom méretű, ezért egyesével kipróbálhatók – a tár minden próbálkozás után törölhető. Így polinom tár elegendő az összes eset végigvizsgálásához.",
    difficulty: "hard",
  },
];
