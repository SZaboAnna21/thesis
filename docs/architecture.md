# Fotoc Helper – a rendszer jelenlegi architektúrája

*Állapot: 2026. szeptember 30.*

## 1. Röviden

A Fotoc Helper egy böngészőben futó oktatási alkalmazás a Számításelmélet alapjai I–II. tárgyhoz. Minden témakörhöz három dolgot szeretne egy helyen adni: elméleti összefoglalót, vizualizációt és interaktív gyakorlást (például egy automata lépésenkénti futtatását saját bemenetre).

Az alkalmazás teljesen kliensoldali: nincs szerver és adatbázis, a tananyag az alkalmazással együtt töltődik be.

**Hol tart a projekt:** az architektúra és a tartalommodell elkészült, a navigáció működik, a négy modul mindegyike létezik legalább alapszinten. A tényleges tananyag még nincs feltöltve: a 14 témakörben egyelőre csak a fejezetcímek szerepelnek.

## 2. Technológiák

| Technológia | Mire használom |
|---|---|
| TypeScript | A teljes kódbázis és a tananyag nyelve. A típusok a tananyag szerkezetét is ellenőrzik. |
| React 19 | Felhasználói felület |
| React Router 7 | Navigáció az oldalak között |
| Vite | Fejlesztői szerver és éles build |
| pnpm workspaces | Monorepo: több, egymásra épülő csomag egy repositoryban |

Tervezett: KaTeX (matematikai képletek megjelenítése), Vitest (tesztek).

## 3. A kódbázis felépítése

A projekt három csomagra van bontva. Az a lényeg, hogy **a tananyag és az automaták logikája független a felülettől**:

```
Fotoc-helper/
├── apps/
│   └── web/                   A React webalkalmazás (csak megjelenítés)
│       └── src/
│           ├── main.tsx       belépési pont
│           ├── router/        útvonalak
│           ├── pages/         főoldal, témakör oldala
│           └── components/    megjelenítő komponensek
├── packages/
│   ├── content/               @fotoc/content – a tananyag és típusai
│   │   └── src/
│   │       ├── types/         a tartalommodell típusai
│   │       └── topics/        témakörönként egy mappa + a registry
│   └── automata-core/         @fotoc/automata-core – automaták logikája
└── docs/                      dokumentáció, szakdolgozat
```

```
               apps/web
            (React felület)
              /         \
             v           v
   @fotoc/content    @fotoc/automata-core
    (tananyag)         (szimuláció)
```

Miért így?

- **A tananyag adat, nem kód.** A tananyag írásához nem kell React-ot ismerni, és a felület lecserélhető a tartalom módosítása nélkül.
- **Az automatalogika böngésző nélkül is tesztelhető**, mert nem függ a React-től.
- **Új témakör felvételéhez nem kell a felülethez nyúlni** (ez a cél, lásd a 7. pontot).

## 4. A tartalommodell (`@fotoc/content`)

### 4.1 Blokkalapú tananyag

Az előadásdiák elemzéséből indultam ki: milyen ismétlődő elemekből áll a tárgy anyaga. Ezekből lettek a **tartalomblokkok**. Egy témakör elméleti anyaga blokkok sorozata:

| Blokk | Tartalma | Példa |
|---|---|---|
| `heading` | cím, szint (1–3) | „Determinisztikus véges automata” |
| `paragraph` | folyó szöveg | magyarázó bekezdés |
| `definition` | fogalom + definíció | a DVA definíciója |
| `theorem` | fajta (tétel / lemma / állítás / következmény), név, állítás, bizonyítás | Myhill–Nerode-tétel |
| `example` | cím + tartalom | kidolgozott példa |
| `formula` | LaTeX képlet | $\delta : Q \times \Sigma \to Q$ |
| `list` | számozott vagy felsorolásos lista | az ötös elemei |
| `table` | fejléc + sorok | átmenettáblázat |

Egy definíció a kódban így néz ki:

```ts
{
  type: "definition",
  term:    { hu: "Determinisztikus véges automata" },
  content: { hu: "Az $A = \\langle Q, \\Sigma, \\delta, q_0, F \\rangle$ rendezett ötös, ahol ..." },
}
```

Néhány döntés, ami ebből látszik:

- **Minden szöveg kétnyelvűre van előkészítve** (`{ hu, en? }`). A magyar kötelező, az angol később pótolható.
- **A matematikai jelölés LaTeX**, szövegen belül `$...$` között, kiemelt képletnél külön `formula` blokkban.
- **A típusrendszer ellenőrzi a tananyagot:** ha egy definícióból hiányzik a törzs, vagy elírom egy mező nevét, a fordító már szerkesztés közben jelez.

### 4.2 Témakörök

Minden témakörhöz metaadatok is tartoznak: azonosító, sorrend, csoport, cím, rövid összefoglaló, a kapcsolódó előadások és a hozzá tartozó interaktív modul.

A témakörök öt csoportba tartoznak: alapfogalmak, reguláris nyelvek, környezetfüggetlen nyelvek, környezetfüggő nyelvek, valamint kiszámíthatóság (a II. rész, későbbi bővítés).

