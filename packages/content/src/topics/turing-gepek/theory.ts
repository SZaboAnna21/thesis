import type { ContentBlock } from "../../types/content";

export const theory: ContentBlock[] = [
  {
    type: "heading",
    level: 1,
    text: { hu: "Turing-gépek" },
  },
  {
    type: "paragraph",
    text: {
      hu: "Az algoritmikus számítás pontos matematikai modelljét a 20. század elején több egymástól független formalizmus is megragadta. Gödel a rekurzív függvényeket, Church a $\\lambda$-kalkulust, Turing pedig az ún. Turing-gépet vezette be. Mindhárom modell azonos osztályt definiál, ami arra utal, hogy ez az osztály maga az 'algoritmikusan megoldható' problémák osztálya.",
    },
  },
  {
    type: "definition",
    term: { hu: "Church–Turing-tézis" },
    content: {
      hu: "Minden formalizálható probléma, ami megoldható algoritmussal, az megoldható Turing-géppel is.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "A Church–Turing-tézis nem tétel, nem bizonyítható formálisan egyszerűen nem adtunk precíz definíciót az 'algoritmus' fogalmára. Elfogadásának indoka, hogy minden ismert algoritmikus modell ekvivalens a Turing-géppel.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: { hu: "A Turing-gép definíciója" },
  },
  {
    type: "paragraph",
    text: {
      hu: "A Turing-gép (TG) egy vezérlőegységből és egy kétirányban végtelen szalagból áll, amelyen egy író-olvasó fej mozog. A gép determinisztikus: minden konfigurációnak egyértelmű rákövetkezője van.",
    },
  },
  {
    type: "definition",
    term: { hu: "Turing-gép" },
    content: {
      hu: "Az (egyszalagos determinisztikus) Turing-gép egy $M = \\langle Q, \\Sigma, \\Gamma, \\delta, q_0, q_i, q_n \\rangle$ rendezett hetes, ahol:",
    },
    items: [
      { hu: "$Q$ az állapotok véges, nemüres halmaza," },
      { hu: "$q_0, q_i, q_n \\in Q$; $q_0$ a kezdőállapot, $q_i$ az elfogadó, $q_n$ az elutasító állapot," },
      { hu: "$\\Sigma$ a bemeneti ábécé, $\\Gamma$ a szalagábécé, $\\Sigma \\subseteq \\Gamma$," },
      { hu: "$\\square \\in \\Gamma \\setminus \\Sigma$ az üres cella (blank) szimbóluma," },
      {
        hu: "$\\delta : (Q \\setminus \\{q_i, q_n\\}) \\times \\Gamma \\to Q \\times \\Gamma \\times \\{L, S, R\\}$ az átmenetfüggvény, ahol $L$ balra, $S$ helyben, $R$ jobbra mozgatja a fejet.",
      },
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Az átmenetdiagramban a $q \\xrightarrow{a/b,D} r$ él azt jelenti, hogy $\\delta(q,a) = (r,b,D)$: Vagyis ha a gép $q$ állapotban, an, és a fej éppen az $a$ betűt olvassa, akkor a következő lépésben $r$ állapotba vált, $b$-t ír a szalagra, és $D$ irányba mozgatja a fejet. Itt D lehet balra, jobbra vagy helyben maradás.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: { hu: "Konfigurációk és átmenetek" },
  },
  {
    type: "paragraph",
    text: {
      hu: "A Turing-gép működését konfigurációkkal írjuk le. Egy konfiguráció megmondja, hogy éppen mi van a szalagon, melyik állapotban van a gép, és hol áll az olvasó-író fej.",
    },
  },
  {
    type: "definition",
    term: { hu: "Konfiguráció" },
    content: {
      hu: "Az $M$ TG egy konfigurációja egy $uqv$ szó, ahol $q \\in Q$, $u, v \\in \\Gamma^*$, $v \\neq \\varepsilon$. Ez azt reprezentálja, hogy a szalag tartalma $uv$ (a fennmaradó cellák $\\square$-ok), a gép $q$ állapotban van, és a fej $v$ első betűjén áll.",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "Az $u$ bemenő szóhoz tartozó **kezdőkonfiguráció**: $q_0 u\\square$ (ha $u \\neq \\varepsilon$), ill. $q_0 \\square$ (ha $u = \\varepsilon$)." },
      { hu: "Elfogadó konfiguráció: $q = q_i$; **elutasító konfiguráció**: $q = q_n$. Együtt: **megállási konfiguráció**." },
      { hu: "Elutasító konfiguráció: $q = q_n$." },
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Az elfogadó és elutasító konfigurációkat együtt megállási konfigurációknak nevezzük, mert a gép ezekből már nem lép tovább.",
    },
  },
  {
    type: "definition",
    term: { hu: "Egylépéses konfigurációátmenet ($\\vdash$)" },
    content: {
      hu: "Tegyük fel, hogy a gép az $uqav$ konfigurációban van, és $\\delta(q, a) = (r, b, D)$. Ez azt jelenti, hogy a gép az $a$ szimbólum helyére $b$-t ír, $r$ állapotba lép, majd a fejet a $D$ irányba mozgatja. Ekkor az egylépéses átmenet a következőképpen alakul:",
    },
    items: [
      { hu: "Ha $D = R$: $uqav \\vdash ubrv'$, ahol $v' = v$, ha $v \\neq \\varepsilon$, különben $v' = \\square$." },
      { hu: "Ha $D = S$: $uqav \\vdash urbv$." },
      { hu: "Ha $D = L$: $uqav \\vdash u'rcbv$, ahol $u'c = u$ (ha $u \\neq \\varepsilon$), különben $u' = \\varepsilon$ és $c = \\square$." },
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "A három eset valójában ugyanazt az egy lépést írja le: a gép átírja az aktuális szimbólumot, állapotot vált, majd a fej a megfelelő irányba mozog.",
    },
  },
  {
    type: "definition",
    term: { hu: "Többlépéses konfigurációátmenet ($\\vdash^*$)" },
    content: {
      hu: "A $C \\vdash^* C'$ jelölés azt fejezi ki, hogy a gép nulla vagy több lépésben eljuthat $C$-ből $C'$-be. Formálisan $C \\vdash^* C'$, ha vagy $C = C'$, vagy létezik egy konfigurációsorozat $C = C_1 \\vdash C_2 \\vdash \\cdots \\vdash C_n = C'$, ahol minden konfiguráció az előzőből egyetlen lépésben keletkezik. Másképpen fogalmazva, a $\\vdash^*$ reláció a $\\vdash$ reláció reflexív-tranzitív lezártja.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: { hu: "Felismert és eldöntött nyelvek" },
  },
  {
    type: "definition",
    term: { hu: "TG által felismert nyelv" },
    content: {
      hu: "Az $M$ TG által felismert nyelv: $L(M) = \\{u \\in \\Sigma^* \\mid q_0 u\\square \\vdash^* x q_i y \\text{ valamely } x, y \\in \\Gamma^*,\\, y \\neq \\varepsilon\\text{-ra}\\}.$",
    },
  },
  {
    type: "definition",
    term: { hu: "Turing-felismerhető és eldönthető nyelv" },
    content: {
      hu: "Egy $L \\subseteq \\Sigma^*$ nyelv:",
    },
    items: [
      { hu: "Turing-felismerhető (rekurzívan felsorolható, RE), ha $L = L(M)$ valamely $M$ TG-re. Ha $u \\notin L$, a gép hurokba eshet (soha nem áll meg)." },
      { hu: "Eldönthető (rekurzív, R), ha létezik olyan $M$ TG, amely minden bemeneten megállási konfigurációba jut, és $L(M) = L$." },
    ],
  },
  {
    type: "formula",
    latex: "R \\subseteq RE",
  },
  {
    type: "funfact",
    text: {
      hu: "Nem minden nyelvet lehet Turing-géppel felismerni. Ennek oka egy egyszerű számossági érv: a {0,1} feletti nyelvek halmaza kontinuum számosságú ($|\\mathbb{R}|$), míg a Turing-gépek száma csak megszámlálható ($|\\mathbb{N}|$), Mivel több nyelv van, mint Turing-gép, ofc léteznek olyan nyelvek, amelyeket egyetlen Turing-gép sem ismer fel.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: { hu: "Futási idő" },
  },
  {
    type: "definition",
    term: { hu: "Futási idő és időkorlátos TG" },
    content: {
      hu: "Az $M$ TG futási ideje az $u$ szóra $t \\geq 0$, ha $M$ az $u$-hoz tartozó kezdőkonfigurációból $t$ lépés alatt jut megállási konfigurációba. Ha nincs ilyen $t$, a futási idő végtelen. Legyen $f : \\mathbb{N} \\to \\mathbb{N}$. Az $M$ egy $f(n)$ időkorlátos TG, ha minden $u \\in \\Sigma^*$ inputra a futási ideje legfeljebb $f(|u|)$.",
    },
  },
  {
    type: "example",
    title: { hu: "$L = \\{ww^{-1} \\mid w \\in \\{a,b\\}^*\\}$ egyszalagos TG-gel" },
    content: {
      hu: "Az $aba$ inputra a gép konfigurációátmenetei: $q_0 aba \\vdash q_1 ba \\vdash baq_1 \\square \\vdash bq_3 a \\vdash \\ldots$ A futási idő a végrehajtott konfigurációátmenetek számával mérhető. Az egyszalagos megoldásban a gép gyakran végigmozog a szalagon, hogy összehasonlítsa a szó különböző pozícióin lévő karaktereket. Mivel egy ilyen bejárás $O(n)$ lépésbe kerül, és erre legfeljebb $O(n)$-szer lehet szükség, a teljes futási idő $O(n^2)$.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: { hu: "Többszalagos Turing-gép" },
  },
  {
    type: "paragraph",
    text: {
      hu: "A többszalagos Turing-gép a szokásos Turing-gép olyan változata, amely k≥1k \ge 1k≥1 darab kétirányban végtelen szalaggal rendelkezik. Minden szalaghoz külön olvasó-író fej tartozik, amelyek egymástól függetlenül mozoghatnak.",
    },
  },
  {
    type: "definition",
    term: { hu: "$k$-szalagos Turing-gép" },
    content: {
      hu: "A $k$-szalagos TG egy $M = \\langle Q, \\Sigma, \\Gamma, \\delta, q_0, q_i, q_n \\rangle$ rendezett hetes, ahol az átmenetfüggvény $\\delta : (Q \\setminus \\{q_i, q_n\\}) \\times \\Gamma^k \\to Q \\times \\Gamma^k \\times \\{L, S, R\\}^k$.",
    },
  },
  {
    type: "definition",
    term: { hu: "$k$-szalagos TG konfigurációja" },
    content: {
      hu: "Egy $(q, u_1, v_1, \\ldots, u_k, v_k)$ szó, ahol $q \\in Q$, $u_i, v_i \\in \\Gamma^*$, $v_i \\neq \\varepsilon$ ($1 \\leq i \\leq k$). Az $i$. szalag tartalma $u_i v_i$, a fej $v_i$ első betűjén áll. Az $u$ szóhoz tartozó **kezdőkonfiguráció**: $(q_0, \\varepsilon, u\\square, \\varepsilon, \\square, \\ldots, \\varepsilon, \\square)$ — az input az első szalagon, a többi üres.",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    name: { hu: "$k$-szalagos TG szimulálása egyszalagossal" },
    statement: {
      hu: "Minden $M$ $k$-szalagos Turing-géphez megadható egy vele ekvivalens $M'$ egyszalagos Turing-gép. Ha $M$ legalább lineáris időigényű ($f(n) = \\Omega(n)$), akkor $M'$ $O(f(n)^2)$ időkorlátos.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Intuíció: Az egyszalagos gép egyetlen szalagon tárolja a kkk szalag tartalmát, elválasztó jelekkel és a fejek helyét jelölő speciális szimbólumokkal. Egy többszalagos lépés szimulálásához végig kell olvasnia ezt a reprezentációt, ami legfeljebb $O(f(n))$ időt igényel. Mivel ezt az eredeti gép minden egyes lépésére el kell végeznie, az összes futási idő $O(f(n)^2)$ lesz.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: { hu: "Nemdeterminisztikus Turing-gép" },
  },
  {
    type: "definition",
    term: { hu: "Nemdeterminisztikus Turing-gép (NTG)" },
    content: {
      hu: "Az egyszalagos NTG egy $M = \\langle Q, \\Sigma, \\Gamma, \\delta, q_0, q_i, q_n \\rangle$ rendezett hetes, ahol $\\delta : (Q \\setminus \\{q_i, q_n\\}) \\times \\Gamma \\to \\mathcal{P}(Q \\times \\Gamma \\times \\{L, S, R\\})$ az átmenetfüggvény. Egy adott $(q, a)$ párhoz több lehetséges átmenet is rendelhető.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Egy $u$ inputhoz az NTG-nek több számítása (ága) is lehet: elfogadók, elutasítók, és végtelen (elakadó) számítások egyaránt. Az NTG elfogadja $u$-t, ha legalább egy számítása elfogadó konfigurációban ér véget. A felismert és eldöntött nyelvek fogalma analóg a determinisztikus esettel.",
    },
  },
  {
    type: "definition",
    term: { hu: "Nemdeterminisztikus számítási fa" },
    content: {
      hu: "Az $M$ NTG-hez és $u \\in \\Sigma^*$ inputhoz tartozó nemdeterminisztikus számítási fa egy gyökeres fa, melynek csúcsai $M$ konfigurációival vannak címkézve. A gyökér $q_0 u\\square$. Ha $C$ egy csúcs és $\\{C' \\mid C \\vdash C'\\}$ az összes lehetséges rákövetkezője, akkor ezek $C$ gyerekei.",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    name: { hu: "NTG szimulálása determinisztikus TG-pel" },
    statement: {
      hu: "Minden $M$ $f(n)$ időkorlátos NTG-hez megadható egy ekvivalens $M'$ determinisztikus TG, amely $2^{O(f(n))}$ időkorlátos.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A bizonyítás alapötlete: A determinisztikus gép szélességi bejárással szimulálja a nemdeterminisztikus számítási fa összes ágát. Mivel egy $f(n)$ lépéses futás során exponenciálisan sok ág keletkezhet, a teljes szimuláció időigénye $2^{O(f(n))}$.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "Abból, hogy az NTG–determinisztikus szimuláció exponenciális időigényű, még nem következik, hogy nem létezhet hatékonyabb szimuláció. Ez éppen a $P \\overset{?}{=} NP$ kérdés lényege.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: { hu: "Kiszámító Turing-gép" },
  },
  {
    type: "definition",
    term: { hu: "Kiszámító TG" },
    content: {
      hu: "Az $M = \\langle Q, \\Sigma, \\Delta, \\delta, q_0, q_i, (q_n) \\rangle$ TG **kiszámítja** az $f : \\Sigma^* \\to \\Delta^*$ szófüggvényt, ha minden $u \\in \\Sigma^*$ szóra megáll, és ekkor $f(u)$ olvasható az utolsó szalagon. Egy $f$ szófüggvény **kiszámítható**, ha van olyan TG, ami kiszámítja.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A kiszámítható függvények fogalma az eldöntési problémák kibővítéseként fogható fel. Míg egy eldöntési probléma végén csak egy igen vagy nem választ kapunk, addig itt a kimenet bármilyen szó lehet. Másképpen fogalmazva: a gép nemcsak eldönt valamit a bemenetről, hanem eredményt is előállít. Az eddig megismert számítási modellek mind ugyanazt a függvényosztályt adják, vagyis ugyanazokat a függvényeket tudják kiszámítani.",
    },
  },
];
