import type { ContentBlock } from "../../types/content";

export const theory: ContentBlock[] = [
  {
    type: "heading",
    level: 1,
    text: {
      hu: "A szóprobléma",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Adott egy $G = \\langle N, \\Sigma, P, S \\rangle$ környezetfüggetlen grammatika és egy $u \\in \\Sigma^*$ szó. A kérdés: $u \\in L(G)$? Ez a szóprobléma. Reguláris grammatikára már láttunk rá lineáris algoritmust, most a környezetfüggetlen esetet nézzük.",
    },
  },
  {
    type: "theorem",
    kind: "allitas",
    statement: {
      hu: "A környezetfüggetlen grammatikák szóproblémája eldönthető.",
    },
    proof: {
      hu: "Hozzuk $G$-t Chomsky-normálformára, ez algoritmikusan megy. Ha $u = \\varepsilon$, akkor $u \\in L(G) \\iff S \\to \\varepsilon \\in P$. Ha $|u| = n \\geq 1$, akkor $u$ minden levezetése pontosan $n - 1$ darab $A \\to BC$ és $n$ darab $A \\to a$ alakú szabályalkalmazásból áll. Rögzített grammatika és $n$ mellett ilyen levezetésből csak véges sok van, ezeket mind végignézve eldönthető, hogy $u \\in L(G)$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Ez a módszer helyes, de a levezetések száma exponenciálisan nő $n$-nel, a gyakorlatban használhatatlan. A levezetéseket viszont nem kell egyenként felsorolni: elég alulról felfelé, a rövid részszavaktól a hosszabbak felé haladva feljegyezni, hogy melyik részszó melyik nemterminálisból vezethető le. Ez a dinamikus programozás ötlete, és pontosan ezt csinálja a CYK algoritmus.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "CYK algoritmus",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A nevét kitalálóiról, John Cocke-ról, Daniel Youngerről és Tadao Kasamiról kapta.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Cocke–Younger–Kasami (CYK) algoritmus",
    },
    content: {
      hu: "Bemenet: egy Chomsky-normálformájú $G = \\langle N, \\Sigma, P, S \\rangle$ grammatika és egy $u = t_1 \\cdots t_n$ szó ($t_i \\in \\Sigma$, $n \\geq 1$). Kimenet: $u \\in L(G)$? Az algoritmus $H_{i,j}$ halmazokat számol ki ($1 \\leq i \\leq j \\leq n$), $j - i$ szerint növekvő sorrendben:",
    },
  },
  {
    type: "formula",
    latex: "H_{i,i} := \\{ A \\mid A \\to t_i \\in P \\}",
  },
  {
    type: "formula",
    latex: "H_{i,j} := \\{ A \\mid A \\to BC \\in P,\\ B \\in H_{i,h},\\ C \\in H_{h+1,j} \\text{ valamely } i \\leq h < j \\text{-re} \\} \\quad (i < j)",
  },
  {
    type: "paragraph",
    text: {
      hu: "A válasz: $u \\in L(G) \\iff S \\in H_{1,n}$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Szavakban: $H_{i,j}$ azoknak a nemterminálisoknak a halmaza, amelyekből a $t_i \\cdots t_j$ részszó levezethető. Egy betűt csak $A \\to a$ szabály tud előállítani, ezért $H_{i,i}$-hez elég átnézni ezeket. Egy legalább két hosszú részszót pedig az első lépés $A \\to BC$ alakú szabálya két darabra vág: $B$ vezeti le az elejét, $C$ a végét. A vágás helye ($h$) bárhol lehet, ezért minden lehetséges vágást kipróbálunk, és a két darabhoz tartozó halmazokat már korábban kiszámoltuk, mert rövidebbek.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "A táblázat",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A halmazokat háromszög alakú táblázatba szokás írni. Legalul a szó betűi állnak, fölöttük az első sorban a $H_{i,i}$ halmazok, a második sorban a $H_{i,i+1}$ halmazok, és így tovább; a csúcson egyetlen cella van, a $H_{1,n}$. A $k$-adik sorban tehát a $k$ hosszú részszavakhoz tartozó halmazok állnak, $n - k + 1$ darab.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Egy $H_{i,j}$ cella kitöltéséhez párokat kell képezni: a $t_i \\cdots t_j$ részszó minden kettévágásánál a bal darab halmazának minden elemét párosítjuk a jobb darab halmazának minden elemével, és megnézzük, melyik párból lesz valamely $A \\to BC$ szabály jobboldala. A táblázatban ez úgy néz ki, hogy a cella alatt balra lefelé és jobbra lefelé haladó két átlót párosítjuk össze: a bal átló legalsó elemét a jobb átló legfelsőjével, a bal átló második elemét a jobb átló másodikával, és így tovább.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "A párosítás sorrendje számít: $\\{A, X\\}\\{B\\} = \\{AB, XB\\}$, és ebből nem lesz $BA$. A bal darab nemterminálisa mindig a szabály jobboldalának első betűje.",
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
    title: {
      hu: "aabbcc",
    },
    content: {
      hu: "Legyen $G$ a következő Chomsky-normálformájú grammatika, $S$ a kezdőszimbólum: $S \\to AB \\mid BC$, $A \\to XA \\mid a$, $X \\to a$, $C \\to YC \\mid c$, $Y \\to c$, $B \\to UV \\mid VW \\mid XS$, $U \\to XX$, $W \\to YY \\mid XS$, $V \\to ZZ$, $Z \\to b$. Döntsük el, hogy $aabbcc \\in L(G)$!",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Az első sor a betűkből jön: $a$-t $A$ és $X$ vezeti le, $b$-t $Z$, $c$-t $Y$ és $C$. A második sorban például $H_{1,2}$-höz a $\\{A, X\\}\\{A, X\\} = \\{AA, AX, XA, XX\\}$ párokat nézzük, ebből $XA$ az $A$, $XX$ az $U$ jobboldala, tehát $H_{1,2} = \\{A, U\\}$. A $H_{1,4}$ cellánál már három vágás van: $\\{A, X\\}\\{\\,\\}$, $\\{A, U\\}\\{V\\}$ és $\\{\\,\\}\\{Z\\}$; ezek közül csak az $UV$ pár ad valamit, $B$-t.",
    },
  },
  {
    type: "table",
    headers: ["hossz", "1", "2", "3", "4", "5", "6"],
    rows: [
      ["6", "$\\{S, B, W\\}$", "", "", "", "", ""],
      ["5", "$\\{S\\}$", "$\\{S\\}$", "", "", "", ""],
      ["4", "$\\{B\\}$", "$\\{\\,\\}$", "$\\{B\\}$", "", "", ""],
      ["3", "$\\{\\,\\}$", "$\\{\\,\\}$", "$\\{\\,\\}$", "$\\{\\,\\}$", "", ""],
      ["2", "$\\{A, U\\}$", "$\\{\\,\\}$", "$\\{V\\}$", "$\\{\\,\\}$", "$\\{C, W\\}$", ""],
      ["1", "$\\{A, X\\}$", "$\\{A, X\\}$", "$\\{Z\\}$", "$\\{Z\\}$", "$\\{Y, C\\}$", "$\\{Y, C\\}$"],
      ["", "$a$", "$a$", "$b$", "$b$", "$c$", "$c$"],
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "A $k$ hosszú sor $i$-edik oszlopában a $H_{i,i+k-1}$ halmaz áll. A csúcson $H_{1,6} = \\{S, B, W\\}$: az $\\{A, U\\}\\{B\\}$ vágásból $AB$ miatt $S$, a $\\{B\\}\\{C, W\\}$ vágásból $BC$ miatt szintén $S$, az $\\{A, X\\}\\{S\\}$ vágásból $XS$ miatt $B$ és $W$ kerül bele. Mivel $S \\in H_{1,6}$, ezért $aabbcc \\in L(G)$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A táblázatból egy levezetés is visszafejthető: a csúcsból indulva minden cellánál megkeressük azt a vágást és szabályt, amelyik a nemterminálist oda tette. Például $S \\Rightarrow AB \\Rightarrow XAB \\Rightarrow XAVW \\Rightarrow XAZZW \\Rightarrow XAZZYY \\Rightarrow^* aabbcc$.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "Az algoritmus csak Chomsky-normálformájú grammatikára működik: egy $A \\to aB$ vagy $A \\to BCD$ szabályt a fenti képletek egyszerűen nem vesznek észre. Más alakú grammatikát előbb normálformára kell hozni. Az üres szót sem a táblázat dönti el: $\\varepsilon \\in L(G) \\iff S \\to \\varepsilon \\in P$.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Helyesség",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    statement: {
      hu: "Minden $1 \\leq i \\leq j \\leq n$ esetén $H_{i,j} = \\{ X \\in N \\mid X \\Rightarrow_G^* t_i \\cdots t_j \\}$.",
    },
    proof: {
      hu: "$(j - i)$ szerinti teljes indukcióval. Ha $j = i$, akkor $t_i$ csak egy $X \\to t_i$ szabállyal vezethető le, ez éppen $H_{i,i}$ definíciója. Legyen most $i < j$, és tegyük fel, hogy az állítás minden rövidebb részszóra igaz. Ha $X \\Rightarrow^* t_i \\cdots t_j$, akkor a szó legalább két hosszú, így a levezetés első lépése $X \\Rightarrow YZ$ valamely $Y, Z \\in N$-re, és van olyan $i \\leq h < j$, hogy $Y \\Rightarrow^* t_i \\cdots t_h$ és $Z \\Rightarrow^* t_{h+1} \\cdots t_j$. Mindkét darab rövidebb, így az indukciós feltevés szerint $Y \\in H_{i,h}$ és $Z \\in H_{h+1,j}$, tehát $X \\in H_{i,j}$. Fordítva, ha $X \\in H_{i,j}$, akkor van olyan $h$ és $X \\to YZ \\in P$, hogy $Y \\in H_{i,h}$, $Z \\in H_{h+1,j}$, és az indukciós feltevés szerint $X \\Rightarrow YZ \\Rightarrow^* t_i \\cdots t_h Z \\Rightarrow^* t_i \\cdots t_j$.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Bonyolultság",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A táblázatnak $n(n+1)/2$ cellája van, egy cellánál legfeljebb $n - 1$ vágást kell nézni, egy vágásnál pedig a szabályokat kell végignézni. Ha $|G|$ a grammatika mérete (a szabályok bal- és jobboldalának összhossza), akkor a CYK algoritmus lépésszáma nagyságrendileg $|G| \\cdot n^3$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Tetszőleges környezetfüggetlen grammatikánál ehhez hozzájön a Chomsky-normálformára hozás, amely legfeljebb $|G|^2$ méretű grammatikát állít elő. Így a szóprobléma nagyságrendileg $|G|^2 \\cdot n^3$ lépésben eldönthető, ami polinomiális, tehát hatékony.",
    },
  },
  {
    type: "funfact",
    text: {
      hu: "A CYK nem csak eldönti a szóproblémát: a táblázat az összes levezetési fát tömörítve tartalmazza. Ha egy cellába ugyanaz a nemterminális két különböző vágásból is bekerülhet, akkor a szónak egynél több levezetési fája van, vagyis a grammatika nem egyértelmű. A példában ez a csúcson történik: $S$ az $AB$ és a $BC$ vágásból is bekerül.",
    },
  },
];
