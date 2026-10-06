import type { ContentBlock } from "../../types/content";

export const theory: ContentBlock[] = [
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Grammatika",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Eddig a nyelveket úgy adtuk meg, hogy leírtuk, milyen szavak vannak bennük. A grammatika ezt megfordítja: nem felsorolja a szavakat, hanem a receptet adja meg, amivel legyártjuk őket. Van egy kezdőszimbólum, meg egy rakás átírási szabály, és addig írogatunk, amíg csak terminális betűk maradnak.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Grammatika",
    },
    content: {
      hu: "A $G = \\langle N, \\Sigma, P, S \\rangle$ rendezett négyest (generatív) grammatikának nevezzük, ha $N$ és $\\Sigma$ diszjunkt véges ábécék ($N \\cap \\Sigma = \\emptyset$), $S \\in N$ a kezdőszimbólum, $P$ pedig $x \\to y$ alakú szabályok véges halmaza, ahol $x, y \\in (N \\cup \\Sigma)^*$ és $x$ tartalmaz legalább egy nemterminálist.",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "$N$ elemei a nemterminálisok (ezeket konvenció szerint nagybetűvel írjuk: $S, A, B, \\dots$). Ezek a „még kifejtendő” részek." },
      { hu: "$\\Sigma$ elemei a terminálisok (kisbetűk: $a, b, \\dots$). Ezekből áll a kész szó." },
      { hu: "$P$ elemei a szabályok (átírási szabályok, produkciók)." },
      { hu: "$S$ a kezdőszimbólum, minden levezetés innen indul." },
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Az, hogy a bal oldalon kell lennie nemterminálisnak, tömören így is írható: $x \\in (N \\cup \\Sigma)^* N (N \\cup \\Sigma)^*$. Ez pontosan $(N \\cup \\Sigma)^* - \\Sigma^*$, vagyis bármi, ami nem csupa terminális.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "Ez az egyetlen megkötés! A bal oldal lehet hosszú, tartalmazhat terminálist is, a jobb oldal lehet akár $\\varepsilon$ is. Csak csupa terminálisból álló bal oldal tilos. Ha ilyet látsz, az nem grammatika.",
    },
  },
  {
    type: "example",
    content: {
      hu: "$G_1 = \\langle \\{S, A, B\\}, \\{a, b, c\\}, \\{S \\to c,\\ S \\to AB,\\ A \\to aA,\\ B \\to \\varepsilon,\\ abb \\to aSb\\}, S \\rangle$ nem grammatika, mert az $abb \\to aSb$ szabály bal oldalán nincs nemterminális.",
    },
  },
  {
    type: "example",
    content: {
      hu: "$G_2 = \\langle \\{S, A, B, C\\}, \\{a, b, c\\}, \\{S \\to a,\\ S \\to AB,\\ A \\to Ab,\\ B \\to \\varepsilon,\\ aCA \\to aSc\\}, S \\rangle$ viszont grammatika. Az $aCA \\to aSc$ furcsán néz ki, de a bal oldalán ott a $C$ (meg az $A$), szóval rendben van.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Rövidítés: ha $\\alpha \\to \\beta$ és $\\alpha \\to \\gamma$ is szabály, akkor tömören $\\alpha \\to \\beta \\mid \\gamma$-t írunk.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Levezetés",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Egy lépés",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Közvetlen (egylépéses) levezetés",
    },
    content: {
      hu: "Legyen $u, v \\in (N \\cup \\Sigma)^*$. Azt mondjuk, hogy $v$ egy lépésben levezethető $u$-ból, jelölése $u \\Rightarrow_G v$, ha $u = u_1 x u_2$ és $v = u_1 y u_2$ valamilyen $u_1, u_2 \\in (N \\cup \\Sigma)^*$ szavakra és $x \\to y \\in P$ szabályra.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Magyarul: keresel az $u$ szóban egy részszót, ami valamelyik szabály bal oldala, és kicseréled a jobb oldalára. A környezet ($u_1$ és $u_2$) közben érintetlen marad. Ha egyértelmű, melyik grammatikáról van szó, a $G$ indexet elhagyjuk.",
    },
  },
  {
    type: "example",
    content: {
      hu: "A fenti $G_2$-ben: $BBaCAa \\Rightarrow BBaSca$ (az $aCA \\to aSc$ szabállyal), $ABB \\Rightarrow AbBB$ (az $A \\to Ab$-vel), és $BB \\Rightarrow B$ (a $B \\to \\varepsilon$-nal).",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Több lépés",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Többlépéses levezetés",
    },
    content: {
      hu: "$u$-ból levezethető $v$, jelölése $u \\Rightarrow_G^* v$, ha $u = v$, vagy van olyan $n \\geq 1$ és $w_0, \\dots, w_n \\in (N \\cup \\Sigma)^*$, hogy $w_0 = u$, $w_n = v$ és $w_{i-1} \\Rightarrow_G w_i$ minden $1 \\leq i \\leq n$-re.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Vagyis egymás után akárhány (akár nulla!) egylépéses levezetést fűzhetsz.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Mondatforma",
    },
    content: {
      hu: "A kezdőszimbólumból levezethető szavakat, vagyis az $S \\Rightarrow^* \\alpha$ teljesítő $\\alpha \\in (N \\cup \\Sigma)^*$ szavakat mondatformáknak nevezzük.",
    },
  },
  {
    type: "example",
    content: {
      hu: "$G_2$-ben $S \\Rightarrow AB \\Rightarrow AbB \\Rightarrow AbbB$, tehát $S \\Rightarrow^* AbbB$, azaz $AbbB$ egy mondatforma.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "A mondatformában lehetnek még nemterminálisok! Mondatforma nem ugyanaz, mint a generált nyelv egy szava. Maga az $S$ is mondatforma (nulla lépéssel).",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Generált nyelv",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Generált nyelv",
    },
    content: {
      hu: "A $G = \\langle N, \\Sigma, P, S \\rangle$ grammatika által generált nyelv: $L(G) := \\{w \\in \\Sigma^* \\mid S \\Rightarrow_G^* w\\}$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Tehát a generált nyelvbe azok a mondatformák kerülnek, amikben már egyetlen nemterminális sincs. Ha egy levezetés elakad (marad benne nemterminális, de már egyik szabály sem alkalmazható), az zsákutca, abból nem lesz szó.",
    },
  },
  {
    type: "example",
    content: {
      hu: "$G_1$: $N = \\{S\\}$, $\\Sigma = \\{a, b\\}$, $P = \\{S \\to aSb,\\ S \\to ab,\\ S \\to ba\\}$. Ekkor $L(G_1) = \\{a^n ab\\, b^n, a^n ba\\, b^n \\mid n \\geq 0\\}$. Indoklás: minden mondatformában legfeljebb egy nemterminális van, és $n$-szer alkalmazva az első szabályt $a^nSb^n$-t kapunk (indukció: $a^nSb^n \\Rightarrow a^{n+1}Sb^{n+1}$). Ezután a második vagy a harmadik szabály lezárja a levezetést.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Egy komolyabb példa",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Legyen $G_2$ szabályrendszere $S \\to ASB \\mid \\varepsilon$, $AB \\to BA$, $BA \\to AB$, $A \\to a$, $B \\to b$. Ez pont azokat a szavakat generálja, amikben ugyanannyi $a$ van, mint $b$. Az ötlet: $S$-ből párban gyártunk $A$-kat és $B$-ket, a két cserélgető szabállyal tetszőleges sorrendbe rakjuk őket, végül kisbetűsítünk.",
    },
  },
  {
    type: "example",
    content: {
      hu: "$S \\Rightarrow^* AAABBB \\Rightarrow^* BBAABA \\Rightarrow^* bbaaba$ (gyártás, keverés, kisbetűsítés).",
    },
  },
  {
    type: "proof",
    content: [
      {
        type: "list",
        ordered: false,
        items: [
          {
            hu: "$\\subseteq$: minden mondatformára $N_a + N_A = N_b + N_B$ (ahol $N_t$ a $t$ betűk száma). $S$-re ez $0 = 0$, és egyik szabály sem rontja el. A kész szóban nincs nagybetű, tehát $N_a = N_b$.",
          },
          {
            hu: "$\\supseteq$: $n$ darab $a$-t és $b$-t tartalmazó szóhoz $n$-szer $S \\to ASB$, majd $S \\to \\varepsilon$ ad $A^nB^n$-t. Cserékkel kirakjuk a célszó sorrendjét, aztán kisbetűsítünk.",
          },
        ],
      },
      {
        type: "funfact",
        text: {
          hu: "Ez a minta szinte mindig működik: a $\\subseteq$ irányra invariáns (amit $S$ teljesít és egyik szabály sem ront el), a $\\supseteq$ irányra levezetési stratégia.",
        },
      },
    ],
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Grammatikák ekvivalenciája",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Minden grammatika pontosan egy nyelvet generál, de fordítva ez nem igaz: ugyanazt a nyelvet rengeteg különböző grammatika is generálhatja.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Ekvivalens grammatikák",
    },
    content: {
      hu: "A $G_1$ és $G_2$ grammatikák ekvivalensek, ha $L(G_1) = L(G_2)$.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Gyengén ekvivalens nyelvek",
    },
    content: {
      hu: "Az $L_1$ és $L_2$ nyelvek gyengén ekvivalensek, ha legfeljebb az $\\varepsilon$-ban térnek el: $(L_1 - L_2) \\cup (L_2 - L_1) \\subseteq \\{\\varepsilon\\}$. Két grammatika gyengén ekvivalens, ha gyengén ekvivalens nyelveket generál.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Hogy miért kell külön fogalom arra, ha csak az $\\varepsilon$-ban térnek el? Mert az $\\varepsilon$ sok helyen kilóg a sorból (lásd a Chomsky-osztályozásnál a korlátozott $\\varepsilon$-szabályt), és gyakran kényelmesebb azt mondani, hogy „az $\\varepsilon$-t most hagyjuk, majd a végén külön kezeljük”.",
    },
  },
  {
    type: "example",
    content: {
      hu: "Az előző $G_2$ nyelvét (jelölje $L_{EQ}$) egy jóval egyszerűbb grammatika is generálja: $S \\to SS \\mid aSb \\mid bSa \\mid \\varepsilon$. Itt minden bal oldal egyetlen nemterminális, ami később nagyon fontos lesz.",
    },
  },
  {
    type: "proof",
    content: [
      {
        type: "list",
        ordered: false,
        items: [
          {
            hu: "$\\subseteq$: minden szabály vagy semennyit, vagy egy $a$-t és egy $b$-t ad hozzá, így minden mondatforma kiegyensúlyozott.",
          },
          {
            hu: "$\\supseteq$: indukció a hosszra. Ha $w = aw'b$ (vagy $bw'a$), akkor $S \\Rightarrow aSb \\Rightarrow^* aw'b$. Ha $w$ ugyanazzal a betűvel kezdődik és végződik, akkor $w = uv$ két nemüres $L_{EQ}$-beli szóra, és $S \\Rightarrow SS \\Rightarrow^* uv$.",
          },
        ],
      },
      {
        type: "funfact",
        text: {
          hu: "Miért vágható szét? Számold balról, hogy „$a$-k mínusz $b$-k”. $w = a\\dots a$ esetén az első betű után $+1$, az utolsó előtt $-1$, tehát közben átmegy a $0$-n. Ott vágunk.",
        },
      },
    ],
  },
  {
    type: "warning",
    text: {
      hu: "Az, hogy két grammatika ránézésre teljesen más, semmit nem mond arról, hogy ekvivalensek-e. Bizonyítani mindig a generált nyelvek egyenlőségét kell, mindkét irányban.",
    },
  },
];
