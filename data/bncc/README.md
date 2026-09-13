# BNCC skills (vendored)

`habilidades.json` is a subset of **bncc-dados** by **bncc.dev (mantido pela Profy)**:
https://github.com/bncc-dev/bncc-dados

- License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.pt-br). The BNCC texts themselves are official acts, not protected by copyright (Lei nº 9.610/1998, art. 8º, IV); the license covers bncc-dados' compilation, structure and identifiers.
- Source: `dados/bncc-2018/ensino-fundamental.json` at commit `daabd7dd63ae0cac0aa520b6189e79f95c24f583` (2026-08-11).
- Subset: 5º ano skills of Matemática, Língua Portuguesa, Ciências, História and Geografia, plus 6º ano Língua Inglesa (the BNCC has no English before 6º ano). 164 skills. Only `codigo`, `texto`, `componente` and `anos` are kept.

Used by `src/lib/questions.ts` to check that every question's BNCC code exists and belongs to its subject and year.

## Regenerate

From a bncc-dados checkout:

```bash
jq '[.habilidades[]
  | select(((.componente | IN("ef-comp-ma","ef-comp-lp","ef-comp-ci","ef-comp-hi","ef-comp-ge")) and (.anos | index(5)))
           or (.componente == "ef-comp-li" and (.anos | index(6))))
  | {codigo, texto, componente, anos}]
  | sort_by(.codigo)' dados/bncc-2018/ensino-fundamental.json > data/bncc/habilidades.json
```

Update the commit hash above when regenerating. This file is excluded from Prettier so it stays byte-identical to the jq output.
