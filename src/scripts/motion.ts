export async function initMotion() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = document.querySelector<HTMLElement>('.hero');

  if (reduceMotion || !hero) return;

  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  const context = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
      gsap.from(element, {
        y: 38,
        opacity: 0,
        duration: 1.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 88%',
          once: true,
        },
      });
    });

    gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
      const items = Array.from(group.querySelectorAll<HTMLElement>('[data-reveal-item]'));
      if (items.length === 0) return;

      gsap.from(items, {
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: group,
          start: 'top 86%',
          once: true,
        },
      });
    });

    gsap.to('.hero__copy', {
      yPercent: -7,
      opacity: 0.22,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
      },
    });

    gsap.to('.hero__scene', {
      yPercent: 11,
      scale: 0.94,
      opacity: 0.42,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
      },
    });

    gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((element) => {
      const trigger = element.closest<HTMLElement>('.project') ?? element;

      gsap.fromTo(
        element,
        { yPercent: -2.4, scale: 1.035 },
        {
          yPercent: 2.4,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    });

    document.querySelectorAll<HTMLDetailsElement>('.project-case').forEach((details) => {
      details.addEventListener('toggle', () => {
        window.requestAnimationFrame(() => ScrollTrigger.refresh());
      });
    });

    if (document.fonts?.ready) {
      void document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  }, document.body);

  window.addEventListener('pagehide', () => context.revert(), { once: true });
}
