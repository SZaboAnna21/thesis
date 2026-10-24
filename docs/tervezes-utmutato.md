# Útmutató a Tervezés fejezet hátralévő szakaszaihoz

Ez a jegyzet a `fejlesztoi.tex` 3.3.3–3.3.8. szakaszaihoz gyűjti össze, mi kerüljön beléjük, milyen sorrendben, és milyen kérdésekre kell válaszolniuk. Nem kész szöveg, hanem váz: a pontok mellett ott van, mit érdemes a kódból kiemelni.

## Honnan jönnek a követelmények

**1. Hivatalos ELTE IK tájékoztató (PTI BSc).** A fejlesztői dokumentáció tartalmazza:
- a probléma részletes specifikációját,
- a felhasznált módszerek részletes leírását, a használt fogalmak definícióját,
- **a program logikai és fizikai szerkezetének leírását (adatszerkezetek, adatbázisok, modulfelbontás)**,
- a tesztelési tervet és a tesztelés eredményeit.

A bíráló a fejlesztői dokumentációnál ezt nézi: *„milyen mértékben segíti elő a programban való tájékozódást, a program továbbfejlesztését, karbantartását”*, továbbá *„a dokumentáció részeinek kapcsolata, összhangja (algoritmusok, modulok, programszerkezetek)”*.

**2. Kari útmutató (BSc és MSc általános tanácsok, 2021).**
- Úgy írd meg, *„mintha egy cégnél dolgoznál és a többi fejlesztőnek írnád”*, aki átveszi a projektet.
- Minden döntésnél legyen ott: mit döntöttél, milyen alternatívák voltak, mi az előnyük és hátrányuk, és miért ezt választottad.
- Mutasd be a program rétegeit, moduljait, adatszerkezeteit, fontosabb függvényeit, algoritmusait. Legyenek UML-ábrák (osztálydiagram), és szó lehet a fájlkezelésről és az adattárolásról is.
- Ne kerüljön bele nagy kódrészlet, csak a lényeges részek, magyarázattal.
- Ne ismételd meg a felhasználói dokumentációt.

**Prioritás:** az 1. és a 2. pont a mérvadó, ezek alapján kell eldönteni, mi kerül a dolgozatba. A minta (3.) csak példa arra, hogyan oldotta meg ezt valaki más. Ha a minta mást csinál, mint amit a kari elvárás kér, a kari elvárás nyer.

**3. Másodlagos: a minta (Otar dolgozata, Design fejezet).** Formai ötletnek és ábratípusokhoz használható (C4, ERD, szekvenciadiagram), a tartalom eldöntésére nem.

A hat szakasz a kari követelményekhez így kapcsolódik (a minta oszlopa csak tájékoztató):

| Szakasz | Kari követelmény (mérvadó) | A mintában (példa) |
|---|---|---|
| 3.3.3 A tartalommodell | adatszerkezetek; tervezési döntés + alternatívák | Persistence layer, ERD |
| 3.3.4 Az algoritmuscsomag terve | modulfelbontás, adatszerkezetek, fontosabb függvények, algoritmusok, UML | Class diagram |
| 3.3.5 A webalkalmazás szerkezete | modulfelbontás, rétegek, osztályok/modulok | Presentation layer |
| 3.3.6 Állapotkezelés és perzisztencia | fizikai szerkezet, adattárolás és fájlkezelés | Persistence layer |
| 3.3.7 Dinamikus modell | a részek összhangja (algoritmusok, modulok, programszerkezetek), UML-ábrák | Sequence diagram |
| 3.3.8 Fejlesztési folyamat | fejlesztői környezet; a bíráló a hallgató munkáját is értékeli | Development Methodology |

**Általános szabály minden szakaszra:** az első bekezdés mondja meg, mit mutat be a szakasz. Utána jön egy ábra vagy táblázat, a szöveg azt magyarázza, a végén pedig egy mondat arról, melyik követelményt (FK/NFK) szolgálja a megoldás.

---

## 3.3.3 A tartalommodell

**Kari elvárás:** „adatszerkezetek” (PTI tájékoztató); tervezési döntés alternatívákkal, előnyökkel és hátrányokkal (kari útmutató 2.2).

**Cél:** hogyan van tárolva a tananyag, vagyis a program legfontosabb adatszerkezete.

