import type { LocalizedText, ContentBlock } from "./content";

export type TopicGroup =
  | "foundations"
  | "regular"
  | "context-free"
  | "context-sensitive"
  | "computability";

export type TopicMeta = {
  id: string;
  order: number;

  group: TopicGroup;

  title: LocalizedText;
  summary: LocalizedText;

  lectures: number[];

  module: string | null;
};

export type Topic = {
  meta: TopicMeta;
  content: ContentBlock[];
};