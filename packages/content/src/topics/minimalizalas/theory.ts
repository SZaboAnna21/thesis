import type { ContentBlock } from "../../types/content";

export const theory: ContentBlock[] = [
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Maradéknyelvek",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Egy nyelvhez sokféle különböző automata adható, és sokszor nem lesz mindegy, mekkora. Az $A$ és $A'$ automaták ekvivalensek, ha $L(A) = L(A')$. A kérdésünk: mennyi az a legkevesebb állapot, amivel egy nyelv felismerhető, és ezt, hogy kapjuk meg ?",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Egy szóra vonatkozó maradéknyelv",
    },
    content: {
      hu: "Az $L \\subseteq \\Sigma^*$ nyelv $p \\in \\Sigma^*$ szóra vonatkozó maradéknyelve $L_p := \\{ v \\in \\Sigma^* \\mid pv \\in L \\}$, vagyis azok a $v$ szavak, amelyekkel $p$-t jobbról kiegészítve $L$-beli szót kapunk.",
    },
  },
  {
    type: "example",
    content: {
      hu: "Ha $L = \\{ab, aac, bc, aabc\\}$, akkor $L_{aa} = \\{c, bc\\}$, $L_b = \\{c\\}$, $L_{ab} = \\{\\varepsilon\\}$ és $L_{bb} = \\emptyset$.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Egy állapotra vonatkozó maradéknyelv",
    },
    content: {
      hu: "Legyen $A = \\langle Q, \\Sigma, \\delta, q_0, F \\rangle$ DVA. Az $A$ automata $q \\in Q$ állapotra vonatkozó maradéknyelve $L(A, q) := \\{ v \\in \\Sigma^* \\mid \\hat{\\delta}(q, v) \\in F \\}$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "$L(A, q)$ tehát az a nyelv, amit az automata akkor fogadna el, ha a kezdőállapota $q$ lenne. Tulajdonságai: $L(A, q)_w = L(A, \\hat{\\delta}(q, w))$, $L(A, q_0) = L(A)$, és $\\varepsilon \\in L(A, q) \\iff q \\in F$.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Myhill–Nerode tétel",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    name: {
      hu: "Myhill–Nerode tétel",
    },
    statement: {
      hu: "$L \\in \\mathcal{L}_3 \\iff |\\{ L_p \\}_{p \\in \\Sigma^*}| < \\infty$, azaz egy nyelv pontosan akkor reguláris, ha csak véges sok különböző maradéknyelve van.",
    },
    proof: {
      hu: "$(\\Leftarrow)$: Az állapotok legyenek maga a maradéknyelvek: $A_{LMN} := \\langle \\{L_p\\}_{p \\in \\Sigma^*}, \\Sigma, \\delta, L_\\varepsilon, F \\rangle$, ahol $\\delta(L_p, t) := L_{pt}$ és $F := \\{ L_p \\mid \\varepsilon \\in L_p \\}$. A $\\delta$ jól definiált, mert $L_p = L_q$ esetén $L_{pt} = (L_p)_t = (L_q)_t = L_{qt}$. A szó hosszára vonatkozó indukcióval $\\hat{\\delta}(L_\\varepsilon, u) = L_u$, így $u \\in L(A_{LMN}) \\iff L_u \\in F \\iff \\varepsilon \\in L_u \\iff u \\in L$. $(\\Rightarrow)$: Ha $A$ egy $L$-et felismerő DVA, akkor tetszőleges $u$-ra $L_u = L(A, q_0)_u = L(A, \\hat{\\delta}(q_0, u))$, tehát $\\{L_u\\}_{u \\in \\Sigma^*} \\subseteq \\{ L(A, q) \\}_{q \\in Q}$, ami legfeljebb $|Q|$ elemű.",
    },
  },
  {
    type: "example",
    title: {
      hu: "nem reguláris nyelv",
    },
    content: {
      hu: "$L = \\{a^nb^n \\mid n \\in \\mathbb{N}\\}$. Ekkor $L_{a^k} = \\{a^{n-k}b^n \\mid n \\geq k\\}$, és $b^i \\in L_{a^k} \\iff i = k$. Az $L_{a^0}, L_{a^1}, L_{a^2}, \\dots$ maradéknyelvek tehát páronként különbözők, végtelen sok van belőlük, így $L \\notin \\mathcal{L}_3$.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "A minimális automata",
    },
  },
  {
    type: "definition",
    term: {
      hu: "minimális automata",
    },
    content: {
      hu: "Az $A$ DVA minimális (állapotszámú), ha nincs olyan $A$-val ekvivalens DVA, amelynek kevesebb állapota van. Egy $L$ nyelv minimális automatája egy $L$-et felismerő minimális DVA.",
    },
  },
  {
    type: "theorem",
    kind: "kovetkezmeny",
    statement: {
      hu: "Az $A_{LMN}$ állapotszáma legfeljebb akkora, mint bármely $L$-et felismerő DVA állapotszáma, vagyis $A_{LMN}$ az $L$ minimális automatája.",
    },
    proof: {
      hu: "A tétel bizonyításában láttuk, hogy $\\{L_u\\}_{u \\in \\Sigma^*} \\subseteq \\{ L(A, q) \\}_{q \\in Q}$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A maradéknyelveket ritkán tudjuk közvetlenül kiszámolni, ezért a gyakorlatban egy meglévő DVA-ból indulunk ki, és két lépésben faragjuk le: előbb elhagyjuk az elérhetetlen állapotokat, aztán összevonjuk azokat, amelyek ugyanúgy viselkednek.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Összefüggővé alakítás",
    },
  },
  {
    type: "definition",
    term: {
      hu: "elérhető állapot, összefüggő automata",
    },
    content: {
      hu: "A $q$ állapot elérhető, ha van olyan $x \\in \\Sigma^*$, hogy $q_0x \\Rightarrow^* q$. Az automata összefüggő, ha minden állapota elérhető.",
    },
  },
  {
    type: "formula",
    latex: "H_0 := \\{q_0\\}, \\qquad H_{i+1} := H_i \\cup \\{ \\delta(q, a) \\mid q \\in H_i,\\ a \\in \\Sigma \\}",
  },
  {
    type: "paragraph",
    text: {
      hu: "Mivel $H_0 \\subseteq H_1 \\subseteq \\dots \\subseteq Q$, van olyan $k$, hogy $H_k = H_{k+1}$, és innentől a sorozat már nem változik. $H := H_k$ éppen az elérhető állapotok halmaza. A $Q \\setminus H$ állapotokat az átmeneteikkel együtt elhagyva az $A' = \\langle H, \\Sigma, \\delta|_H, q_0, F \\cap H \\rangle$ automata összefüggő és $A$-val ekvivalens.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Ekvivalens állapotok összevonása",
    },
  },
  {
    type: "definition",
    term: {
      hu: "megkülönböztethetetlen állapotok",
    },
    content: {
      hu: "A $q, q' \\in Q$ állapotok megkülönböztethetetlenek ($q \\sim q'$), ha $L(A, q) = L(A, q')$, azaz minden $u \\in \\Sigma^*$-ra $\\hat{\\delta}(q, u) \\in F \\iff \\hat{\\delta}(q', u) \\in F$. Az automata redukált, ha nincs két különböző, megkülönböztethetetlen állapota.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A $\\sim$ ekvivalenciareláció, és jobb-kongruencia: ha $q \\sim q'$, akkor minden $t \\in \\Sigma$-ra $\\delta(q, t) \\sim \\delta(q', t)$. Ezért az osztályait össze lehet vonni egy-egy állapottá.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Hogy melyik reprezentánst választjuk, az a jobb-kongruencia miatt mindegy. Egy osztályban vagy minden állapot elfogadó, vagy egyik sem, hiszen az $\\varepsilon$ szó már megkülönböztetné őket.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "A $\\sim_i$ relációk",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A $\\sim$ definíciója végtelen sok szót néz, ezt így nem lehet kiszámolni. Ezért a szavak hosszát korlátozzuk. Jelölje $\\Sigma^{\\leq i}$ a legfeljebb $i$ hosszú szavak halmazát.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "$i$-megkülönböztethetetlenség",
    },
    content: {
      hu: "$q \\sim_i q'$ ($q$ és $q'$ $i$-ekvivalens), ha minden $u \\in \\Sigma^{\\leq i}$-ra $\\hat{\\delta}(q, u) \\in F \\iff \\hat{\\delta}(q', u) \\in F$.",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "$q \\sim_0 q' \\iff (q \\in F \\Leftrightarrow q' \\in F)$, tehát $\\sim_0$ két osztálya $F$ és $Q \\setminus F$." },
      { hu: "$q \\sim_{i+1} q' \\iff q \\sim_i q'$ és minden $t \\in \\Sigma$-ra $\\delta(q, t) \\sim_i \\delta(q', t)$." },
      { hu: "Minden $\\sim_{i+1}$ a $\\sim_i$ finomítása: az osztályok legfeljebb kettéválnak, de sosem olvadnak össze." },
      { hu: "Ha egyszer $\\sim_i = \\sim_{i+1}$, akkor onnantól minden reláció ugyanez, és ez éppen $\\sim$. Ez legkésőbb $i = |Q| - 1$-nél bekövetkezik." },
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Az algoritmus tehát: felírjuk $\\sim_0$ osztályait, majd minden állapotnál megnézzük, hogy az egyes betűk hatására melyik osztályba lép. Egy osztályon belül azok az állapotok maradnak együtt, amelyeknek ez a sorvektora megegyezik. Ezt addig ismételjük, amíg egy kör után már semmi sem válik szét.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "Az új osztályba sorolásnál a cél-állapotok osztályát hasonlítjuk össze, nem magát a cél-állapotot! Ha $\\delta(q, a) = 4$ és $\\delta(q', a) = 5$, de $4 \\sim_i 5$, akkor az $a$ betű még nem választja szét $q$-t és $q'$-t.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Példa",
    },
  },
  {
    type: "example",
    content: {
      hu: "Legyen $\\Sigma = \\{a, b\\}$, $F = \\{q_2, q_5\\}$, a kezdőállapot $q_0$, az átmenetfüggvény az alábbi táblázat. Készítsük el a minimális automatát!",
    },
  },
  {
    type: "table",
    headers: ["", "$a$", "$b$"],
    rows: [
      ["→ $q_0$", "$q_1$", "$q_3$"],
      ["$q_1$", "$q_4$", "$q_2$"],
      ["← $q_2$", "$q_4$", "$q_3$"],
      ["$q_3$", "$q_4$", "$q_0$"],
      ["$q_4$", "$q_1$", "$q_5$"],
      ["← $q_5$", "$q_1$", "$q_0$"],
      ["$q_6$", "$q_2$", "$q_6$"],
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Összefüggővé alakítás: $H_0 = \\{q_0\\}$, $H_1 = \\{q_0, q_1, q_3\\}$, $H_2 = \\{q_0, q_1, q_2, q_3, q_4\\}$, $H_3 = \\{q_0, \\dots, q_5\\} = H_4$. A $q_6$ állapotba semmi nem vezet, elhagyjuk.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "$\\sim_0$: $I = \\{q_0, q_1, q_3, q_4\\}$ és $II = \\{q_2, q_5\\}$. Minden állapothoz felírjuk, hogy $a$-ra és $b$-re melyik osztályba lép:",
    },
  },
  {
    type: "table",
    headers: ["$\\sim_0$ osztály", "állapot", "$a$", "$b$"],
    rows: [
      ["$I$", "$q_0$", "$I$", "$I$"],
      ["$I$", "$q_3$", "$I$", "$I$"],
      ["$I$", "$q_1$", "$I$", "$II$"],
      ["$I$", "$q_4$", "$I$", "$II$"],
      ["$II$", "$q_2$", "$I$", "$I$"],
      ["$II$", "$q_5$", "$I$", "$I$"],
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Az $I$ osztály kettéválik, így $\\sim_1$: $\\{q_0, q_3\\}$, $\\{q_1, q_4\\}$, $\\{q_2, q_5\\}$. Ugyanezt megcsinálva $\\sim_1$ osztályaival: $q_0$ és $q_3$ is $a$-ra $\\{q_1, q_4\\}$-be, $b$-re $\\{q_0, q_3\\}$-ba lép, $q_1$ és $q_4$ is $a$-ra $\\{q_1, q_4\\}$-be, $b$-re $\\{q_2, q_5\\}$-be, $q_2$ és $q_5$ pedig $a$-ra $\\{q_1, q_4\\}$-be, $b$-re $\\{q_0, q_3\\}$-ba. Semmi nem válik szét, tehát $\\sim_2 = \\sim_1 = \\sim$.",
    },
  },
  {
    type: "table",
    headers: ["", "$a$", "$b$"],
    rows: [
      ["→ $\\{q_0, q_3\\}$", "$\\{q_1, q_4\\}$", "$\\{q_0, q_3\\}$"],
      ["$\\{q_1, q_4\\}$", "$\\{q_1, q_4\\}$", "$\\{q_2, q_5\\}$"],
      ["← $\\{q_2, q_5\\}$", "$\\{q_1, q_4\\}$", "$\\{q_0, q_3\\}$"],
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "A minimális automata három állapotú, és az $ab$-re végződő szavakat ismeri fel. A három állapot a három maradéknyelv: „az utolsó betű $a$”, „az utolsó két betű $ab$”, és „egyik sem” (ide tartozik az üres szó is).",
    },
  },
  {
    type: "warning",
    text: {
      hu: "A sorrend számít: előbb összefüggővé alakítunk, és csak utána redukálunk. Egy elérhetetlen állapot nem olvad bele szükségképpen semmibe, így ha bent marad, az eredmény redukált lesz, de nem minimális. Az algoritmus teljes DVA-t vár: ha valahonnan hiányzik egy átmenet, előbb vegyünk fel egy csapdaállapotot.",
    },
  },
  {
    type: "funfact",
    text: {
      hu: "A $\\sim_i$ finomítás $|Q|^2 \\cdot |\\Sigma|$ nagyságrendű lépést igényel. Hopcroft 1971-es algoritmusa ügyesebben választja meg, melyik osztály mentén finomít, és $O(|\\Sigma| \\cdot |Q| \\log |Q|)$ időben végez.",
    },
  },
];