**Kérdések, amelyekre válaszolnia kell:**
- Milyen formában van tárolva a tananyag, és miért így (és miért nem JSON, Markdown vagy adatbázis)?
- Milyen egységekből áll (csoport → témakör → blokk → kvízkérdés)?
- Milyen blokktípusok vannak, és melyiknek mi a mezője?
- Hogyan van megoldva a képletek és a két nyelv kezelése?
- Hogyan hivatkozik egy témakör az interaktív modulra?

**Sorrend:**
1. Rövid bevezető, visszautalással a specifikáció „Adatformátum” részére (`\ref{sec:data}`), hogy ott a logikai modell volt, itt a megvalósított típusok jönnek.
2. **Tervezési döntés:** TypeScript-típusok és `.ts` fájlok az alternatívákkal szemben (JSON, Markdown/MDX, adatbázis). Érv: a fordító szerkesztés közben jelzi a hibás blokkot, nincs szükség betöltésre vagy parszolásra, és nincs szerver.
3. Típusdiagram (UML-osztálydiagram stílusban): `Topic` → `TopicMeta`, `ContentBlock[]`, `QuizQuestion[]`, valamint a `ContentBlock` uniótípus a változataival.
4. **Többnyelvű szöveg:** `LocalizedText` (hu/en).
5. **Tartalomblokkok táblázata:** `heading`, `paragraph`, `definition`, `theorem` (`kind`: tétel/lemma/következmény…), `example`, `formula`, `list`, `table`, `warning`, `funfact`, `proof`. Oszlopok: típus, mezők, mire való.
6. **Matematikai jelölések:** a szövegben `$…$` LaTeX, ezt a megjelenítéskor a KaTeX rajzolja ki.
7. **Témakörök metaadatai:** `id`, `order`, `group`, `title`, `summary`, `lectures`, `module` (táblázat), majd a csoportok (`foundations`, `regular`, …) táblázata.
8. Egy rövid kódrészlet: egy definícióblokk (8–10 sor).
9. Zárás: miért jó ez a bővíthetőség szempontjából (NFK-5), és egy mondat a regiszterről (`topics/index.ts`).

**Kész anyag:** a `fejlesztoi.tex`-ben az `\iffalse` blokkban (kb. 415–560. sor) ez a szakasz már szinte teljesen meg van írva (Többnyelvű szöveg, Tartalomblokkok, Matematikai jelölések, Témakörök metaadatai, `tab:blocks`, `tab:topicmeta`, `tab:groups`). Azt kell ide áthozni, és kiegészíteni a 2. ponttal (döntés, alternatívák) és a 3. ponttal (diagram).

**Kerüld:** a specifikáció `tab:data-logical` táblázatának megismétlését. Arra csak hivatkozz.

---

## 3.3.4 Az algoritmuscsomag terve

**Kari elvárás:** „modulfelbontás, adatszerkezetek” (PTI tájékoztató); „osztályokat, modulokat, fontosabb függvényeket, algoritmusokat”, UML-ábrák; csak rövid, magyarázott kód (kari útmutató 5.2.2).

**Cél:** az `@fotoc/automata-core` belső felépítése: milyen modellek vannak benne adattípusként, és milyen műveletek dolgoznak rajtuk. A bíráló szempontjából ez a dolgozat „programozási nehézség” része.

**Kérdések:**
- Hogyan van ábrázolva egy DVA, egy NDVA, egy grammatika és egy reguláris kifejezés?
- Milyen modulokra bomlik a csomag, és melyik mit csinál?
- Mit ad vissza egy algoritmus: csak az eredményt, vagy a lépéseket is? Miért?
- Hogyan jelzi a csomag a hibás bemenetet (pl. hibás reguláris kifejezés)?
- Hogyan van korlátozva, ami nem állna meg magától (szavak felsorolása)?

