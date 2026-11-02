import type { ContentBlock } from "../../types/content";

export const theory: ContentBlock[] = [
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Aktív és elérhető nemterminálisok",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Egy környezetfüggetlen grammatikában lehetnek „halott” nemterminálisok: olyanok, amelyekből sosem lesz terminális szó, vagy amelyekhez el sem lehet jutni $S$-ből. Ezek nyugodtan kidobhatók.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "aktív, elérhető, hasznos",
    },
    content: {
      hu: "$X$ aktív, ha van olyan $w \\in \\Sigma^*$, hogy $X \\Rightarrow^* w$. $Y$ elérhető, ha $S \\Rightarrow^* v_1Yv_2$ valamely $v_1, v_2$-re. Egy nemterminális hasznos, ha aktív és elérhető. A grammatika redukált, ha minden nemterminálisa hasznos.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Mindkét halmazt rétegenként építjük, amíg már nem változik:",
    },
  },
  {
    type: "table",
    headers: ["", "Kezdet", "Bővítés"],
    rows: [
      ["Aktívak", "$A_1$: akinek van csupa terminális jobb oldalú szabálya", "$X$ bekerül, ha van $X \\to w$, ahol $w$ csak terminálisokból és már aktívakból áll"],
      ["Elérhetők", "$R_1 = \\{S\\}$", "$Y$ bekerül, ha egy már elérhető $X$ valamelyik szabályának jobb oldalán szerepel"],
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Redukálás: előbb kidobjuk az inaktív nemterminálisokat az őket tartalmazó összes szabállyal együtt, aztán a maradékban kidobjuk az elérhetetleneket és az ő szabályaikat is.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "A sorrend számít: először az inaktívak, utána az elérhetetlenek! Ha egy inaktív nemterminálist tartalmazó szabályt törlünk, attól más nemterminálisok elérhetetlenné válhatnak (lent a példában a $C$ is így jár).",
    },
  },
  {
    type: "example",
    content: {
      hu: "$S \\to A \\mid bBD$, $A \\to AB \\mid AC$, $B \\to \\varepsilon \\mid a \\mid SS$, $C \\to AS \\mid aba$, $D \\to BB$. Aktívak: $A_1 = \\{B, C\\}$, $A_2 = \\{B, C, D\\}$, $A_3 = A_4 = \\{B, C, D, S\\}$. Az $A$ inaktív, az őt tartalmazó szabályokat töröljük: $S \\to bBD$, $B \\to \\varepsilon \\mid a \\mid SS$, $C \\to aba$, $D \\to BB$. Elérhetők: $R_1 = \\{S\\}$, $R_2 = R_3 = \\{S, B, D\\}$, a $C$ elérhetetlen. Az eredmény: $S \\to bBD$, $B \\to \\varepsilon \\mid a \\mid SS$, $D \\to BB$.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Chomsky-normálforma",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Chomsky-normálforma",
    },
    content: {
      hu: "A $G$ grammatika Chomsky-normálformájú, ha minden szabálya $A \\to BC$ ($A, B, C \\in N$) vagy $A \\to a$ ($a \\in \\Sigma$) alakú. Ezen kívül lehet egy $S \\to \\varepsilon$ szabály is, de ekkor $S$ nem szerepelhet szabály jobb oldalán.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Tehát a jobb oldalon vagy pontosan két nemterminális áll, vagy pontosan egy terminális. Minden környezetfüggetlen grammatikához van vele ekvivalens Chomsky-normálformájú, és ezt négy lépésben állítjuk elő. Erre lesz szükség a CYK-algoritmushoz is.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "A normálformára hozás lépései",
    },
  },
  {
    type: "list",
    ordered: true,
    items: [
      { hu: "Álterminálisok: a terminálisok kiszedése a hosszú jobb oldalakból." },
      { hu: "Hosszredukció: a 3 vagy több hosszú jobb oldalak feldarabolása." },
      { hu: "$\\varepsilon$-mentesítés: az $X \\to \\varepsilon$ szabályok eltüntetése." },
      { hu: "Láncmentesítés: az $X \\to Y$ szabályok eltüntetése." },
    ],
  },
  {
    type: "warning",
    text: {
      hu: "Ebben a sorrendben! Az $\\varepsilon$-mentesítés új láncszabályokat gyárt (pl. $A \\to BC$-ből $A \\to C$ lesz), ezért a láncmentesítésnek a végére kell kerülnie. A hosszredukció pedig azért jön előbb, hogy az $\\varepsilon$-mentesítésnél már csak kéttagú jobb oldalakkal kelljen foglalkozni.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "1. Álterminálisok bevezetése",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Minden $a$ terminálishoz felveszünk egy új $\\bar{a}$ nemterminálist és egy $\\bar{a} \\to a$ szabályt, a jobb oldalakon pedig $a$ helyére $\\bar{a}$-t írunk. Így a jobb oldalak csupa nemterminálisból állnak.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "Az $A \\to a$ alakú szabályokat nem kell átírni, azok már jók. Csak ott cseréljük a terminálist, ahol a jobb oldal hossza legalább 2.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "2. Hosszredukció",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Minden $X \\to Y_1Y_2 \\cdots Y_k$ ($k \\geq 3$) szabályt láncszerűen feldarabolunk új $Z_1, \\dots, Z_{k-2}$ nemterminálisokkal:",
    },
  },
  {
    type: "formula",
    latex: "X \\to Y_1Z_1,\\quad Z_1 \\to Y_2Z_2,\\quad \\dots,\\quad Z_{k-2} \\to Y_{k-1}Y_k",
  },
  {
    type: "paragraph",
    text: {
      hu: "Pl. $C \\to CDEF$ helyett $C \\to CZ_3$, $Z_3 \\to DZ_4$, $Z_4 \\to EF$. Minden szabályhoz saját, új $Z$-k kellenek.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "3. $\\varepsilon$-mentesítés",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Először kiszámoljuk, mely nemterminálisokból vezethető le $\\varepsilon$:",
    },
  },
  {
    type: "formula",
    latex: "U_1 := \\{ X \\mid X \\to \\varepsilon \\in P \\}, \\qquad U_{i+1} := U_i \\cup \\{ X \\mid X \\to u \\in P,\\ u \\in U_i^* \\}",
  },
  {
    type: "paragraph",
    text: {
      hu: "Vagyis $X$ bekerül, ha van olyan szabálya, aminek a jobb oldalán csupa $U_i$-beli nemterminális áll. A stabilizálódott halmaz $U$. Ezután töröljük az összes $X \\to \\varepsilon$ szabályt, és minden $A \\to BC$ szabály mellé felvesszük:",
    },
  },
  {
    type: "table",
    headers: ["Ha", "Új szabály"],
    rows: [
      ["$B \\in U$", "$A \\to C$ (a $B$ eltűnhet)"],
      ["$C \\in U$", "$A \\to B$ (a $C$ eltűnhet)"],
      ["$B, C \\in U$", "mindkettő: $A \\to B$ és $A \\to C$"],
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Ha $S \\notin U$, kész is vagyunk. Ha $S \\in U$, akkor $\\varepsilon \\in L(G)$, és ezt meg kell őrizni: felveszünk egy új $S'$ kezdőszimbólumot az $S' \\to S \\mid \\varepsilon$ szabályokkal. Ha $S$ nem szerepel egyik jobb oldalon sem, akkor nem kell új kezdőszimbólum, elég az $S \\to \\varepsilon$ szabályt visszavenni.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "$A \\to \\varepsilon$ semmilyen formában nem maradhat, kivéve $S \\to \\varepsilon$-t (vagy $S' \\to \\varepsilon$-t). Ha $S$ jobb oldalon is áll, és ennek ellenére $S \\to \\varepsilon$-t hagyunk, megsértjük a normálformát.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "4. Láncmentesítés",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Minden $A$-ra kiszámoljuk $H(A)$-t: azokat a nemterminálisokat, ahová $A$-ból csak láncszabályokkal ($X \\to Y$) eljutunk, $A$-t is beleértve.",
    },
  },
  {
    type: "formula",
    latex: "H_0(A) := \\{A\\}, \\qquad H_{i+1}(A) := H_i(A) \\cup \\{ B \\mid C \\to B \\in P,\\ C \\in H_i(A) \\}",
  },
  {
    type: "paragraph",
    text: {
      hu: "Ezután minden $A$ megkapja az összes $H(A)$-beli nemterminális nem-lánc szabályát, a láncszabályokat pedig töröljük. Röviden: ha $A \\Rightarrow^* B$ láncokkal és $B \\to w$ nem lánc, akkor $A \\to w$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A végén érdemes redukálni is, mert a láncmentesítés után gyakran maradnak elérhetetlen nemterminálisok.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Teljes példa",
    },
  },
  {
    type: "example",
    content: {
      hu: "$S \\to AB$, $A \\to aAa \\mid C$, $B \\to bBb \\mid C$, $C \\to Cabc \\mid b \\mid \\varepsilon$. Hozzuk Chomsky-normálformára!",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "1. lépés: $D \\to a$, $E \\to b$, $F \\to c$ álterminálisok. A $C \\to b$ marad, mert már jó alakú.",
    },
  },
  {
    type: "formula",
    latex: "\\begin{aligned} S &\\to AB & A &\\to DAD \\mid C & B &\\to EBE \\mid C \\\\ C &\\to CDEF \\mid b \\mid \\varepsilon & D &\\to a & E &\\to b \\qquad F \\to c \\end{aligned}",
  },
  {
    type: "paragraph",
    text: {
      hu: "2. lépés: $DAD$, $EBE$ és $CDEF$ túl hosszú.",
    },
  },
  {
    type: "formula",
    latex: "\\begin{aligned} A &\\to DZ_1 \\mid C & Z_1 &\\to AD \\\\ B &\\to EZ_2 \\mid C & Z_2 &\\to BE \\\\ C &\\to CZ_3 \\mid b \\mid \\varepsilon & Z_3 &\\to DZ_4 \\qquad Z_4 \\to EF \\end{aligned}",
  },
  {
    type: "paragraph",
    text: {
      hu: "3. lépés: $U_1 = \\{C\\}$, $U_2 = \\{C, A, B\\}$ (az $A \\to C$ és $B \\to C$ miatt), $U_3 = \\{C, A, B, S\\} = U_4$ (az $S \\to AB$ miatt). Az új szabályok: $S \\to AB$-ből $S \\to A \\mid B$, $Z_1 \\to AD$-ből $Z_1 \\to D$, $Z_2 \\to BE$-ből $Z_2 \\to E$, $C \\to CZ_3$-ból $C \\to Z_3$. Mivel $S \\in U$, de $S$ nincs jobb oldalon, elég $S \\to \\varepsilon$:",
    },
  },
  {
    type: "formula",
    latex: "\\begin{aligned} S &\\to AB \\mid A \\mid B \\mid \\varepsilon & Z_1 &\\to AD \\mid D \\\\ A &\\to DZ_1 \\mid C & Z_2 &\\to BE \\mid E \\\\ B &\\to EZ_2 \\mid C & Z_3 &\\to DZ_4 \\\\ C &\\to CZ_3 \\mid b \\mid Z_3 & Z_4 &\\to EF \\end{aligned}",
  },
  {
    type: "paragraph",
    text: {
      hu: "4. lépés: $H(S) = \\{S, A, B, C, Z_3\\}$, $H(A) = \\{A, C, Z_3\\}$, $H(B) = \\{B, C, Z_3\\}$, $H(C) = \\{C, Z_3\\}$, $H(Z_1) = \\{Z_1, D\\}$, $H(Z_2) = \\{Z_2, E\\}$, a többinél csak önmaga. Mindenki megkapja a $H$-jában lévők nem-lánc szabályait:",
    },
  },
  {
    type: "formula",
    latex: "\\begin{aligned} S &\\to AB \\mid DZ_1 \\mid EZ_2 \\mid CZ_3 \\mid DZ_4 \\mid b \\mid \\varepsilon \\\\ A &\\to DZ_1 \\mid CZ_3 \\mid DZ_4 \\mid b \\\\ B &\\to EZ_2 \\mid CZ_3 \\mid DZ_4 \\mid b \\\\ C &\\to CZ_3 \\mid DZ_4 \\mid b \\\\ Z_1 &\\to AD \\mid a \\qquad Z_2 \\to BE \\mid b \\qquad Z_3 \\to DZ_4 \\qquad Z_4 \\to EF \\\\ D &\\to a \\qquad E \\to b \\qquad F \\to c \\end{aligned}",
  },
  {
    type: "paragraph",
    text: {
      hu: "Minden szabály $X \\to YZ$ vagy $X \\to t$ alakú, az egyetlen $\\varepsilon$-szabály $S \\to \\varepsilon$, és $S$ nincs jobb oldalon. Kész.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "ZH-ban a lépéseket külön-külön le kell írni, és az $U_i$, $H(A)$ halmazokat is fel kell sorolni. Csak a végeredmény nem elég!",
    },
  },
];
