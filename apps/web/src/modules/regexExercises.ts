import type { LanguageReference } from "@fotoc/automata-core";

export type RegexExercise = {
  id: string;
  title: string;
  statement: string;
  alphabet: string[];
  reference: LanguageReference;
  hint: string;
  solution: string;
};

const count = (word: string, letter: string) => [...word].filter((c) => c === letter).length;

export const regexExercises: RegexExercise[] = [
  {
    id: "b-re-vegzodik",
    title: "Bemelegítés",
    statement: "Az $\\{a, b\\}$ feletti, $b$-re végződő szavak.",
    alphabet: ["a", "b"],
    reference: { kind: "regex", source: "(a+b)*b" },
    hint: "Előbb jöhet bármi, akárhányszor, utána a kötelező vég.",
    solution: "(a+b)*b",
  },
  {
    id: "legalabb-egy-1",
    title: "Legalább egy 1-es",
    statement: "$\\{u \\in \\{0, 1\\}^* \\mid u$ legalább egy 1-est tartalmaz$\\}$",
    alphabet: ["0", "1"],
    reference: { kind: "regex", source: "(0+1)*1(0+1)*" },
    hint: "Vágd ketté a szót az első 1-esnél: előtte csak 0-k állhatnak, utána bármi.",
    solution: "0*1(0+1)*",
  },
  {
    id: "paros-sok-1",
    title: "Páros sok 1-es",
    statement: "$\\{u \\in \\{0, 1\\}^* \\mid u$ páros sok 1-est tartalmaz$\\}$",
    alphabet: ["0", "1"],
    reference: { kind: "regex", source: "0*(10*10*)*" },
    hint: "Szedd párokba az 1-eseket. Egy pár: 1, utána akárhány 0, aztán még egy 1. A párok között és előttük 0-k állhatnak.",
    solution: "(0+10*1)*",
  },
  {
    id: "nincs-aa",
    title: "Nincs benne aa",
    statement: "Az $\\{a, b\\}$ feletti szavak, amelyekben nincs két egymás utáni $a$.",
    alphabet: ["a", "b"],
    reference: { kind: "regex", source: "(b+ab)*(ε+a)" },
    hint: "Kivonás nincs, ezért írd le pozitívan: minden a után b jön, kivéve esetleg a legutolsó a-t.",
    solution: "(b+ab)*(ε+a)",
  },
  {
    id: "a2n1b-csillag",
    title: "Lezárt nyelv",
    statement: "$\\{a^{2n+1}b \\mid n \\in \\mathbb{N}\\}^*$",
    alphabet: ["a", "b"],
    reference: { kind: "regex", source: "(a(aa)*b)*" },
    hint: "Előbb a zárójelben lévő nyelvre írj kifejezést (páratlan sok a, utána egy b), aztán tedd rá a csillagot.",
    solution: "(a(aa)*b)*",
  },
  {
    id: "masodik-c-vagy-ket-d",
    title: "Két feltétel uniója",
    statement: "$\\{u \\in \\{c, d\\}^* \\mid u$ második betűje $c$, vagy $u$ pontosan két $d$-t tartalmaz$\\}$",
    alphabet: ["c", "d"],
    reference: { kind: "regex", source: "(c+d)c(c+d)* + c*dc*dc*" },
    hint: "A „vagy” uniót jelent: írj külön kifejezést a két feltételre, és tedd közéjük a +-t.",
    solution: "(c+d)c(c+d)* + c*dc*dc*",
  },
  {
    id: "zh1-2",
    title: "ZH-feladat",
    statement:
      "$L = \\{u \\in \\{a, b\\}^* \\mid u$-ban páros sok $a$ van, de ha $u$-ban van $b$ betű, akkor az utolsóként előforduló $b$ utáni $a$-k száma páratlan$\\}$",
    alphabet: ["a", "b"],
    reference: {
      kind: "predicate",
      accepts: (u) => {
        if (count(u, "a") % 2 !== 0) return false;
        const lastB = u.lastIndexOf("b");
        return lastB === -1 || (u.length - lastB - 1) % 2 === 1;
      },
      maxLength: 10,
    },
    hint: "Két eset van: a szóban nincs b (ekkor csak páros sok a), vagy van. Ha van, a szó X·b·(páratlan sok a) alakú. Mivel összesen páros sok a kell, X-ben páratlan sok a van. A páros sok a-t tartalmazó szavak: (b + ab*a)*.",
    solution: "(aa)* + (b+ab*a)*ab*ba(aa)*",
  },
];
