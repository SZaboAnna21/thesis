import { SiteHeader } from "../components/SiteHeader";

const technologies = ["React", "TypeScript", "Tailwind CSS", "React Router"];

export function Homepage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
        <section className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-600">
            Számításelmélet Alapjai I–II
          </p>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Interaktív vizualizációs platform
          </h1>
          <p className="text-lg leading-relaxed text-slate-600">
            A FOTOC segít megérteni a formális nyelvek, automaták és a
            kiszámíthatóság fogalmait. Minden témakörhöz rövid elméleti
            összefoglaló és interaktív szimuláció tartozik, ahol saját
            példákon próbálhatod ki, hogyan működnek az automaták.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Válassz témát a fenti <span className="font-medium text-slate-800">FOTOC I</span> vagy{" "}
            <span className="font-medium text-slate-800">FOTOC II</span> menüből!
          </p>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-slate-700">Készítette: Szabó Anna</p>
            <p>ELTE Informatikai Kar · 2026</p>
          </div>
          <ul className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </>
  );
}
