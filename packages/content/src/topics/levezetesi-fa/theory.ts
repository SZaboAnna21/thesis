import type { ContentBlock } from "../../types/content";

export const theory: ContentBlock[] = [
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Levezetési fa",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Egy környezetfüggetlen grammatikában minden lépés egyetlen nemterminálist ír át, és ez független attól, mi van mellette. Ezért a levezetést fába is rajzolhatjuk: minden nemterminális csúcs gyerekei annak a szabálynak a jobb oldala, amivel átírtuk.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "levezetési fa",
    },
    content: {
      hu: "A $G = \\langle N, \\Sigma, P, S \\rangle$ környezetfüggetlen grammatika feletti levezetési fának nevezünk egy fát, ha teljesülnek a következők:",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "A levezetési fa gyökerének címkéje $S$." },
      { hu: "Minden további csúcs címkéje $N \\cup \\Sigma \\cup \\{\\varepsilon\\}$ valamely eleme." },
      { hu: "Ha egy csúcs címkéje $X$ és gyerekeinek címkéi balról jobbra olvasva rendre $X_1, \\ldots, X_m$ ($m \\geq 1$), akkor $X \\to X_1 \\cdots X_m \\in P$." },
      { hu: "Minden levél címkéje $\\Sigma \\cup \\{\\varepsilon\\}$ valamely eleme, az $\\varepsilon$-nal címkézett csúcsoknak nincs testvére." },
    ],
  },
  {
    type: "definition",
    term: {
      hu: "határ",
    },
    content: {
      hu: "Egy levezetési fa határa a levélcímkéi balról jobbra összeolvasva (konkatenálva).",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Minden terminális szót generáló levezetéshez tartozik egy levezetési fa, amelynek határa éppen az adott szó. Fordítva viszont nem igaz: a fa nem mondja meg, milyen sorrendben alkalmaztuk a szabályokat. Ugyanahhoz a fához általában több levezetés is tartozik.",
    },
  },
  {
    type: "example",
    title: {
      hu: "Egy fa, két levezetés",
    },
    content: {
      hu: "Legyen $G = \\langle \\{S\\}, \\{a, b, c\\}, \\{S \\to SaS \\mid SbS \\mid c\\}, S \\rangle$. $L(G)$ olyan páratlan hosszú szavakból áll, amelyek páratlan pozícióin $c$, páros pozícióin $a$ vagy $b$ áll. Tekintsük azt a fát, ahol a gyökér az $S \\to SbS$ szabállyal ágazik el, a bal $S$-ből $c$ lesz, a jobb $S$ pedig $S \\to SaS$-sel ágazik tovább, és mindkét gyereke $c$-t ad. Zárójelesen:",
    },
  },
  {
    type: "formula",
    latex: "S\\big[\\, S[c] \\;\\; b \\;\\; S\\big[\\, S[c] \\;\\; a \\;\\; S[c] \\,\\big] \\,\\big]",
  },
  {
    type: "paragraph",
    text: {
      hu: "A fa határa $cbcac$. Két levezetés is tartozik hozzá:",
    },
  },
  {
    type: "formula",
    latex: "\\begin{aligned} &S \\Rightarrow SbS \\Rightarrow cbS \\Rightarrow cbSaS \\Rightarrow cbcaS \\Rightarrow cbcac \\\\ &S \\Rightarrow SbS \\Rightarrow SbSaS \\Rightarrow SbcaS \\Rightarrow cbcaS \\Rightarrow cbcac \\end{aligned}",
  },
  {
    type: "paragraph",
    text: {
      hu: "Ugyanazokat a szabályokat ugyanazokra a csúcsokra alkalmaztuk, csak más sorrendben. Az ilyen levezetéseket nem érdemes megkülönböztetni.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "lényegében azonos levezetések",
    },
    content: {
      hu: "Egy 2-típusú grammatika két levezetését lényegében azonosnak nevezzük, ha ugyanazt a levezetési fát határozzák meg.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Baloldali levezetés",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A lényegében azonos levezetések közül kitüntetünk egyet, hogy minden fához pontosan egy levezetést rendelhessünk.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "baloldali levezetés",
    },
    content: {
      hu: "Egy 2-típusú grammatika egy levezetése baloldali levezetés, ha minden lépésben az aktuális mondatforma balról legelső nemterminálisára alkalmazzuk a grammatika egy szabályát.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Így minden levezetési fához pontosan egy baloldali levezetés tartozik: a fát mélységi bejárással, balról jobbra olvassuk ki. A fenti példában az első levezetés a baloldali.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Egyértelműség",
    },
  },
  {
    type: "definition",
    term: {
      hu: "egyértelmű grammatika",
    },
    content: {
      hu: "Egy $G$ környezetfüggetlen grammatika egyértelmű, ha minden $L(G)$-beli szónak egyetlen baloldali levezetése van. Ezzel ekvivalens: minden $u \\in L(G)$-nek egyetlen levezetési fája van.",
    },
  },
  {
    type: "example",
    title: {
      hu: "Nem egyértelmű grammatika",
    },
    content: {
      hu: "Az előző $G$-ben a $cbcac$ szónak van egy másik fája is: most a gyökér ágazik el $S \\to SaS$-sel, a bal $S$ pedig $S \\to SbS$-sel.",
    },
  },
  {
    type: "formula",
    latex: "S\\big[\\, S\\big[\\, S[c] \\;\\; b \\;\\; S[c] \\,\\big] \\;\\; a \\;\\; S[c] \\,\\big]",
  },
  {
    type: "paragraph",
    text: {
      hu: "A hozzá tartozó baloldali levezetés: $S \\Rightarrow SaS \\Rightarrow SbSaS \\Rightarrow cbSaS \\Rightarrow cbcaS \\Rightarrow cbcac$. A határ ugyanúgy $cbcac$, de a fa más, tehát $cbcac$-nek két különböző baloldali levezetése van. Így $G$ nem egyértelmű.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Hogyan mutatjuk meg, hogy egy grammatika nem egyértelmű?",
    },
  },
  {
    type: "list",
    ordered: true,
    items: [
      { hu: "Keresünk egy szót, amit kétféleképpen lehet felépíteni. Jó jelölt, ha egy szabály jobb oldalán ugyanaz a nemterminális kétszer szerepel (pl. $S \\to SaS$), mert ilyenkor nem egyértelmű, melyik oldalra kerül a további elágazás." },
      { hu: "Felrajzoljuk a két különböző levezetési fát, és ellenőrizzük, hogy a határuk ugyanaz a szó." },
      { hu: "Mindkét fához leírjuk a baloldali levezetést. Ha ezek különböznek, a grammatika nem egyértelmű." },
    ],
  },
  {
    type: "warning",
    text: {
      hu: "Két különböző levezetés még nem elég! Az is kell, hogy a fák (vagy ami ugyanaz, a baloldali levezetések) különbözzenek. A fenti első két levezetés például ugyanahhoz a fához tartozik, ezekből nem következik semmi.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Az egyértelműség a grammatika tulajdonsága, nem a nyelvé. Ugyanazt a nyelvet generálhatja egyértelmű és nem egyértelmű grammatika is. A fenti nyelvet például az $S \\to caS \\mid cbS \\mid c$ grammatika is generálja, és ebben minden szónak csak egy fája van, mert a szót balról jobbra, betűpáronként építi fel.",
    },
  },
  {
    type: "funfact",
    text: {
      hu: "Általában algoritmikusan eldönthetetlen, hogy egy környezetfüggetlen grammatika egyértelmű-e. Konkrét grammatikára persze sokszor könnyű ellenpéldát találni. A programozási nyelvek fordítóinál ezért fontos, hogy a nyelvtant eleve egyértelműre írják: a $2 + 3 \\cdot 4$ kifejezésnek csak egy fája lehet, különben nem lenne világos, mit kell kiszámolni.",
    },
  },
];
