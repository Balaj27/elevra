// Save the original Framer timing before the converters remove its runtime.
export function annotateMotion($) {
  let appearances = {};
  try { appearances = JSON.parse($('#__framer__appearAnimationsContent').text()); } catch {}
  $('[style], [data-framer-appear-id]').each((_, node) => {
    const element = $(node);
    if (element.is('nav') || element.find('nav').length) return;
    const style = element.attr('style') || '';
    const appearance = appearances[element.attr('data-framer-appear-id')]?.default;
    const reveal = /will-change:\s*transform/.test(style) && /opacity:\s*0(?:\.001)?(?:;|$)/.test(style);
    if (!appearance && !reveal) return;
    // A ticker owns its transform; reveal its container instead of the track.
    if (node.tagName === 'ul') return;
    element.attr('data-motion-reveal', '');
    element.attr('data-motion-y', String(appearance?.initial?.y ?? (/translateY\(([-\d.]+)px\)/.exec(style)?.[1] || 0)));
    element.attr('data-motion-duration', String((appearance?.animate?.transition?.duration || .85) * 1000));
    element.attr('data-motion-delay', String((appearance?.animate?.transition?.delay || 0) * 1000));
  });
}
