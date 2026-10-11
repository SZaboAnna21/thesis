import type { ContentBlock } from "../../types/content";

export const theory: ContentBlock[] = [
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Nyelvek és műveleteik",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Az előző részben szavakkal dolgoztunk. Most egy szinttel feljebb lépünk, és szavak halmazaival fogunk foglalkozni. Ezeket hívjuk nyelveknek, és innentől szinte minden róluk fog szólni.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Nyelv",
    },
    content: {
      hu: "Legyen $V$ egy ábécé. A $V^*$ bármely $L$ részhalmazát ($L \\subseteq V^*$) $V$ feletti nyelvnek nevezzük.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Tehát egy nyelv nem más, mint szavak egy bizonyos halmaza. Nem kell, hogy értelmes legyen s nem kell, hogy szabály szerint épüljön fel, bármilyen szóhalmaz nyelv. Az üres nyelvet, amiben egyetlen szó sincs, $\\emptyset$-val jelöljük. Egy nyelv véges, ha véges sok szót tartalmaz, különben végtelen.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "Az üres nyelv ($\\emptyset$) és az üres szót tartalmazó nyelv ($\\{\\varepsilon\\}$) nem ugyanaz! Az elsőben nulla szó van, a másodikban pontosan egy: az üres szó. Olyan ez, mint egy üres doboz, illetve egy doboz, amiben egy üres boríték van.",
    },
  },
  {
    type: "example",
    title: {
      hu: "Példa",
    },
    content: {
      hu: "Legyen $V = \\{a, b\\}$. Néhány $V$ feletti nyelv:",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "$L_1 = \\{a, ba, ababb, \\varepsilon\\}$" },
      { hu: "$L_2 = \\{a^ib^i \\mid i \\geq 0\\}$" },
      { hu: "$L_3 = \\{uu^R \\mid u \\in V^*\\}$" },
      { hu: "$L_4 = \\{a^n \\mid n \\geq 1\\}$" },
      { hu: "$L_5 = \\{u \\mid u \\in \\{a, b\\}^+, \\text{ u-ban ugyanannyi } a \\text{ van, mint } b\\}$" },
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Ezek közül $L_1$ véges nyelv, a többi végtelen.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Halmazműveletek",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Mivel a nyelvek halmazok, minden, amit halmazokkal csinálni szoktunk, itt is érvényes. Legyenek $L_1, L_2 \\subseteq V^*$.",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      {
        hu: "Unió: $L_1 \\cup L_2 = \\{u \\mid u \\in L_1 \\text{ vagy } u \\in L_2\\}$",
      },
      {
        hu: "Metszet: $L_1 \\cap L_2 = \\{u \\mid u \\in L_1 \\text{ és } u \\in L_2\\}$",
      },
      {
        hu: "Különbség: $L_1 - L_2 = \\{u \\mid u \\in L_1 \\text{ és } u \\notin L_2\\}$",
      },
    ],
  },
  {
    type: "example",
    title: {
      hu: "Példa",
    },
    content: {
      hu: "Legyen $L_1 = \\{\\varepsilon, ab, abb\\}$ és $L_2 = \\{ab, bab\\}$. Ekkor $L_1 \\cup L_2 = \\{\\varepsilon, ab, abb, bab\\}$, $L_1 \\cap L_2 = \\{ab\\}$, $L_1 - L_2 = \\{\\varepsilon, abb\\}$.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Komplementer",
    },
    content: {
      hu: "Az $L \\subseteq V^*$ nyelv komplementere a $V$ ábécére nézve az $\\overline{L} = V^* - L$ nyelv.",
    },
  },
  {
    type: "example",
    title: {
      hu: "Példa",
    },
    content: {
      hu: "Legyen $V = \\{a\\}$ és $L = \\{a^{2n+1} \\mid n \\in \\mathbb{N}\\}$, vagyis a páratlan hosszú szavak. Ekkor $\\overline{L} = \\{a^{2n} \\mid n \\in \\mathbb{N}\\}$, vagyis a páros hosszúak (az $\\varepsilon$-t is beleértve).",
    },
  },
  {
    type: "warning",
    text: {
      hu: "A komplementer mindig az ábécéhez képest értendő! Ugyanannak a nyelvnek más a komplementere, ha $V = \\{a\\}$, és más, ha $V = \\{a, b\\}$.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Nyelvek konkatenációja",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A szavaknál már láttuk a konkatenációt, most ezt emeljük át nyelvekre. A recept egyszerű: mindenkit mindenkivel.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Nyelvek konkatenációja",
    },
    content: {
      hu: "Legyen $L_1, L_2 \\subseteq V^*$. Az $L_1$ és $L_2$ nyelvek konkatenációja az $L_1L_2 = \\{u_1u_2 \\mid u_1 \\in L_1, u_2 \\in L_2\\}$ nyelv.",
    },
  },
  {
    type: "example",
    title: {
      hu: "Példa: kevesebb szó, mint várnánk",
    },
    content: {
      hu: "Legyen $L_3 = \\{a, ab\\}$ és $L_4 = \\{bc, c\\}$. Ekkor $L_3L_4 = \\{abc, ac, abbc\\}$. Itt $|L_3L_4| = 3 < 2 \\cdot 2 = 4$, mert az $abc$ kétféleképpen is előáll: $a \\cdot bc$ és $ab \\cdot c$.",
    },
  },
  {
    type: "example",
    title: {
      hu: "Példa: végtelen nyelvek",
    },
    content: {
      hu: "Legyen $L_5 = \\{a^{2n}b^{2n} \\mid n \\in \\mathbb{N}\\}$ és $L_6 = \\{a^{3n}b^{3n} \\mid n \\in \\mathbb{N}\\}$. Ekkor $L_5L_6 = \\{a^{2n}b^{2n}a^{3k}b^{3k} \\mid n, k \\in \\mathbb{N}\\}$. Figyeld meg, hogy két külön változó kell ($n$ és $k$), hiszen az $L_5$ bármelyik szava párosulhat az $L_6$ bármelyik szavával: például $n = 46$ és $k = 87$ is jó.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "Gyakori hiba ugyanazt a változót használni a két tényezőben, pl. $\\{a^{2n}b^{2n}a^{3n}b^{3n}\\}$-t írni. Ez egy sokkal kisebb nyelv lenne, mert ott a két rész „össze van kötve”.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A konkatenáció asszociatív: $L_1(L_2L_3) = (L_1L_2)L_3$, de (ahogy a szavaknál) nem kommutatív. Az egységelem a $\\{\\varepsilon\\}$ nyelv: $\\{\\varepsilon\\}L = L\\{\\varepsilon\\} = L$ minden $L$-re.",
    },
  },
  {
    type: "funfact",
    text: {
      hu: "Algebrai nyelven: egy adott ábécé feletti nyelvek a konkatenációra nézve egységelemes félcsoportot (monoidot) alkotnak, melynek $\\{\\varepsilon\\}$ az egységeleme. És vajon mi történik az üres nyelvvel? $\\emptyset L = L\\emptyset = \\emptyset$, hiszen nincs kit kivel párosítani. Ez úgy viselkedik, mint a $0$ a szorzásnál.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Hatvány és Kleene-lezárt",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Nyelv $i$-edik hatványa",
    },
    content: {
      hu: "$L^0 := \\{\\varepsilon\\}$ és $L^i := LL^{i-1}$ ($i \\geq 1$). Vagyis $L^i$ az $L$ $i$-szeres konkatenációja önmagával. Nyilván $L^{k+n} = L^kL^n$.",
    },
  },
  {
    type: "example",
    title: {
      hu: "Példa",
    },
    content: {
      hu: "Legyen $L = \\{a, bb\\}$. Ekkor az első néhány hatvány:",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "$L^0 = \\{\\varepsilon\\}$" },
      { hu: "$L^1 = \\{a, bb\\}$" },
      { hu: "$L^2 = \\{aa, abb, bba, bbbb\\}$" },
      { hu: "$L^3 = \\{aaa, aabb, abba, abbbb, bbaa, bbabb, bbbba, bbbbbb\\}$" },
    ],
  },
  {
    type: "definition",
    term: {
      hu: "Kleene-lezárt (iteratív lezárt)",
    },
    content: {
      hu: "Az $L$ nyelv Kleene-lezártja az $L^* = \\bigcup_{i \\geq 0} L^i$ nyelv.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Pozitív lezárt",
    },
    content: {
      hu: "Az $L$ nyelv pozitív lezártja az $L^+ = \\bigcup_{i \\geq 1} L^i$ nyelv.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Szemléletesen: $L^*$ az összes olyan szó, amit $L$ szavaiból tetszőleges (akár nulla) darabot egymás után írva kapunk. Az $L = \\{a, bb\\}$ példánál $L^*$ az $L^0, L^1, L^2, L^3, \\dots$ halmazok uniója, $L^+$ pedig ugyanez $L^0$ nélkül.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "Csapda: $L^+$ nem mindig $L^* - \\{\\varepsilon\\}$! Ha $\\varepsilon \\in L$, akkor $\\varepsilon$ már $L^1$-ben is benne van, így $L^+ = L^*$. Ha $\\varepsilon \\notin L$, akkor valóban $L^+ = L^* - \\{\\varepsilon\\}$.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Tükörkép",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Nyelv tükörképe",
    },
    content: {
      hu: "Legyen $L \\subseteq V^*$. Ekkor $L^R := \\{u^R \\mid u \\in L\\}$ az $L$ nyelv tükörképe (megfordítása), ahol $u^R$ az $u$ szó visszafelé olvasva.",
    },
  },
  {
    type: "example",
    title: {
      hu: "Példa",
    },
    content: {
      hu: "Ha $V = \\{a, b\\}$ és $L = \\{ba^{2n+1} \\mid n \\in \\mathbb{N}\\}$, akkor $L^R = \\{a^{2n+1}b \\mid n \\in \\mathbb{N}\\}$.",
    },
  },
  {
    type: "heading",
    level: 3,
    text: {
      hu: "Hasznos összefüggések",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Néhány összefüggés a nyelvműveletek között. Érdemes mindegyiket egyszer végiggondolni .",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "$(L^R)^R = L$" },
      { hu: "$(L_1L_2 \\cdots L_n)^R = L_n^R \\cdots L_2^R L_1^R$" },
      { hu: "$(L^i)^R = (L^R)^i$, ahol $i \\geq 0$" },
      { hu: "$(L^*)^R = (L^R)^*$" },
      { hu: "$L^*L^* = L^*$" },
      { hu: "$(L^*)^* = L^*$" },
      { hu: "$(L_1 \\cup L_2)^* = (L_1^*L_2^*)^*$" },
      { hu: "$L_1(L_2 \\cup L_3) = L_1L_2 \\cup L_1L_3$" },
    ],
  },
  {
    type: "warning",
    text: {
      hu: "A konkatenáció disztributív az unióra, de a metszetre nem: általában $L_1(L_2 \\cap L_3) \\neq L_1L_2 \\cap L_1L_3$. (Próbáld ki: $L_1 = \\{a, aa\\}$, $L_2 = \\{a\\}$, $L_3 = \\{aa\\}$.)",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Prefix- és suffixnyelv",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Prefixnyelv",
    },
    content: {
      hu: "Egy $L \\subseteq V^*$ nyelv prefixnyelve a $\\mathrm{Pre}(L) = \\{u \\mid u \\in V^*, uv \\in L \\text{ valamely } v \\in V^*\\text{-ra}\\}$ nyelv, vagyis $L$ szavainak összes kezdőszelete.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Suffixnyelv",
    },
    content: {
      hu: "Egy $L \\subseteq V^*$ nyelv suffixnyelve a $\\mathrm{Suf}(L) = \\{u \\mid u \\in V^*, vu \\in L \\text{ valamely } v \\in V^*\\text{-ra}\\}$ nyelv, vagyis $L$ szavainak összes végszelete.",
    },
  },
  {
    type: "example",
    title: {
      hu: "Példa",
    },
    content: {
      hu: "Legyen $L = \\{a^{2n+1}b \\mid n \\in \\mathbb{N}\\}$. Ekkor $\\mathrm{Pre}(L) = \\{a^{2n+1}b \\mid n \\in \\mathbb{N}\\} \\cup \\{a^n \\mid n \\in \\mathbb{N}\\}$ és $\\mathrm{Suf}(L) = \\{a^nb \\mid n \\in \\mathbb{N}\\} \\cup \\{\\varepsilon\\}$.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Homomorfizmus",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A homomorfizmus egy „betűcserélő” leképezés: minden betűt lecserélünk egy szóra, és ezt végigcsináljuk a szó összes betűjén.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Homomorfizmus",
    },
    content: {
      hu: "Legyen $V_1$ és $V_2$ két ábécé. A $h: V_1^* \\to V_2^*$ leképezés homomorfizmus, ha egyértelmű (azaz minden $u \\in V_1^*$ szóra pontosan egy $v \\in V_2^*$ szó létezik, amelyre $h(u) = v$), és $h(uv) = h(u)h(v)$ minden $u, v \\in V_1^*$-ra.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Ebből két dolog is következik. Egyrészt $h(\\varepsilon) = \\varepsilon$, hiszen $h(\\varepsilon) = h(\\varepsilon\\varepsilon) = h(\\varepsilon)h(\\varepsilon)$, és ez csak az üres szóra teljesülhet. Másrészt minden $u = a_1a_2 \\cdots a_n$ szóra $h(u) = h(a_1)h(a_2) \\cdots h(a_n)$. Ez azt jelenti, hogy elég $h$-t az ábécé betűin megadni, a többi szóra automatikusan kiterjed.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "$\\varepsilon$-mentes homomorfizmus",
    },
    content: {
      hu: "A $h$ homomorfizmus $\\varepsilon$-mentes, ha $h(u) \\neq \\varepsilon$ bármely $u \\in V_1^+$ szóra, vagyis egyetlen betűt sem töröl ki.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Homomorf kép",
    },
    content: {
      hu: "Az $L \\subseteq V_1^*$ nyelv $h$-homomorf képe a $h(L) = \\{h(u) \\mid u \\in L\\} \\subseteq V_2^*$ nyelv.",
    },
  },
  {
    type: "example",
    title: {
      hu: "Példa",
    },
    content: {
      hu: "Legyen $V_1 = \\{a, b\\}$, $V_2 = \\{b, c\\}$, $L = \\{a^nba^n \\mid n \\in \\mathbb{N}\\}$, továbbá $h(a) = cc$ és $h(b) = cbb$. Ekkor $h(a^nba^n) = c^{2n} \\cdot cbb \\cdot c^{2n}$, tehát $h(L) = \\{c^{2n+1}b^2c^{2n} \\mid n \\in \\mathbb{N}\\}$.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Formális nyelvek megadása",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Egy nyelvet többféleképpen is leírhatunk. Véges nyelvnél egyszerű a dolgunk, végtelennél viszont kell valami véges leírás, ami mégis az összes szót „lefedi”.",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      {
        hu: "Felsorolással (csak véges nyelvekre): $L_1 = \\{ab, ba, abba, ca\\}$",
      },
      {
        hu: "Formulával: $L_2 = \\{a^nb^n \\mid n \\in \\mathbb{N}\\}$",
      },
      {
        hu: "Reguláris kifejezéssel: az $L_3 = \\{a^{2n+1}b \\mid n \\in \\mathbb{N}\\} \\cup \\{a^n \\mid n \\in \\mathbb{N}\\}$ nyelv később így fog kinézni: $(aa)^*ab + a^*$",
      },
      {
        hu: "Felsoroló algoritmussal: pl. $L_4 = \\{0, 1\\}^*$ szavait a hosszlexikografikus (shortlex) felsorolás adja meg",
      },
      {
        hu: "(Generatív) grammatikákkal: szintetizáló eszközök, egyetlen szimbólumból szabályok segítségével építenek fel szavakat",
      },
      {
        hu: "Automatákkal: elemző eszközök, egy szót kapnak bemenetként, és igen/nem választ adnak; az elfogadott szavak alkotják a nyelvet",
      },
    ],
  },
  {
    type: "warning",
    text: {
      hu: "Nem minden eszközzel lehet minden nyelvet megadni! Látni fogjuk például, hogy reguláris kifejezéssel kevesebb nyelv írható le, mint általános grammatikával, de még az sem elég a $\\{0, 1\\}$ feletti összes nyelv leírásához.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Nyelvcsaládok",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Nyelvcsalád (nyelvosztály)",
    },
    content: {
      hu: "Nyelvek egy halmaza. Ha $X$ egy halmaz, jelölje $\\mathcal{P}(X) = \\{A \\mid A \\subseteq X\\}$ a hatványhalmazát. Ekkor egy nyelvcsalád $\\mathcal{L} \\subseteq \\mathcal{P}(V^*)$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Könnyű összekeverni a szinteket, ezért érdemes egyszer egymás mellé tenni őket:",
    },
  },
  {
    type: "table",
    headers: ["Fogalom", "Jelölés", "Mi ez?"],
    rows: [
      ["betű", "$a \\in V$", "az ábécé egy eleme"],
      ["szó", "$u \\in V^*$", "betűk véges sorozata"],
      ["nyelv", "$L \\subseteq V^*$, azaz $L \\in \\mathcal{P}(V^*)$", "szavak halmaza"],
      ["nyelvcsalád", "$\\mathcal{L} \\subseteq \\mathcal{P}(V^*)$, azaz $\\mathcal{L} \\in \\mathcal{P}(\\mathcal{P}(V^*))$", "nyelvek halmaza"],
    ],
  },
  {
    type: "example",
    title: {
      hu: "Példa",
    },
    content: {
      hu: "Legyen $V = \\{a, b\\}$. Nyelvcsaládok például: a véges nyelvek családja; azon nyelvek családja, amelyek csak $b$ betűvel kezdődő szavakat tartalmaznak; vagy a reguláris kifejezésekkel leírható nyelvek családja.",
    },
  },
]
