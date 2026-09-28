# Fotoc Helper – Tartalomkezelő rendszer tervezése és implementálása (2026-09-28)

## Cél

A szakdolgozat projektben a cél egy olyan tananyagkezelő rendszer kialakítása volt, amely lehetővé teszi a Számításelmélet alapjai I. tárgy teljes elméleti anyagának strukturált tárolását és megjelenítését.

A tervezés során fontos szempont volt, hogy:

- a tartalom technológiafüggetlen legyen,
- a tananyag könnyen bővíthető legyen,
- a későbbi interaktív modulok (DVA, NDVA, PDA stb.) ráépíthetők legyenek,
- a teljes tananyag egységes formátumban tárolódjon.

---

# 1. Tartalommodell tervezése

Első lépésben az előadásdiák elemzése történt.

A cél annak meghatározása volt, hogy a tárgy milyen ismétlődő információelemekből áll.

Az elemzés során az alábbi blokktípusok kerültek meghatározásra:

- heading
- paragraph
- definition
- theorem
- example
- note
- formula
- list
- algorithm
- table
- automaton

A blokk alapú modell előnye:

- minden témakör ugyanazzal a rendererrel jeleníthető meg,
- az új tartalmak létrehozása egyszerű,
- a későbbi export (PDF, nyomtatás stb.) könnyebb.

---

# 2. Matematikai jelölések egységesítése

A tárgy jelentős mennyiségű matematikai formulát tartalmaz.

Példák:

- DFA
- NDFA
- Grammatikák
- Chomsky-hierarchia
- CYK algoritmus
- Pumpálási lemmák

Ezért a projektben KaTeX alapú megjelenítés került kiválasztásra.

Szabályok:

- inline matematika: $...$
- kiemelt képlet: formula blokk
- LaTeX alapú tárolás

Példa:

text
$A = \langle Q, \Sigma, \delta, q_0, F \rangle$

Ennek előnye, hogy a teljes tananyag egységes matematikai formában szerkeszthető.

---

# 3. TopicMeta modell

A tartalom és a navigáció szétválasztása érdekében minden témakör külön metaadatokat kapott.

A TopicMeta feladata:

- navigáció
- rendezés
- kategorizálás
- előadásokhoz kötés
- későbbi modulkapcsolatok

A mezők:

type TopicMeta = {
  id: string;
  order: number;

  group: TopicGroup;

  title: LocalizedText;
  summary: LocalizedText;

  lectures: number[];

  module: string | null;
};

---

# 4. TopicGroup kialakítása

A teljes tananyag 5 fő kategóriára lett bontva.

type TopicGroup =
  | "foundations"
  | "regular"
  | "context-free"
  | "context-sensitive"
  | "computability";

Jelentésük:

| Group | Jelentés |
|---------|---------|
| foundations | Alapfogalmak |
| regular | Reguláris nyelvek |
| context-free | Környezetfüggetlen nyelvek |
| context-sensitive | Környezetfüggő nyelvek |
| computability | Későbbi bővítés |

Az öt csoport a tárgy logikai felosztását követi.

---

# 5. TypeScript adattípusok

A content package-ben létrejöttek a fő adattípusok.

## content.ts

Itt találhatók:

- LocalizedText
- HeadingBlock
- ParagraphBlock
- DefinitionBlock
- TheoremBlock
- FormulaBlock
- TableBlock
- stb.

Valamint:

type ContentBlock = ...

discriminated union formában.

---

## topic.ts

Itt találhatók:

- TopicGroup
- TopicMeta
- Topic

típusok.

---

## exercise.ts

Jelenlegi változat:

MultipleChoiceExercise
TrueFalseExercise

A további feladattípusok később kerülnek bevezetésre.

---

# 6. Témakörstruktúra kialakítása

A teljes tantárgyhoz létrejött a 14 témakör váza.

Minden témakör külön mappát kapott.

Példa:

text
topics/
└── dva/
    ├── meta.ts
    └── theory.ts

A létrehozott témakörök:

1. alapfogalmak
2. grammatikak
3. regularis-grammatikak
4. regularis-kifejezesek
5. dva
6. ndva
7. minimalizalas
8. regex-automata
9. kis-bar-hillel
10. cf-grammatikak
11. cyk
12. veremautomata
13. nagy-bar-hillel
14. kornyezetfuggo

Ebben a fázisban még csak a szerkezet készült el.

Valódi elméleti tartalom még nem került feltöltésre.

---

# 7. Topic registry

Létrejött:

text
topics/index.ts

Feladata:

- az összes témakör összegyűjtése
- sorrendbe rendezése
- keresés biztosítása

Például:

export const topics = [...]

és

getTopic(id)

Ez jelenleg kézi registry.

A későbbi verzióban feltehetően:

import.meta.glob(...)

fogja automatikusan felépíteni.

A mostani megoldás célja a gyors prototípus-készítés.

---

# 8. Package kapcsolat kialakítása

A content package önálló workspace csomag lett.

Példa:

{
  "name": "@fotoc/content"
}

Később a web alkalmazás innen importál:

import { topics } from "@fotoc/content";

Ez biztosítja a rétegek szétválasztását.

---

# 9. Első működő integráció

Elkészült az első HomePage prototípus.

tsx
import { topics } from "@fotoc/content";

A HomePage képes:

- a content package betöltésére,
- az összes témakör listázására,
- a címek megjelenítésére.

Ez az első bizonyítéka annak, hogy:

- a content package működik,
- a web package látja a content package-et,
- a tananyagmodell helyes.

---

# Következő lépés

## E fázis

Web minimum:

- React Router
- HomePage
- TopicPage
- Sidebar
- témakör navigáció

## F fázis

TheoryRenderer:

- heading
- paragraph
- definition
- theorem
- formula
- table
- algorithm

blokkok kirajzolása.

## G fázis

Tényleges tananyagírás:

először:

- alapfogalmak
- grammatikak
- dva

majd a többi témakör.

---

# Eredmény

A projekt jelenleg rendelkezik:

- stabil tartalommodellel
- típusbiztos adattárolással
- 14 témakör struktúrájával
- különálló content package-gel
- működő HomePage prototípussal

Így a következő fejlesztési szakasz már a tananyag megjelenítésére koncentrálhat.