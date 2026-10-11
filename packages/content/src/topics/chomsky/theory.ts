import type { ContentBlock } from "../../types/content";

export const theory: ContentBlock[] = [
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Grammatikák Chomsky-féle osztályozása",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Az általános grammatika annyira tág fogalom, hogy elsőre szinte megfoghatatlan. Mivel szinte bármit megenged, nem sok hasznos dolgot tudunk róla állítani. Ezért elkezdjük szép lassan megszorítani a szabályait. Ahogy egyre több feltételt vezetünk be, egyre szűkebb lesz a leírható nyelvek köre, viszont cserébe egyre jobban megértjük, mivel is van dolgunk.",
    },
  },
  {
    type: "definition",
    term: {
      hu: "$i$-típusú grammatika",
    },
    content: {
      hu: "A $G = \\langle N, \\Sigma, P, S \\rangle$ grammatika $i$-típusú ($i = 0, 1, 2, 3$), ha $P$ minden szabályára teljesül az alábbi feltétel:",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "$i = 0$: nincs korlátozás." },
      { hu: "$i = 1$: minden szabály $u_1Au_2 \\to u_1vu_2$ alakú, ahol $u_1, u_2, v \\in (N \\cup \\Sigma)^*$, $A \\in N$ és $v \\neq \\varepsilon$. Egyetlen kivétel megengedett: az $S \\to \\varepsilon$ szabály, de csak ha $S$ egyetlen szabály jobb oldalán sem fordul elő." },
      { hu: "$i = 2$: minden szabály $A \\to v$ alakú, ahol $A \\in N$ és $v \\in (N \\cup \\Sigma)^*$." },
      { hu: "$i = 3$: minden szabály $A \\to uB$ vagy $A \\to u$ alakú, ahol $A, B \\in N$ és $u \\in \\Sigma^*$." },
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Az $i$-típusú grammatikák osztályát $\\mathcal{G}_i$ jelöli.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Fordítsuk le emberi nyelvre. Az 1-es típusnál egyetlen $A$ nemterminálist cserélünk egy nemüres $v$ szóra, de csak akkor, ha körülötte ott van az $u_1$ és $u_2$ környezet (ami nem változik). A 2-esnél a bal oldalon egyedül áll egy nemterminális, környezet nélkül. A 3-asnál ráadásul a jobb oldalon is legfeljebb egy nemterminális lehet, és az is csak a legvégén.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "A korlátozott $\\varepsilon$-szabály (KES)",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Az 1-es típusú szabályok sosem rövidítenek, hiszen $v \\neq \\varepsilon$. Ez jó, de akkor az üres szót sosem tudnánk generálni. Ezért van a kiskapu: $S \\to \\varepsilon$ megengedett, ha $S$ sehol nem szerepel jobb oldalon. Így az $\\varepsilon$ csak úgy jöhet ki, hogy a legelső lépésben $S$-ből rögtön $\\varepsilon$-t csinálunk, és a levezetés közben semmi nem tűnhet el.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "A KES egy globális feltétel, nem egy szabályról szól, hanem a szabályok kapcsolatáról. Az $S \\to \\varepsilon$ önmagában rendben van, az $S \\to ASB$ is, de a kettő együtt megsérti a KES-t, mert $S$ jobb oldalon is előfordul.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "$\\mathcal{G}_3 \\subseteq \\mathcal{G}_2$, de $\\mathcal{G}_2 \\not\\subseteq \\mathcal{G}_1$! A 2-es és 3-as típusban bármelyik nemterminálisnak lehet $\\varepsilon$ jobb oldalú szabálya (pl. $A \\to \\varepsilon$), az 1-esben viszont nem. Ránézésre tehát csak ennyi igaz: $\\mathcal{G}_3 \\subseteq \\mathcal{G}_2 \\subseteq \\mathcal{G}_0$ és $\\mathcal{G}_1 \\subseteq \\mathcal{G}_0$.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Hogyan soroljunk be egy grammatikát?",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A recept: menj végig szabályonként, és nézd meg, melyik típusba „engedi” az adott szabály a grammatikát. A grammatika azokba a típusokba tartozik, amiket minden szabálya megenged. A végén külön ellenőrizd a KES-t.",
    },
  },
  {
    type: "example",
    content: {
      hu: "$N = \\{S, A, B\\}$, $\\Sigma = \\{a, b\\}$, $P = \\{S \\to ASB,\\ S \\to \\varepsilon,\\ AB \\to BA,\\ BA \\to AB,\\ A \\to a,\\ B \\to b\\}$.",
    },
  },
  {
    type: "table",
    headers: ["Szabály", "Megengedett típusok"],
    rows: [
      ["$S \\to ASB$", "0, 1•, 2"],
      ["$S \\to \\varepsilon$", "0, 1•, 2, 3"],
      ["$AB \\to BA$", "0"],
      ["$BA \\to AB$", "0"],
      ["$A \\to a$", "0, 1, 2, 3"],
      ["$B \\to b$", "0, 1, 2, 3"],
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "A • azt jelzi, hogy az első két szabály együtt sérti a KES-t. Az $AB \\to BA$ viszont már önmagában mindent kizár a 0-son kívül (nincs olyan felbontás, ahol egyetlen nemterminális cserélődik, a környezet meg marad). Tehát $G \\in \\mathcal{G}_0$, és $G \\notin \\mathcal{G}_1, \\mathcal{G}_2, \\mathcal{G}_3$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Összesen ezek az esetek fordulhatnak elő:",
    },
  },
  {
    type: "table",
    headers: ["Szabályok (lokálisan)", "KES", "Eredmény"],
    rows: [
      ["mind 3-as", "teljesül", "$\\mathcal{G}_3, \\mathcal{G}_2, \\mathcal{G}_1, \\mathcal{G}_0$"],
      ["mind 3-as", "nem teljesül", "$\\mathcal{G}_3, \\mathcal{G}_2, \\mathcal{G}_0$"],
      ["mind 2-es, van nem 3-as", "teljesül", "$\\mathcal{G}_2, \\mathcal{G}_1, \\mathcal{G}_0$"],
      ["mind 2-es, van nem 3-as", "nem teljesül", "$\\mathcal{G}_2, \\mathcal{G}_0$"],
      ["mind 1-es, van nem 2-es", "teljesül", "$\\mathcal{G}_1, \\mathcal{G}_0$"],
      ["mind 1-es, van nem 2-es", "nem teljesül", "csak $\\mathcal{G}_0$"],
      ["van nem 1-es", "mindegy", "csak $\\mathcal{G}_0$"],
    ],
  },
  {
    type: "warning",
    text: {
      hu: "Itt „lokálisan 1-es” azt jelenti, hogy a szabály alakja $u_1Au_2 \\to u_1vu_2$, vagy $S \\to \\varepsilon$. Egy $A \\to \\varepsilon$ szabály ($A \\neq S$) nem lokálisan 1-es, egy 2-es vagy 3-as grammatikában viszont teljesen legális.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Nyelvek Chomsky-féle osztályozása",
    },
  },
  {
    type: "definition",
    term: {
      hu: "$i$-típusú nyelv",
    },
    content: {
      hu: "$\\mathcal{L}_i := \\{L \\mid \\exists G \\in \\mathcal{G}_i : L = L(G)\\}$. Vagyis egy nyelv $i$-típusú, ha van olyan $i$-típusú grammatika, ami generálja.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "Ne keverd a grammatika típusát a nyelv típusával! Egy 0-típusú grammatika is generálhat 3-as típusú nyelvet. Például a fenti $AB \\to BA$-s grammatika csak 0-típusú, de ugyanazt a nyelvet egy 2-típusú grammatika ($S \\to SS \\mid aSb \\mid bSa \\mid \\varepsilon$) is generálja, tehát a nyelv 2-típusú. A nyelv típusa az, hogy létezik-e megfelelő grammatika, nem az, hogy épp milyet kaptál.",
    },
  },
  {
    type: "table",
    headers: ["Típus", "Grammatika neve", "Nyelvosztály neve"],
    rows: [
      ["0", "mondatszerkezetű (phrase-structure)", "rekurzívan felsorolható"],
      ["1", "környezetfüggő (context-sensitive)", "környezetfüggő"],
      ["2", "környezetfüggetlen (context-free)", "környezetfüggetlen"],
      ["3", "reguláris / véges állapotú", "reguláris"],
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "A nevek nem véletlenek. Környezetfüggő: az $A$-t csak az $u_1 \\_ u_2$ környezetben szabad lecserélni. Környezetfüggetlen: az $A$ bárhol, bármilyen környezetben cserélhető. Reguláris / véges állapotú: ezek pont a véges automatákkal vannak szoros kapcsolatban, erről később.",
    },
  },
  {
    type: "funfact",
    text: {
      hu: "Noam Chomsky amerikai nyelvész, a generatív nyelvtan elméletének megalkotója. Eredetileg emberi nyelvek szerkezetét akarta leírni, a programozási nyelvek és fordítóprogramok csak utána csaptak le az ötletre.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "A Chomsky-hierarchia",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    name: {
      hu: "Chomsky-féle nyelvhierarchia",
    },
    statement: {
      hu: "$\\mathcal{L}_3 \\subset \\mathcal{L}_2 \\subset \\mathcal{L}_1 \\subset \\mathcal{L}_0$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A grammatikák alakjából rögtön jön $\\mathcal{L}_3 \\subseteq \\mathcal{L}_2 \\subseteq \\mathcal{L}_0$ és $\\mathcal{L}_1 \\subseteq \\mathcal{L}_0$. Két dolog viszont egyáltalán nem nyilvánvaló, ezeket később bizonyítjuk:",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "$\\mathcal{L}_2 \\subseteq \\mathcal{L}_1$: a 2-es grammatikákban lehetnek $A \\to \\varepsilon$ szabályok, amik az 1-esben tilosak. Meg kell mutatni, hogy ezektől (a KES kivételével) meg lehet szabadulni." },
      { hu: "A tartalmazások valódiak: mindegyik szinten van olyan nyelv, ami a kisebb osztályba már nem fér bele. Például $L_{EQ}$ (egyenlő számú $a$ és $b$) 2-típusú, de nem 3-típusú." },
    ],
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Grammatikák a gyakorlatban: BNF",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Ha láttál már programozási nyelv szintaxisleírását, láttál környezetfüggetlen grammatikát. A BNF (Backus–Naur-forma, ALGOL 60) egy metanyelv szabályok leírására: a fogalmak a nemterminálisok, a $::=$ választja el a bal és jobb oldalt, a $|$ a „vagy”. Bal oldalon pontosan egy fogalom áll, tehát ez pont a 2-es típus.",
    },
  },
  {
    type: "example",
    content: {
      hu: "Azonosítók: $\\langle\\text{azonosító}\\rangle ::= \\langle\\text{betű}\\rangle \\mid \\langle\\text{betű}\\rangle\\langle\\text{azvég}\\rangle$, $\\langle\\text{azvég}\\rangle ::= \\langle\\text{betű}\\rangle \\mid \\langle\\text{számjegy}\\rangle \\mid \\langle\\text{betű}\\rangle\\langle\\text{azvég}\\rangle \\mid \\langle\\text{számjegy}\\rangle\\langle\\text{azvég}\\rangle$, $\\langle\\text{betű}\\rangle ::= a \\mid \\dots \\mid z$, $\\langle\\text{számjegy}\\rangle ::= 0 \\mid \\dots \\mid 9$.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Terminálisok eliminációja a bal oldalakon",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A 0-s és 1-es típusú szabályok bal oldalán terminálisok is lehetnek, ami több bizonyításban is idegesítő. Szerencsére ettől könnyen megszabadulhatunk.",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    statement: {
      hu: "Minden $G$ grammatikához van vele ekvivalens és azonos típusú $G'$, amelynek minden $x \\to y$ szabályára $x \\in (N')^+$, vagyis a bal oldalakon csak nemterminálisok állnak.",
    },
    proof: {
      hu: "A 2-es és 3-as típus eleve ilyen. A 0-s és 1-es típusnál minden $a \\in \\Sigma$ terminálishoz bevezetünk egy új $\\bar{a}$ nemterminálist (álterminális). Minden szabályban, bal és jobb oldalon is, $a$-t kicseréljük $\\bar{a}$-ra, végül hozzáadjuk az $\\bar{a} \\to a$ szabályokat. Ha $S \\Rightarrow^* t_1 \\cdots t_n$ az eredetiben, akkor az újban $S \\Rightarrow^* \\bar{t}_1 \\cdots \\bar{t}_n \\Rightarrow^* t_1 \\cdots t_n$. A másik irányhoz a $\\bar{a} \\mapsto a$ homomorfizmus az új levezetést visszaképezi egy régire.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Ezt a lépést a továbbiakban álterminálisok bevezetésének hívjuk. Ugyanez 2-es típusra is alkalmazható, így a 0-s, 1-es és 2-es típusnál feltehetjük, hogy terminális csak $A \\to a$ alakú szabályokban fordul elő. Ez a trükk még visszajön a Chomsky-normálformánál.",
    },
  },
  {
    type: "heading",
    level: 1,
    text: {
      hu: "Zártsági tulajdonságok",
    },
  },
  {
    type: "definition",
    term: {
      hu: "Zártság",
    },
    content: {
      hu: "Egy $\\mathcal{L}$ nyelvcsalád zárt egy $\\varphi$ $n$-változós nyelvműveletre, ha minden $L_1, \\dots, L_n \\in \\mathcal{L}$ esetén $\\varphi(L_1, \\dots, L_n) \\in \\mathcal{L}$. Az unió, a konkatenáció és a lezárás (csillag) együtt a reguláris műveletek.",
    },
  },
  {
    type: "theorem",
    kind: "tetel",
    statement: {
      hu: "$\\mathcal{L}_i$ zárt a reguláris műveletekre ($i = 0, 1, 2, 3$).",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "A bizonyítás 3 művelet × 4 típus = 12 konstrukció, de nem kell mindet bemagolni. Az ötlet mindig ugyanaz: veszünk két grammatikát (diszjunkt nemterminálisokkal), és egy új kezdőszimbólummal összedrótozzuk őket. A típusonkénti eltérés csak abból jön, hogy a ragasztó szabály ne rontsa el a típust. Legyen $G_k = \\langle N_k, \\Sigma_k, P_k, S_k \\rangle$, $L(G_k) = L_k$, és $S_0$ egy új nemterminális.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Unió",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "0, 2, 3 típus: $P_1 \\cup P_2 \\cup \\{S_0 \\to S_1 \\mid S_2\\}$, kezdőszimbólum $S_0$. Kész." },
      { hu: "1 típus: a fenti nem jó, mert ha pl. $S_1 \\to \\varepsilon$ szabály volt, akkor $S_1$ most jobb oldalon is szerepel, és sérül a KES. Megoldás: vegyük úgy $G_1, G_2$-t, hogy $L_1 - \\{\\varepsilon\\}$-t és $L_2 - \\{\\varepsilon\\}$-t generálják (dobjuk el az $S_k \\to \\varepsilon$-t), csináljuk meg az uniót, és ha $\\varepsilon$ valamelyikben benne volt, adjuk hozzá az $S' \\to S_0 \\mid \\varepsilon$ szabályokat új $S'$ kezdőszimbólummal." },
    ],
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Konkatenáció",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "0, 2 típus: $P_1 \\cup P_2 \\cup \\{S_0 \\to S_1S_2\\}$. Itt kell a terminálismentes bal oldal: különben egy szabály átnyúlhatna a két rész határán, és olyan szó is kijöhetne, ami nem $L_1L_2$-beli." },
      { hu: "3 típus: $S_0 \\to S_1S_2$ nem 3-as szabály. Helyette $G_1$ minden befejező $A \\to u$ ($u \\in \\Sigma^*$) szabályát lecseréljük $A \\to uS_2$-re, a kezdőszimbólum $S_1$. Vagyis ahol $G_1$ szava véget érne, ott elkezdődik egy $G_2$-beli szó." },
      { hu: "1 típus: megint a KES a gond. Levesszük az $\\varepsilon$-t ($L_k' = L_k - \\{\\varepsilon\\}$), az $L_1'L_2'$-re jó a 0/2-es konstrukció, és utána attól függően, hogy $\\varepsilon \\in L_1$, $\\varepsilon \\in L_2$, uniózzuk hozzá $L_1'$-t, $L_2'$-t, $\\{\\varepsilon\\}$-t. Az unióra való zártságot már tudjuk." },
    ],
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Lezárás (csillag)",
    },
  },
  {
    type: "list",
    ordered: false,
    items: [
      { hu: "2 típus: $P \\cup \\{S_0 \\to SS_0 \\mid \\varepsilon\\}$. Ennyi." },
      { hu: "3 típus: $S_0 \\to SS_0$ nem 3-as. Helyette minden befejező $A \\to u$ szabály mellé felvesszük az $A \\to uS$ szabályt (az eredetit is megtartjuk, hogy le lehessen állni), plusz $S_0 \\to S \\mid \\varepsilon$." },
      { hu: "0, 1 típus: ez a trükkös eset. Az $S_0 \\to SS_0$ itt azért nem jó, mert a nem-környezetfüggetlen szabályok átnyúlhatnak két iteráció határán, és így $L^*$-on kívüli szavak is keletkezhetnek. A megoldás egy $S_1$ „jelző” nemterminális, ami mindig a mondatforma elején áll, és csak akkor indít új iterációt, ha az előző már terminálissal kezdődik: $S_0 \\to \\varepsilon \\mid S \\mid S_1S$, $S_1a \\to S_1Sa$ és $S_1a \\to Sa$ minden $a \\in \\Sigma$-ra." },
    ],
  },
  {
    type: "funfact",
    text: {
      hu: "Ha a zártsági konstrukciók közül csak egyet jegyzel meg, az legyen ez: az összeragasztás csak akkor biztonságos, ha a szabályok nem tudnak „átkacsintani” a ragasztás helyén. A 2-es és 3-as típusnál ez automatikusan teljesül, mert a bal oldal egyetlen nemterminális. A 0-s és 1-es típusnál ezért kell az álterminális-trükk, a diszjunkt nemterminálisok, és a lezárásnál az $S_1$ jelző.",
    },
  },
];
