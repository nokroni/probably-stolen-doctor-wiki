import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://nokroni.github.io',
  base: '/probably-stolen-doctor-wiki',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: { en: 'Probably Stolen Doctor Wiki', 'zh-CN': 'Probably Stolen 医生模组 Wiki' },
      defaultLocale: 'root',
      locales: {
        root: { label: 'English', lang: 'en' },
        'zh-cn': { label: '简体中文', lang: 'zh-CN' },
      },
      customCss: ['./src/styles/clinic.css'],
      favicon: '/clinic-mark.svg',
      sidebar: [
        {
          label: 'Play guide', translations: { 'zh-CN': '游玩指南' },
          items: [{ slug: 'start/first-shift' }, { slug: 'start/bedside' }, { slug: 'start/practice' }],
        },
        {
          label: 'Reference', translations: { 'zh-CN': '资料索引' },
          items: [{ slug: 'reference/items' }, { slug: 'reference/procedures' }],
        },
      ],
    }),
  ],
});
