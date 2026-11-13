const header = document.querySelector<HTMLElement>('[data-header]');
const main = document.querySelector<HTMLElement>('main');
const footer = document.querySelector<HTMLElement>('.site-footer');
const menuToggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const menuPanel = document.querySelector<HTMLElement>('[data-menu-panel]');
const menuLabel = document.querySelector<HTMLElement>('[data-menu-label]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let menuOpen = false;

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 12 && !menuOpen);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const scrollToInitialHash = () => {
  if (!window.location.hash || window.location.hash.length < 2) return;

  let target: HTMLElement | null = null;
  try {
    target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
  } catch {
    return;
  }

  if (!target) return;

  target.scrollIntoView({
    behavior: reduceMotion.matches ? 'auto' : 'smooth',
    block: 'start',
  });
};

const scheduleInitialHashScroll = () => {
  if (!window.location.hash) return;

  const run = () => {
    window.requestAnimationFrame(() => scrollToInitialHash());
  };

  if (document.fonts?.ready) {
    void document.fonts.ready.then(run);
  } else {
    run();
  }
};

if (document.readyState === 'complete') scheduleInitialHashScroll();
else window.addEventListener('load', scheduleInitialHashScroll, { once: true });

const focusableSelector =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const getMenuFocusables = (): HTMLElement[] => {
  if (!menuPanel || !menuToggle) return [];
  const inside = Array.from(menuPanel.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => element.offsetParent !== null,
  );
  return [menuToggle, ...inside];
};

const openMenu = () => {
  if (!menuToggle || !menuPanel || menuOpen) return;

  menuOpen = true;
  menuPanel.inert = false;
  menuPanel.setAttribute('aria-hidden', 'false');
  menuPanel.classList.add('is-open');
  menuToggle.setAttribute('aria-expanded', 'true');
  if (menuLabel) menuLabel.textContent = 'Close';
  document.body.classList.add('menu-open');
  header?.classList.remove('is-scrolled');
  header?.classList.add('is-menu-open');
  if (main) main.inert = true;
  if (footer) footer.inert = true;

  requestAnimationFrame(() => {
    menuPanel.querySelector<HTMLAnchorElement>('[data-menu-link]')?.focus();
  });
};

const closeMenu = (restoreFocus = true) => {
  if (!menuToggle || !menuPanel || !menuOpen) return;

  menuOpen = false;
  menuPanel.classList.remove('is-open');
  menuPanel.setAttribute('aria-hidden', 'true');
  menuPanel.inert = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  if (menuLabel) menuLabel.textContent = 'Menu';
  document.body.classList.remove('menu-open');
  header?.classList.remove('is-menu-open');
  if (main) main.inert = false;
  if (footer) footer.inert = false;
  window.setTimeout(() => {
    if (restoreFocus) menuToggle.focus();
    updateHeader();
  }, reduceMotion.matches ? 0 : 60);
};

if (menuToggle && menuPanel) {
  menuToggle.addEventListener('click', () => {
    if (menuOpen) closeMenu();
    else openMenu();
  });

  menuPanel.addEventListener('click', (event) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>('a');
    if (link) closeMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (!menuOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusables = getMenuFocusables();
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (!focusables.includes(active as HTMLElement)) {
      event.preventDefault();
      first.focus();
      return;
    }

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const desktopQuery = window.matchMedia('(min-width: 1025px)');
  desktopQuery.addEventListener('change', (event) => {
    if (event.matches && menuOpen) closeMenu(false);
  });
}

const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]'));
const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));

if (sections.length > 0 && navLinks.length > 0) {
  const setActiveSection = (id: string) => {
    navLinks.forEach((link) => {
      const isActive = link.dataset.sectionId === id;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    },
    {
      rootMargin: '-42% 0px -50% 0px',
      threshold: 0,
    },
  );

  sections.forEach((section) => spy.observe(section));
}

const backToTop = document.querySelector<HTMLButtonElement>('[data-back-to-top]');
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion.matches ? 'auto' : 'smooth',
    });
  });
}

const copyButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-copy-email]'));

const copyToClipboard = async (text: string) => {
  if (!navigator.clipboard?.writeText) {
    throw new Error('Clipboard API unavailable');
  }

  await navigator.clipboard.writeText(text);
};

copyButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const email = button.dataset.copyEmail;
    if (!email) return;

    const label = button.querySelector<HTMLElement>('[data-copy-label]') ?? button;
    const status = document.querySelector<HTMLElement>('[data-copy-status]');
    const original = label.textContent ?? 'Copy email';

    try {
      await copyToClipboard(email);
      label.textContent = 'Copied';
      if (status) status.textContent = `${email} copied to clipboard.`;
      window.setTimeout(() => {
        label.textContent = original;
        if (status) status.textContent = '';
      }, 2600);
    } catch {
      if (status) status.textContent = `Could not copy automatically. The email address is ${email}.`;
    }
  });
});
