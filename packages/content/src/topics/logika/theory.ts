import type { ContentBlock } from "../../types/content";

export const theory: ContentBlock[] = [
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Nulladrendű logika (ítéletkalkulus)",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Az ítéletkalkulus elemi állításokból (ítéletekből) logikai összekötőkkel felépített állításokkal foglalkozik. Egy ilyes fajta ítéletnek egyértelmű igazságértéke van: igaz ($i$) vagy hamis ($h$). Ítélet például a „Süt a nap”, de nem ítélet a „Lejössz a térre?” vagy a „Laci magas” (mihez képest?)..",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Formulák",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Ítéletlogikai formula",
    },
    content: {
      hu: "Adott az ítéletváltozók megszámlálhatóan végtelen $Var = \\{x_1, x_2, \\dots\\}$ halmaza. A formulák $Form$ halmaza a legszűkebb halmaz, amelyre:",
    },
    items: [
      { hu: "minden $x \\in Var$ esetén $x \\in Form$," },
      { hu: "ha $\\varphi \\in Form$, akkor $\\neg\\varphi \\in Form$," },
      { hu: "ha $\\varphi, \\psi \\in Form$, akkor $(\\varphi \\wedge \\psi), (\\varphi \\vee \\psi), (\\varphi \\to \\psi) \\in Form$." },
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "A műveleti jelek: negáció ($\\neg$), konjunkció ($\\wedge$), diszjunkció ($\\vee$), implikáció ($\\to$). $Var(\\varphi)$ jelöli a $\\varphi$-ben előforduló ítéletváltozók halmazát.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A formulák szerkezetét jól szemlélteti a szerkezeti fa. Ennek gyökere maga a teljes formula, a gyerekcsúcsok pedig annak közvetlen részformulái. Így a bonyolultabb formulák lépésről lépésre „szétszedhetők” egyszerűbb darabokra. A gyökérben található művelet a fő logikai összekötő, vagyis az a művelet, amelyet a formula kiértékelésekor utoljára hajtunk végre.",
    },
  },
  {
    type: "heading",
    level: 3,
    text: {
      hu: "Zárójelelhagyás",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A logikai formulákban sok zárójel felesleges, ha ismerjük a műveletek prioritását.",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "A precedencia csökkenő sorrendben: $\\neg, \\wedge, \\vee, \\to$. (a negáció köt a legerősebben, az implikáció pedig a leggyengébben)" },
      { hu: "1. A formula külső zárójelpárja elhagyható." },
      { hu: "2. Egy részformula zárójele elhagyható, ha a fő összekötőjének precedenciája nagyobb, mint a szülőjéé a szerkezeti fában." },
      { hu: "3. Konjunkció- és diszjunkcióláncban minden belső zárójel elhagyható (asszociativitás miatt)." },
      { hu: "4. Implikációláncnál az alapértelmezett zárójelezés jobbról történik: $X_1 \\to X_2 \\to X_3$ jelentése $X_1 \\to (X_2 \\to X_3)$. Más zárójelezésnél a zárójel nem hagyható el, mert $\\to$ nem asszociatív." },
    ],
  },
  {
    type: "example",
    title: {
      hu: "Melyik a fő logikai összekötő?",
    },
    content: {
      hu: "$x \\to y \\vee z \\to y \\wedge x$ visszazárójelezve: $(x \\to ((y \\vee z) \\to (y \\wedge x)))$. A fő logikai összekötő az első $\\to$.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Interpretáció és igazságérték",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Interpretáció",
    },
    content: {
      hu: "Egy $I : Var(\\varphi) \\to \\{i, h\\}$ függvényt a $\\varphi$ formula interpretációjának (változókiértékelésének) nevezünk. Formulahalmazra ugyanígy: $I : Var(F) \\to \\{i, h\\}$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A lényeg igazából, hogy igazságértéket adunk a változóknak, majd ebből kiszámoljuk a teljes formula igazságértékét. A $\\varphi$ formula $B_I(\\varphi)$ igazságértékét (Boole-értékét) rekurzívan számoljuk: $B_I(x) = I(x)$, $B_I(\\neg\\varphi) = \\neg B_I(\\varphi)$, $B_I(\\varphi \\circ \\psi) = B_I(\\varphi) \\circ B_I(\\psi)$, ahol a műveleteket az alábbi tábla definiálja:",
    },
  },
  {
    type: "table",
    headers: ["$B_I(\\varphi)$", "$B_I(\\psi)$", "$\\neg\\varphi$", "$\\varphi \\wedge \\psi$", "$\\varphi \\vee \\psi$", "$\\varphi \\to \\psi$"],
    rows: [
      ["$i$", "$i$", "$h$", "$i$", "$i$", "$i$"],
      ["$i$", "$h$", "$h$", "$h$", "$i$", "$h$"],
      ["$h$", "$i$", "$i$", "$h$", "$i$", "$i$"],
      ["$h$", "$h$", "$i$", "$h$", "$h$", "$i$"],
    ],
  },
  {
    type: "warning",
    text: {
      hu: "Az implikáció csak akkor hamis, ha az előtag igaz és az utótag hamis. Hamis előtagból bármi következik: $h \\to h$ és $h \\to i$ is igaz.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Szemantikus tulajdonságok",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "$I$ kielégíti $\\varphi$-t ($I \\models_0 \\varphi$), ha $\\varphi$ igaz az I interpretációban." },
      { hu: "$\\varphi$ kielégíthető, ha van olyan interpretáció, amely kielégíti." },
      { hu: "$\\varphi$ kielégíthetetlen, ha nincs olyan interpretáció, amely kielégíti." },
      { hu: "$\\varphi$ tautológia ($\\models_0 \\varphi$), ha minden interpretáció kielégíti." },
      { hu: "$\\psi$ a $\\varphi$ tautologikus következménye ($\\varphi \\models_0 \\psi$), ha minden $\\varphi$-t kielégítő interpretáció kielégíti $\\psi$-t is." },
      { hu: "$\\varphi$ és $\\psi$ tautologikusan ekvivalensek ($\\varphi \\sim_0 \\psi$), ha $\\varphi \\models_0 \\psi$ és $\\psi \\models_0 \\varphi$." },
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "A fenti fogalmak formulahalmazokra is értelmezhetők: $I \\models_0 F$, ha $I$ minden $F$-beli formulát kielégít, és $F \\models_0 \\varphi$, ha minden $F$-et kielégítő interpretáció kielégíti $\\varphi$-t is.",
    },
  },
  {
    type: "heading",
    level: 3,
    text: {
      hu: "Ítélettábla",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Ha egy formulában nnn különböző ítéletváltozó szerepel, akkor 2n2^n2n különböző interpretáció létezik. Az ítélettábla ezeket az interpretációkat sorolja fel, és minden sorhoz megadja a formula igazságértékét. Az ítélettáblából egyszerűen leolvashatók a legfontosabb szemantikus tulajdonságok: ",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "a formula kielégíthető, ha van legalább egy olyan sor, ahol igaz" },
      { hu: "kielégíthetetlen, ha minden sorban hamis" },
      { hu: "tautológia, ha minden sorban igaz" },
      { hu: "két formula ekvivalens, ha minden interpretációban ugyanazt az igazságértéket kapják." },
    ],
  },
  {
    type: "example",
    title: {
      hu: "$\\{x \\to y, x\\} \\models_0 y$",
    },
    content: {
      hu: "Vizsgáljuk meg, hogy {x→y,x}⊨0y\{x \to y, x\} \models_0 y{x→y,x}⊨0​y teljesül-e. Az ítélettáblában csak az I(x)=iI(x)=iI(x)=i, I(y)=iI(y)=iI(y)=i interpretáció elégíti ki egyszerre az x→yx\to yx→y és az xxx formulát. Ebben az interpretációban yyy is igaz, ezért yyy következménye a {x→y,x}\{x \to y, x\}{x→y,x} formulahalmaznak.",
    },
  },
  {
    type: "table",
    headers: ["$x$", "$y$", "$x \\to y$", "$x$", "$y$"],
    rows: [
      ["$i$", "$i$", "$i$", "$i$", "$i$"],
      ["$i$", "$h$", "$h$", "$i$", "$h$"],
      ["$h$", "$i$", "$i$", "$h$", "$i$"],
      ["$h$", "$h$", "$i$", "$h$", "$h$"],
    ],
  },
  {
    type: "heading",
    level: 3,
    text: {
      hu: "Fontosabb logikai törvények",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A formulák átalakításához leggyakrabban a következő azonosságokat használjuk:",
    },
  },
  {
    type: "table",
    headers: ["Név", "Törvény"],
    rows: [
      ["kettős tagadás", "$\\neg\\neg\\varphi \\sim_0 \\varphi$"],
      ["implikáció átírása", "$\\varphi \\to \\psi \\sim_0 \\neg\\varphi \\vee \\psi$"],
      ["kizárt harmadik, ellentmondás", "$\\varphi \\vee \\neg\\varphi \\sim_0 \\top$, $\\varphi \\wedge \\neg\\varphi \\sim_0 \\bot$"],
      ["De Morgan", "$\\neg(\\varphi \\wedge \\psi) \\sim_0 \\neg\\varphi \\vee \\neg\\psi$, $\\neg(\\varphi \\vee \\psi) \\sim_0 \\neg\\varphi \\wedge \\neg\\psi$"],
      ["ellentmondás", "$\\varphi \\wedge \\neg\\varphi \\sim_0 \\bot$"],

    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Ha egy részformulát egy vele ekvivalens formulára cserélünk, az eredmény ekvivalens marad. Ezért a fenti törvényekkel lépésről lépésre alakíthatunk át formulákat.",
    },
  },
  {
    type: "example",
    title: {
      hu: "$\\models_0 x \\to (y \\to x)$",
    },
    content: {
      hu: "$x \\to (y \\to x) \\sim_0 \\neg x \\vee (\\neg y \\vee x) \\sim_0 (\\neg x \\vee x) \\vee \\neg y \\sim_0 \\top \\vee \\neg y \\sim_0 \\top$.",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    statement: {
      hu: "Egy formula pontosan akkor kielégíthetetlen, ha a negáltja tautológia.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Ha szeretnénk belátni, hogy $\\varphi$ következik $\\mathcal{F}$-ből, akkor elég hozzávenni $\\neg\\varphi$-t az előfeltevésekhez. Ha így ellentmondásra jutunk, akkor a következmény valóban igaz. Ezt az ötletet használja a rezolúció is.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Normálformák",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Literál, klóz, KNF, DNF",
    },
    content: {
      hu: "Literál egy $x$ vagy $\\neg x$ alakú formula, Az $x$ és $\\neg x$ komplemensei egymásnak. Klóznak nevezzük a literálok diszjunkcióját: $\\ell_1 \\vee \\dots \\vee \\ell_n$.",
    },
    items: [
      { hu: "KNF (konjunktív normálforma): klózok konjunkciója." },
      { hu: "DNF (diszjunktív normálforma): elemi konjunkciók diszjunkciója." },
    ],
  },
  {
    type: "example",
    content: {
      hu: "$x \\vee \\neg y \\vee z$ egy klóz (egyben 1-tagú KNF és 3-tagú DNF). $(x \\vee \\neg y \\vee z) \\wedge (\\neg x \\vee z) \\wedge y$ egy 3-tagú KNF.",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    statement: {
      hu: "Tétel. Minden ítéletlogikai formula átírható vele ekvivalens KNF-be és DNF-be.",
    },
  },
  {
    type: "heading",
    level: 3,
    text: {
      hu: "KNF és DNF az ítélettáblából",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "DNF: A táblázatból vesszük az igaz sorokat. Minden igaz sorhoz felírunk egy elemi konjunkciót úgy, hogy az adott sorban igaz változók pozitívan, a hamisak negálva szerepelnek. Az így kapott konjunkciókat végül diszjunkcióval kapcsoljuk össze." },
      { hu: "KNF: Minden hamis sorhoz felírunk egy klózt úgy, hogy az adott sorban igaz változók negálva, a hamisak pozitívan szerepelnek. Az így kapott klózokat végül konjunkcióval kapcsoljuk össze." },
    ],
  },
  {
    type: "warning",
    text: {
      hu: "KNF-nél fordítva kell negálni! A klóz pontosan abban az egy sorban legyen hamis, amelyikből készült, ezért az igaz változók kerülnek negálva bele.",
    },
  },

  {
    type: "heading",
    level: 2,
    text: {
      hu: "Rezolúció",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A rezolúció egy következtetési szabály klózokra. Ha két klózban ugyanaz a változó ellentétes előjellel szerepel (például $y$ és $\\neg y$), akkor ezt a komplemens párt kiejtjük, és a maradék literálokból új klózt képzünk: ez a rezolvens.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Rezolvens",
    },
    content: {
      hu: "Legyenek $C_1 = C_1' \\vee \\ell$ és $C_2 = C_2' \\vee \\neg\\ell$ olyan klózok, amelyek között pontosan egy komplemens literálpár van. Ekkor $res(C_1, C_2) := C_1' \\vee C_2'$. Speciálisan $res(\\ell, \\neg\\ell) = \\Box$ (üres klóz).",
    },
  },
  {
    type: "table",
    headers: ["Klózpár", "Rezolvens"],
    rows: [
      ["$(x \\vee y,\\ \\neg y \\vee z)$", "$x \\vee z$"],
      ["$(x,\\ \\neg x)$", "$\\Box$"],
      ["$(x \\vee \\neg y,\\ \\neg y \\vee z)$", "nincs: nincs komplemens pár"],
      ["$(x \\vee y \\vee z,\\ \\neg y \\vee \\neg z)$", "nincs: két komplemens pár van"],
    ],
  },
  {
    type: "warning",
    text: {
      hu: "Rezolvens csak akkor képezhető, ha a két klóz között pontosan egy komplemens pár van. Ha nincs ilyen, vagy több is van, a két klózból nem képezünk rezolvenst.",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    statement: {
      hu: "Az $S$ klózhalmaz pontosan akkor kielégíthetetlen, ha a rezolúció ismételt alkalmazásával levezethető belőle az üres klóz ($\\Box$).",
    },
  },
  {
    type: "heading",
    level: 3,
    text: {
      hu: "Hogyan igazoljunk következményt rezolúcióval?",
    },
  },
  {
    type: "list",
    ordered: true,
    items: [
      { hu: "$\\mathcal{F} \\models_0 \\varphi$ igazolásához a premisszákhoz hozzávesszük a konklúzió negáltját, $\\neg\\varphi$-t." },
      { hu: "A premisszákat és $\\neg\\varphi$-t KNF-re hozzuk, a klózaik együtt alkotják az $S$ klózhalmazt." },
      { hu: "Rezolvenseket képzünk, amíg el nem jutunk $\\Box$-hoz. Minden sornál jelöljük, hogy $S$-beli vagy melyik két korábbi sor rezolvense." },
    ],
  },
  {
    type: "example",
    title: {
      hu: "$S = \\{y \\vee z,\\ x \\vee \\neg w \\vee \\neg z,\\ \\neg y,\\ y \\vee \\neg z \\vee w,\\ \\neg x \\vee y\\}$ kielégíthetetlen",
    },
    content: {
      hu: "Egy lehetséges levezetés:",
    },
  },
  {
    type: "table",
    headers: ["#", "Klóz", "Indoklás"],
    rows: [
      ["1.", "$\\neg y$", "$\\in S$"],
      ["2.", "$y \\vee z$", "$\\in S$"],
      ["3.", "$z$", "$res(1, 2)$"],
      ["4.", "$x \\vee \\neg w \\vee \\neg z$", "$\\in S$"],
      ["5.", "$y \\vee \\neg z \\vee w$", "$\\in S$"],
      ["6.", "$x \\vee y \\vee \\neg z$", "$res(4, 5)$"],
      ["7.", "$x \\vee y$", "$res(3, 6)$"],
      ["8.", "$\\neg x \\vee y$", "$\\in S$"],
      ["9.", "$y$", "$res(7, 8)$"],
      ["10.", "$\\Box$", "$res(1, 9)$"],
    ],
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Elsőrendű logika",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Az elsőrendű logika az ítéletkalkulus kiterjesztése, amely figyelembe veszi az állítások belső szerkezetét. Segítségével objektumokat, tulajdonságokat és relációkat írhatunk le, valamint univerzális és egzisztenciális kvantorok alkalmazásával általános állításokat fogalmazhatunk meg objektumok halmazairól.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Szintaxis",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Szimbólumhalmaz",
    },
    content: {
      hu: "Egy elsőrendű logika szimbólumai: a predikátumszimbólumok véges $Pred$ halmaza, a függvényszimbólumok véges $Func$ halmaza, a konstansszimbólumok véges $Cnst$ halmaza, az individuumváltozók megszámlálhatóan végtelen $Ind = \\{x_1, x_2, \\dots\\}$ halmaza, a $\\neg, \\wedge, \\vee, \\to$ műveleti jelek, a $\\forall$ (univerzális) és $\\exists$ (egzisztenciális) kvantorok, valamint a zárójelek és a vessző. Minden $s \\in Pred \\cup Func \\cup Cnst$ szimbólumnak van egy $ar(s) \\in \\mathbb{N}$ aritása (konstansoké 0).",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Term",
    },
    content: {
      hu: "A termek objektumokat jelölnek. Term lehet",
    },
    items: [
      { hu: "egy individuumváltozó ($x \\in Ind$)," },
      { hu: "egy konstans ($c \\in Cnst$)," },
      { hu: "vagy egy függvényszimbólum alkalmazása termekre." },
    ],
  },
  {
    type: "definition",
    term: {
      hu: "Elsőrendű formula",
    },
    content: {
      hu: "A formulák logikai állításokat fejeznek ki. Ha $p \\in Pred$ egy $n$-aritású predikátumszimbólum és $t_1, \\dots, t_n$ termek, akkor $p(t_1, \\dots, t_n)$ atomi formula. Az összetett formulák ezekből építhetők fel:",
    },
    items: [
      { hu: "ha $\\varphi$ formula, akkor $\\neg\\varphi$ is formula;" },
      { hu: "ha $\\varphi$ és $\\psi$ formulák, akkor $(\\varphi \\wedge \\psi)$, $(\\varphi \\vee \\psi)$ és $(\\varphi \\to \\psi)$ is formulák;" },
      { hu: "ha $\\varphi$ formula és $x \\in Ind$, akkor $\\forall x\\, \\varphi$ és $\\exists x\\, \\varphi$ is formulák." },
    ],
  },
  {
    type: "example",
    title: {
      hu: "$Pred = \\{p, q\\}$, $Func = \\{f\\}$, $Cnst = \\{a\\}$, $ar(p) = ar(q) = ar(f) = 2$",
    },
    content: {
      hu: "Termek: $x$, $a$, $f(x, y)$, $f(x, f(a, x))$. Nem term: $f(x)$, mert $f$ kétváltozós. Formulák: $p(x, y)$, $q(x, f(a, a))$, $\\exists x(p(x, y) \\to q(x, z))$. Nem formulák: $p(x)$ (rossz aritás), $\\forall x f(x, y)$ (a term nem formula), $p(x, q(y, z))$ (predikátum nem lehet argumentum).",
    },
  },
  {
    type: "warning",
    text: {
      hu: "A term egy objektumot jelöl (pl. egy számot), a formula pedig egy állítást, aminek igazságértéke van. Predikátum argumentumába csak term kerülhet, formula nem.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A zárójelelhagyás ugyanúgy működik, mint nulladrendben, a precedenciasorrend: $\\forall, \\exists, \\neg, \\wedge, \\vee, \\to$. Pl. $(\\neg p(x, y) \\vee q(x, x)) \\to \\forall x(p(x, f(x, y)) \\wedge q(x, z))$ helyett írható $\\neg p(x, y) \\vee q(x, x) \\to \\forall x(p(x, f(x, y)) \\wedge q(x, z))$.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Szemantika",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Interpretáció",
    },
    content: {
      hu: "Egy $I = \\langle U, I_{Pred}, I_{Func}, I_{Cnst} \\rangle$ négyes.",
    },
    items: [
      { hu: "$U$ egy nemüres halmaz (univerzum)" },
      { hu: "$I_{Pred}$ minden $p$-hez egy $p^I \\subseteq U^{ar(p)}$ relációt" },
      { hu: "$I_{Func}$ minden $f$-hez egy $f^I : U^{ar(f)} \\to U$ műveletet" },
      { hu: "$I_{Cnst}$ minden $c$-hez egy $c^I \\in U$ elemet rendel" },
    ],
  },
  {
    type: "definition",
    term: {
      hu: "Változókiértékelés",
    },
    content: {
      hu: "Egy $\\kappa : Ind \\to U$ leképezés, vagyis minden változóhoz hozzárendelünk egy elemet az univerzumból. A $\\kappa^*$ a $\\kappa$ $x$-variánsa, ha legfeljebb az $x$ értékében tér el tőle.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Egy $t$ term értékét ($|t|_{I,\\kappa}$) a várható módon számoljuk: változó helyére $\\kappa$ szerinti értéket, konstans helyére $c^I$-t írunk, a függvényszimbólumokat pedig $f^I$ szerint értékeljük ki, belülről kifelé.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Egy formula $|\\varphi|_{I,\\kappa}$ igazságértéke:",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "$p(t_1, \\dots, t_k)$ igaz, ha a termek értékeiből álló $k$-as benne van $p^I$-ben," },
      { hu: "$\\neg, \\wedge, \\vee, \\to$ ugyanúgy működik, mint az ítéletlogikában," },
      { hu: "$\\forall x\\, \\varphi$ igaz, ha $\\varphi$ igaz, bárhogy is választjuk $x$ értékét ($\\kappa$ minden $x$-variánsára)," },
      { hu: "$\\exists x\\, \\varphi$ igaz, ha van olyan érték $x$-nek, amire $\\varphi$ igaz (legalább egy $x$-variánsra)." },
    ],
  },
  {
    type: "example",
    title: {
      hu: "Kiértékelés a természetes számokon",
    },
    content: {
      hu: "Legyen $U = \\mathbb{N}$, $p^I$: $\\geq$, $q^I$: $=$, $f^I$: összeadás, $a^I = 0$, továbbá $\\kappa(x) = 5$, $\\kappa(y) = 3$. Ekkor $|f(f(x, y), y)|_{I,\\kappa} = 11$, $|p(f(y, y), x)|_{I,\\kappa} = i$ (mert $6 \\geq 5$), $|q(f(y, y), x)|_{I,\\kappa} = h$. A $\\forall x\\, p(x, a)$ („minden szám $\\geq 0$”) igaz, a $\\forall x \\exists y\\, q(f(x, y), a)$ („minden számhoz van, amivel összeadva $0$”) hamis, de $U = \\mathbb{Z}$ esetén igaz lenne.",
    },
  },
  {
    type: "heading",
    level: 3,
    text: {
      hu: "Szabad és kötött változók",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Egy változó-előfordulás kötött, ha egy rá vonatkozó kvantor hatáskörében van, egyébként szabad. Ha egy formulában nincs szabad változó, akkor zárt, és az értéke nem függ $\\kappa$-tól.",
    },
  },
  {
    type: "example",
    content: {
      hu: "$\\forall x\\, p(x, x) \\to q(x, x)$ nyitott, mert a kvantor csak $p(x, x)$-re vonatkozik, így $q(x, x)$-ben az $x$ szabad. Ezzel szemben $\\forall x (p(x, x) \\to q(x, x))$ zárt.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "A $\\forall$ és $\\exists$ precedenciája a legnagyobb, ezért zárójel nélkül csak a közvetlenül utána álló részformulára vonatkozik!",
    },
  },
  {
    type: "heading",
    level: 3,
    text: {
      hu: "Szemantikus alapfogalmak",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Ugyanazok, mint nulladrendben, csak interpretáció helyett $(I, \\kappa)$ párokkal:",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "kielégíthető: van olyan $I, \\kappa$, amiben igaz;" },
      { hu: "logikailag igaz ($\\models \\varphi$): minden $I, \\kappa$-ban igaz;" },
      { hu: "ekvivalens ($\\varphi \\sim \\psi$): minden $I, \\kappa$-ban ugyanaz az értékük;" },
      { hu: "következmény ($F \\models \\varphi$): ahol $F$ minden formulája igaz, ott $\\varphi$ is." },
    ],
  },
  {
    type: "heading",
    level: 3,
    text: {
      hu: "Elsőrendű logikai törvények",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A nulladrendű törvények itt is érvényesek. A legfontosabb újak (ahol $x$ nem szabad $A$-ban):",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "Kvantoros De Morgan: $\\neg\\exists x A \\sim \\forall x \\neg A$, $\\neg\\forall x A \\sim \\exists x \\neg A$." },
      { hu: "Azonos kvantorok felcserélhetők: $\\forall x \\forall y A \\sim \\forall y \\forall x A$ (és $\\exists$-re is)." },
      { hu: "Kiemelés: $A \\wedge \\forall x B \\sim \\forall x(A \\wedge B)$, $A \\vee \\exists x B \\sim \\exists x(A \\vee B)$ stb., ha $x$ nem szabad $A$-ban." },
      { hu: "Implikáció előtagjából kiemelve a kvantor megfordul: $\\forall x B \\to A \\sim \\exists x(B \\to A)$, $\\exists x B \\to A \\sim \\forall x(B \\to A)$." },
      { hu: "$\\forall$ szétosztható $\\wedge$-en, $\\exists$ pedig $\\vee$-n: $\\forall x A \\wedge \\forall x B \\sim \\forall x(A \\wedge B)$, $\\exists x A \\vee \\exists x B \\sim \\exists x(A \\vee B)$." },
    ],
  },
  {
    type: "warning",
    text: {
      hu: "Különböző kvantorok nem cserélhetők fel: $\\forall x \\exists y\\, q(x, y)$ („mindenkinek van párja”) $\\not\\sim$ $\\exists y \\forall x\\, q(x, y)$ („van valaki, aki mindenkinek a párja”). Ugyanígy $\\forall$ nem osztható szét $\\vee$-n, $\\exists$ pedig $\\wedge$-n.",
    },
  },
  {
    type: "example",
    title: {
      hu: "Szókratész halandó",
    },
    content: {
      hu: "$E(x)$: $x$ ember, $H(x)$: $x$ halandó, $s$: Szókratész. Belátandó: $\\{\\forall x(E(x) \\to H(x)),\\ E(s)\\} \\models H(s)$. Vegyünk egy $I, \\kappa$-t, ahol mindkét feltétel igaz. Mivel $E(x) \\to H(x)$ minden $x$-re igaz, $x = s^I$-re is. $E(s)$ igaz, így az implikáció miatt $H(s)$ is igaz.",
    },
  },
  {
    type: "funfact",
    text: {
      hu: "Ítéletlogikában a tautológia-ellenőrzés véges (ítélettábla). Elsőrendben viszont végtelen sok $(I, \\kappa)$ pár van, és a logikai igazság eldönthetetlen – erről az Eldönthetetlenség témakörben lesz szó.",
    },
  },
];
