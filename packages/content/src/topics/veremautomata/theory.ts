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
      hu: "A véges automata memóriája az állapotaiban korlátozott, ezért nem képes például az $\\{a^nb^n \\mid n \\geq 1\\}$ nyelv felismerésére. Ha az automatát egy veremmel egészítjük ki, már képes tetszőlegesen sok információ tárolására. Az így kapott modellt veremautomatának nevezzük.",
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
      { hu: "$Z$ a veremábécé," },
      { hu: "$Q$ az állapotok véges halmaza," },
      { hu: "$\\Sigma$ az inputábécé," },
      { hu: "$\\delta : Z \\times Q \\times (\\Sigma \\cup \\{\\varepsilon\\}) \\to \\mathcal{P}_{\\text{véges}}(Z^* \\times Q)$ az átmeneti függvény," },
      { hu: "$z_0 \\in Z$ a kezdeti veremszimbólum," },
      { hu: "$q_0 \\in Q$ a kezdőállapot," },
      { hu: "$F \\subseteq Q$ a végállapotok halmaza." },
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Egy átmenet az aktuális állapot, a következő inputjel és a verem teteje alapján választódik ki. A lépés során a verem tetején lévő szimbólumot eltávolítjuk, majd helyette tetszőleges számú szimbólumot írhatunk vissza. Az $\\varepsilon$-átmenetek bemenet olvasása nélkül hajthatók végre.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Az átmeneteket szabályokkal írjuk fel, ezek halmaza $M_\\delta$:",
    },
  },
  {
    type: "formula",
    latex: "zqa \\to up \\in M_\\delta \\iff (u, p) \\in \\delta(z, q, a), \\qquad zq \\to up \\in M_\\delta \\iff (u, p) \\in \\delta(z, q, \\varepsilon)",
  },
  {
    type: "paragraph",
    text: {
      hu: "Átmenetdiagramon ez egy $q$-ból $p$-be mutató nyíl $a; z \\to u$ felirattal.",
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
      hu: "Egy $zqw$ alakú szó, ahol $z \\in Z^*$ a verem tartalma, $q$ az aktuális állapot, $w$ a még el nem olvasott input. A kezdőkonfiguráció $z_0q_0w$.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "A verem teteje jobbra van: a $q$ bal oldalán áll a verem teteje, a jobb oldalán a következő betű.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Egy lépés ($\\alpha \\Rightarrow_A \\beta$): ha $(u, p) \\in \\delta(z, q, a)$, akkor $rzqaw \\Rightarrow_A rupw$. A $\\Rightarrow_A^*$ ennek reflexív, tranzitív lezártja. A szabály jobb oldalával a veremműveletek, ha a verem tetején $z$ áll:",
    },
  },
  {
    type: "table",
    headers: ["szabály", "hatása"],
    rows: [
      ["$zqa \\to r$", "$z$ kivétele (POP)"],
      ["$zqa \\to zr$", "a verem változatlan"],
      ["$zqa \\to z'r$", "$z$ cseréje $z'$-re"],
      ["$zqa \\to zz'r$", "$z'$ a verem tetejére (PUSH)"],
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Ha egyik szabály sem illik, a működés elakad. Üres veremmel mindig elakad, ezért kezdünk egy $z_0$-lal a veremben.",
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
      hu: "Végállapottal felismert nyelv",
    },
    content: {
      hu: "$L(A) = \\{w \\in \\Sigma^* \\mid z_0q_0w \\Rightarrow_A^* up$, ahol $u \\in Z^*$, $p \\in F\\}$.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Üres veremmel felismert nyelv",
    },
    content: {
      hu: "$N(A) = \\{w \\in \\Sigma^* \\mid z_0q_0w \\Rightarrow_A^* p$, ahol $p \\in Q\\}$. A végállapotok ilyenkor nem számítanak.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "Mindkét esetben a teljes bemenetet el kell olvasni. Út közben egy végállapot vagy egy üres verem még nem elfogadás, a bemenet vége után viszont még jöhetnek $\\varepsilon$-lépések.",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    statement: {
      hu: "A kétféle elfogadás ugyanazt a nyelvosztályt adja: minden $A$-hoz van $A'$, amelyre $N(A') = L(A)$, és fordítva.",
    },
  },
  {
    type: "example",
    title: {
      hu: "$L = \\{wcw^R \\mid w \\in \\{a, b\\}^+\\}$, végállapottal",
    },
    content: {
      hu: "A $c$-ig pakoljuk a betűket, utána a veremmel vetjük össze a bemenetet. $Z = \\{\\#, a, b\\}$, $z_0 = \\#$, $F = \\{q_3\\}$, a szabályok minden $z, t \\in \\{a, b\\}$-re:",
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
      hu: "Az $abcba$ szóra: $\\#q_0abcba \\Rightarrow \\#aq_1bcba \\Rightarrow \\#abq_1cba \\Rightarrow \\#abq_2ba \\Rightarrow \\#aq_2a \\Rightarrow \\#q_2 \\Rightarrow \\#q_3$, és $q_3 \\in F$.",
    },
  },
  {
    type: "example",
    title: {
      hu: "$N(A) = \\{a^nb^n \\mid n \\geq 1\\}$, üres veremmel",
    },
    content: {
      hu: "Szabályok: $\\#q_0a \\to \\#aq_0$, $aq_0a \\to aaq_0$, $aq_0b \\to q_1$, $aq_1b \\to q_1$, $\\#q_1 \\to q_1$. Az $a$-knál pakolunk, a $b$-knél fogyasztunk, a végén a $\\#$-t is levesszük. Az $aabb$ szóra $\\#q_0aabb \\Rightarrow \\#aq_0abb \\Rightarrow \\#aaq_0bb \\Rightarrow \\#aq_1b \\Rightarrow \\#q_1 \\Rightarrow q_1$, tehát elfogadja. Az $aabbb$ szóra $\\Rightarrow^* q_1b$: a verem kiürült, de maradt input, ezért elutasítja.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Hogyan építsünk veremautomatát?",
    },
  },
  {
    type: "list",
    ordered: true,
    items: [
      { hu: "Döntsd el, mit számol vagy mit jegyez meg a verem (pl. a még pár nélküli betűket)." },
      { hu: "Az állapotokkal a fázisokat különítsd el (pl. „még $a$-kat olvasunk” és „már $b$-ket”)." },
      { hu: "Minden (verem teteje, állapot, betű) hármasra írd fel, mi történjen, ami nem kell, arra ne legyen szabály." },
      { hu: "A végén $\\varepsilon$-lépéssel ürítsd a vermet vagy lépj végállapotba, amikor a $z_0$ kerül felülre." },
      { hu: "Ellenőrizd egy elfogadott és egy elutasított szóval." },
    ],
  },
  {
    type: "example",
    title: {
      hu: "$\\{u \\in \\{a, b\\}^* \\mid N_a(u) = N_b(u)\\}$, üres veremmel",
    },
    content: {
      hu: "A verem a pár nélküli betűket tárolja: ha a teteje ugyanaz a betű vagy $\\#$, pakolunk, ha a másik betű, levesszük. Minden $t \\in \\{a, b\\}$-re: $\\#qt \\to \\#tq$, $tqt \\to ttq$, $aqb \\to q$, $bqa \\to q$, és a végén $\\#q \\to q$. Ha egy betűhöz kettőt kell párosítani (pl. $N_a(u) = 2 \\cdot N_b(u)$), egy $b$-nél két $a$-t veszünk le, vagy két jelet pakolunk.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Kapcsolat a CF nyelvekkel",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    statement: {
      hu: "Minden CF grammatikához van vele ekvivalens veremautomata, és minden veremautomatához van CF grammatika. Tehát a veremautomaták pontosan a környezetfüggetlen nyelveket ismerik fel.",
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
    type: "definition",
    term: {
      hu: "Determinisztikus veremautomata",
    },
    content: {
      hu: "$A$ determinisztikus, ha minden $(z, q, a) \\in Z \\times Q \\times \\Sigma$ esetén $|\\delta(z, q, a)| + |\\delta(z, q, \\varepsilon)| = 1$. Tágabb értelemben az $\\leq 1$ is elég, mert ez kiegészíthető.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Vagyis minden helyzetben legfeljebb egy lépés lehetséges, és ha van $\\varepsilon$-lépés, akkor betűt olvasó nincs mellette. A fenti $wcw^R$ automata determinisztikus. A $\\{ww^R\\}$ nyelvhez viszont tippelni kell, hol a szó közepe ($zq_1 \\to zq_2$), ezért ott nemdeterminisztikus automata kell, és determinisztikus nem is létezik.",
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
    type: "warning",
    text: {
      hu: "A véges automatákkal ellentétben itt a nemdeterminizmus több erőt ad: a különböző futásokhoz különböző vermek tartoznak, ezeket nem lehet egyetlen veremben követni.",
    },
  },
];
