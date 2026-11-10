import type { QuizQuestion } from "../../types/exercise";

export const quiz: QuizQuestion[] = [
  {
    question: "Mikor mondjuk, hogy két halmaz azonos számosságú?",
    answers: [
      "ha mindkettő végtelen",
      "ha létezik köztük bijekció",
      "ha létezik injekció az egyikből a másikba",
    ],
    correct: 1,
    explanation:
      "$|A| = |B|$ pontosan akkor, ha van bijekció $A$ és $B$ között. Egyetlen injekció csak $\\leq$ viszonyt ad, a Cantor–Bernstein–Schröder tétel szerint viszont két injekció (oda és vissza) már elég.",
    difficulty: "easy",
  },
  {
    question: "Melyik halmaz NEM megszámlálható?",
    answers: [
      "a racionális számok halmaza",
      "a Turing-gépek halmaza",
      "a $\\{0,1\\}$ feletti nyelvek halmaza",
    ],
    correct: 2,
    explanation:
      "A nyelvek halmaza $\\mathcal{P}(\\{0,1\\}^*)$, ami Cantor tétele szerint nagyobb számosságú, mint a megszámlálható $\\{0,1\\}^*$. A Turing-gépek véges bináris szavakkal kódolhatók, így belőlük csak megszámlálhatóan sok van.",
    difficulty: "easy",
  },
  {
    question: "Mi a különbség az $R$ és az $RE$ nyelvosztály között?",
    answers: [
      "$R$-nél a gép minden bemeneten megáll, $RE$-nél a nem elfogadott szavakon végtelen ciklusba is eshet",
      "$R$-beli nyelveket determinisztikus, $RE$-belieket csak nemdeterminisztikus gép ismer fel",
      "$RE$-ben csak véges nyelvek vannak",
    ],
    correct: 0,
    explanation:
      "Eldöntésnél ($R$) mindig kapunk választ. Felismerésnél ($RE$) csak az „igen” biztos, a nem $L$-beli szavakon a gép akár sosem áll meg.",
    difficulty: "easy",
  },
  {
    question: "Hol helyezkedik el az univerzális nyelv, $L_u = \\{\\langle M, w \\rangle \\mid w \\in L(M)\\}$?",
    answers: ["$R$-ben", "$RE \\setminus R$-ben", "nincs benne $RE$-ben"],
    correct: 1,
    explanation:
      "$L_u \\in RE$, mert az univerzális Turing-gép szimulálja $M$-et $w$-n, és ha $M$ elfogad, ő is elfogad. Eldönthető viszont nem, mert ha $M$ végtelen ciklusba esik, a szimuláció sem áll meg.",
    difficulty: "easy",
  },
  {
    question: "Ha $L_1 \\leq L_2$ és $L_1 \\notin R$, mit tudunk $L_2$-ről?",
    answers: ["$L_2 \\in R$", "$L_2 \\notin R$", "semmit"],
    correct: 1,
    explanation:
      "Ha $L_2$ eldönthető lenne, akkor az $f$ visszavezetés és az $L_2$-t eldöntő gép együtt $L_1$-et is eldöntené. Tehát $L_2$ legalább olyan nehéz, mint $L_1$, így $L_2 \\notin R$.",
    difficulty: "easy",
  },
  {
    question: "Melyik kérdés dönthető el egy tetszőleges $M$ Turing-gépről?",
    answers: [
      "elfogadja-e $M$ az üres szót",
      "véges nyelvet ismer-e fel $M$",
      "megáll-e $M$ az üres szón 100 lépésen belül",
    ],
    correct: 2,
    explanation:
      "100 lépést egyszerűen lefuttathatunk, ez mindig véget ér. A másik kettő a felismert nyelv nem triviális tulajdonsága, így Rice tétele szerint eldönthetetlen.",
    difficulty: "easy",
  },
  {
    question: "Ha $L \\in RE \\setminus R$, mit mondhatunk $\\overline{L}$-ről?",
    answers: ["$\\overline{L} \\in R$", "$\\overline{L} \\in RE \\setminus R$", "$\\overline{L} \\notin RE$"],
    correct: 2,
    explanation:
      "Ha $L$ és $\\overline{L}$ is $RE$-beli lenne, a két felismerőt felváltva futtatva $L$-et eldönthetnénk, azaz $L \\in R$ lenne. Ez ellentmondás, tehát $\\overline{L} \\notin RE$. Például $\\overline{L_u}, \\overline{L_h} \\notin RE$.",
    difficulty: "hard",
  },
  {
    question: "Be akarjuk látni, hogy egy $L$ nyelv eldönthetetlen. Melyik visszavezetést kell megadnunk?",
    answers: ["$L \\leq L_u$", "$L_u \\leq L$", "bármelyik irány jó"],
    correct: 1,
    explanation:
      "Egy ismert eldönthetetlen nyelvet vezetünk vissza $L$-re. Ha $L$ eldönthető lenne, akkor $L_u$ is az lenne, ami ellentmondás. Az $L \\leq L_u$ irány csak azt mutatná, hogy $L$ legfeljebb olyan nehéz, mint $L_u$.",
    difficulty: "hard",
  },
  {
    question:
      "Az $L_u \\leq L_h$ bizonyításban $\\langle M, w \\rangle$-ból $M'$-t készítünk. Mit csinál $M'$, ha $M$ elutasítja $w$-t?",
    answers: ["elutasít", "végtelen ciklusba lép", "elfogad"],
    correct: 1,
    explanation:
      "Azt akarjuk, hogy $M'$ pontosan akkor álljon meg, ha $M$ elfogad. Ha $M$ elutasításakor $M'$ is elutasítana, akkor megállna, és a visszavezetés elromlana.",
    difficulty: "hard",
  },
  {
    question: "Mit állít a Post megfelelkezési problémáról szóló tétel?",
    answers: [
      "$L_{PMP} \\in R$, mert a dominók száma véges",
      "$L_{PMP} \\in RE \\setminus R$",
      "$L_{PMP} \\notin RE$",
    ],
    correct: 1,
    explanation:
      "A dominósorozatokat hossz szerint felsorolva, ha van megoldás, előbb-utóbb megtaláljuk, így $L_{PMP} \\in RE$. Ha viszont nincs megoldás, ez a keresés sosem áll meg, és a tétel szerint jobb algoritmus sincs: $L_{PMP} \\notin R$.",
    difficulty: "hard",
  },
];
