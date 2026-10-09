import { es } from './es';
import { en } from './en';

const STORAGE_KEY = 'portfolio-lang';
const SUPPORTED = ['es', 'en'];

const translations = { es, en };

let currentLang = 'en';
let heroAnimationDone = false;

function resolveBrowserLang() {
  const candidates = navigator.languages?.length
    ? [...navigator.languages]
    : [navigator.language || 'en'];

  for (const raw of candidates) {
    const code = String(raw).toLowerCase().split('-')[0];
    if (code === 'es') return 'es';
    if (code === 'en') return 'en';
  }

  return 'en';
}

function getNested(obj, path) {
  return path.split('.').reduce((acc, key) => (acc != null ? acc[key] : undefined), obj);
}

export function getLocale() {
  return currentLang;
}

export function t(key) {
  return getNested(translations[currentLang], key);
}

export function getHeroStrings() {
  return {
    name: t('hero.name'),
    role: t('hero.role'),
  };
}

function resolveInitialLang() {
  const params = new URLSearchParams(window.location.search);
  const queryLang = params.get('lang');
  if (SUPPORTED.includes(queryLang)) return queryLang;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (SUPPORTED.includes(stored)) return stored;

  return resolveBrowserLang();
}

function updateMeta(lang) {
  const strings = translations[lang];
  if (!strings?.meta) return;

  const siteUrl = 'https://soniadurgom.github.io/portfolio/';

  document.documentElement.lang = lang;
  document.documentElement.dataset.lang = lang;
  document.title = strings.meta.title;

  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', strings.meta.description);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', strings.meta.ogTitle);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', strings.meta.ogDescription);

  const ogLocale = document.querySelector('meta[property="og:locale"]');
  if (ogLocale) ogLocale.setAttribute('content', lang === 'es' ? 'es_ES' : 'en_GB');

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', `${siteUrl}?lang=${lang}`);

  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) twitterTitle.setAttribute('content', strings.meta.ogTitle);

  const twitterDesc = document.querySelector('meta[name="twitter:description"]');
  if (twitterDesc) twitterDesc.setAttribute('content', strings.meta.ogDescription);

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', `${siteUrl}?lang=${lang}`);
}

function updateSchemaPerson(lang) {
  const strings = translations[lang];
  const schemaEl = document.getElementById('schema-person');
  if (!schemaEl || !strings?.meta) return;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Sonia Durán Gómez',
    jobTitle: lang === 'es' ? 'Desarrolladora Web Frontend' : 'Frontend Web Developer',
    url: 'https://soniadurgom.github.io/portfolio/',
    email: 'soniadurgom@gmail.com',
    sameAs: [
      'https://github.com/SoniaDurGom',
      'https://www.linkedin.com/in/sonia-durán-gómez-358b73189',
    ],
    knowsAbout: ['WordPress', 'PrestaShop', 'Frontend', 'CMS', 'WCAG'],
  };

  schemaEl.textContent = JSON.stringify(data);
}

function applyMailtoLinks(lang) {
  const strings = translations[lang];
  if (!strings?.mailto) return;

  document.querySelectorAll('[data-i18n-mailto]').forEach((el) => {
    const key = el.getAttribute('data-i18n-mailto');
    const data = getNested(strings.mailto, key);
    if (!data) return;
    const email = el.getAttribute('data-email') || 'soniadurgom@gmail.com';
    const params = new URLSearchParams();
    if (data.subject) params.set('subject', data.subject);
    if (data.body) params.set('body', data.body);
    el.setAttribute('href', `mailto:${email}?${params.toString()}`);
  });
}

function applyCases(strings) {
  document.querySelectorAll('.case[data-case-id]').forEach((article) => {
    const id = article.getAttribute('data-case-id');
    const caseData = strings.cases?.[id];
    if (!caseData) return;

    article.querySelector('.case__category')?.replaceChildren(document.createTextNode(caseData.category));
    article.querySelector('.case__title')?.replaceChildren(document.createTextNode(caseData.title));

    const durationEl = article.querySelector('[data-case-field="duration"]');
    if (durationEl) durationEl.textContent = caseData.duration;

    article.querySelector('[data-case-field="problem"]')?.replaceChildren(document.createTextNode(caseData.problem));
    article.querySelector('[data-case-field="solution"]')?.replaceChildren(document.createTextNode(caseData.solution));

    article.querySelectorAll('[data-case-field^="li"]').forEach((li) => {
      const field = li.getAttribute('data-case-field');
      const value = caseData[field];
      if (value != null) li.textContent = value;
    });
  });
}

