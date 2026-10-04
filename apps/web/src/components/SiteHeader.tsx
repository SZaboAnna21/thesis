import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { topics, type Topic } from "@fotoc/content";

const fotoc1Topics = topics.filter((t) => t.meta.group !== "computability");
const fotoc2Topics = topics.filter((t) => t.meta.group === "computability");

type DropdownProps = {
  label: string;
  items: Topic[];
};

function TopicDropdown({ label, items }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);


  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          open
            ? "bg-brand-50 text-brand-700"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        {label}
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 z-20 mt-2 w-72 rounded-xl bg-white p-1.5 shadow-lg ring-1 ring-slate-900/5">
          {items.length === 0 ? (
            <p className="px-3 py-2 text-sm text-slate-500">
              TODO.
            </p>
          ) :(
            <ul className="max-h-[70vh] overflow-y-auto">
              {items.map((topic) => (
                <li key={topic.meta.id}>
                  <Link to={`/topics/${topic.meta.id}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-700">
                    {topic.meta.title.hu}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center gap-8 px-6 py-3">
        <Link to="/" className="flex items-center gap-2">
          <svg className="size-6 text-brand-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v4.875h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        </Link>
        <nav className="flex items-center gap-1">
          <TopicDropdown label="Számításelmélet I" items={fotoc1Topics} />
          <TopicDropdown label="Számításelmélet II" items={fotoc2Topics} />
        </nav>
      </div>
    </header>
  );
}
