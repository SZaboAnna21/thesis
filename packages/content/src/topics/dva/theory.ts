import type { ContentBlock } from "../../types/content";

export const theory: ContentBlock[] = [
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Determinisztikus véges automata",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Formális nyelvek nemcsak generatív eszközökkel (grammatikákkal), hanem felismerő eszközökkel is megadhatók. Ilyenek az automaták: bemenetük egy szó, amelyet feldolgozás után vagy elfogadnak, vagy elutasítanak. A grammatikák szintetizáló, az automaták analitikus megközelítést alkalmaznak.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "determinisztikus véges automata",
    },
    content: {
      hu: "Egy determinisztikus véges automata (DVA) egy $A = \\langle Q, \\Sigma, \\delta, q_0, F \\rangle$ rendezett ötös, ahol",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "$Q$ az állapotok egy véges, nemüres halmaza," },
      { hu: "$\\Sigma$ az inputszimbólumok ábécéje," },
      { hu: "$\\delta : Q \\times \\Sigma \\to Q$ az állapot-átmenet függvény, amelynek értelmezési tartománya a teljes $Q \\times \\Sigma$," },
      { hu: "$q_0 \\in Q$ a kezdőállapot," },
      { hu: "$F \\subseteq Q$ az elfogadó állapotok halmaza." },
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Tehát minden $(q, a) \\in Q \\times \\Sigma$ párra pontosan egy olyan $s$ állapot létezik, amelyre $\\delta(q, a) = s$. Az elfogadó állapotokat végállapotnak is nevezik.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Működés, konfiguráció",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Az automata a kezdőállapotából indul, az olvasófej a bemeneti szó első betűjén áll. Minden lépésben elolvas egy betűt, az olvasófejet egy pozícióval jobbra mozgatja, és az átmenetfüggvény szerint állapotot vált. Ha a teljes bemenetet elolvasta, megáll, és az aktuális állapota alapján elfogadja vagy elutasítja a szót. Ha közben elfogadó állapotba ér, még nem dönt, hanem tovább működik.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "konfiguráció",
    },
    content: {
      hu: "Egy $u \\in Q\\Sigma^*$ szót az automata konfigurációjának nevezünk: az első betűje az aktuális állapot, a többi a bemenet még olvasatlan része.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Az automata a $qaw$ konfigurációt egy lépésben a $pw$ konfigurációra redukálja (jelölés: $qaw \\Rightarrow_A pw$), ha $\\delta(q, a) = p$. A többlépéses redukció ($\\Rightarrow_A^*$) ennek reflexív, tranzitív lezártja.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Felismert nyelv",
    },
  },
  {
    type: "definition",
    term: {
      hu: "az átmenetfüggvény kiterjesztése",
    },
    content: {
      hu: "A $\\delta$ leképezés kiterjesztése az a $\\hat{\\delta} : Q \\times \\Sigma^* \\to Q$ leképezés, amelyre $\\hat{\\delta}(q, \\varepsilon) := q$ és $\\hat{\\delta}(q, xa) := \\delta(\\hat{\\delta}(q, x), a)$ minden $x \\in \\Sigma^*$, $a \\in \\Sigma$ esetén.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "$\\hat{\\delta}(q, u)$ tehát az az állapot, ahová az automata a $q$ állapotból indulva az $u$ szó feldolgozása után eljut. Az automata által elfogadott (felismert) nyelv:",
    },
  },
  {
    type: "formula",
    latex: "L(A) = \\{ u \\in \\Sigma^* \\mid \\hat{\\delta}(q_0, u) \\in F \\}",
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Állapotátmenet-gráf és -táblázat",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Az automata táblázattal is megadható: a $q$ állapot sorában és a $t$ betű oszlopában $\\delta(q, t)$ áll. A kezdőállapotot →, az elfogadó állapotokat ← jelöli, ha pedig a kezdőállapot egyben elfogadó is, ⇆. Átmenetdiagramon az állapotok a gráf csúcsai, és $q$-ból akkor megy $t$ címkéjű él $r$-be, ha $\\delta(q, t) = r$; az elfogadó állapotokat duplán karikázzuk.",
    },
  },
  {
    type: "example",
    title: {
      hu: "paritás",
    },
    content: {
      hu: "Legyen $Q = \\{q_0, q_1, q_2, q_3\\}$, $\\Sigma = \\{a, b\\}$, $F = \\{q_1, q_2\\}$, az átmenetfüggvény pedig az alábbi táblázat. Az állapotok jelentése: $q_0$: eddig páros sok $a$ és páros sok $b$ volt; $q_1$: páros sok $a$, páratlan sok $b$; $q_2$: páratlan sok $a$, páros sok $b$; $q_3$: páratlan sok $a$ és páratlan sok $b$. Az automata tehát pontosan azokat a szavakat fogadja el, amelyekben az $a$ és a $b$ betűk paritása különbözik.",
    },
  },
  {
    type: "table",
    headers: ["", "$a$", "$b$"],
    rows: [
      ["→ $q_0$", "$q_2$", "$q_1$"],
      ["← $q_1$", "$q_3$", "$q_0$"],
      ["← $q_2$", "$q_0$", "$q_3$"],
      ["$q_3$", "$q_1$", "$q_2$"],
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Például $q_0aab \\Rightarrow q_2ab \\Rightarrow q_0b \\Rightarrow q_1$, és mivel $q_1 \\in F$, ezért $aab \\in L(A)$.",
    },
  },
];
