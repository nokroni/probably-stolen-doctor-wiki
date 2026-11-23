# Probably Stolen Doctor Wiki

Player documentation for the Probably Stolen Doctor mod in English and Simplified Chinese. The reference groups equipment and medicines into short family pages, and covers in-game symptoms, diagnoses, procedures, and clinic systems. The guides use practice examples and keep campaign encounters and plot choices out of the site and its search index.

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
- Document readiness checks and controls. Describe campaign-only items by type and use. A standalone specialist diagnosis name may appear in the collapsed, search-excluded condition reference. Keep named cases, plot triggers, and campaign outcomes out of pages, screenshot crops, and search.
- The header art uses the Doctor mod’s original monitor sprite and room illustration. Interface diagrams are original teaching illustrations. Screenshots are game frames cropped to the relevant controls, with the capture build given in each caption.

The Pages workflow builds and serves `main`. The site uses [Starlight](https://starlight.astro.build/) on [Astro](https://docs.astro.build/en/guides/deploy/github/).

## Licensing

- Original site code uses the [MIT License](LICENSE).
- Original English and Simplified Chinese guides, references, and teaching illustrations use [CC BY-SA 4.0](LICENSE-CC-BY-SA-4.0.txt).
- Game captures, Doctor mod artwork, trademarks, and third-party material follow the [asset exceptions](ASSET-NOTICES.md). The wiki displays the policy in [English](https://nokroni.github.io/probably-stolen-doctor-wiki/licensing/) and [简体中文](https://nokroni.github.io/probably-stolen-doctor-wiki/zh-cn/licensing/).