**Sorrend:**
1. Bevezető: miért tiszta függvények és sima adattípusok (rekordok), osztályok helyett. Érv: a React jól kezeli a módosíthatatlan adatot, egyszerű tesztelni és JSON-ként kiírni. Alternatíva: osztályhierarchia (`Automaton` ősosztály). Mondd meg, miért nem azt választottad.
2. **Típusdiagram** (az osztálydiagram helyett, mert nincsenek osztályok, ezt egy mondatban írd le): `Dfa`, `Nfa`, `EpsilonNfa`, `Grammer`/`Rule`, `Regex` (uniótípus), és a lépéstípusok: `DfaStep`/`DfaRun`, `NfaRunStep`, `SubsetStep`, `Nf3Step`, `Step`.
3. **Modultáblázat:** modul | fő típusok | fő függvények | melyik webes modul használja.
   - `dfa`: `runDfa`, `isComplete`, `dfaToNfa`
   - `nfa`: `epsilonClosure`, `runNfa`, `acceptsWord`, `determinize`
   - `grammer`: `possibleSteps`, `applyStep`, `isTerminalWord`
   - `chomsky`: `classifyGrammer`, `checkOneRule`, `tokenize`
   - `normalform3`: `toNormalForm3Steps`, `lengthReduction`, `removeChains`, `chainLayers`
   - `language`: `parseRegex`, `regexToNfa`, `regexMatches`, `shortlex`, `findRegexCounterexample`, `checkRegex`
   - `words`: `reverse`, `power`, `prefixes`, `suffixes`, `runAll`
4. **A lépéslista elve:** a szimuláló függvények a teljes futást lépések listájaként adják vissza (pl. `DfaRun`, `SubsetStep[]`). Erre az Architektúra szakaszban már hivatkoztál, itt egy példán mutasd meg a `DfaStep` mezőit.
5. **Hibakezelés:** `RegexParseResult` (siker vagy hiba pozícióval), `ChomskyResult`, `Nf3Result`. Kivételek helyett eredménytípust ad vissza, és ennek az előnyét is írd le.
6. **Korlátok:** a `shortlex` generátor és a hosszkorlát, ami NFK-1 miatt kell.
7. Zárás: a tesztek csomagszinten futnak (`node --test`), részletek a Tesztelés fejezetben.

**Kerüld:** az algoritmusok matematikai levezetését. Az a „Felhasznált módszerek” részbe kerül, a megvalósítás részletei pedig az Implementáció „Kiemelt algoritmusok” szakaszába.

---

## 3.3.5 A webalkalmazás szerkezete

**Kari elvárás:** „modulfelbontás” (PTI tájékoztató); „mutasd be a programod rétegeit … modulokat” (kari útmutató 5.2.2).

**Cél:** az `apps/web` felépítése: útvonalak, komponensfa és a modulregiszter.

**Kérdések:**
- Milyen útvonalak vannak, és miért hash alapú az útvonalkezelés?
- Hogyan épül fel a komponensfa (`Layout` → `SiteHeader` + oldal)?
- Milyen újrafelhasználható komponensek vannak, és melyik mire való?
- Hogyan kapcsolódik egy témakör a hozzá tartozó interaktív modulhoz?
- Hogyan van megoldva a stílus (Tailwind)?

**Sorrend:**
1. **Útvonalak táblázata:** `/` → `Homepage`, `/topics/:topicID` → `Topicpages`. Döntés: `createHashRouter` a `createBrowserRouter` helyett, mert a GitHub Pages közvetlen link esetén 404-et adna.
2. **Komponensfa-ábra** (fa vagy UML-komponensdiagram): `main.tsx` → `RouterProvider` → `Layout` (`SiteHeader`, `Outlet`) → `Homepage` / `Topicpages` → `TheoryRenderer`, `[modul]`, `QuizView`.
3. **Komponenscsoportok táblázata** (nem mind a 25 komponens egyenként, hanem csoportosítva):
   - keret: `Layout`, `SiteHeader`
   - tananyag: `TheoryRenderer`, `MathText`
   - lejátszás: `usePlayer`, `PlayerControls`
   - automaták: `AutomatonGraph` (React Flow), `AutomatonView`, `NfaTable`, `SubsetPlayer`
   - szimulátorok: `DfaSimulator`, `NfaLab`, `GrammarDerivation`, `ChomskyClassifier`, `NormalForm3Visualizer`, `RegexChecker`, `LanguageExplorer`, `WordPlayground`
   - gyakorlás: `QuizView`, `ExerciseView`
