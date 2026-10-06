import { Fragment, type ReactNode } from "react";
import katex from "katex";
import type { ContentBlock, TheoremKind } from "@fotoc/content";
import { MathText } from "./MathText";

type Props = {
  blocks: ContentBlock[];
};

const theoremLabels: Record<TheoremKind, string> = {
  tetel: "Tétel",
  lemma: "Lemma",
  allitas: "Állítás",
  kovetkezmeny: "Következmény",
};

function Collapsible({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="group rounded border border-slate-200 bg-slate-50 px-5 py-2">
      <summary className="cursor-pointer select-none font-semibold text-brand-700">
        <MathText text={title} />
      </summary>
      <div className="mt-2 flex flex-col gap-4">{children}</div>
    </details>
  );
}

function renderBlockasType(block: ContentBlock) {
  switch (block.type) {
    case "heading":
      if (block.level === 1) {
        return <h2 className="mt-16 text-3xl font-bold text-brand-700 first:mt-0"><MathText text={block.text.hu} /></h2>;
      }
      if (block.level === 2) {
        return <h3 className="mt-12 text-2xl font-bold text-brand-700"><MathText text={block.text.hu} /></h3>;
      }
      return <h4 className="mt-6 text-xl font-bold text-brand-700"><MathText text={block.text.hu} /></h4>;

    case "paragraph":
      return <p><MathText text={block.text.hu} /></p>;

    case "definition":
      return (
        <p>
          <b className="font-semibold text-brand-700"><MathText text={block.term.hu} />:</b>{" "}
          <MathText text={block.content.hu} />
        </p>
      );

    case "theorem":
      return (
        <div>
          <p>
            <b className="font-semibold text-brand-700">
              {theoremLabels[block.kind]}
              {block.name && <> (<MathText text={block.name.hu} />)</>}:
            </b>{" "}
            <MathText text={block.statement.hu} />
          </p>
          {block.proof && (
            <Collapsible title="Bizonyítás">
              <p><MathText text={block.proof.hu} /></p>
            </Collapsible>
          )}
        </div>
      );

    case "proof":
      return (
        <Collapsible title={block.title ? `Bizonyítás: ${block.title.hu}` : "Bizonyítás"}>
          {block.content.map((inner, index) => (
            <Fragment key={index}>{renderBlockasType(inner)}</Fragment>
          ))}
        </Collapsible>
      );

    case "example":
      return (
        <p>
          <i className="font-semibold">Példa:</i> <MathText text={block.content.hu} />
        </p>
      );

    case "formula":
      return (
        <div
          className="overflow-x-auto"
          dangerouslySetInnerHTML={{
            __html: katex.renderToString(block.latex, { displayMode: true, throwOnError: false }),
          }}
        />
      );

    case "list": {
      const items = block.items.map((item, index) => (
        <li key={index}><MathText text={item.hu} /></li>
      ));
      return block.ordered
        ? <ol className="list-decimal pl-8">{items}</ol>
        : <ul className="list-disc pl-8">{items}</ul>;
    }

    case "warning":
      return (
        <div className="rounded border border-amber-200 bg-amber-50 px-5 py-3 text-base text-amber-900">
          <b className="font-semibold">Vizsgacsapda:</b> <MathText text={block.text.hu} />
        </div>
      );

    case "funfact":
      return (
        <p>
          <b className="font-semibold text-brand-700">Intuíció:</b> <MathText text={block.text.hu} />
        </p>
      );

    case "table":
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-base">
            <thead className="border-b-2 border-slate-300">
              <tr>
                {block.headers.map((header, index) => (
                  <th key={index} className="py-2 pr-4 font-semibold text-brand-700"><MathText text={header} /></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-slate-200">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="py-2 pr-4"><MathText text={cell} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default: {
      // Ha új blokktípus kerül a ContentBlock-ba, itt fordítási hiba jelez.
      const unhandled: never = block;
      return unhandled;
    }
  }
}

export function TheoryRenderer({ blocks }: Props) {
  return (
    <article className="flex min-w-0 flex-col gap-4 text-lg leading-loose text-slate-800 sm:text-justify">
      {blocks.map((block, index) => (
        <Fragment key={index}>{renderBlockasType(block)}</Fragment>
      ))}
    </article>
  );
}
