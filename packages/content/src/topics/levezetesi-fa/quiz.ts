import type { QuizQuestion } from "../../types/exercise";

export const quiz: QuizQuestion[] = [
  {
    question: "Mi a levezetési fa gyökerének címkéje?",
    answers: ["a levezetett szó első betűje", "$S$", "$\\varepsilon$"],
    correct: 1,
    explanation: "A levezetési fa gyökere mindig a kezdőszimbólum, $S$.",
    difficulty: "easy",
  },
  {
    question: "Mi lehet egy levezetési fa levelének címkéje?",
    answers: [
      "csak nemterminális",
      "$\\Sigma \\cup \\{\\varepsilon\\}$ valamely eleme",
      "$N \\cup \\Sigma$ bármely eleme",
    ],
    correct: 1,
    explanation:
      "A levelek terminálisok vagy $\\varepsilon$. Az $\\varepsilon$-nal címkézett csúcsnak nem lehet testvére.",
    difficulty: "easy",
  },
  {
    question: "Mi a levezetési fa határa?",
    answers: [
      "a fa magassága",
      "a levelek címkéi balról jobbra összeolvasva",
      "a belső csúcsok címkéi szintenként összeolvasva",
    ],
    correct: 1,
    explanation:
      "A határ a levélcímkék konkatenációja balról jobbra. Ez éppen a levezetett terminális szó.",
    difficulty: "easy",
  },
  {
    question: "Mi a baloldali levezetés?",
    answers: [
      "minden lépésben a mondatforma balról legelső nemterminálisát írjuk át",
      "minden lépésben a legrövidebb jobb oldalú szabályt alkalmazzuk",
      "olyan levezetés, amelyben csak $A \\to aB$ alakú szabályok szerepelnek",
    ],
    correct: 0,
    explanation:
      "Baloldali levezetésben mindig a legbaloldalibb nemterminálist írjuk át. Így minden levezetési fához pontosan egy baloldali levezetés tartozik.",
    difficulty: "easy",
  },
  {
    question: "Hány levezetés tartozhat egy levezetési fához?",
    answers: [
      "pontosan egy",
      "általában több is, de baloldali levezetés pontosan egy",
      "végtelen sok",
    ],
    correct: 1,
    explanation:
      "A fa nem rögzíti, milyen sorrendben írtuk át a nemterminálisokat, ezért több levezetés is tartozhat hozzá. Baloldali levezetés viszont pontosan egy.",
    difficulty: "easy",
  },
  {
    question: "Az egyértelműség minek a tulajdonsága?",
    answers: ["a nyelvé", "a grammatikáé", "a levezetett szóé"],
    correct: 1,
    explanation:
      "Ugyanazt a nyelvet generálhatja egyértelmű és nem egyértelmű grammatika is, pl. az $S \\to SaS \\mid SbS \\mid c$ és az $S \\to caS \\mid cbS \\mid c$ grammatika ugyanazt a nyelvet generálja.",
    difficulty: "easy",
  },
  {
    question:
      "Legyen $S \\to SaS \\mid SbS \\mid c$. Melyik baloldali levezetés?",
    answers: [
      "$S \\Rightarrow SbS \\Rightarrow SbSaS \\Rightarrow SbcaS \\Rightarrow cbcaS \\Rightarrow cbcac$",
      "$S \\Rightarrow SbS \\Rightarrow cbS \\Rightarrow cbSaS \\Rightarrow cbcaS \\Rightarrow cbcac$",
      "$S \\Rightarrow SbS \\Rightarrow Sbc$",
    ],
    correct: 1,
    explanation:
      "A második levezetésben mindig a legbaloldalibb $S$-t írjuk át. Az elsőben már a második lépésben a jobb oldali $S$-t írjuk át, a harmadik pedig nem is baloldali.",
    difficulty: "hard",
  },
  {
    question:
      "Az $S \\to SaS \\mid SbS \\mid c$ grammatikában a $cbcac$ szónak két különböző levezetése van. Következik-e ebből, hogy a grammatika nem egyértelmű?",
    answers: [
      "igen, két levezetés mindig elég",
      "nem feltétlenül, az kell, hogy a levezetési fák (vagy a baloldali levezetések) különbözzenek",
    ],
    correct: 1,
    explanation:
      "Két levezetés lehet lényegében azonos, ha ugyanazt a fát határozzák meg. A nem egyértelműséghez két különböző fa kell. A $cbcac$-nek amúgy valóban van két különböző fája, tehát ez a grammatika nem egyértelmű.",
    difficulty: "hard",
  },
  {
    question: "Melyik szabály utal arra, hogy a grammatika valószínűleg nem egyértelmű?",
    answers: ["$S \\to caS$", "$S \\to SaS$", "$S \\to c$"],
    correct: 1,
    explanation:
      "Ha a jobb oldalon ugyanaz a nemterminális kétszer szerepel, nem egyértelmű, melyik oldalra kerül a további elágazás, így gyakran ugyanaz a szó két különböző fával is felépíthető.",
    difficulty: "hard",
  },
  {
    question: "Miért egyértelmű az $S \\to caS \\mid cbS \\mid c$ grammatika?",
    answers: [
      "mert a szót balról jobbra, betűpáronként építi fel, így minden lépés meghatározott",
      "mert csak egy nemterminálisa van",
      "mert véges nyelvet generál",
    ],
    correct: 0,
    explanation:
      "A szó következő két betűje egyértelműen meghatározza, melyik szabályt kell alkalmazni, így minden szónak csak egy fája van. Az egy nemterminális nem elég: az $S \\to SaS \\mid SbS \\mid c$ grammatikának is csak egy van.",
    difficulty: "hard",
  },
  {
    question: "Eldönthető-e algoritmikusan, hogy egy környezetfüggetlen grammatika egyértelmű-e?",
    answers: ["igen", "nem, általában eldönthetetlen"],
    correct: 1,
    explanation:
      "Általában eldönthetetlen, bár konkrét grammatikára sokszor könnyű ellenpéldát találni.",
    difficulty: "hard",
  },
];
