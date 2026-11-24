/*
 * "Fade up on scroll" for page sections, built on IntersectionObserver (which measures what is
 * actually on screen, so it also works with the desktop CSS zoom). Disabled during SSR and for
 * visitors who prefer reduced motion: elements then simply stay visible.
 *
 * Usage:  useEffect(() => reveal(ref.current, revealConfig(delayMs)), []);
 */
const isSSR = typeof window === 'undefined';
const prefersReducedMotion =
  !isSSR && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let observer = null;

const show = el => {
  el.style.opacity = '';
  el.style.transform = '';
  // Drop the inline transition once it has played so it can't interfere with other styles.
  setTimeout(
    () => {
      el.style.transition = '';
    },
    Number(el.dataset.revealTotal) || 0,
  );
};

const getObserver = () => {
  if (!observer) {
    observer = new IntersectionObserver(
      entries =>
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            show(entry.target);
            observer.unobserve(entry.target);
          }
        }),
      // Fire as soon as the element's top edge is 40px into the screen, however tall it is (a
      // ratio threshold made tall blocks wait until a big chunk of them was already on screen).
      { threshold: 0, rootMargin: '0px 0px -40px 0px' },
    );
  }
  return observer;
};

/** Hide `el` now and fade it up when it scrolls into view. No-op when disabled or el is null. */
export const reveal = (el, { delay = 0, distance = 20, duration = 400, easing = 'ease' } = {}) => {
  if (isSSR || prefersReducedMotion || !el) {
    return;
  }
  el.style.opacity = '0';
  el.style.transform = `translateY(${distance}px)`;
  el.style.transition = `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms`;
  el.dataset.revealTotal = String(delay + duration);
  getObserver().observe(el);
};

export default reveal;
