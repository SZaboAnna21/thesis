export type LocalizedText = {
  hu: string;
  en?: string;
};

export type HeadingBlock = {
  type: "heading";
  level: 1 | 2 | 3;
  text: LocalizedText;
};

export type ParagraphBlock = {
  type: "paragraph";
  text: LocalizedText;
};

export type DefinitionBlock = {
  type: "definition";
  term: LocalizedText;
  content: LocalizedText;
};

export type TheoremKind =
  | "tetel"
  | "lemma"
  | "allitas"
  | "kovetkezmeny";

export type TheoremBlock = {
  type: "theorem";
  kind: TheoremKind;
  name?: LocalizedText;
  statement: LocalizedText;
  proof?: LocalizedText;
};

export type ExampleBlock = {
  type: "example";
  title?: LocalizedText;
  content: LocalizedText;
};

export type FormulaBlock = {
  type: "formula";
  latex: string;
};

export type ListBlock = {
  type: "list";
  ordered: boolean;
  items: LocalizedText[];
};

export type TableBlock = {
  type: "table";
  headers: string[];
  rows: string[][];
};

export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | DefinitionBlock
  | TheoremBlock
  | ExampleBlock
  | FormulaBlock
  | ListBlock
  | TableBlock;
