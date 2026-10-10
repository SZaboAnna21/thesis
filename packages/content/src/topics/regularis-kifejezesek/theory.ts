import type { ContentBlock } from "../../types/content";

export const theory: ContentBlock[] = [
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Miért kell még egy eszköz?",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Minden véges nyelv reguláris (egy szót egy hosszú 3-as szabállyal ki lehet írni), és $\\mathcal{L}_3$ zárt az unióra, konkatenációra és lezárásra. Ha tehát fogunk néhány véges nyelvet, és ezt a három műveletet véges sokszor alkalmazzuk rájuk, biztosan reguláris nyelvet kapunk. A nagy kérdés: megkapjuk-e így az összes reguláris nyelvet? Spoiler: igen. A reguláris kifejezés pont ennek a „legózásnak” a leírása.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Reguláris kifejezés",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Reguláris kifejezés",
    },
    content: {
      hu: "Legyen $V$ egy ábécé, és $V' = \\{\\emptyset, \\varepsilon, \\cdot, +, ^*, (, )\\}$ tőle diszjunkt. A $V$ feletti reguláris kifejezéseket rekurzívan definiáljuk:",
    },
  },
  {
    type: "list",
    ordered: true,
    items: [
      { hu: "$\\emptyset$ reguláris kifejezés," },
      { hu: "$\\varepsilon$ reguláris kifejezés," },
      { hu: "$a$ reguláris kifejezés minden $a \\in V$-re," },
      { hu: "ha $R$ reguláris kifejezés, akkor $R^*$ is," },
      { hu: "ha $Q$ és $R$ reguláris kifejezések, akkor $(Q \\cdot R)$ is," },
      { hu: "ha $Q$ és $R$ reguláris kifejezések, akkor $(Q + R)$ is." },
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Ez még csak szintaxis: szimbólumsorozatok, amiket szabályosan raktunk össze. A jelentésük a következő.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Reguláris kifejezés által jelölt nyelv",
    },
  },
  {
    type: "definition",
    term: {
      hu: "$L(R)$",
    },
    content: {
      hu: "Minden $R$ reguláris kifejezéshez tartozik egy $L(R)$ nyelv, szintén rekurzívan:",
    },
  },
  {
    type: "table",
    headers: ["Kifejezés", "Nyelv", "Kiolvasva"],
    rows: [
      ["$\\emptyset$", "$\\emptyset$", "semmi"],
      ["$\\varepsilon$", "$\\{\\varepsilon\\}$", "csak az üres szó"],
      ["$a$", "$\\{a\\}$", "egyetlen betű"],
      ["$R^*$", "$L(R)^*$", "akárhányszor (0-szor is)"],
      ["$Q \\cdot R$", "$L(Q)L(R)$", "előbb az egyik, utána a másik"],
      ["$Q + R$", "$L(Q) \\cup L(R)$", "vagy az egyik, vagy a másik"],
    ],
  },
  {
    type: "warning",
    text: {
      hu: "$\\emptyset$ és $\\varepsilon$ nem ugyanaz! $L(\\emptyset)$ az üres nyelv, egyetlen szó sincs benne, $L(\\varepsilon)$-ban viszont van egy szó, az üres szó. Ez a konkatenációnál látszik igazán: $R \\cdot \\varepsilon = R$, de $R \\cdot \\emptyset = \\emptyset$. (Nincs mivel összefűzni, tehát semmi sem jön ki.)",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Jelölésbeli lazaságok, amiket mindenki használ: $R$-et gyakran azonosítjuk $L(R)$-rel (pl. $ab^* = \\{ab^n \\mid n \\in \\mathbb{N}\\}$). A $+$ helyett írnak $|$-t vagy $\\cup$-t, a $\\cdot$-ot el szokás hagyni. $Q^+$ a $QQ^*$ rövidítése, és konkrét kitevő is megengedett, pl. $(a^3b + ab^3)b^*$.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Precedencia: mi köt erősebben?",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Mint a matekban: a $^*$ köt legerősebben (hatvány), utána a $\\cdot$ (szorzás), végül a $+$ (összeadás). Ennek és az asszociativitásnak köszönhetően a zárójelek nagy része elhagyható.",
    },
  },
  {
    type: "example",
    content: {
      hu: "$(a + b)a^*$ és $aa^* + ba^*$ ugyanazt jelenti: $\\{aa^n\\} \\cup \\{ba^n\\}$, vagyis egy $a$ vagy $b$, utána akárhány $a$. Viszont $a + ba^*$ egészen más: ez $\\{a, b, ba, ba^2, \\dots\\}$, mert a $+$ gyengébben köt, így az $a$ itt magában áll, nem jön utána $a^*$.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "$ab^*$ az $a, ab, abb, \\dots$ szavakat jelenti, nem az $(ab)^*$-ot! A csillag csak a közvetlenül előtte álló dologra vonatkozik. Ha egy több betűs részt akarsz ismételni, zárójelezz.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Azonosságok",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Ezekkel lehet reguláris kifejezéseket egyszerűsíteni és átírni. Pontosan fogalmazva mindegyik $L(\\text{bal oldal}) = L(\\text{jobb oldal})$-t jelent.",
    },
  },
  {
    type: "table",
    headers: ["#", "Azonosság", "Mit mond"],
    rows: [
      ["1", "$P + (Q + R) = (P + Q) + R$", "az unió asszociatív"],
      ["2", "$P(QR) = (PQ)R$", "a konkatenáció asszociatív"],
      ["3", "$P + Q = Q + P$", "az unió kommutatív"],
      ["4", "$P(Q + R) = PQ + PR$", "balról disztributív"],
      ["5", "$(P + Q)R = PR + QR$", "jobbról disztributív"],
      ["6", "$P^* = \\varepsilon + PP^*$", "a csillag: 0-szor, vagy egyszer és utána akárhányszor"],
      ["7", "$\\varepsilon P = P\\varepsilon = P$", "$\\varepsilon$ az egységelem"],
      ["8", "$P^* = (\\varepsilon + P)^*$", "az $\\varepsilon$ úgyis benne van a csillagban"],
      ["9", "$P\\emptyset = \\emptyset P = \\emptyset$", "$\\emptyset$ elnyeli a konkatenációt"],
    ],
  },
  {
    type: "warning",
    text: {
      hu: "Ami nincs a listán: a konkatenáció nem kommutatív, $PQ \\neq QP$ általában. És a csillag sem disztributív: $(P + Q)^* \\neq P^* + Q^*$. Például $abab \\in (a + b)^*$, de nincs benne sem $a^*$-ban, sem $b^*$-ban.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Gyakorlat: hogyan írj reguláris kifejezést?",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Nincs rá gépies recept, de pár minta nagyon gyakran előjön. Gondolj arra, hogy a szó milyen „darabokból” áll, és azok hogyan ismétlődhetnek. Itt mindenhol $\\Sigma = \\{a, b\\}$.",
    },
  },
  {
    type: "table",
    headers: ["Nyelv", "Reguláris kifejezés", "Ötlet"],
    rows: [
      ["minden szó", "$(a + b)^*$", "bármi, bármennyiszer"],
      ["$b$-re végződik", "$(a + b)^*b$", "bármi, aztán a kötelező vég"],
      ["tartalmazza az $aa$-t", "$(a + b)^*aa(a + b)^*$", "bármi, $aa$, bármi"],
      ["páros sok $a$ van benne", "$b^*(ab^*ab^*)^*$", "az $a$-kat párokba szedjük, közöttük akárhány $b$"],
      ["nincs benne $aa$", "$(b + ab)^*(\\varepsilon + a)$", "minden $a$ után $b$ jön, kivéve esetleg a legutolsót"],
    ],
  },
  {
    type: "warning",
    text: {
      hu: "A „nem tartalmaz” típusú nyelvek a legtrükkösebbek: a $(a + b)^*$-ból nem tudsz kivonni, mert kivonás nincs a műveletek között. Ilyenkor azt kell leírni, hogyan néz ki pozitívan egy jó szó. Tipikus hiba a nincs $aa$ példánál az $(b + ab)^*$: ebből kimaradnak az $a$-ra végződő szavak (pl. $a$, $ba$).",
    },
  },
  {
    type: "funfact",
    text: {
      hu: "A programozásban használt regexek (Python, JavaScript, grep) ezen alapulnak, de többet tudnak: például a visszahivatkozással (backreference) olyan nyelveket is leír, amik már nem regulárisak. Az elméleti reguláris kifejezés ennél szigorúbb, cserébe mindig átalakítható gyors, véges automatává.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Arden tétele",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Reguláris kifejezésekkel egyenleteket is lehet írni, és meg is lehet őket oldani. Ez a tétel lesz a kulcs ahhoz, hogy automatából reguláris kifejezést csináljunk.",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    name: {
      hu: "Arden tétele",
    },
    statement: {
      hu: "Legyenek $R$ és $Q$ reguláris kifejezések. A $P = R + PQ$ egyenletnek $P = RQ^*$ megoldása. Ha $\\varepsilon \\notin L(Q)$, akkor ez az egyetlen megoldás.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Intuíció: a $P = R + PQ$ azt mondja, hogy egy $P$-beli szó vagy egy $R$-beli szó, vagy egy $P$-beli szó, ami után még jön egy $Q$-beli darab. Ha ezt kibontjuk, $P$ = egy $R$-beli kezdet, utána akárhány $Q$-darab. Ez pont $RQ^*$.",
    },
  },
  {
    type: "example",
    content: {
      hu: "$P = ab^* + Pbc^*$. Itt $R = ab^*$, $Q = bc^*$, és $\\varepsilon \\notin L(bc^*)$ (minden szava $b$-vel kezdődik). Az egyértelmű megoldás tehát $P = ab^*(bc^*)^*$.",
    },
  },
  {
    type: "proof",
    title: {
      hu: "Bizonyítás",
    },
    content: [
      {
        type: "paragraph",
        text: {
          hu: "Megoldás: helyettesítsük be $P = RQ^*$-ot. $R + RQ^*Q = R(\\varepsilon + Q^*Q) = RQ^*$, a 6-os azonosság miatt.",
        },
      },
      {
        type: "paragraph",
        text: {
          hu: "Egyértelműség: az egyenletet önmagába helyettesítgetve $P = R + RQ + RQ^2 + \\dots + RQ^n + PQ^{n+1}$ adódik, tetszőleges $n$-re. Legyen $w \\in P$ és $n = |w|$. Mivel $\\varepsilon \\notin Q$, minden $Q$-beli szó legalább 1 hosszú, így $PQ^{n+1}$ minden szava legalább $n+1$ hosszú, tehát $w$ nincs benne. Ezért $w \\in R(\\varepsilon + Q + \\dots + Q^n) \\subseteq RQ^*$. Fordítva, ha $w \\in RQ^n$ valamely $n$-re, akkor a fenti kifejtés jobb oldalán szerepel, tehát $w \\in P$.",
        },
      },
    ],
  },
  {
    type: "warning",
    text: {
      hu: "Az $\\varepsilon \\notin L(Q)$ feltétel nem díszítés. Ha például $Q = \\varepsilon$, az egyenlet $P = R + P$, és ennek $R$-en kívül bármelyik $R$-et tartalmazó nyelv (pl. $\\Sigma^*$) is megoldása. Ilyenkor $RQ^*$ csak a legkisebb megoldás.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "A reguláris kifejezések leíró ereje",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    statement: {
      hu: "Minden reguláris kifejezés reguláris nyelvet ír le, és megfordítva: minden reguláris nyelvhez van őt leíró reguláris kifejezés.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Vagyis a bevezető kérdésre a válasz: igen, a „legózással” pontosan a reguláris nyelveket kapjuk meg, se többet, se kevesebbet.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Kifejezésből grammatika",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Ez a könnyű irány. $\\emptyset$, $\\{\\varepsilon\\}$ és $\\{a\\}$ regulárisak, és $\\mathcal{L}_3$ zárt a reguláris műveletekre. A kifejezést belülről kifelé építve a zártsági tétel konstrukcióit kell egymás után alkalmazni.",
    },
  },
  {
    type: "example",
    content: {
      hu: "$R = a(a + ba^*)^*$. Részkifejezések: $R_1 = a$, $R_2 = ba^*$, $R_3 = R_1 + R_2$, $R_4 = R_3^*$. $R_1$: $A \\to a$. $R_2$: $B \\to bC$, $C \\to aC \\mid \\varepsilon$. $R_3$ (unió, új $D$): $D \\to A \\mid B$, plusz az eddigiek. $R_4$ (lezárás, új $X$; a befejező szabályok mögé odaírjuk $D$-t): $X \\to D \\mid \\varepsilon$, $D \\to A \\mid B$, $A \\to a \\mid aD$, $B \\to bC$, $C \\to aC \\mid \\varepsilon \\mid D$. Végül $R$ (konkatenáció $a$-val, új $S$): $S \\to aX$, plusz az $R_4$-es szabályok.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Grammatikából kifejezés",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Ez a nehezebb irány. Induljunk egy 3-as normálformájú grammatikából, $N = \\{A_1, \\dots, A_n\\}$, $S = A_1$. Minden szabály $A_i \\to aA_j$ vagy $A_i \\to \\varepsilon$ alakú, így a levezetés közben mindig egyetlen nemterminális van a mondatforma végén, és nemterminálisról nemterminálisra „ugrálunk”.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "$E^k_{i,j}$",
    },
    content: {
      hu: "$E^k_{i,j}$ azoknak az $u \\in \\Sigma^*$ szavaknak a halmaza, amelyekre van $A_i \\Rightarrow^* uA_j$ levezetés úgy, hogy közben csak $A_1, \\dots, A_k$ nemterminálisokat érintünk (a kezdő $A_i$-t és a záró $A_j$-t nem számítva). Ezt nevezzük $k$-megszorított levezetésnek.",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "$k = 0$: közbülső nemterminális nincs, tehát legfeljebb egy lépés. $i \\neq j$ esetén $a \\in E^0_{i,j} \\iff A_i \\to aA_j \\in P$. $i = j$ esetén ezen felül $\\varepsilon \\in E^0_{i,i}$ (nulla lépés). Ez véges nyelv, tehát leírható reguláris kifejezéssel." },
      { hu: "$k > 0$: egy $k$-megszorított levezetés vagy nem érinti $A_k$-t (akkor $(k-1)$-megszorított), vagy igen. Ha igen, vágjuk fel az $A_k$ előfordulásainál: odaérünk $A_k$-ba, akárhányszor körbemegyünk $A_k$-ból $A_k$-ba, aztán továbbmegyünk $A_j$-be. Minden darab $(k-1)$-megszorított." },
    ],
  },
  {
    type: "formula",
    latex: "E^k_{i,j} = E^{k-1}_{i,j} + E^{k-1}_{i,k}\\left(E^{k-1}_{k,k}\\right)^* E^{k-1}_{k,j}",
  },
  {
    type: "paragraph",
    text: {
      hu: "Indukcióval tehát minden $E^k_{i,j}$ leírható reguláris kifejezéssel. Végül ha $I_\\varepsilon$ azon $i$ indexek halmaza, amelyekre $A_i \\to \\varepsilon \\in P$, akkor $L(G) = \\sum_{i \\in I_\\varepsilon} E^n_{1,i}$: indulunk $A_1$-ből, bármit érinthetünk, és egy olyan nemterminálisban kell kikötnünk, ahonnan le lehet állni.",
    },
  },
  {
    type: "example",
    title: {
      hu: "$E^k_{i,j}$ táblázatok kitöltése",
    },
    content: {
      hu: "Grammatika: $A_1 \\to bA_1 \\mid aA_2$, $A_2 \\to bA_1 \\mid \\varepsilon$. Mivel csak $A_2 \\to \\varepsilon$ van, $L(G) = E^2_{1,2}$. A táblázatokat $k = 0, 1, 2$ sorrendben töltjük ki, mindig az előzőből.",
    },
  },
  {
    type: "table",
    headers: ["$k$", "$E^k_{1,1}$", "$E^k_{1,2}$", "$E^k_{2,1}$", "$E^k_{2,2}$"],
    rows: [
      ["0", "$\\varepsilon + b$", "$a$", "$b$", "$\\varepsilon$"],
      ["1", "$b^*$", "$b^*a$", "$b^+$", "$\\varepsilon + b^+a$"],
      ["2", "$b^* + b^*a(b^+a)^*b^+$", "$b^*a(b^+a)^*$", "$(b^+a)^*b^+$", "$(b^+a)^*$"],
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Egy cella kiszámolása: $E^2_{1,2} = E^1_{1,2} + E^1_{1,2}(E^1_{2,2})^*E^1_{2,2} = b^*a + b^*a(\\varepsilon + b^+a)^*(\\varepsilon + b^+a) = b^*a(b^+a)^*$. Itt a 8-as azonosságot ($(\\varepsilon + P)^* = P^*$) és azt használtuk, hogy $P^*P \\subseteq P^*$. Tehát $L(G) = b^*a(b^+a)^*$: ezek pont azok a szavak, amik $a$-ra végződnek, és nincs bennük $aa$.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "Ez a módszer helyes, de a kifejezések nagyon gyorsan elszállnak. Minden lépésnél egyszerűsíts az azonosságokkal, különben a $k = 3$-as táblázatot már egy oldalra sem tudod leírni. Zh-n a hibák többsége is innen jön, nem a képletből.",
    },
  },
  {
    type: "funfact",
    text: {
      hu: "Ha láttál már Floyd–Warshall algoritmust (összes pár legrövidebb útja), az $E^k_{i,j}$ képlet ismerős lehet: ott is $k$-ról $k$-ra engedjük meg, hogy az utak egy újabb csúcson menjenek át. Ugyanaz a dinamikus programozás, csak távolságok helyett nyelvekkel, a minimum helyett unióval, az összeadás helyett konkatenációval.",
    },
  },
];
