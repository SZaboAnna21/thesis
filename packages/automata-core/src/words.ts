export function reverse(word: string): string {
    return word.split("").reverse().join("");
}

export function concatenate(u: string, v: string): string {
    return u + v;
}

export function power(word: string, n: number): string {
    if (n === 0) {
        return "";
    }
    let toReturn = "";
    for (let i = 0; i < n; i++) {
        toReturn += word;
    }
    return toReturn;
}

export function prefixes(word: string): string[] {
    const result: string[] = [];

    for (let i = 0; i <= word.length; i++) {
        result.push(word.substring(0, i));
    }
    return result;
}

export function properPrefixes(word: string): string[] {
    const result: string[] = [];
    for (let i = 0; i < word.length; i++) {
        result.push(word.substring(0, i));
    }
    return result;
}

export function suffixes(word: string): string[] {
    const result: string[] = [];
    for (let i = 0; i <= word.length; i++) {
        result.push(word.substring(i));
    }
    return result;
}

export function properSuffixes(word: string): string[] {
    const result: string[] = [];
    for (let i = 1; i <= word.length; i++) {
        result.push(word.substring(i));
    }


    return result;
}

export type Outputmap = {
    word: string;
    length: number;
    reverse: string;
    concatenate: string;
    power: string;
    prefixes: string[];
    properPrefixes: string[];
    suffixes: string[];
    properSuffixes: string[];
};

export function runAll(word: string, other: string = "", n: number = 2): Outputmap {
    return {
        word,
        length: word.length,
        reverse: reverse(word),
        concatenate: concatenate(word, other),
        power: power(word, n),
        prefixes: prefixes(word),
        properPrefixes: properPrefixes(word),
        suffixes: suffixes(word),
        properSuffixes: properSuffixes(word),
    };
}
