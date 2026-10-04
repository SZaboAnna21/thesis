import { Outlet } from "react-router-dom";
import { SiteHeader } from "./SiteHeader";

export function Layout() {
  return (
    <>
      <SiteHeader />

      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-slate-700">Készítette: Szabó Anna</p>
            <p>ELTE Informatikai Kar · 2026</p>
          </div>
        </div>
      </footer>
    </>
  );
}
