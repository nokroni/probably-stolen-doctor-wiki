import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const family = (label, zh, topic, pages) => ({
  label,
  translations: { 'zh-CN': zh },
  collapsed: true,
  items: pages.map((page) => ({ slug: `reference/${topic}/${page}` })),
});

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
          items: [
            family('Setup and power', '开业与供电', 'items', ['clinic-documents', 'equipment-rack', 'medicine-cabinet', 'power', 'modules']),
            family('Monitoring and diagnosis', '监护与诊断', 'items', ['monitors', 'finger-probe', 'blood-pressure', 'thermometers', 'glucose-sampler', 'twelve-lead', 'ultrasound', 'bedside-lab', 'station-controller']),
            family('Treatment equipment', '治疗设备', 'items', ['defibrillators', 'bag-mask', 'chest-compressor', 'syringe-tray', 'infusion-pump', 'ventilator', 'blood-station', 'surgery-core', 'microscope-cradle', 'recovery-cot', 'immune-regulator']),
            family('Clinic medicine', '诊所药品', 'items', ['broadguard', 'glucorescue', 'clearflow', 'pulselift', 'heparin', 'painease', 'clinic-biogel', 'pressor-bridge', 'rhythm-buffer', 'epinephrine']),
            family('Supplies and native stock', '耗材与原版物资', 'items', ['sterile-supplies', 'dressing-supplies', 'wound-adjuncts', 'native-pain-relief', 'native-infection-stock', 'native-specialty-medicine', 'counter-stock', 'exposure-stock']),
            family('Growing and chemistry', '种植与化学', 'items', ['clinic-crops', 'chemistry-tools', 'sterile-bench', 'clinic-reagents']),
          ],
        },
        family('Bedside actions', '床旁操作分类', 'procedures', ['assessment', 'monitoring', 'resuscitation', 'medicines', 'wound-care', 'transfer']),
        family('Symptoms and conditions', '症状与病症分类', 'conditions', ['symptoms', 'chest-pain', 'rhythms', 'breathing', 'infection', 'neurologic', 'abdominal', 'metabolic-exposure', 'wounds', 'major-trauma', 'recovery-specialist']),
        family('Clinic systems', '诊所系统分类', 'systems', ['progression', 'referrals', 'clinic-workflow', 'clinic-economy', 'production']),
      ],
    }),
  ],
});
