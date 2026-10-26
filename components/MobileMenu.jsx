'use client';

import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const links = [['Home', '/'], ['About', '/about'], ['Services', '/services'], ['Insights', '/insights'], ['Contact', '/contact']];

export default function MobileMenu({ open, onClose, pathname }) {
  const [present, setPresent] = useState(false);
  const panel = useRef(null);
  const closeButton = useRef(null);
  const visible = open || present;

  useEffect(() => {
    if (open) { setPresent(true); return; }
    if (!present) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timeout = setTimeout(() => setPresent(false), reduced ? 0 : 300);
    return () => clearTimeout(timeout);
  }, [open, present]);

  useLayoutEffect(() => {
    if (!visible) return;
    const previousFocus = document.activeElement;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const backgrounds = [...document.querySelectorAll('#main')].map(element => ({element, inert:element.inert}));
    backgrounds.forEach(({element}) => { element.inert = true; });
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    closeButton.current?.focus({preventScroll:true});
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      backgrounds.forEach(({element,inert}) => {element.inert = inert;});
      if (previousFocus?.isConnected) previousFocus.focus({preventScroll:true});
    };
  }, [visible]);

  useEffect(() => {
    const desktop = matchMedia('(min-width:1200px)');
    const resized = () => { if (desktop.matches) onClose(); };
    desktop.addEventListener('change', resized);
    return () => desktop.removeEventListener('change', resized);
  }, [onClose]);

  if (!visible) return null;
  const onKeyDown = event => {
    if (event.key === 'Escape') { event.preventDefault(); onClose(); }
    if (event.key !== 'Tab') return;
    const focusable = [...panel.current.querySelectorAll('a[href],button')];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {event.preventDefault();last.focus();}
    else if (!event.shiftKey && document.activeElement === last) {event.preventDefault();first.focus();}
  };

  return <div ref={panel} className="mobile-navigation" id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Navigation" data-state={open ? 'open' : 'closing'} onKeyDown={onKeyDown}>
    <div className="mobile-menu-header">
      <Link className="mobile-menu-brand" href="/" prefetch={false} onClick={onClose} aria-label="Elevra home">
        <img src="/assets/bd5a0c313f21046b30.png" width="28" height="28" alt="" />
        <span>Elevra</span>
      </Link>
      <button ref={closeButton} className="menu-close" onClick={onClose} aria-label="Close navigation">
        <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true"><path d="m5 5 18 18M23 5 5 23" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
      </button>
    </div>
    <div className="mobile-menu-body">
      <nav className="mobile-menu-links" aria-label="Main navigation">
        {links.map(([label,href],index) => <Link key={href} prefetch={false} href={href} aria-current={pathname === href ? 'page' : undefined} onClick={onClose} style={{'--menu-item':index}}>{label}</Link>)}
      </nav>
      <div className="mobile-menu-details">
        <div><span className="mobile-menu-detail-label">Email</span><a href="mailto:hello@elevra.com">hello@elevra.com</a></div>
        <div><span className="mobile-menu-detail-label">Phone</span><a href="tel:+12345678910">+1 234 567 89 10</a></div>
        <div><span className="mobile-menu-detail-label">Location</span><span>Aspen, Colorado,<br />USA</span></div>
        <div><span className="mobile-menu-detail-label">Response Time</span><span className="mobile-menu-response">We reply within 24 hours</span></div>
      </div>
    </div>
  </div>;
}
