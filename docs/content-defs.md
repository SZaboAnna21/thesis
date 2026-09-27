JSON típusok leírasa

type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | DefinitionBlock
  | TheoremBlock
  | ExampleBlock
  | NoteBlock
  | AlgorithmBlock
  | FormulaBlock
  | ListBlock
  | TableBlock
  | AutomatonBlock;

type LocalizedText = {
  hu: string;
  en?: string;
};


Heading
{
"type": "heading",
"level": 2,
"text": {
"hu": "Determinisztikus véges automata"
}}

Paragraph
{
"type": "paragraph",
"text": {
"hu": "A determinisztikus véges automata egy rendezett ötös."
}
}


Definition
{
"type": "definition",
"term": {
"hu": "Determinisztikus véges automata"
},
"content": {
"hu": "Az $A = \\langle Q, \\Sigma, \\delta, q_0, F \\rangle$ rendezett ötös..."
}
}


Theorem
{
"type": "theorem",
"kind": "tetel",
"name": {
"hu": "Myhill–Nerode tétel"
},
"statement": {
"hu": "Egy nyelv pontosan akkor reguláris..."
},
"proof": {
"hu": "A bizonyítás fő ötlete..."
}
}

Lehetséges értékek:
TypeScript
kind:
| "tetel"
| "lemma"
| "allitas"
| "kovetkezmeny";


Example
{
"type": "example",
"title": {
"hu": "Példa DVA-ra"
},
"content": {
"hu": "Legyen az automata..."
}
}

Note

{
"type": "note",
"content": {
"hu": "Figyelem: a konkatenáció nem kommutatív."
}
}

Formula

{
"type": "formula",
"latex": "\\delta : Q \\times \\Sigma \\to P(Q)"
}


List
{
"type": "list",
"ordered": false,
"items": [
{
"hu": "állapotok halmaza"
},
{
"hu": "input ábécé"
}
]
}


Algorithm
{
"type": "algorithm",
"title": {
"hu": "CYK algoritmus"
},
"steps": [
{
"title": {
"hu": "Inicializálás"
},
"content": {
"hu": "Töltsük fel az első átlót."
}
},
{
"title": {
"hu": "Iteráció"
},
"content": {
"hu": "Számoljuk ki a hosszabb részszavakat."
}
}
]
}


Table
{
"type": "table",
"headers": ["a", "b"],
"rows": [
["q1", "q2"],
["q0", "q1"]
]
}
 


Automaton
{
"type": "automaton",
"automatonId": "dfa-even-a"
}
 

A témakörök az alábbi fő kategóriákba sorolhatók: 
| id | Megjelenő név | 
|-----|-----| 
| foundations | Alapfogalmak | 
| regular | Reguláris nyelvek | 
| context-free | Környezetfüggetlen nyelvek | 
| context-sensitive | Környezetfüggő és 0-típusú nyelvek | 
| computability | Számíthatóság (II. rész) |  
# TopicMeta

Minden témakör rendelkezik metaadatokkal.

Mezők:

| mező | jelentés |
|--------|--------|
| id | egyedi azonosító |
| order | megjelenési sorrend |
| group | témakör csoport |
| title | cím |
| summary | rövid összefoglaló |
| lectures | kapcsolódó előadások |
| module | interaktív modul azonosítója |

# TopicMeta

Minden témakör rendelkezik metaadatokkal.

Mezők:

| mező | jelentés |
|--------|--------|
| id | egyedi azonosító |
| order | megjelenési sorrend |
| group | témakör csoport |
| title | cím |
| summary | rövid összefoglaló |
| lectures | kapcsolódó előadások |
| module | interaktív modul azonosítója |

{
  "id": "deterministic-finite-automata",
  "order": 7,
  "group": "regular",
  "title": {
    "hu": "Determinisztikus véges automata"
  },
  "summary": {
    "hu": "A DVA definíciója, működése és tulajdonságai."
  },
  "lectures": [4, 5],
  "module": null
}



# Matematikai jelölések

Az alkalmazás KaTeX-et használ matematikai formulák megjelenítésére.

Szabályok:

- Inline matematika: $...$
- Kiemelt képlet: formula blokk használata
- Minden matematikai jelölés LaTeX szintaxissal írandó
- JSON fájlban a \ karaktert escape-elni kell (\\)

Példa:

$A = \langle Q, \Sigma, \delta, q_0, F \rangle$

JSON formában:

{
  "type": "paragraph",
  "text": {
    "hu": "A DVA alakja: $A = \\langle Q, \\Sigma, \\delta, q_0, F \\rangle$"
  }
}
