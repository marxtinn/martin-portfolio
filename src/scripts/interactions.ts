// Page-wide progressive enhancements. Everything degrades to static content without JS.
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll reveal: elements start hidden only under html.js (see global.css).
const revealer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-in');
      revealer.unobserve(entry.target);
    }
  },
  { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
);
document.querySelectorAll('[data-reveal]').forEach((el) => revealer.observe(el));

// Count-up numbers when the metrics strip enters view.
const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);
const counter = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      counter.unobserve(entry.target);
      const el = entry.target as HTMLElement;
      const target = Number(el.dataset.count);
      if (reduceMotion) continue;
      const start = performance.now();
      const duration = 1400;
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        el.textContent = String(Math.round(target * easeOut(t)));
        if (t < 1) requestAnimationFrame(tick);
      };
      el.textContent = '0';
      requestAnimationFrame(tick);
    }
  },
  { threshold: 0.6 },
);
document.querySelectorAll('[data-count]').forEach((el) => counter.observe(el));

// Spotlight border: track pointer position as CSS variables on each tile.
if (matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll<HTMLElement>('[data-spotlight]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}
