import type { ContentBlock } from "@fotoc/content";

type Props = {
  blocks: ContentBlock[];
};

function renderBlockasType(block: ContentBlock) {
  switch (block.type) {
    case "heading":
      return <h2>{block.text.hu}</h2>;

    case "paragraph":
      return <p>{block.text.hu}</p>;

    default:
      return null;
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
