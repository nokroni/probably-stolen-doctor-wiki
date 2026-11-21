# Probably Stolen Doctor Wiki

Player documentation for the Probably Stolen Doctor mod in English and Simplified Chinese. The public reference describes in-game items and actions. The guides use manikin examples and keep campaign encounters and plot choices out of the site and its search index.

[Open the wiki](https://nokroni.github.io/probably-stolen-doctor-wiki/) · [Doctor mod](https://github.com/nokroni/probably_stolen_doctor_mod)

## Local development

Use Node.js 24 or newer.

```shell
npm ci
npm run dev
npm run build
npm test
```

The dev and preview servers serve under `/probably-stolen-doctor-wiki/`. The production build goes to `dist/`. The link check runs on the production output.

## Editing

- Put English pages in `src/content/docs/` and their Simplified Chinese counterparts at the same relative path under `src/content/docs/zh-cn/`.
- Match player-visible terms to the game locale. Use relative links between pages so the repository path and current language stay intact.
- Keep readiness gates and visual guides public. Place campaign-only item names in the collapsed, search-excluded item index. Keep plot triggers, outcomes, and campaign patients out of the guides.
- The header art uses the Doctor mod’s original monitor sprite and room illustration. Interface diagrams are original teaching illustrations.

The Pages workflow builds and serves `main`. The site uses [Starlight](https://starlight.astro.build/) on [Astro](https://docs.astro.build/en/guides/deploy/github/).
