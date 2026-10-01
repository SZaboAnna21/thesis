import katex from "katex";
import "katex/dist/katex.min.css";

type Props = {
  text: string;
};

// A szövegben $...$ között álló részeket KaTeX-szel rajzolja ki.
export function MathText({ text }: Props) {
  const parts = text.split(/(\$[^$]+\$)/);

  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("$") && part.endsWith("$") ? (
          <span
            key={index}
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(part.slice(1, -1), { throwOnError: false }),
            }}
          />
        ) : (
          part
        ),
      )}
    </>
  );
}
