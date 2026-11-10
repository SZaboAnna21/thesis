import type { ContentBlock } from "../../types/content";

export const theory: ContentBlock[] = [
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Számosság és eldönthetetlenség",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Ebben a fejezetben azt nézzük meg, hogy vajon vannak-e olyan problémák, amelyeket semmilyen Turing-gép nem képes megoldani. (Spoiler igen vannak hiszen a témakör is létezik hehe) Először a halmazok számosságával megmutatjuk, hogy ilyen nyelveknek létezniük kell. Ezután konkrét példákat is láthatunk, például a megállási problémát, amely az egyik legismertebb eldönthetetlen probléma.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Számosság",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A számosság azt mondja meg nekünk, hogy két halmazban „ugyanannyi” elem van-e. Véges halmazoknál ezt egyszerű megszámolni, viszont végtelen halmazoknál más módszer kell. Két halmazt akkor tekintünk azonos számosságúnak, ha elemeik közt létezik kölcsönösen egyértelmű megfeleltetés , azaz bijekció.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Számosság",
    },
    content: {
      hu: "Két halmaz azonos számosságú, ha van köztük bijekció:",
    },
    items: [
      { hu: "$|A| = |B|$, ha létezik bijekció $A$ és $B$ között," },
      { hu: "$|A| \\geq |B|$, ha létezik injekció $B$-ből $A$-ba," },
      { hu: "$|A| > |B|$, ha létezik injekció $B$-ből $A$-ba, de bijekció nem." },
    ],
  },
  {
    type: "theorem",
    kind: "tetel",
    name: {
      hu: "Cantor–Bernstein–Schröder",
    },
    statement: {
      hu: "Ha $|A| \\leq |B|$ és $|A| \\geq |B|$, akkor $|A| = |B|$. Vagyis elég két injekciót mutatni, oda és vissza.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Egy halmaz megszámlálhatóan végtelen, ha elemei sorba rendezhetők úgy, hogy minden elem előbb-utóbb sorra kerüljön. Másképpen: ugyanannyi elemű, mint a természetes számok halmaza. Meglepő módon ilyen halmaz például az egész számok vagy a racionális számok halmaza is.",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    name: {
      hu: "Cantor",
    },
    statement: {
      hu: "Minden $H$ halmazra $|\\mathcal{P}(H)| > |H|$.",
    },
    proof: {
      hu: "Indirekt tegyük fel, hogy van $f : \\mathcal{P}(H) \\to H$ bijekció. Legyen $A = \\{x \\in H \\mid x \\notin f^{-1}(x)\\}$. Ekkor $f(A) \\in A$ pontosan akkor, ha $f(A) \\notin A$, ami ellentmondás. Ez a Cantor-féle átlós módszer.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Következmény: végtelen sok különböző végtelen számosság van. Jelölés: $\\aleph_0 = |\\mathbb{N}|$, $c = |\\mathcal{P}(\\mathbb{N})| = |\\mathbb{R}|$ (kontinuum).",
    },
  },
  {
    type: "funfact",
    text: {
      hu: "Az átlós módszer lényege, hogy egy felsorolásból mindig előállítható egy olyan objektum, amely biztosan nincs benne a felsorolásban. Ezt az ötletet később nem felismerhető nyelvek konstruálására is felhasználjuk.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Túl sok a nyelv",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "A Turing-gépek leírhatók véges bináris szavakkal, ezért a Turing-gépek halmaza megszámlálható." },
      { hu: "A nyelvek halmaza viszont a szavak halmazának hatványhalmaza, ami Cantor tétele szerint nem megszámlálható." },
      { hu: "Minden Turing-gép egyetlen nyelvet ismer fel, így nem jut mindegyik nyelvre gép." },
    ],
  },
  {
    type: "theorem",
    kind: "tetel",
    statement: {
      hu: "Létezik nem Turing-felismerhető nyelv. Sőt, a nyelvek „többsége” ilyen.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "R és RE",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A felismerhető és az eldönthető nyelvek közti különbség első látásra kicsinek tűnik, valójában azonban ez az eldönthetetlenség egyik kulcsa.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Felismerhető és eldönthető nyelvek",
    },
    content: {
      hu: "Egy $L$ nyelv",
    },
    items: [
      { hu: "Turing-felismerhető ($L \\in RE$, rekurzívan felsorolható), ha van $M$ Turing-gép, amelyre $L(M) = L$ (minden helyes bemenetet elfogad). A nem $L$-beli szavakon $M$ akár végtelen ciklusba is eshet." },
      { hu: "eldönthető ($L \\in R$, rekurzív), ha van olyan $M$, amely minden bemeneten megáll, és $L(M) = L$. Vagyis helyesen eldönti az elfogadást vagy az elutasítást" },
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Nyilván $R \\subseteq RE$. A különbség a gyakorlatban: eldöntésnél mindig kapunk választ, felismerésnél csak az „igen” válasz biztos, a „nem”-re lehet, hogy örökké várunk.",
    },
  },
  {
    type: "table",
    headers: ["Nyelv", "Jelentés", "Hol van?"],
    rows: [
      ["$L_{\\text{átló}} = \\{w_i \\mid w_i \\notin L(M_i)\\}$", "azok a kódok, amelyeket a saját gépük nem fogad el", "$\\notin RE$"],
      ["$L_u = \\{\\langle M, w \\rangle \\mid w \\in L(M)\\}$", "univerzális nyelv: $M$ elfogadja-e $w$-t", "$RE \\setminus R$"],
      ["$L_h = \\{\\langle M, w \\rangle \\mid M \\text{ megáll } w\\text{-n}\\}$", "megállási probléma", "$RE \\setminus R$"],
      ["$\\overline{L_u}$, $\\overline{L_h}$", "a fentiek komplementere", "$\\notin RE$"],
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "$L_{\\text{átló}} \\notin RE$ az átlós módszerrel látható: a $T(i, j) = 1 \\iff w_j \\in L(M_i)$ táblázat $i$-edik sora az $i$-edik gép nyelve, az átló komplementere pedig pont $L_{\\text{átló}}$, ami minden sortól különbözik. $L_u \\in RE$, mert az univerzális Turing-gép szimulálni tudja $M$-et $w$-n.",
    },
  },
  {
    type: "heading",
    level: 3,
    text: {
      hu: "Komplementer",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "Ha $L \\in R$, akkor $\\overline{L} \\in R$ (megcseréljük $q_i$-t és $q_n$-t)." },
      { hu: "Ha $L \\in RE$ és $\\overline{L} \\in RE$, akkor $L \\in R$ (a két felismerőt felváltva futtatjuk, valamelyik biztosan elfogad)." },
      { hu: "Következmény: ha $L \\in RE \\setminus R$, akkor $\\overline{L} \\notin RE$. Így RE nem zárt a komplementerképzésre." },
    ],
  },
  {
    type: "warning",
    text: {
      hu: "Ha $A \\subseteq B$ és $A$ eldönthetetlen, abból nem következik, hogy $B$ is az! Például $L_u \\subseteq \\{0,1\\}^*$, de $\\{0,1\\}^*$ triviálisan eldönthető. Eldönthetetlenséget visszavezetéssel kell bizonyítani.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Visszavezetés",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A visszavezetés az eldönthetetlenségi bizonyítások egyik legfontosabb eszköze. Az alapötlet az, hogy egy már ismert problémát alakítunk át a vizsgált problémára úgy, hogy a válasz ne változzon meg. Ezzel a két problémát összekapcsoljuk: ha az egyiket meg tudnánk oldani, akkor a másikat is. Így egy ismerten nehéz vagy eldönthetetlen probléma segítségével újabb problémákról is megmutathatjuk, hogy nehezek vagy eldönthetetlenek.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Visszavezetés",
    },
    content: {
      hu: "$L_1$ visszavezethető $L_2 \\subseteq \\Delta^*$-ra ($L_1 \\leq L_2$), ha létezik egy kiszámítható $f$ függvény: $\\Sigma^* \\to \\Delta^*$, hogy minden $w$-re $w \\in L_1 \\iff f(w) \\in L_2$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Szemléletesen: $L_1 \\leq L_2$ reláció azt fejezi ki, hogy $L_2$ legalább olyan nehéz, mint $L_1$, hiszen egy $L_2$-t megoldó géppel $L_1$-et is meg tudnánk oldani.",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    statement: {
      hu: "Legyen $L_1 \\leq L_2$. Ha $L_2 \\in R$ ($RE$), akkor $L_1 \\in R$ ($RE$). Megfordítva: ha $L_1 \\notin R$ ($RE$), akkor $L_2 \\notin R$ ($RE$).",
    },
  },
  {
    type: "warning",
    text: {
      hu: "Az irány a legfontosabb! Ha $L$-ről azt akarjuk belátni, hogy eldönthetetlen, akkor egy ismert eldönthetetlen nyelvet kell $L$-re visszavezetni ($L_u \\leq L$), nem fordítva.",
    },
  },
  {
    type: "example",
    title: {
      hu: "$L_h \\notin R$",
    },
    content: {
      hu: "Megmutatjuk, hogy $L_u \\leq L_h$. Egy $\\langle M, w \\rangle$ párból készítsük el $M'$-t: futtatja $M$-et, ha $M$ elfogad, $M'$ is elfogad, ha $M$ elutasít, $M'$ végtelen ciklusba lép. Ekkor $M$ elfogadja $w$-t $\\iff$ $M'$ megáll $w$-n, tehát $f(\\langle M, w \\rangle) = \\langle M', w \\rangle$ jó visszavezetés.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Rice tétele",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A Rice-tétel azt mondja ki, hogy ha egy Turing-gép által felismert nyelvről szeretnénk valamilyen érdemi tulajdonságot eldönteni, akkor erre általában nincs algoritmus.",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    name: {
      hu: "Rice",
    },
    statement: {
      hu: "Ha $\\mathcal{P}$ nem triviális tulajdonság, akkor $L_{\\mathcal{P}} \\notin R$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Másképp fogalmazva: ha egy tulajdonság egyedül attól függ, hogy a gép milyen nyelvet ismer fel, és nem igaz minden nyelvre, de nem is hamis minden nyelvre, akkor általában eldönthetetlen megállapítani, hogy egy adott Turing-gép rendelkezik-e ezzel a tulajdonsággal.",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "az üres nyelvet ismeri-e fel ($\\mathcal{P} = \\{\\emptyset\\}$)," },
      { hu: "véges nyelvet ismer-e fel," },
      { hu: "környezetfüggetlen nyelvet ismer-e fel," },
      { hu: "elfogadja-e az üres szót." },
    ],
  },
  {
    type: "warning",
    text: {
      hu: "A Rice-tétel a felismert nyelv tulajdonságairól szól, nem magáról a Turing-gépről. Az olyan kérdések, mint hogy „a gépnek legalább 5 állapota van-e” vagy „100 lépésen belül megáll-e az üres szón”, a gép leírására vonatkoznak, ezért eldönthetők. A tétel csak olyan tulajdonságokra alkalmazható, amelyek kizárólag a felismert nyelvtől függenek.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Post megfelelkezési probléma (PMP)",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Dominókészlet és megoldás",
    },
    content: {
      hu: "Egy dominó két szóból áll, egy felsőből és egy alsóból. $D = \\left\\{\\frac{u_1}{v_1}, \\dots, \\frac{u_n}{v_n}\\right\\}$, ahol $u_i, v_i \\in \\Sigma^+$. A feladat az, hogy találjunk egy dominósorozatot (ismétlés megengedett), amelyre a felső részek egymás mögé írva ugyanazt a szót adják, mint az alsó részek: $u_{i_1} \\cdots u_{i_m} = v_{i_1} \\cdots v_{i_m}$.",
    },
  },
  {
    type: "example",
    title: {
      hu: "$D = \\left\\{\\frac{b}{ca}, \\frac{a}{ab}, \\frac{ca}{a}, \\frac{abc}{c}\\right\\}$",
    },
    content: {
      hu: "Egy megoldás: $\\frac{a}{ab}\\,\\frac{b}{ca}\\,\\frac{ca}{a}\\,\\frac{a}{ab}\\,\\frac{abc}{c}$. Felül: $a \\cdot b \\cdot ca \\cdot a \\cdot abc = abcaaabc$, alul: $ab \\cdot ca \\cdot a \\cdot ab \\cdot c = abcaaabc$.",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    statement: {
      hu: "$L_{PMP} = \\{\\langle D \\rangle \\mid D\\text{-nek van megoldása}\\} \\in RE \\setminus R$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "PMP azért fontos, mert egy nagyon egyszerűen megfogalmazható, mégis eldönthetetlen probléma. Emiatt gyakran használják kiindulópontként más eldönthetetlenségi bizonyításokban és visszavezetésekben.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "További eldönthetetlen problémák",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "Környezetfüggetlen grammatikák: eldönthetetlen például, hogy egy grammatika egyértelmű-e, két grammatika nyelve metszi-e egymást, ugyanazt a nyelvet írják-e le, az egyik nyelv részhalmaza-e a másiknak, illetve hogy a grammatika az összes lehetséges szót előállítja-e." },
      { hu: "Elsőrendű logika: eldönthetetlen, hogy egy formula logikailag igaz, kielégíthető, kielégíthetetlen-e, két formula ekvivalens-e, illetve hogy $F \\models \\varphi$ teljesül-e. A kielégíthetetlenség viszont RE-beli." },
      { hu: "Nulladrendű logikában ugyanezek mind eldönthetők, hiszen az ítélettábla véges." },
    ],
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Összefoglaló: a Chomsky-hierarchia kiegészítve",
    },
  },
  {
    type: "table",
    headers: ["Osztály", "Grammatika", "Gép"],
    rows: [
      ["$\\mathcal{L}_3$", "3-as típusú (reguláris)", "véges automata, reguláris kifejezés"],
      ["$\\mathcal{L}_2$", "2-es típusú (környezetfüggetlen)", "veremautomata"],
      ["$\\mathcal{L}_1$", "1-es típusú (környezetfüggő)", "lineárisan korlátolt automata"],
      ["$R$", "–", "minden bemeneten megálló Turing-gép"],
      ["$RE = \\mathcal{L}_0$", "0-s típusú", "Turing-gép (determinisztikus vagy nemdeterminisztikus)"],
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "A tartalmazások valódiak: $\\mathcal{L}_3 \\subsetneq \\mathcal{L}_2 \\subsetneq \\mathcal{L}_1 \\subsetneq R \\subsetneq RE$.",
    },
  },
];
