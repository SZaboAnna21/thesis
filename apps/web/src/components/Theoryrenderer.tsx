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

function renderBlockasType(block: ContentBlock) {
  switch (block.type) {
    case "heading": {
      const Heading = `h${block.level + 1}` as "h2" | "h3" | "h4";
      return <Heading><MathText text={block.text.hu} /></Heading>;
    }

    case "paragraph":
      return <p><MathText text={block.text.hu} /></p>;

    case "definition":
      return (
        <p>
          <strong>Definíció ({block.term.hu}).</strong> <MathText text={block.content.hu} />
        </p>
      );

    case "theorem":
      return (
        <div>
          <p>
            <strong>
              {theoremLabels[block.kind]}
              {block.name && ` (${block.name.hu})`}.
            </strong>{" "}
            <MathText text={block.statement.hu} />
          </p>
          {block.proof && (
            <p>
              <em>Bizonyítás.</em> <MathText text={block.proof.hu} />
            </p>
          )}
        </div>
      );

    case "example":
      return (
        <p>
          <strong>Példa{block.title && ` (${block.title.hu})`}.</strong>{" "}
          <MathText text={block.content.hu} />
        </p>
      );

    case "formula":
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: katex.renderToString(block.latex, { displayMode: true, throwOnError: false }),
          }}
        />
      );

    case "list": {
      const items = block.items.map((item, index) => (
        <li key={index}><MathText text={item.hu} /></li>
      ));
      return block.ordered ? <ol>{items}</ol> : <ul>{items}</ul>;
    }

    case "table":
      return (
        <table>
          <thead>
            <tr>
              {block.headers.map((header, index) => (
                <th key={index}><MathText text={header} /></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}><MathText text={cell} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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
    <>
      {blocks.map((block, index) => (
        <div key={index}>{renderBlockasType(block)}</div>
      ))}
    </>
  );
}
