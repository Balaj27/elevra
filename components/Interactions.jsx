'use client';

import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { setupMotion } from '../lib/motion';
import MobileMenu from './MobileMenu';

export default function Interactions() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useLayoutEffect(() => setupMotion(), [pathname]);
  useEffect(() => {
    setMenuOpen(false);
    const cleanups = [];
    const listen = (node, event, handler) => {
      node.addEventListener(event, handler);
      cleanups.push(() => node.removeEventListener(event, handler));
    };
    document.querySelectorAll('[data-framer-name="Menu wrap"]').forEach(trigger => {
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('aria-label', 'Toggle navigation');
      trigger.setAttribute('aria-controls', 'mobile-navigation');
      const toggle = () => setMenuOpen(open => !open);
      listen(trigger, 'click', toggle);
      listen(trigger, 'keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); }
      });
    });
    listen(document, 'keydown', event => { if (event.key === 'Escape') setMenuOpen(false); });
    const filters = [...document.querySelectorAll('[data-insight-filter]')];
    const insightCards = [...document.querySelectorAll('[data-insight-category]')];
    filters.forEach(filter => {
      filter.setAttribute('role', 'button');
      filter.setAttribute('tabindex', '0');
      filter.setAttribute('aria-pressed', String(filter.dataset.insightFilter === 'All'));
      const activate = () => {
        filters.forEach(tab => {
          const active = tab === filter;
          tab.classList.toggle('framer-v-1a9n99m', active);
          tab.classList.toggle('framer-v-bx9udf', !active);
          tab.setAttribute('aria-pressed', String(active));
          tab.dataset.filterActive = String(active);
        });
        insightCards.forEach(card => {
          const visible = filter.dataset.insightFilter === 'All' || card.dataset.insightCategory === filter.dataset.insightFilter;
          card.style.display = visible ? '' : 'none';
        });
      };
      listen(filter,'click',activate);
      listen(filter,'keydown',event => { if(event.key === 'Enter' || event.key === ' ') {event.preventDefault();activate();} });
    });
    document.querySelectorAll('.framer-e9hkzq').forEach(trigger => {
      trigger.setAttribute('role','button');
      trigger.setAttribute('tabindex','0');
      trigger.setAttribute('aria-label',`View ${trigger.textContent.trim()} milestone`);
      const activate = () => {
        const target = [...document.querySelectorAll('.framer-p69ig0')].find(item => item.textContent.trim() === trigger.textContent.trim() && item.getBoundingClientRect().height > 0);
        target?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',block:'center'});
      };
      listen(trigger,'click',activate);
      listen(trigger,'keydown',event => {if(event.key === 'Enter' || event.key === ' ') {event.preventDefault();activate();}});
    });
    document.querySelectorAll('.framer-wCdDT').forEach(group => {
      const cards = [...group.querySelectorAll('[data-process-card]')];
      cards.forEach(card => {
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-expanded', String(card.dataset.processCard === '0'));
        card.parentElement.dataset.processWrapper = card.dataset.processCard === '0' ? 'open' : 'closed';
        const activate = () => cards.forEach(sibling => {
          const mobile = sibling.dataset.framerName.toLowerCase().includes('mobile');
          const active = sibling === card;
          ['framer-v-1l06fgw','framer-v-1u9of9p','framer-v-1no2b2','framer-v-1b6vnyr'].forEach(name => sibling.classList.remove(name));
          sibling.classList.add(mobile ? (active ? 'framer-v-1no2b2' : 'framer-v-1b6vnyr') : (active ? 'framer-v-1l06fgw' : 'framer-v-1u9of9p'));
          sibling.setAttribute('aria-expanded', String(active));
          sibling.parentElement.dataset.processWrapper = active ? 'open' : 'closed';
        });
        listen(card, 'click', activate);
        listen(card, 'pointerenter', event => { if(event.pointerType === 'mouse' && matchMedia('(hover:hover)').matches) activate(); });
        listen(card, 'focusin', activate);
        listen(card, 'keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(); } });
      });
    });
    // The export contains all FAQ answers. Restore disclosure interaction without Framer.
    document.querySelectorAll('.framer-u5gfX').forEach((item, index) => {
      const trigger = item.querySelector('[data-framer-name="Question wrapper"]');
      const answer = item.querySelector('[data-framer-name="Answer Wrapper"]');
      if (!trigger || !answer) return;
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('tabindex', '0');
      answer.id = `faq-answer-${index}`;
      trigger.setAttribute('aria-controls', answer.id);
      let open = /Open/i.test(item.dataset.framerName || '');
      let disclosureAnimation;
      cleanups.push(() => disclosureAnimation?.cancel());
      const update = (animate = false) => {
        const previousHeight = answer.getBoundingClientRect().height;
        disclosureAnimation?.cancel();
        trigger.setAttribute('aria-expanded', String(open));
        answer.style.display = open ? '' : 'none';
        answer.style.height = open ? 'auto' : '';
        answer.style.opacity = open ? '1' : '0';
        item.style.height = 'auto';
        item.querySelector('.framer-IRM4W')?.setAttribute('data-open', String(open));
        if(animate && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
          answer.style.display = '';
          answer.style.height = 'auto';
          answer.style.overflow = 'hidden';
          const nextHeight = open ? answer.scrollHeight : 0;
          disclosureAnimation = answer.animate([
            {height:`${previousHeight}px`,opacity:open ? 0 : 1},
            {height:`${nextHeight}px`,opacity:open ? 1 : 0},
          ],{duration:340,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
          disclosureAnimation.onfinish = () => {
            answer.style.display = open ? '' : 'none';
            answer.style.height = open ? 'auto' : '';
            answer.style.opacity = open ? '1' : '0';
            disclosureAnimation.cancel();
          };
        }
      };
      update();
      const toggle = () => { open = !open; update(true); };
      listen(trigger, 'click', toggle);
      listen(trigger, 'keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); }
      });
    });
    document.querySelectorAll('form').forEach(form => {
      listen(form, 'submit', event => {
        event.preventDefault();
        let status = form.parentElement.querySelector('[role="status"]');
        if (!status) {
          status = document.createElement('p');
          status.setAttribute('role', 'status');
        status.style.cssText = `color:${form.querySelector('textarea') ? '#212d3d' : 'white'};font:14px sans-serif;margin-top:12px`;
          form.after(status);
        }
        status.textContent = form.querySelector('textarea')
          ? 'Message delivery is not connected yet. Please email hello@elevra.com directly.'
          : 'Newsletter signup is not connected yet. Please contact hello@elevra.com.';
      });
    });
    document.documentElement.dataset.elevraReady = 'true';
    return () => { cleanups.forEach(cleanup => cleanup()); delete document.documentElement.dataset.elevraReady; };
  }, [pathname]);
  useEffect(() => {
    document.querySelectorAll('[data-framer-name="Menu wrap"]').forEach(trigger => trigger.setAttribute('aria-expanded', String(menuOpen)));
  }, [menuOpen]);
  return <MobileMenu open={menuOpen} onClose={closeMenu} pathname={pathname} />;
}
