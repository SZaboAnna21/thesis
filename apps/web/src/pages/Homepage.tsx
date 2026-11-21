export function Homepage() {
  return (
    <div className="relative isolate flex-1 overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-brand-100/60 to-transparent" />
      <section className="mx-auto max-w-5xl px-6 py-20">
        <span className="mb-4 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
          Számításelmélet Alapjai I–II
        </span>
        <h1 className="mb-6 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Interaktív <span className="text-brand-600">vizualizációs</span> platform
        </h1>
        <p className="max-w-3xl text-lg leading-relaxed text-slate-600">
         Formális nyelvek, automaták, veremautomaták, Turing-gépek... azok a témák, amelyek előadást követve talán még logikusnak tűnnek, vizsga előtt pedig hirtelen már nem annyira.
          Ez a felület interaktív szimulációkkal és rövid magyarázatokkal segít abban, hogy ne csak bemagold az anyagot, hanem lásd is működés közben. Kattints, kísérletezz, hibázz bátran, itt ezért nem jár pontlevonás.
          A témakörök között szabadon navigálhatsz, kipróbálhatod a különböző automatákat saját példákon, vagy akár egy rövid kvízzel is ellenőrizheted a tudásodat.
          És valljuk be: van valami elég menő abban, amikor valaki ilyen rétegtémákat is megért. Nem kell mindenkinek tudnia, hogyan működik egy Turing-gép, de aki érti, az azért kap néhány plusz intelligencia pontot. Let's get smart!
        </p>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
          Válassz témát a fenti <span className="font-medium text-brand-700">Számításelmélet I</span> vagy{" "}
          <span className="font-medium text-brand-700">Számításelmélet II</span> menüből!
        </p>
        </section>
    </div>
  );
}
