export const localPaths = new Set(['/', '/about', '/services', '/insights', '/contact']);

export function resolveHref(href) {
  if (!href || href.startsWith('#') || /^(mailto:|tel:|data:)/i.test(href)) return href;
  const url = new URL(href, 'https://elevra.framer.media/');
  if (url.origin !== 'https://elevra.framer.media') return href;
  const path = url.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  const normalized = path === '/index' ? '/' : path;
  return localPaths.has(normalized) ? `${normalized}${url.search}${url.hash}` : url.href;
}
