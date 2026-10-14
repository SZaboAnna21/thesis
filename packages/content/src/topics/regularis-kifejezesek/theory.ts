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
      hu: "Minden véges nyelv reguláris, és $\\mathcal{L}_3$ zárt az unióra, a konkatenációra és a lezárásra. Vagyis ha pár véges nyelvből ezekkel a műveletekkel legózunk, biztosan reguláris nyelv jön ki. A kérdés: kilegózható így az összes reguláris nyelv? Erre lesz jó a reguláris kifejezés, ami pont a legó-útmutató.",
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
      hu: "Legyen $V$ ábécé, és $V' = \\{\\emptyset, \\varepsilon, \\cdot, +, ^*, (, )\\}$ tőle diszjunkt. A $V$ feletti reguláris kifejezések rekurzívan:",
    },
  },
  {
    type: "list",
    ordered: true,
    items: [
      { hu: "$\\emptyset$, $\\varepsilon$ és minden $a \\in V$ reguláris kifejezés," },
      { hu: "ha $R$ az, akkor $R^*$ is," },
      { hu: "ha $Q$ és $R$ azok, akkor $(Q \\cdot R)$ és $(Q + R)$ is." },
    ],
  },
  {
    type: "paragraph",
    text: {
      hu: "Ez eddig csak egy szabályosan összerakott jelsorozat. Jelentést az $L(R)$ nyelv ad neki:",
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
      ["$\\emptyset$", "$\\emptyset$", "semmi, nulla, nada"],
      ["$\\varepsilon$", "$\\{\\varepsilon\\}$", "csak az üres szó"],
      ["$a$", "$\\{a\\}$", "egyetlen betű"],
      ["$R^*$", "$L(R)^*$", "akárhányszor (0-szor is)"],
      ["$Q \\cdot R$", "$L(Q)L(R)$", "előbb az egyik, aztán a másik"],
      ["$Q + R$", "$L(Q) \\cup L(R)$", "vagy az egyik, vagy a másik"],
    ],
  },
  {
    type: "warning",
    text: {
      hu: "$\\emptyset \\neq \\varepsilon$! Az egyik egy üres doboz, a másik egy doboz, amiben egy üres papírlap van. Konkatenációnál látszik: $R\\varepsilon = R$, de $R\\emptyset = \\emptyset$.",
    },
  },
  {
    type: "paragraph",
    text: {hu: "Szokásos jelölésbeli rövidítések: nem különböztetjük meg élesen egy reguláris kifejezést és az általa jelölt nyelvet (pl. $ab^* = \\{ab^n \\mid n \\in \\mathbb{N}\\}$), a konkatenáció jele ($\\cdot$) általában elmarad, a választást írhatjuk $+$, $|$ vagy $\\cup$ jellel, továbbá $R^+ = RR^*$, és használhatunk kitevőket is, például $(a^*b)^3 = a^*ba^*ba^*b$."    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Precedencia, mint a matekban: $^*$ (hatvány) > konkatenáció (szorzás) > $+$ (összeadás). Zárójel csak ott kell, ahol ettől eltérnénk.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "$ab^*$ = $a, ab, abb, \\dots$, és nem $(ab)^*$! A csillag csak a közvetlen szomszédjára vonatkozik. Ugyanígy $a + ba^*$ nem ugyanaz, mint $(a + b)a^*$.",
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
    type: "table",
    headers: ["#", "Azonosság", "Mit mond"],
    rows: [
      ["1", "$P + (Q + R) = (P + Q) + R$", "unió asszociatív"],
      ["2", "$P(QR) = (PQ)R$", "konkatenáció asszociatív"],
      ["3", "$P + Q = Q + P$", "unió kommutatív"],
      ["4", "$P(Q + R) = PQ + PR$", "balról disztributív"],
      ["5", "$(P + Q)R = PR + QR$", "jobbról disztributív"],
      ["6", "$P^* = \\varepsilon + PP^*$", "0-szor, vagy 1-szer és utána akárhányszor"],
      ["7", "$\\varepsilon P = P\\varepsilon = P$", "$\\varepsilon$ az egység"],
      ["8", "$P^* = (\\varepsilon + P)^*$", "az $\\varepsilon$ úgyis benne van"],
      ["9", "$P\\emptyset = \\emptyset P = \\emptyset$", "$\\emptyset$ mindent megeszik"],
    ],
  },
  {
    type: "warning",
    text: {
      hu: "Ami nincs a listán, az nem is igaz: $PQ \\neq QP$, és $(P + Q)^* \\neq P^* + Q^*$ (pl. $ab \\in (a + b)^*$, de se $a^*$-ban, se $b^*$-ban nincs benne).",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Gyakori minták",
    },
  },
  {
    type: "table",
    headers: ["Nyelv ($\\Sigma = \\{a, b\\}$)", "Kifejezés"],
    rows: [
      ["minden szó", "$(a + b)^*$"],
      ["$b$-re végződik", "$(a + b)^*b$"],
      ["van benne $aa$", "$(a + b)^*aa(a + b)^*$"],
      ["páros sok $a$", "$b^*(ab^*ab^*)^*$"],
      ["nincs benne $aa$", "$(b + ab)^*(\\varepsilon + a)$"],
    ],
  },
  {
    type: "warning",
    text: {
      hu: "Kivonás nincs, ezért a „nem tartalmaz” nyelveknél azt kell leírni, hogy néz ki egy jó szó. A $(b + ab)^*$ csábító, de lemaradnak róla az $a$-ra végződő szavak.",
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
    type: "theorem",
    kind: "tetel",
    name: {
      hu: "Arden tétele",
    },
    statement: {
      hu: "Az $X = R + XQ$ egyenlet megoldása $X = RQ^*$. Ha $\\varepsilon \\notin L(Q)$, akkor ez az egyetlen megoldás.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Kiolvasva: $X$ egy $R$-es kezdet, utána akárhány $Q$-darab. Ha az $X$ a másik oldalon áll, vagyis $X = R + QX$, akkor $X = Q^*R$. A $Q^*$ mindig azon az oldalon marad, ahol a $Q$ állt.",
    },
  },
  {
    type: "example",
    content: {
      hu: "$X = ab^* + Xbc^*$: $R = ab^*$, $Q = bc^*$, és $\\varepsilon \\notin bc^*$, tehát az egyetlen megoldás $X = ab^*(bc^*)^*$.",
    },
  },
  {
    type: "warning",
    text: {
      hu: "Az $\\varepsilon \\notin L(Q)$ feltétel nem dísz. $Q = \\varepsilon$ esetén $X = R + X$-nek bármi megoldása, ami $R$-et tartalmazza, és akkor az $RQ^*$ csak a legkisebb közülük.",
    },
  },
  {
    type: "heading",
    level: 2,
    text: {
      hu: "Egyenletrendszerek",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Több ismeretlennél jön a jó öreg Gauss-elimináció: az egyik egyenletből Ardennel kifejezed az egyik változót, beírod a többibe, és addig ismétled, amíg egy változó nem marad.",
    },
  },
  {
    type: "example",
    content: {
      hu: "$X = ab^* + b + (aa^* + bb)X + babY$, $Y = bb + aa + bX + a(a + bb)^*Y$. A 2. egyenlet $Y = \\dots + QY$ alakú, tehát $Y = (a(a + bb)^*)^*(bb + aa + bX)$. Ezt beírjuk az 1.-be, rendezzük $X = R' + Q'X$ alakra, és még egy Arden. Az eredmény: $X = (aa^* + bb + bab(a(a + bb)^*)^*b)^*(ab^* + b + bab(a(a + bb)^*)^*(bb + aa))$.",
    },
  },
  {
    type: "paragraph",
    text: {
      hu: "Igen, csúnya. Ez a műfaj ilyen: a helyes eredmény ritkán szép.",
    },
  },

];
