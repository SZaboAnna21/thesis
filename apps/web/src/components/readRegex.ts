import { parseRegex, regexLetters, type Regex } from "@fotoc/automata-core";

export type RegexInputState =
  | { ok: true; regex: Regex }
  | { ok: false; message: string };

// A beírt szövegből szintaxisfa, vagy egy megjeleníthető hibaüzenet.
export function readRegex(value: string, alphabet?: string[]): RegexInputState {
  const parsed = parseRegex(value);
  if (!parsed.ok) {
    return { ok: false, message: `${parsed.error.message} (${parsed.error.position + 1}. karakter)` };
  }
  if (alphabet) {
    const foreign = [...regexLetters(parsed.regex)].find((letter) => !alphabet.includes(letter));
    if (foreign !== undefined) {
      return { ok: false, message: `A(z) „${foreign}” betű nem eleme az ábécének.` };
    }
  }
  return { ok: true, regex: parsed.regex };
}
