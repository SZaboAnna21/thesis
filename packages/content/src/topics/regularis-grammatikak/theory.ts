import type { ContentBlock } from "../../types/content";

export const theory: ContentBlock[] = [
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Lineáris grammatikák",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A 3-as típusú grammatikáról eddig annyit tudunk, hogy a szabályok jobb oldalán legfeljebb egy nemterminális lehet, és az is csak a legvégén. Most megnézzük, mi van, ha ezt a szabályt lazítjuk: hova kerülhet az az egy nemterminális, és mit nyerünk vagy veszítünk vele.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Lineáris grammatika",
    },
    content: {
      hu: "Egy $G = \\langle N, \\Sigma, P, S \\rangle$ környezetfüggetlen grammatika lineáris, ha minden szabálya vagy $A \\to u$ alakú ($u \\in \\Sigma^*$), vagy $A \\to u_1Bu_2$ alakú, ahol $A, B \\in N$ és $u_1, u_2 \\in \\Sigma^*$. $G$ bal-lineáris, ha minden második típusú szabályában $u_1 = \\varepsilon$ (a nemterminális a bal szélen áll), és jobb-lineáris, ha mindegyikben $u_2 = \\varepsilon$ (a nemterminális a jobb szélen áll).",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Emberi nyelven: minden mondatformában legfeljebb egy nemterminális van, egy „kurzor”, ami körül épül a szó. Lineárisnál a kurzor bárhol lehet, bal-lineárisnál a szó elején ül és balra írunk elé, jobb-lineárisnál a végén ül és jobbra írunk utána.",
    },
  },
  {
    type: "table",
    headers: ["Grammatika", "Típus"],
    rows: [
      ["$S \\to aSb \\mid \\varepsilon$", "lineáris, de se nem bal-, se nem jobb-lineáris"],
      ["$S \\to Saa \\mid b$", "bal-lineáris"],
      ["$S \\to aS \\mid bbS \\mid c$", "jobb-lineáris"],
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Vedd észre: a jobb-lineáris grammatika pont a 3-as típusú grammatika, csak más néven. Ugyanígy a jobb-lineáris nyelvek pontosan a reguláris nyelvek. Egy nyelv lineáris, bal-lineáris, illetve jobb-lineáris, ha van ilyen grammatika, ami generálja.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "Ne keverd a kettőt egy grammatikán belül! Ha egyes szabályok bal-, mások jobb-lineárisak, akkor a grammatika csak lineáris, és már nem garantált, hogy reguláris nyelvet generál. Például $S \\to aA \\mid \\varepsilon$ (jobb-lineáris) és $A \\to Sb$ (bal-lineáris) együtt az $\\{a^nb^n \\mid n \\ge 0\\}$ nyelvet adja, ami nem reguláris.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Bal-lineáris = jobb-lineáris",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    statement: {
      hu: "Minden bal-lineáris grammatika reguláris (3-as típusú) nyelvet generál.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Az ötlet: egy bal-lineáris levezetés jobbról balra építi a szót. A végén áll az első legenerált darab, az elején az utolsó. Ha a levezetést megfordítjuk, és a szót balról jobbra építjük, pont egy jobb-lineáris levezetést kapunk. A nemterminálisok „láncát” kell csak fordított irányban bejárni.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Legyen $G$ bal-lineáris, $N = \\{S, A_1, \\dots, A_n\\}$. Feltehetjük, hogy $S$ egyetlen jobb oldalon sem szerepel (ha mégis, nevezzük át ott $S'$-re, és vegyük fel az $S \\to S'$ szabályt). Az új, jobb-lineáris $G'$ szabályai a régiekből így jönnek ($u \\in \\Sigma^*$):",
    },
  },
  {
    type: "table",
    headers: ["Ha $G$-ben van…", "akkor $G'$-be ezt tesszük"],
    rows: [
      ["$S \\to u$", "$S \\to u$"],
      ["$A_k \\to u$", "$S \\to uA_k$"],
      ["$A_k \\to A_ju$", "$A_j \\to uA_k$"],
      ["$S \\to A_ju$", "$A_j \\to u$"],
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Megjegyezni így érdemes: a szerepek megfordulnak. Ami $G$-ben a levezetés vége volt ($A_k \\to u$, nincs több nemterminális), az $G'$-ben az eleje lesz (közvetlenül $S$-ből indul). Ami $G$-ben az eleje volt ($S \\to A_ju$), az $G'$-ben a vége. A középső szabályoknál pedig a nyíl „megfordul”: $A_k$-ból $A_j$-be ment, most $A_j$-ből megy $A_k$-ba.",
    },
  },
  {
    type: "proof",
    title: {
      hu: "Miért ugyanaz a nyelv?",
    },
    content: [
      {
        type: "paragraph",
        text: {
          hu: "Ha $S \\to w \\in P$, akkor $S \\to w \\in P'$, kész. Különben $w$-nek van egy $S \\Rightarrow A_{i_1}w_1 \\Rightarrow A_{i_2}w_2w_1 \\Rightarrow \\dots \\Rightarrow A_{i_{m-1}}w_{m-1} \\cdots w_1 \\Rightarrow w_m w_{m-1} \\cdots w_1 = w$ levezetése $G$-ben. A táblázat alapján ehhez $G'$-ben tartozik az $S \\Rightarrow w_mA_{i_{m-1}} \\Rightarrow w_mw_{m-1}A_{i_{m-2}} \\Rightarrow \\dots \\Rightarrow w_m \\cdots w_2A_{i_1} \\Rightarrow w_m \\cdots w_1 = w$ levezetés. Ugyanaz a lánc, csak visszafelé járjuk be. A másik irány szimmetrikus.",
        },
      },
    ],
  },
  {
    type: "example",
    title: {
      hu: "Átalakítás lépésről lépésre",
    },
    content: {
      hu: "Az $L = \\{a^nb^k \\mid n, k \\ge 0\\}$ nyelvet generálja a bal-lineáris $S \\to \\varepsilon \\mid A_1b \\mid A_2a$, $A_1 \\to A_1b \\mid A_2$, $A_2 \\to A_2a \\mid \\varepsilon$. A táblázat szerint a jobb-lineáris változat: $S \\to \\varepsilon \\mid A_2$, $A_1 \\to b \\mid bA_1$, $A_2 \\to a \\mid aA_2 \\mid A_1$. Nézzük az $ab$ szót. Az eredetiben: $S \\Rightarrow A_1b \\Rightarrow A_2b \\Rightarrow A_2ab \\Rightarrow ab$. Az újban: $S \\Rightarrow A_2 \\Rightarrow aA_2 \\Rightarrow aA_1 \\Rightarrow ab$. Ugyanazokon a nemterminálisokon megyünk át, csak fordított sorrendben.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Tükrözés",
    },
  },
  {
    type: "theorem",
    kind: "allitas",
    statement: {
      hu: "Minden jobb-lineáris $G$ grammatikához van olyan bal-lineáris $G'$, ami $L(G)$ tükörképét generálja.",
    },
    proof: {
      hu: "Fordítsunk meg minden jobb oldalt: $A \\to u$ helyett $A \\to u^R$, $A \\to uB$ helyett $A \\to Bu^R$. Ahol eddig jobbra írtunk, most balra írunk, és pont a tükörkép jön ki.",
    },
  },
  {
    type: "theorem",
    kind: "kovetkezmeny",
    statement: {
      hu: "1. $\\mathcal{L}_3$ zárt a tükrözésre. 2. Minden reguláris nyelv generálható bal-lineáris grammatikával.",
    },
    proof: {
      hu: "1. Ha $L \\in \\mathcal{L}_3$, akkor az állítás szerint $L^R$-et generálja egy bal-lineáris grammatika, a tétel szerint tehát $L^R \\in \\mathcal{L}_3$. 2. Ha $L \\in \\mathcal{L}_3$, akkor az 1. pont miatt $L^R$ is az, vagyis van rá jobb-lineáris grammatika. Az állítást erre alkalmazva $(L^R)^R = L$-et egy bal-lineáris grammatika generálja.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Összefoglalva: a reguláris nyelveket mindegy, hogy bal- vagy jobb-lineáris grammatikával írod le, ugyanazt az osztályt kapod. Csak a kettőt ne keverd.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "A 3-as normálforma",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Egy 3-as típusú grammatika szabályai elég vadak lehetnek: $A \\to abbaB$, $A \\to B$, $A \\to aab$. Bizonyításokhoz (és később a véges automatákhoz) sokkal kényelmesebb, ha minden lépés pontosan egy betűt ír ki. Erre való a normálforma.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "3-as normálforma",
    },
    content: {
      hu: "A $G = \\langle N, \\Sigma, P, S \\rangle$ grammatika 3-as normálformájú, ha minden szabálya $X \\to aY$ ($X, Y \\in N$, $a \\in \\Sigma$) vagy $X \\to \\varepsilon$ ($X \\in N$) alakú.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Vagyis: vagy kiírunk egy betűt és továbblépünk egy nemterminálisba, vagy megállunk. Ha ez ismerősen hangzik, nem véletlen: pont így működik egy véges automata is (állapot, betű, új állapot, elfogadó állapot).",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    statement: {
      hu: "Minden reguláris nyelv generálható 3-as normálformájú grammatikával.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Az átalakítás két lépésből áll. A kiinduló szabályok $A \\to uB$ vagy $A \\to u$ alakúak ($u \\in \\Sigma^*$).",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "1. lépés: hosszredukció",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "$A \\to a_1 \\cdots a_nB$, $n \\ge 2$: szedjük szét betűnként új, csak ehhez a szabályhoz tartozó $Z_1, \\dots, Z_{n-1}$ nemterminálisokkal: $A \\to a_1Z_1,\\ Z_1 \\to a_2Z_2,\\ \\dots,\\ Z_{n-1} \\to a_nB$." },
      { hu: "$A \\to a_1 \\cdots a_m$, $m \\ge 1$: ugyanígy, csak a végén egy közös $E$ nemterminálisba futunk, amiből leállunk: $A \\to a_1Y_1,\\ \\dots,\\ Y_{m-1} \\to a_mE$, és $E \\to \\varepsilon$. Az $E$-ből elég egy darab az egész grammatikára." },
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Ez nem változtat a nyelven: a régi hosszú szabályt eljátsszuk a rövidekkel. Mivel a $Z_i$-k szabályonként egyediek, nem lehet „összekeverni” két hosszú szabály darabjait, így új szó sem keletkezik.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Ezután minden szabály $X \\to aY$, $X \\to \\varepsilon$ vagy $X \\to Y$ alakú. Az utolsó a láncszabály, ezektől kell még megszabadulni.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "2. lépés: láncmentesítés",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Minden $A$-ra kiszámoljuk, hova juthatunk el belőle csak láncszabályokkal: $H(A) = \\{B \\in N \\mid A \\Rightarrow^* B\\}$. Ezt rétegenként építjük:",
    },
  },
  {
    type: "formula",
    latex: "H_0(A) = \\{A\\}, \\qquad H_{i+1}(A) = H_i(A) \\cup \\{B \\mid \\exists C \\in H_i(A) : C \\to B \\in P\\}",
  },
  {
    type: "paragraph",
    text: {
      hu: "A sorozat nő, de $N$ véges, így egyszer megáll. Ez lesz $H(A)$. Ezután a láncszabályokat kidobjuk, és mindenki örökli azoknak a nem-lánc szabályait, akiket láncon el tud érni: $P' = \\{A \\to w \\mid \\exists B \\in H(A) : B \\to w \\in P\\} \\setminus \\{\\text{láncszabályok}\\}$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Egy levezetésben a láncszabályok sorozatát ($A \\Rightarrow^* B$) és az utána jövő $B \\to w$ lépést most egyetlen $A \\to w$ lépés helyettesíti. Visszafelé ugyanez: minden új szabály egy lánc plusz egy régi szabály. A nyelv tehát nem változik.",
    },
  },
  {
    type: "example",
    title: {
      hu: "Teljes példa",
    },
    content: {
      hu: "Kiindulás: $S \\to abS \\mid B$, $B \\to bB \\mid V$, $V \\to aa \\mid b$. Hosszredukció után: $S \\to aZ_1 \\mid B$, $Z_1 \\to bS$, $B \\to bB \\mid V$, $V \\to aZ_2 \\mid bE$, $Z_2 \\to aE$, $E \\to \\varepsilon$. A láncok: $H(S) = \\{S, B, V\\}$, $H(B) = \\{B, V\\}$, a többinél csak önmaga. Láncmentesítés után: $S \\to aZ_1 \\mid bB \\mid aZ_2 \\mid bE$, $B \\to bB \\mid aZ_2 \\mid bE$, $V \\to aZ_2 \\mid bE$, $Z_1 \\to bS$, $Z_2 \\to aE$, $E \\to \\varepsilon$. Minden szabály $X \\to aY$ vagy $X \\to \\varepsilon$ alakú.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "Ne felejtsd el: a láncszabályokat ki kell dobni, nem elég az új szabályokat hozzáadni! Láncmentesítés után egyes nemterminálisok elérhetetlenné válhatnak (a példában a $V$-be már semmi nem visz). Ezeket el lehet hagyni, de nem kötelező, a nyelv nem változik tőlük.",
    },
  },
  {
    type: "funfact",
    text: {
      hu: "A gyakorlatban a reguláris grammatikák leginkább a fordítóprogramok lexikális elemzőjében (lexer) bukkannak fel: azonosítók, számok, kulcsszavak felismerésére. Ott persze senki nem ír kézzel 3-as normálformát, hanem reguláris kifejezést, amiből egy eszköz automatát gyárt. Hogy ez miért működik, az a következő témák lényege.",
    },
  },
];