4. **Modulregiszter:** `modules/index.tsx` egy `azonosító → komponens` táblázat. Mutasd meg a 8 bejegyzést táblázatban (azonosító | komponens | témakör). Egy rövid kódrészlet (4–5 sor) a regiszterből.
5. **Stílus:** Tailwind, egységes színek (`brand-700`), reszponzivitás (`max-w-3xl`, `sm:`). Ez NFK-3-hoz kötődik.
6. Zárás: új modul felvétele itt egyetlen sor (hivatkozz vissza a Bővíthetőség részre).

**Kerüld:** a képernyőképeket (azok a felhasználói dokumentációba valók) és a komponensek belső kódját.

---

## 3.3.6 Állapotkezelés és perzisztencia

**Kari elvárás:** a program „fizikai szerkezete” (PTI tájékoztató); „milyen adatbázist használtok, hogy néz ki az adatszerkezetetek”, „ha használtok fájlkezelést valamire, azt is írjátok le” (kari útmutató 5.2.2).

**Cél:** hol van állapot a programban, mi marad meg újratöltés után, és hogyan. A hivatalos lista „fizikai szerkezet, adattárolás” pontja tartozik ide.

**Kérdések:**
- Milyen állapot van a programban (komponensen belüli vagy közös)?
- Miért nincs Redux vagy Context? Mi a döntés és mi az alternatíva?
- Mi kerül a `localStorage`-ba, milyen kulccsal és milyen formátumban?
- Mi történik, ha a böngésző tiltja a tárolást, vagy sérült az adat?
- Mi az, ami (még) nem perzisztens?

**Sorrend:**
1. **Állapot fajtái** (táblázat): állapot | hol él | élettartam.
   - szimuláció bemenete és lépésindexe: komponens (`useState`, `usePlayer`), oldalváltásig
   - kvízválaszok: `QuizView`, oldalváltásig
   - megtekintett témakörök: `progress.ts` + `localStorage`, tartósan
2. **Döntés:** helyi állapot és egy kis saját tároló, Redux vagy Zustand helyett. Érv: egyetlen megosztott adat van, nem éri meg egy függőséget behozni miatta.
3. **A `progress` modul:** kulcs `fotoc.visitedTopics`, értéke a témakör-azonosítók JSON tömbje. `useSyncExternalStore` → megfigyelő minta, a fejléc menüje frissül.
4. **Hibatűrés:** sérült JSON esetén üres listát ad, tiltott tárolásnál a munkamenet végéig memóriában marad (`try/catch`). Ez NFK-2.
5. **Adatvédelem:** semmilyen adat nem hagyja el a gépet, nincs süti és nincs analitika.
6. Ha a beállítások vagy a nyelvválasztás elkészül, ide kerülnek. Ha nem, írd le őszintén, hogy most csak a megtekintett témakörök tárolódnak (és egyeztesd az FK-8 szövegével!).

**Figyelj:** az FK-8 és a `tab:interfaces` „haladás és beállítások”-at ígér. Jelenleg csak a megtekintett témakörök vannak tárolva. Vagy megcsinálod, vagy a szöveget igazítod hozzá.

---

## 3.3.7 Dinamikus modell

**Kari elvárás:** „a dokumentáció részeinek kapcsolata, összhangja (algoritmusok, modulok, programszerkezetek)” (bírálati szempont); UML-ábrák (kari útmutató 5.2.2).

**Cél:** egy tipikus használat időbeli lefolyása szekvenciadiagramon. A minta Figure 4.14-e felel meg neki.

**Kérdések:**
- Mi történik a felhasználó egy műveletétől a képernyő frissüléséig?
- Melyik komponens kit hív, és mikor fut az algoritmus?
- Hol van az elágazás (hibás bemenet)?

**Sorrend:**
1. Válassz egy felhasználói történetet. A DVA-szimuláció a legjobb, mert a specifikációban már megvan (`todo.txt`, „Mint hallgató… szeretném egy DVA működését lépésenként követni”).
2. **Szekvenciadiagram** (tikz vagy pgf-umlsd). Résztvevők: Hallgató, `DfaSimulator`, `runDfa` (core), `usePlayer`, `PlayerControls`, `AutomatonGraph`.
   - a Hallgató beírja a szót → `DfaSimulator` ellenőrzi az ábécét
   - `alt` elágazás: hibás betű esetén hibaüzenet, különben `runDfa(dfa, szó)` → `DfaRun` (lépéslista)
   - `usePlayer(lépésszám)` → index = 0
   - `loop`: Előre gomb → index+1 → `AutomatonGraph` kiemeli az aktuális állapotot
   - utolsó lépés → elfogadás/elutasítás kijelzése