A tárgy I. részéhez **14 témakör váza** készült el: alapfogalmak, grammatikák, reguláris grammatikák, reguláris kifejezések, DVA, NDVA, minimalizálás, reguláris kifejezés és automata kapcsolata, kis Bar-Hillel-lemma, CF grammatikák, CYK, veremautomata, nagy Bar-Hillel-lemma, környezetfüggő nyelvek.

Minden témakör egy mappa:

```
topics/dva/
├── meta.ts      metaadatok (cím, csoport, sorrend, ...)
└── theory.ts    az elméleti anyag blokkjai
```

A `topics/index.ts` gyűjti össze az összes témakört, és sorrendbe rakja őket. A felület két dolgot kér el a csomagtól: az összes témakör listáját (`topics`) és egy témakört azonosító alapján (`getTopic(id)`).

### 4.3 Feladatok

Kétféle gyakorló feladat van: feleletválasztós és igaz/hamis. Mindkettőhöz opcionálisan magyarázat is tartozik, amit a válasz után mutat a program.

## 5. Az automatalogika (`@fotoc/automata-core`)

Jelenleg a determinisztikus véges automata (DVA) van meg. A `runDfa(automata, szó)` függvény végigfuttatja az automatát a szón, és visszaadja:

- az összes lépést (melyik állapotban van, hány betűt olvasott már be),
- hogy az automata elfogadja-e a szót,
- hogy elakadt-e, mert egy betűre nem volt definiált átmenet.

Mivel a függvény az összes lépést visszaadja, a felületen előre- és visszalépni is egyszerű: csak egy indexet kell léptetni a lépések listájában.

## 6. A webalkalmazás (`apps/web`)

### Oldalak

| Cím | Mit mutat |
|---|---|
| `/` | Az összes témakör listája, hivatkozással. |
| `/topics/:id` | Egy témakör címe, összefoglalója, csoportja, a kapcsolódó előadások és az elméleti anyag. |

### Komponensek

| Komponens | Modul | Mit csinál |
|---|---|---|
| `TheoryRenderer` | Tananyag | A blokkokat a típusuk alapján HTML-lé alakítja. |
| `AutomatonView` | Vizualizáció | Az automatát átmenettáblázatként mutatja: a kezdőállapotot → jelöli, az elfogadó állapotokat *, az aktuális állapot kiemelve látszik. |
| `DfaSimulator` | Szimuláció | Bemeneti szó megadása, lépkedés előre-hátra, a végén az eredmény (elfogad / elutasít / elakad). |
| `ExerciseView` | Gyakorlás | Megjeleníti a feladatot, és a válasz után visszajelzést ad. |

## 7. Mi van kész, és mi nincs

| Terület | Állapot | Megjegyzés |
|---|---|---|
| Monorepo, csomagszerkezet | kész | |
| Tartalommodell (típusok) | kész | további blokktípusok még eldöntendők |
| 14 témakör váza + registry | kész | csak fejezetcímek, tartalom nincs |
| Navigáció (főoldal → témakör) | kész | stílus még nincs |
| Elmélet megjelenítése | részben | csak a cím és a bekezdés jelenik meg |
| Képletek megjelenítése (KaTeX) | nincs | |
| DVA szimuláció (logika + felület) | alapszinten kész | még nincs bekötve egyik témakör oldalába sem |
| Automata vizualizáció | alapszinten kész | táblázat; a gráfrajz később jön |
| Gyakorló feladatok | alapszinten kész | típusok és komponens megvan, feladat még nincs |
| NDVA, veremautomata, CYK stb. | nincs | |
| Tesztek | nincs | |

## 8. Következő lépések

A közeli cél az, hogy **egy új témakör felvétele csak adatírás legyen**: egy új mappa a tananyaggal, és a felület kódjához ne kelljen hozzányúlni. Ehhez a következők kellenek:

1. **A tartalommodell véglegesítése.** El kell dönteni, hogy bekerül-e a megjegyzés, az algoritmus és a beágyazott automata blokk. Emellett a témakörhöz feladatokat és automatákat kell tudni kötni.
2. **Minden blokktípus megjelenítése**, KaTeX-szel együtt.
3. **Általános témakör oldal**, amely magától megjeleníti a témakör feladatait és automatáit.
4. **Egyszerűbb regisztráció**: témakörönként egy sor a registryben.
5. **Oldalsáv és alap stílus.**
6. **Automatikus ellenőrzések**: tesztek a szimulációra, és egy teszt, amely a teljes tananyagot ellenőrzi (egyedi azonosítók, hibátlan képletek, érvényes hivatkozások).
7. **Mintatémakör:** a DVA teljes kidolgozása (elmélet, szimuláció, feladatok), amely sablon lesz a többi témakörhöz.

Ezután jöhet a tényleges tananyagírás és a további automatatípusok (NDVA, veremautomata) szimulációja.

## 9. Futtatás

```bash
pnpm install
pnpm --filter web dev
```

Ezután az alkalmazás a terminálban kiírt címen (alapértelmezés szerint `http://localhost:5173`) érhető el.
