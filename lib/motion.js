const ease = 'cubic-bezier(.22, 1, .36, 1)';

// Native animations leave the server-rendered content readable without JavaScript.
// Each route owns its observers, animation frames, and cloned ticker items.
export function setupMotion(root = document) {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let stop = () => {};
  const start = () => {
    stop();
    if (preference.matches) return;
    const cleanups = [];
    const animations = new Set();
    const frames = new Set();
    const schedule = callback => {
      const id = requestAnimationFrame(time => { frames.delete(id); callback(time); });
      frames.add(id);
    };
    const listen = (element, event, handler) => {
      element.addEventListener(event, handler);
      cleanups.push(() => element.removeEventListener(event, handler));
    };
    const play = (element, keyframes, options) => {
      const animation = element.animate(keyframes, options);
      animations.add(animation);
      return animation;
    };
    const observed = new Map();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observed.get(entry.target)?.forEach(callback=>callback());
        observer.unobserve(entry.target);
      }
    }, {threshold:.08, rootMargin:'0px 0px -3% 0px'});
    const onceVisible = (element, callback, anchor=element) => {
      const callbacks=observed.get(anchor)||[];
      callbacks.push(callback);
      observed.set(anchor,callbacks);
      observer.observe(anchor);
    };

    root.querySelectorAll('[data-motion-reveal]').forEach(element => {
      // Fixed navigation must never wait on an offscreen ancestor to reveal it.
      if (element.matches('nav') || element.querySelector('nav')) return;
      const base = element.style.transform && element.style.transform !== 'none' ? element.style.transform : '';
      const filter = getComputedStyle(element).filter;
      const y = Number(element.dataset.motionY || 40);
      const animation = play(element, [
        {opacity:0, transform:`${base} translate3d(0,${y}px,0)`, filter:'blur(5px)'},
        {opacity:1, transform:base || 'none', filter},
      ], {duration:Number(element.dataset.motionDuration || 850), easing:ease, fill:'both'});
      animation.pause();
      animation.currentTime = 0;
      // Observe a stable layout box. A translated child can be fully clipped by
      // its own card and would otherwise never intersect to start its animation.
      let parent=element.parentElement;
      while(parent && getComputedStyle(parent).display==='contents') parent=parent.parentElement;
      const anchor=parent && /hidden|clip/.test(getComputedStyle(parent).overflowY) ? parent : element;
      onceVisible(element, () => {
        // Initial hero timings retain the source delay; scrolling uses a short stagger.
        const rect = element.getBoundingClientRect();
        const initial = scrollY < 80 && rect.top < innerHeight;
        animation.effect.updateTiming({delay:initial ? Number(element.dataset.motionDelay || 0) : 55});
        animation.play();
        animation.onfinish = () => {
          element.dataset.motionRevealed = 'true';
          animation.cancel();
          animations.delete(animation);
        };
      },anchor || element);
      cleanups.push(() => { delete element.dataset.motionRevealed; });
    });

    root.querySelectorAll('.framer-w0i3jg-container p, .framer-10i4lka-container p, .framer-1r667kc-container p, .framer-1abot5y-container p').forEach(element => {
      if (element.style.pointerEvents === 'none') return;
      const finalText = element.textContent.trim();
      const match = /^(-?\d+(?:\.\d+)?)([%+x]?)$/.exec(finalText);
      if (!match) return;
      const target = Number(match[1]);
      const decimals = (match[1].split('.')[1] || '').length;
      const previousLabel = element.getAttribute('aria-label');
      element.setAttribute('aria-label', finalText);
      element.dataset.motionCounter = finalText;
      element.textContent = `${(0).toFixed(decimals)}${match[2]}`;
      onceVisible(element, () => {
        const startAt = performance.now() + 120;
        const tick = time => {
          const progress = Math.max(0, Math.min(1, (time-startAt)/1450));
          const value = target * (1-Math.pow(1-progress,3));
          element.textContent = `${value.toFixed(decimals)}${match[2]}`;
          if (progress < 1) schedule(tick);
          else element.textContent = finalText;
        };
        schedule(tick);
      });
      cleanups.push(() => {
        element.textContent = finalText;
        delete element.dataset.motionCounter;
        if(previousLabel === null) element.removeAttribute('aria-label'); else element.setAttribute('aria-label',previousLabel);
      });
    });

    root.querySelectorAll('[data-framer-name="Graph "]').forEach(element => {
      const oldOrigin = element.style.transformOrigin;
      element.style.transformOrigin = 'left center';
      const animation = play(element,[{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:1200,easing:ease,fill:'both'});
      animation.pause(); animation.currentTime = 0;
      onceVisible(element,()=>{animation.play();animation.onfinish=()=>animation.cancel();});
      cleanups.push(()=>{element.style.transformOrigin=oldOrigin;});
    });

    root.querySelectorAll('.framer-sY8Rs > ul, .framer-xtuulm > ul').forEach(track => {
      const originals = [...track.children];
      if (!originals.length) return;
      const parent = track.parentElement;
      const oldStyle = track.getAttribute('style');
      const clones = [];
      let animation;
      let visible = false;
      let hovered = false;
      const sync = () => {
        if (!animation) return;
        if(visible && !hovered && !document.hidden) animation.play(); else animation.pause();
      };
      const build = () => {
        animation?.cancel();
        clones.splice(0).forEach(clone=>clone.remove());
        track.style.width = 'max-content';
        track.style.maxWidth = 'none';
        track.style.transform = 'none';
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        const first = originals[0].getBoundingClientRect();
        const last = originals.at(-1).getBoundingClientRect();
        const distance = last.right-first.left+gap;
        if (distance < 1) return;
        const repeats = Math.max(1,Math.ceil(parent.clientWidth/distance));
        for(let repeat=0;repeat<repeats;repeat++) originals.forEach(item=>{
          const clone = item.cloneNode(true);
          clone.setAttribute('aria-hidden','true');
          clone.setAttribute('inert','');
          clone.dataset.motionClone = 'true';
          clone.removeAttribute('id');
          clone.querySelectorAll('[id]').forEach(node=>node.removeAttribute('id'));
          track.append(clone); clones.push(clone);
        });
        animation = play(track,[{transform:'translate3d(0,0,0)'},{transform:`translate3d(-${distance}px,0,0)`}],{
          duration:distance/(parent.classList.contains('framer-xtuulm') ? 42 : 30)*1000,
          iterations:Infinity,easing:'linear',
        });
        track.dataset.motionTicker = 'true';
        sync();
      };
      const visibility = new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();});
      visibility.observe(parent);
      const resize = new ResizeObserver(build);
      resize.observe(parent);
      listen(parent,'pointerenter',()=>{hovered=true;sync();});
      listen(parent,'pointerleave',()=>{hovered=false;sync();});
      listen(parent,'focusin',()=>{hovered=true;sync();});
      listen(parent,'focusout',event=>{if(!parent.contains(event.relatedTarget)){hovered=false;sync();}});
      listen(document,'visibilitychange',sync);
      build();
      cleanups.push(()=>{
        visibility.disconnect(); resize.disconnect(); animation?.cancel();
        clones.forEach(clone=>clone.remove());
        if(oldStyle === null) track.removeAttribute('style'); else track.setAttribute('style',oldStyle);
        delete track.dataset.motionTicker;
      });
    });

    const videos = new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
      if(isIntersecting && !document.hidden) target.play().catch(()=>{}); else target.pause();
    }),{threshold:.1});
    root.querySelectorAll('video[muted]').forEach(video=>{
      video.muted = true; video.playsInline = true; videos.observe(video);
      cleanups.push(()=>video.pause());
    });
    stop = () => {
      observer.disconnect(); videos.disconnect();
      frames.forEach(cancelAnimationFrame);
      animations.forEach(animation=>animation.cancel());
      cleanups.reverse().forEach(cleanup=>cleanup());
    };
  };
  start();
  preference.addEventListener('change',start);
  return () => { preference.removeEventListener('change',start); stop(); };
}
