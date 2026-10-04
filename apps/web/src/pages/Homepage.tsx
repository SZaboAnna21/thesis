import { SiteHeader } from "../components/SiteHeader";

const technologies = ["React", "TypeScript", "Tailwind CSS", "React Router"];

export function Homepage() {
  return (
    <>
      <SiteHeader />

      <main className="relative isolate flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-brand-100/60 to-transparent" />
        <section className="mx-auto max-w-5xl px-6 py-20">
          <span className="mb-4 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
            Számításelmélet Alapjai I–II
          </span>
          <h1 className="mb-6 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Interaktív <span className="text-brand-600">vizualizációs</span> platform
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-slate-600">
            A FOTOC segít megérteni a formális nyelvek, automaták és a
            kiszámíthatóság fogalmait. Minden témakörhöz rövid elméleti
            összefoglaló és interaktív szimuláció tartozik, ahol saját
            példákon próbálhatod ki, hogyan működnek az automaták.
          </p>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
            Válassz témát a fenti <span className="font-medium text-brand-700">Számításelmélet I</span> vagy{" "}
            <span className="font-medium text-brand-700">Számításelmélet II</span> menüből!
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
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600"
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
