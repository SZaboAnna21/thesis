import type { ContentBlock } from "../../types/content";

export const theory: ContentBlock[] = [
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Veremautomata",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A véges automata az olvasott szóról csak annyit jegyezhet meg, amennyi az állapotaiba belefér. Ezért nem tudja felismerni az $\\{a^nb^n \\mid n \\geq 1\\}$ nyelvet: ehhez meg kellene számolnia az $a$-kat, $n$ pedig tetszőlegesen nagy lehet. Adjunk tehát az automatának korlátlan memóriát, de csak a legegyszerűbb fajtából: egy vermet, amelynek mindig csak a tetejét látja. A veremautomata a véges automata általánosítása, potenciálisan végtelen veremmel és véges kontrollal.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Veremautomata",
    },
    content: {
      hu: "Egy $A = \\langle Z, Q, \\Sigma, \\delta, z_0, q_0, F \\rangle$ rendezett hetes, ahol",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "$Z$ a veremszimbólumok véges halmaza (veremábécé)," },
      { hu: "$Q$ az állapotok véges halmaza," },
      { hu: "$\\Sigma$ az inputszimbólumok véges halmaza (inputábécé)," },
      { hu: "$\\delta : Z \\times Q \\times (\\Sigma \\cup \\{\\varepsilon\\}) \\to \\mathcal{P}_{\\text{véges}}(Z^* \\times Q)$ az átmeneti függvény, ahol $\\mathcal{P}_{\\text{véges}}(X)$ az $X$ véges részhalmazainak halmaza," },
      { hu: "$z_0 \\in Z$ a kezdeti veremszimbólum," },
      { hu: "$q_0 \\in Q$ a kezdőállapot," },
      { hu: "$F \\subseteq Q$ az elfogadó állapotok vagy végállapotok halmaza." },
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "A verem tetején lévő szimbólum, az aktuális állapot és az inputszimbólum együtt határozzák meg a következő átmenetet. Minden lépésben kiveszünk egy elemet a verem tetejéről, és beteszünk helyette néhányat (0, 1, 2, ... darabot). Ha $\\delta(z, q, \\varepsilon)$ nem üres, akkor $\\varepsilon$-átmenet is végrehajtható: ekkor az automata betű olvasása nélkül változtatja meg az állapotát vagy a vermét. Ilyen lépés az első betű elolvasása előtt és az utolsó után is lehetséges.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Átmenetek szabályokkal",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A véges automatához hasonlóan az átmeneteket itt is megadhatjuk átírási szabályokkal, az így kapott szabályhalmaz jele $M_\\delta$. A $p, q \\in Q$, $a \\in \\Sigma$, $z \\in Z$, $u \\in Z^*$ esetén:",
    },
  },
  {
    type: "formula",
    latex: "zqa \\to up \\in M_\\delta \\iff (u, p) \\in \\delta(z, q, a)",
  },
  {
    type: "formula",
    latex: "zq \\to up \\in M_\\delta \\iff (u, p) \\in \\delta(z, q, \\varepsilon)",
  },
  {
    type: "paragraph",
    text: {
      hu: "Átmenetdiagramon a $(u, p) \\in \\delta(z, q, a)$ átmenet egy $q$-ból $p$-be mutató nyíl, $a; z \\to u$ felirattal. A kezdőállapotot → jelöli, a végállapotokat duplán karikázzuk.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Konfiguráció, működés",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Konfiguráció",
    },
    content: {
      hu: "A veremautomata konfigurációja egy $zqw$ alakú szó, ahol $z \\in Z^*$ a verem aktuális tartalma, $q \\in Q$ az aktuális állapot, $w \\in \\Sigma^*$ pedig az input még feldolgozatlan része. A $w \\in \\Sigma^*$ bemenethez tartozó kezdőkonfiguráció $z_0q_0w$.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "A $z$ első betűje van a verem alján, az utolsó a tetején. A $q$ bal oldalán álló szimbólum tehát a verem teteje, a jobb oldalán álló pedig a következő feldolgozandó betű.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A szabályok jobboldalával az alapvető veremműveletek így valósíthatók meg, ha a verem tetején $z$ áll:",
    },
  },
  {
    type: "table",
    headers: ["átmenet", "hatása"],
    rows: [
      ["$(\\varepsilon, r) \\in \\delta(z, q, t)$", "$z$ kivétele (POP)"],
      ["$(z, r) \\in \\delta(z, q, t)$", "a verem változatlan marad"],
      ["$(z', r) \\in \\delta(z, q, t)$", "$z$ cseréje $z'$-re a verem tetején"],
      ["$(zz', r) \\in \\delta(z, q, t)$", "$z'$ a verem tetejére kerül (PUSH)"],
      ["$(u, r) \\in \\delta(z, q, t)$", "$u$ kerül $z$ helyére, $u$ utolsó betűje lesz felül"],
    ],
  },
  {
    type: "definition",
    term: {
      hu: "Egylépéses redukció",
    },
    content: {
      hu: "$A$ az $\\alpha \\in Z^*Q\\Sigma^*$ konfigurációt a $\\beta \\in Z^*Q\\Sigma^*$ konfigurációra redukálja egy lépésben ($\\alpha \\Rightarrow_A \\beta$), ha van olyan $z \\in Z$, $q, p \\in Q$, $a \\in \\Sigma \\cup \\{\\varepsilon\\}$, $r, u \\in Z^*$ és $w \\in \\Sigma^*$, hogy $(u, p) \\in \\delta(z, q, a)$, $\\alpha = rzqaw$ és $\\beta = rupw$.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Többlépéses redukció",
    },
    content: {
      hu: "$\\alpha \\Rightarrow_A^* \\beta$, ha $\\alpha = \\beta$, vagy van olyan $\\alpha_1, \\dots, \\alpha_n$ sorozat, hogy $\\alpha = \\alpha_1$, $\\beta = \\alpha_n$ és $\\alpha_i \\Rightarrow_A \\alpha_{i+1}$ minden $1 \\leq i \\leq n - 1$-re. Tehát $\\Rightarrow_A^*$ a $\\Rightarrow_A$ reflexív, tranzitív lezártja.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Ha a konfigurációra egyik szabály sem illik, a működés elakad. Üres veremnél ez mindig így van, mert $\\delta$ üres veremre nincs értelmezve. Ezért van eleve egy $z_0$ a veremben a kezdőkonfigurációban.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "Az $\\varepsilon$-átmenetek miatt egy működés akár végtelen is lehet: a $zq \\to zzq$ szabály betű olvasása nélkül, a végtelenségig növeli a vermet. Ezért egy szimulátor nem nézheti végig az összes működést, lépés- vagy veremkorlátra van szüksége.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Elfogadás végállapottal és üres veremmel",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Elfogadó állapottal (végállapottal) felismert nyelv",
    },
    content: {
      hu: "$L(A) = \\{w \\in \\Sigma^* \\mid z_0q_0w \\Rightarrow_A^* up$, ahol $u \\in Z^*$, $p \\in F\\}$.",
    },
  },
  {
    type: "example",
    title: {
      hu: "$L_1 = \\{wcw^R \\mid w \\in \\{a, b\\}^+\\}$",
    },
    content: {
      hu: "Az automata a $c$-ig a verembe pakolja a betűket, utána pedig összeveti a bemenetet a veremmel. $A = \\langle \\{\\#, a, b\\}, \\{q_0, q_1, q_2, q_3\\}, \\{a, b, c\\}, \\delta, \\#, q_0, \\{q_3\\} \\rangle$, a szabályok minden $z, t \\in \\{a, b\\}$-re:",
    },
  },
  {
    type: "table",
    headers: ["", "szabály", "jelentése"],
    rows: [
      ["1.", "$\\#q_0t \\to \\#tq_1$", "az első betű a verembe"],
      ["2.", "$zq_1t \\to ztq_1$", "további betűk a verembe"],
      ["3.", "$zq_1c \\to zq_2$", "megjött a $c$"],
      ["4.", "$tq_2t \\to q_2$", "összevetés a veremmel"],
      ["5.", "$\\#q_2 \\to \\#q_3$", "minden betűnek megvolt a párja"],
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Az $abcba$ szó feldolgozása, minden lépésnél az alkalmazott szabály sorszámával:",
    },
  },
  {
    type: "table",
    headers: ["konfiguráció", "szabály"],
    rows: [
      ["$\\#q_0abcba$", ""],
      ["$\\#aq_1bcba$", "1."],
      ["$\\#abq_1cba$", "2."],
      ["$\\#abq_2ba$", "3."],
      ["$\\#aq_2a$", "4."],
      ["$\\#q_2$", "4."],
      ["$\\#q_3$", "5."],
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "A bemenet elfogyott, $q_3 \\in F$, tehát $abcba \\in L(A)$.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Üres veremmel felismert nyelv",
    },
    content: {
      hu: "$N(A) = \\{w \\in \\Sigma^* \\mid z_0q_0w \\Rightarrow_A^* p$, ahol $p \\in Q\\}$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Ha a verem üres, a működés blokkolódik, ezért a veremnek a bemenet teljes feldolgozása után, az utolsó átmenettel kell kiürülnie. Az elfogadó állapotok halmaza $N(A)$ szempontjából irreleváns.",
    },
  },
  {
    type: "example",
    title: {
      hu: "$N(A) = \\{a^nb^n \\mid n \\geq 1\\}$",
    },
    content: {
      hu: "$A = \\langle \\{\\#, a\\}, \\{q_0, q_1\\}, \\{a, b\\}, \\delta, \\#, q_0, \\{\\,\\} \\rangle$, a szabályok: $\\#q_0a \\to \\#aq_0$, $aq_0a \\to aaq_0$, $aq_0b \\to q_1$, $aq_1b \\to q_1$, $\\#q_1 \\to q_1$. Az $a$-knál pakolunk, a $b$-knél fogyasztunk, a végén a verem alját is levesszük.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Az $aabb$ szóra $\\#q_0aabb \\Rightarrow \\#aq_0abb \\Rightarrow \\#aaq_0bb \\Rightarrow \\#aq_1b \\Rightarrow \\#q_1 \\Rightarrow q_1$, tehát $aabb \\in N(A)$. Az $aabbb$ szóra viszont $\\#q_0aabbb \\Rightarrow^* \\#q_1b \\Rightarrow q_1b$: hiába lett üres a verem, még volt hátra az inputból, ezért $A$ elutasítja.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "Mindkét elfogadásnál fel kell olvasni a teljes bemenetet. Attól, hogy út közben elfogadó állapotba értünk, még nem fogadtuk el a szót. A bemenet elfogyása után viszont még jöhetnek $\\varepsilon$-átmenetek, ezek számítanak.",
    },
  },
  {
    type: "theorem",
    kind: "lemma",
    statement: {
      hu: "Bármely $A$ veremautomatához meg tudunk adni egy $A'$ veremautomatát úgy, hogy $N(A') = L(A)$.",
    },
    proof: {
      hu: "Legyen $z_0' \\notin Z$, $q_0', q_h' \\notin Q$, és $A' = \\langle Z \\cup \\{z_0'\\}, Q \\cup \\{q_0', q_h'\\}, \\Sigma, \\delta', z_0', q_0', \\{\\,\\} \\rangle$. Az első lépés $z_0'q_0' \\to z_0'z_0q_0$, ezután $A'$ szimulálja $A$-t. Minden $z \\in Z \\cup \\{z_0'\\}$ és $q \\in F \\cup \\{q_h'\\}$ esetén felvesszük a $zq \\to q_h'$ szabályt, ezzel egy végállapotból kiürítjük a vermet. A $z_0'$ azért kell, hogy $A'$ ne fogadja el azokat a szavakat, amelyek kiürítik $A$ vermét anélkül, hogy $F$-beli állapotba jutnának: $z_0'$ csak $q_h'$-ba lépő szabállyal törölhető a veremből.",
    },
  },
  {
    type: "theorem",
    kind: "lemma",
    statement: {
      hu: "Bármely $A$ veremautomatához meg tudunk adni egy $A'$ veremautomatát úgy, hogy $L(A') = N(A)$.",
    },
    proof: {
      hu: "Legyen $z_0' \\notin Z$, $q_0', q_f' \\notin Q$, és $A' = \\langle Z \\cup \\{z_0'\\}, Q \\cup \\{q_0', q_f'\\}, \\Sigma, \\delta', z_0', q_0', \\{q_f'\\} \\rangle$. Az első lépés most is $z_0'q_0' \\to z_0'z_0q_0$, ezután $A'$ szimulálja $A$-t. Minden $q \\in Q$-ra felvesszük a $z_0'q \\to z_0'q_f'$ szabályt. A $z_0'$ pontosan akkor kerül a verem tetejére, amikor $A$ kiürítette a saját vermét, ekkor $A'$ elfogadó állapotba lép. Mivel $q_f'$-ből nincs átmenet, $L(A') = N(A)$.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Kapcsolat a CF grammatikákkal",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Grammatikából veremautomata",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    statement: {
      hu: "Bármely $G$ környezetfüggetlen grammatikához megkonstruálható egy olyan $A$ veremautomata, amelyre $L(A) = L(G)$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Legyen $G = \\langle N, \\Sigma, P, S \\rangle$ Chomsky-normálformájú. Ha $\\varepsilon \\in L(G)$, akkor $S \\to \\varepsilon \\in P$, és ekkor $S$ nem szerepel szabály jobboldalán. Legyen $A = \\langle N \\cup \\{z_0\\}, Q, \\Sigma, \\delta, z_0, q_0, \\{q_h\\} \\rangle$, ahol $Q = \\{q_X \\mid X \\in N\\} \\cup \\{q_0, q_h\\}$. A szabályok:",
    },
  },
  {
    type: "list",
    ordered: true,
    items: [
      { hu: "$z_0q_0 \\to z_0q_S \\in M_\\delta$ pontosan akkor, ha $S \\to \\varepsilon \\in P$," },
      { hu: "$z_0q_0a \\to z_0q_X \\in M_\\delta$ pontosan akkor, ha $X \\to a \\in P$," },
      { hu: "$Zq_Ya \\to ZYq_X \\in M_\\delta$ minden $Z \\in N \\cup \\{z_0\\}$, $Y \\in N$ és $X \\to a \\in P$ esetén," },
      { hu: "$Zq_Y \\to q_X \\in M_\\delta$ pontosan akkor, ha $X \\to ZY \\in P$," },
      { hu: "$z_0q_S \\to q_h \\in M_\\delta$." },
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "$M_\\delta$ szabályai lényegében $G$ invertált szabályai: az automata alulról felfelé építi a levezetést. A $q_X$ állapot azt jelenti, hogy az utoljára feldolgozott rész $X$-ből vezethető le. A (2) és (3) szabály egy betűt cserél nemterminálisra, a (4) pedig egy $X \\to ZY$ szabályt alkalmaz visszafelé: a verem tetején álló $Z$ és az állapotban tárolt $Y$ helyére $X$ kerül.",
    },
  },
  {
    type: "example",
    title: {
      hu: "$abbab$",
    },
    content: {
      hu: "Legyen $G = \\langle \\{S, X, Y, Z, A, B\\}, \\{a, b\\}, \\{S \\to XY, X \\to AB, Y \\to ZB, Z \\to BA, A \\to a, B \\to b\\}, S \\rangle$. Az $abbab$ szó jobboldali levezetése, vagyis amikor mindig a legjobboldalibb nemterminálist írjuk át: $S \\Rightarrow XY \\Rightarrow XZB \\Rightarrow XZb \\Rightarrow XBAb \\Rightarrow XBab \\Rightarrow Xbab \\Rightarrow ABbab \\Rightarrow Abbab \\Rightarrow abbab$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Ennek felel meg, visszafelé, a redukció a veremautomatában: $z_0q_0abbab \\Rightarrow z_0q_Abbab \\Rightarrow z_0Aq_Bbab \\Rightarrow z_0q_Xbab \\Rightarrow z_0Xq_Bab \\Rightarrow z_0XBq_Ab \\Rightarrow z_0Xq_Zb \\Rightarrow z_0XZq_B \\Rightarrow z_0Xq_Y \\Rightarrow z_0q_S \\Rightarrow q_h$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Általában is teljesül, hogy $z_0q_0u \\Rightarrow_A^* z_0Wq_Xv \\iff WXv \\Rightarrow_G^* u$, ahol $W \\in N^*$, $X \\in N$, és $v$ az $u$ egy szuffixe. A $v = \\varepsilon$, $W = \\varepsilon$, $X = S$ esetből $z_0q_0u \\Rightarrow_A^* z_0q_S \\iff S \\Rightarrow_G^* u$ adódik, és az (5) szabállyal kapjuk, hogy $L(A) = L(G)$.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Veremautomatából grammatika",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    statement: {
      hu: "Minden $A$ veremautomatához megadható egy $G$ környezetfüggetlen grammatika úgy, hogy $L(G) = N(A)$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Legyen $A = \\langle Z, Q, \\Sigma, \\delta, z_0, q_0, \\{\\,\\} \\rangle$. A $G$ nemterminálisai $[q, x, p]$ alakú hármasok ($q, p \\in Q$, $x \\in Z$) és egy új $S$ szimbólum, vagyis $N = Q \\times Z \\times Q \\cup \\{S\\}$. Az ötlet: $[q, x, p]$ azokat az $u$ szavakat vezeti le, amelyekre $xqu \\Rightarrow_A^* p$, vagyis amelyeket $A$ úgy olvas el, hogy közben $q$-ból $p$-be jut, és a veremből éppen az $x$ fogy el. A szabályok:",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "$S \\to [q_0, z_0, p] \\in P$ minden $p \\in Q$ állapotra," },
      { hu: "ha $xqa \\to y_1 \\cdots y_mp_m \\in M_\\delta$, ahol $a \\in \\Sigma \\cup \\{\\varepsilon\\}$, akkor minden $p_0, p_1, \\dots, p_{m-1} \\in Q$ állapotsorozatra:" },
    ],
  },
  {
    type: "formula",
    latex: "[q, x, p_0] \\to a[p_m, y_m, p_{m-1}] \\cdots [p_1, y_1, p_0]",
  },
  {
    type: "paragraph",
    text: {
      hu: "Ha $m = 0$, azaz $xqa \\to p_0 \\in M_\\delta$, akkor $[q, x, p_0] \\to a \\in P$. A veremből először $y_m$ fogy el, ezért áll a jobboldalon elöl, utána $y_{m-1}$, és így tovább. A közbülső állapotokat a grammatika nem tudja előre, ezért minden lehetőségre felveszünk egy szabályt, a rosszakból pedig nem lesz terminális szó. A két tartalmazás az $[q, x, p] \\Rightarrow_G^* u \\iff xqu \\Rightarrow_A^* p$ állításból következik, amely a levezetés, illetve a redukció hossza szerinti indukcióval látható be.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Determinisztikus veremautomata",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A veremautomata alapértelmezetten nemdeterminisztikus: ahogy az NVDA-nál, egy konfigurációból több lépés is indulhat, és az elfogadáshoz elég egyetlen szerencsés út.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Determinisztikus veremautomata",
    },
    content: {
      hu: "$A$ determinisztikus, ha minden $(z, q, a) \\in Z \\times Q \\times \\Sigma$ esetén $|\\delta(z, q, a)| + |\\delta(z, q, \\varepsilon)| = 1$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Tehát minden $q \\in Q$ és $z \\in Z$ esetén vagy $\\delta(z, q, a)$ pontosan egy elemű minden $a \\in \\Sigma$-ra és $\\delta(z, q, \\varepsilon) = \\emptyset$, vagy $\\delta(z, q, \\varepsilon)$ pontosan egy elemű és $\\delta(z, q, a) = \\emptyset$ minden $a \\in \\Sigma$-ra.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Ha a feltételben $= 1$ helyett csak $\\leq 1$ teljesül, a veremautomata a felismert nyelv módosulása nélkül kiegészíthető determinisztikussá. Így tágabb értelemben ezeket is determinisztikusnak tekinthetjük. Ebben az értelemben a fenti $L_1$ automata determinisztikus.",
    },
  },
  {
    type: "example",
    title: {
      hu: "$L_2 = \\{ww^R \\mid w \\in \\{a, b\\}^+\\}$",
    },
    content: {
      hu: "Az automata ugyanaz, mint $L_1$-nél, csak nincs $c$, ami jelezné a szó közepét. Ezért a 3. szabály helyett $zq_1 \\to zq_2$ kell ($z \\in \\{a, b\\}$): az automata egy $\\varepsilon$-átmenettel megtippeli a közepet.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Ez az automata nemdeterminisztikus, mert $aq_1a$-ra a pakolás és a tipp is alkalmazható. Az $abba$ szóra a jó tipp: $\\#q_0abba \\Rightarrow \\#aq_1bba \\Rightarrow \\#abq_1ba \\Rightarrow \\#abq_2ba \\Rightarrow \\#aq_2a \\Rightarrow \\#q_2 \\Rightarrow \\#q_3$. A rossz tippek elakadnak: ha már az első betű után váltunk, akkor $\\#aq_2bba$-nál a verem tetején $a$ áll, a bemeneten pedig $b$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A véges automatáknál a nemdeterminizmus nem adott több erőt. Itt viszont ad: a részhalmaz-konstrukció azért működött, mert az „összes lehetséges helyzetet” egy véges állapotban el lehetett tárolni. A különböző működésekhez viszont különböző vermek tartoznak, ezeket pedig nem lehet egyetlen veremben nyilvántartani.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Jelölje $\\mathcal{L}_{\\text{detVA}}$ a determinisztikus veremautomaták által végállapottal, $\\mathcal{L}_{\\text{VA}}$ a veremautomaták által végállapottal, $\\mathcal{L}_{\\text{üVA}}$ pedig a veremautomaták által üres veremmel felismerhető nyelvek osztályát.",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    statement: {
      hu: "$\\mathcal{L}_3 \\subset \\mathcal{L}_{\\text{detVA}} \\subset \\mathcal{L}_{\\text{VA}} = \\mathcal{L}_{\\text{üVA}} = \\mathcal{L}_2$",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Az egyenlőségek a fenti lemmákból és tételekből következnek. A tételt nem bizonyítjuk, de $L_1$ nem reguláris, mégis felismerhető determinisztikus veremautomatával, $L_2$ pedig felismerhető veremautomatával, de bizonyítható, hogy determinisztikussal nem: olvasás közben nem derül ki, hol van a szó közepe. A $\\mathcal{L}_{\\text{detVA}}$ elemeit determinisztikus környezetfüggetlen nyelveknek nevezzük.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "A kétféle elfogadás egyenértékűsége csak a nemdeterminisztikus esetre igaz. Determinisztikusan az üres veremmel elfogadás gyengébb: ha $u$-ra kiürül a verem, ott a működés véget ér, ezért $u$ folytatása már nem lehet a nyelvben. Így például az $\\{a, aa\\}$ nyelv determinisztikusan üres veremmel nem ismerhető fel, pedig véges.",
    },
  },
  {
    type: "funfact",
    text: {
      hu: "A programozási nyelvek fordítói is veremautomatákra épülnek. A szintaxist úgy tervezik, hogy determinisztikus veremautomatával elemezhető legyen, mert így a program hosszában lineáris időben lehet ellenőrizni, míg az általános CF esetben a CYK ennél jóval lassabb.",
    },
  },
];
