import type { APIRoute } from 'astro';
import mit from '../../LICENSE?raw';
import shareAlike from '../../LICENSE-CC-BY-SA-4.0.txt?raw';
import assetNotices from '../../ASSET-NOTICES.md?raw';

export function getStaticPaths() {
  return [
    { params: { notice: 'LICENSE' }, props: { text: mit } },
    { params: { notice: 'LICENSE-CC-BY-SA-4.0' }, props: { text: shareAlike } },
    { params: { notice: 'ASSET-NOTICES' }, props: { text: assetNotices } },
  ];
}

export const GET: APIRoute = ({ props }) => new Response(props.text, {
  headers: { 'Content-Type': 'text/plain; charset=utf-8' },
});