function applyExperience(strings) {
  document.querySelectorAll('.timeline__item[data-exp-id]').forEach((article) => {
    const id = article.getAttribute('data-exp-id');
    const exp = strings.experience?.[id];
    if (!exp) return;

    article.querySelector('[data-exp-field="dateStart"]')?.replaceChildren(document.createTextNode(exp.dateStart));
    article.querySelector('[data-exp-field="dateEnd"]')?.replaceChildren(document.createTextNode(exp.dateEnd));
    article.querySelector('[data-exp-field="location"]')?.replaceChildren(document.createTextNode(exp.location));
    article.querySelector('[data-exp-field="role"]')?.replaceChildren(document.createTextNode(exp.role));
    article.querySelector('[data-exp-field="company"]')?.replaceChildren(document.createTextNode(exp.company));
    article.querySelector('[data-exp-field="intro"]')?.replaceChildren(document.createTextNode(exp.intro));

    article.querySelectorAll('[data-exp-field^="li"]').forEach((li) => {
      const field = li.getAttribute('data-exp-field');
      const value = exp[field];
      if (value != null) li.textContent = value;
    });
  });
}

function applyTestimonials(strings) {
  document.querySelectorAll('.testimonial[data-testimonial]').forEach((block) => {
    const id = block.getAttribute('data-testimonial');
    const data = strings.testimonials?.[id];
    if (!data) return;

    block.querySelector('[data-testimonial-field="quote"]')?.replaceChildren(document.createTextNode(data.quote));
    block.querySelector('[data-testimonial-field="author"]')?.replaceChildren(document.createTextNode(data.author));
    block.querySelector('[data-testimonial-field="role"]')?.replaceChildren(document.createTextNode(data.role));

    const dateEl = block.querySelector('[data-testimonial-field="date"]');
    if (dateEl) {
      if (data.date) {
        dateEl.textContent = data.date;
        dateEl.hidden = false;
      } else {
        dateEl.textContent = '';
        dateEl.hidden = true;
      }
    }

    const noteEl = block.querySelector('[data-testimonial-field="originalNote"]');
    if (noteEl) {
      if (data.originalNote) {
        noteEl.textContent = data.originalNote;
        noteEl.hidden = false;
      } else {
        noteEl.textContent = '';
        noteEl.hidden = true;
      }
    }
  });
}

export function applyLanguage(lang, { skipHero = false, forceHero = false } = {}) {
  if (!SUPPORTED.includes(lang)) lang = 'en';

  currentLang = lang;
  localStorage.setItem(STORAGE_KEY, lang);

  const strings = translations[lang];
  if (!strings) return;

  updateMeta(lang);
  updateSchemaPerson(lang);

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const value = getNested(strings, key);
    if (value != null) el.textContent = value;
  });

  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.getAttribute('data-i18n-html');
    const value = getNested(strings, key);
    if (value != null) el.innerHTML = value;
  });

  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria');
    const value = getNested(strings, key);
    if (value != null) el.setAttribute('aria-label', value);
  });

  applyMailtoLinks(lang);
  applyCases(strings);
  applyExperience(strings);
  applyTestimonials(strings);

  if (forceHero || !skipHero || heroAnimationDone) {
    const nameEl = document.querySelector('.hero__name');
    const roleEl = document.querySelector('.hero__role');
    if (nameEl) nameEl.textContent = strings.hero.name;
    if (roleEl) roleEl.textContent = strings.hero.role;
  }

  document.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
  document.documentElement.setAttribute('data-i18n-ready', '');
}

export function initI18n() {
  const initial = resolveInitialLang();

  applyLanguage(initial, { skipHero: true });

  const langSwitch = document.querySelector('.lang-switch');
  const buttons = langSwitch?.querySelectorAll('[data-lang]');

  function syncLangButtons(lang) {
    buttons?.forEach((btn) => {
      const isActive = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
      btn.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  }

  syncLangButtons(initial);

  buttons?.forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      if (!SUPPORTED.includes(lang) || lang === currentLang) return;
      applyLanguage(lang, { forceHero: true });
      syncLangButtons(lang);
    });
  });
}

export function markHeroAnimationDone() {
  heroAnimationDone = true;
}
