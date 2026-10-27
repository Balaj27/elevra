'use client';

import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {firm} from '../lib/firm-content';

const links = [['Home', '/'], ['About Us', '/about'], ['Services', '/services'], ['Industries', '/industries'], ['Contact Us', '/contact']];

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
    const backgrounds = [...document.querySelectorAll('#main,[data-site-header]')].map(element => ({element, inert:element.inert}));
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
      <Link className="mobile-menu-brand" href="/" prefetch={false} onClick={onClose} aria-label={firm.name+' home'}>
        <img className="firm-logo firm-logo-light" src={firm.logo} width="606" height="158" alt={firm.name} />
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
        <div><span className="mobile-menu-detail-label">Sugar Land Office</span><span>{firm.street}<br/>{firm.city}</span></div>
        <div><span className="mobile-menu-detail-label">Office Hours</span><span>{firm.hours}<br/>{firm.days}</span></div>
        <div><span className="mobile-menu-detail-label">Service Area</span><span>Greater Houston<br/>Nationwide</span></div>
        <div><span className="mobile-menu-detail-label">Get Started</span><Link href="/contact" onClick={onClose}>Free consultation <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={{display:'inline-block',verticalAlign:'-2px'}}><path d="M6 18 18 6M6 6h12v12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></Link></div>
      </div>
    </div>
  </div>;
}