3. Szöveges magyarázat számozott lépésekkel (mint a mintában a „Scenario overview”).
4. Opcionálisan egy második, rövidebb diagram: témakör megnyitása. Ezt az Architektúra C3-ábrája részben már lefedi, ezért elhagyható.
5. Zárás: melyik FK teljesül (FK-4, FK-5, FK-6).

**Kerüld:** azt, hogy a diagramon React-belsőségek legyenek (renderelés, effektek). Maradj a komponensek és függvényhívások szintjén.

---

## 3.3.8 Fejlesztési folyamat

**Kari elvárás:** a fejlesztői környezet bemutatása (kari útmutató 5.2.2); a bíráló „a hallgató munkájáról kialakult véleményt” is értékeli (PTI tájékoztató, III/5).

**Cél:** hogyan készült a program: módszertan, fázisok, eszközök. Rövid szakasz, kb. 1 oldal.

**Kérdések:**
- Milyen módszertant követtél (iteratív, inkrementális), és miért?
- Milyen fázisok voltak, és mi készült el bennük?
- Hogyan kezelted a verziókat és a feladatokat?
- Hogyan egyeztettél a témavezetővel?

**Sorrend:**
1. **Módszertan:** inkrementális fejlesztés, minden körben egy témakör vagy modul készült el végig (tartalom → algoritmus → teszt → felület). Indoklás: egy fejlesztő, egy félév, és a témakörök függetlenek. Alternatívaként a vízesés modell, és hogy miért nem az.
2. **Fázisok idővonala** (táblázat vagy egyszerű tikz idővonal). A git log alapján:
   - 2026.09.26–27: alap, tartalomtípusok, témakörök váza, regiszter
   - utána: DVA, NDVA, grammatikák, Chomsky, 3NF, reguláris kifejezések, kvíz (a pontos dátumokat a `git log --date=short` adja)
   - 2026.10–11: dokumentáció, tesztelés
3. **Eszközök:** Git (73 commit), pnpm monorepo, VS Code, `tsc` típusellenőrzés, ESLint, `node --test`. Ha volt GitHub Issues vagy board, képernyőkép róla (mint a mintában).
4. **Konzultációk:** milyen gyakran, mi változott miattuk (pl. a témabejelentőhöz képest eltérő modulok, lásd `todo.txt` 0. pont).
5. Zárás: egy mondat arról, mi maradt továbbfejlesztésre (hivatkozz az Összegzésre).

**Kerüld:** a túlzást (a minta „80 user story, 35 branch”-szerű számait csak akkor írd, ha nálad is igazak).

---

## Ellenőrzőlista a végére

- [ ] Minden szakasz elején van egy mondat arról, mit mutat be.
- [ ] Minden tervezési döntésnél ott van az alternatíva és az indoklás.
- [ ] Minden ábrára és táblázatra hivatkozik a szöveg (`\ref`).
- [ ] Minden FK és NFK legalább egyszer előkerül a Tervezésben.
- [ ] Nincs ismétlés a felhasználói dokumentációval és a specifikációval, csak hivatkozás.
- [ ] A kódrészletek rövidek, és van magyarázatuk.
- [ ] Az FK-8 és a perzisztencia szakasz összhangban van.

## Források

- ELTE IK: Tájékoztató a programtervező informatikus BSc szak hallgatóinak szakdolgozatával kapcsolatban – https://www.inf.elte.hu/dstore/document/257/PTI_BSc_szakdoli_uj.pdf
- ELTE IK: BSc és MSc általános tanácsok (Németh, Gludovátz, Gombos, 2021) – https://www.inf.elte.hu/dstore/document/2424/BSc%20es%20MSc%20altalanos%20tanacsok.pdf
- Minta (másodlagos, csak példa): Jintchveladze O., *Intelligent Time Management Through Context-Aware Automation*, ELTE IK BSc, 2026 (`docs/thesis.pdf`), 4. fejezet
