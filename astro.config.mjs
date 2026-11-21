import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import itemCategories from './src/item-categories.json' with { type: 'json' };

const family = (label, zh, topic, pages) => ({
  label,
  translations: { 'zh-CN': zh },
  collapsed: true,
  items: pages.map((page) => ({ slug: `reference/${topic}/${page}` })),
});

const itemGroups = itemCategories.map(({ slug, label, items }) =>
  family(label.en, label['zh-CN'], 'items', [slug, ...items]),
);

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
          items: [
            { slug: 'reference/items' },
            { slug: 'reference/procedures' },
            { slug: 'reference/conditions' },
            { slug: 'reference/systems' },
          ],
        },
        {
          label: 'Equipment and supplies', translations: { 'zh-CN': '设备与物资' }, collapsed: true,
          items: itemGroups,
        },
        family('Bedside actions', '床旁操作分类', 'procedures', ['assessment', 'monitoring', 'resuscitation', 'medicines', 'wound-care', 'transfer', 'ending-a-visit']),
        family('Find by symptom', '按症状查找', 'conditions', ['symptoms', 'symptoms/heart-breathing', 'symptoms/general-neurologic', 'symptoms/injury-exposure', 'symptoms/monitor-signals']),
        family('Find by condition', '按病症查找', 'conditions', ['chest-pain', 'rhythms', 'breathing', 'infection', 'neurologic', 'abdominal', 'metabolic-exposure', 'wounds', 'major-trauma', 'recovery-specialist']),
        family('Clinic systems', '诊所系统分类', 'systems', ['progression', 'medical-stock', 'referrals', 'clinic-workflow', 'clinic-economy', 'case-review', 'production']),
      ],
    }),
  ],
});
