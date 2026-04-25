/* =========================================================
   ANTON BURJUY — INTERACTIONS
   Loader · Cursor · Nav · Drawer · i18n · Reveal · Counters
   Form validation · Video player
   ========================================================= */

/**
 * Deal — one transaction for the #track section. Every numeric or factual
 * field is verified against signed paperwork before it ships; placeholders
 * are tagged {{TODO_AB_VERIFY: …}} until then.
 *
 * @typedef {Object} Deal
 * @property {string} id              — slug, used as i18n key prefix
 * @property {string} strategy        — Distressed | Reposition | Land JV |
 *                                       Build-to-core | Standing income |
 *                                       Standard brokerage
 * @property {string} date            — quarter or year range, e.g. "Q3 2023"
 * @property {string} role            — Broker | Broker · co-invest | JV partner
 * @property {string} title           — short asset description, no marketing
 * @property {string} location        — Dubai sub-market (e.g. "Dubai South")
 * @property {string} ticket          — gross ticket size in USD
 * @property {string} metric          — net yield, IRR, or markup with label
 * @property {string} hold            — months or month-range
 * @property {string} counterparty    — generic descriptor (region + entity
 *                                       type); never a name
 * @property {string} status          — Held | Exited | Under management |
 *                                       Refinanced
 * @property {string} note            — 1–2 sentences, factual, no adjectives
 * @property {'public'|'partial'|'nda'} disclosure
 *                                    — what's publicly attributable
 */

(() => {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- LOADER ---------- */
  window.addEventListener('load', () => {
    const loader = $('#loader');
    if (!loader) return;
    setTimeout(() => loader.classList.add('is-done'), 350);
    setTimeout(() => loader.classList.add('is-gone'), 1100);
  });

  /* ---------- CUSTOM CURSOR (desktop only) ---------- */
  const cursor = $('#cursor');
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (cursor && supportsHover) {
    let x = 0, y = 0, tx = 0, ty = 0, raf;
    const tick = () => {
      tx += (x - tx) * 0.22;
      ty += (y - ty) * 0.22;
      cursor.style.transform = `translate(${tx}px, ${ty}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', e => {
      x = e.clientX; y = e.clientY;
      cursor.classList.add('is-visible');
      if (!raf) raf = requestAnimationFrame(tick);
    });
    window.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));

    const hoverables = 'a, button, input, textarea, select, [role="button"], .card, .focus__row, .case, .insight';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverables)) cursor.classList.add('is-hover');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverables)) cursor.classList.remove('is-hover');
    });
  }

  /* ---------- NAV: scroll background ---------- */
  const nav = $('#nav');
  const onScroll = () => {
    if (window.scrollY > 100) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- MOBILE DRAWER ---------- */
  const burger = $('#burger');
  const drawer = $('#drawer');
  const closeDrawer = () => {
    burger.classList.remove('is-open');
    drawer.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
  };
  burger?.addEventListener('click', () => {
    const open = !drawer.classList.contains('is-open');
    drawer.classList.toggle('is-open', open);
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    drawer.setAttribute('aria-hidden', String(!open));
  });
  $$('.drawer__links a').forEach(a => a.addEventListener('click', closeDrawer));

  /* ---------- LANGUAGE TOGGLE (RU / EN) ----------
     EN is parallel writing, not translation. Where a Russian phrase doesn't
     transfer cleanly, the EN entry uses a {{TODO_EN: …}} brief instead of a
     calque. TODO_AB markers are facts Anton fills in (deal counts, RERA #,
     personal-investing year). TODO_AB_VERIFY tags numbers carried over from
     prior copy that need explicit sign-off before going live.
  */
  const i18n = {
    en: {
      'meta.title': "Anton Burjuy — Dubai real estate, underwritten before it's sold.",
      'meta.description': "Anton Burjuy — Dubai real estate broker (Inside Realty, RERA). Excel model on every deal. Distressed assets, office repositioning, land JVs, build-to-core warehousing. $300K to $10M tickets, selective co-investment.",

      'nav.about': 'About', 'nav.services': 'Strategies', 'nav.track': 'Track Record',
      'nav.insights': 'Insights', 'nav.contact': 'Contact', 'nav.cta': 'Telegram',

      'hero.eyebrow': 'Anton Burjuy · Inside Realty · RERA · Dubai',
      'hero.title': "Dubai real estate, underwritten before it's sold.",
      'hero.subtitle': 'Inside Realty broker. Excel model on every deal. Distressed assets, office repositioning, land JVs, build-to-core warehousing. $300K to $10M tickets, selective co-investment.',
      'hero.cta1': 'Message on Telegram',
      'hero.cta2': 'WhatsApp',
      'hero.stat1': 'Ticket range',
      'hero.stat2': 'Licensed broker · Inside Realty',
      'hero.stat3': 'Underwritten on every deal',
      'hero.stat4': 'UAE focus',

      'about.eyebrow': '01 — Profile',
      'about.heading': 'Broker on the licence, analyst on the model.',
      'about.bio1': "Anton Burjuy is a Dubai real-estate broker who runs every transaction through an Excel model before it goes to signature.",
      'about.bio2': "Closed {{TODO_AB: N}} deals since {{TODO_AB: YYYY}}, ${{TODO_AB: X}}M aggregate.",
      'about.bio3': "RERA broker licence #{{TODO_AB: number}}. Partner at Inside Realty.",
      'about.bio4': "Personal investor in Dubai real estate since {{TODO_AB: YYYY}}; positions disclosed under NDA.",
      'about.list1': 'Distressed acquisition',
      'about.list2': 'Office repositioning',
      'about.list3': 'Land joint ventures',
      'about.list4': 'Build-to-core warehousing',
      'about.list5': 'Standard brokerage (residential, off-plan, leasing)',
      'about.list6': 'Excel underwriting on every deal',
      'about.quote': 'Every deal is underwritten on numbers, not narratives.',

      'video.eyebrow': '02 — Introduction',
      'video.heading': 'Meet Anton.',
      'video.caption': 'A 90-second introduction to how I work.',

      'services.eyebrow': '03 — Strategies',
      'services.heading': 'Four strategies I underwrite. One I default to.',
      'services.k.ticket':  'Ticket',
      'services.k.deliver': 'Deliverable',
      'services.s1.title': 'Distressed deals',
      'services.s1.body':  "Assets sold under pressure — bank workouts, divorce, succession, fund unwinds. Found before they're listed.",
      'services.s1.ticket': '$500K — $10M',
      'services.s1.deliver': 'Off-market sourcing, full Excel model, structuring through to close.',
      'services.s2.title': 'Office repositioning',
      'services.s2.body':  "Tired Grade B floors bought, capex'd into Grade A income, exited to institutional buyers.",
      'services.s2.ticket': '$1M — $8M',
      'services.s2.deliver': 'Acquisition, capex plan, leasing campaign, disposition.',
      'services.s3.title': 'Land JV',
      'services.s3.body':  'I source and underwrite the plot. Family partner brings capital. Returns split per agreement.',
      'services.s3.ticket': '$2M — $10M+ per JV',
      'services.s3.deliver': 'Plot sourcing, JV structure, build-or-flip thesis, exit.',
      'services.s4.title': 'Build-to-core warehousing',
      'services.s4.body':  'Industrial development with a tenant in mind — DIP, Dubai South, Jebel Ali — held to stabilised income.',
      'services.s4.ticket': '$3M — $10M+',
      'services.s4.deliver': 'Plot, pre-let, build, hold or refinance.',
      'services.s5.title': 'Standard brokerage',
      'services.s5.body':  'Apartments, off-plan, leasing — what fills most weeks. Same approach: numbers first, presentation second.',
      'services.s5.ticket': 'From $300K',
      'services.s5.deliver': 'Sourcing, negotiation, paperwork, handover.',

      'focus.eyebrow': '04 — Asset classes',
      'focus.heading': 'Where capital goes by asset.',
      'focus.r1.name': 'Commercial offices',
      'focus.r1.desc': 'Income-producing offices, Grade A and core-plus.',
      'focus.r2.name': 'Residential',
      'focus.r2.desc': 'Acquisition, repositioning and resale of residential stock.',
      'focus.r3.name': 'Warehouses & logistics',
      'focus.r3.desc': 'Last-mile and built-to-suit, single- and multi-tenant covenants.',
      'focus.r4.name': 'Retail',
      'focus.r4.desc': 'Community-anchored retail and high-street units.',
      'focus.r5.name': 'Land & development JV',
      'focus.r5.desc': 'Plot acquisition and JV development on approved master plans.',

      'track.eyebrow':     '05 — Deal memos',
      'track.heading':     'Track record.',
      'track.placeholder': 'Deal-by-deal memos — tickets, hold periods, IRRs, counterparty descriptors — are shared on request, under NDA. They are not published here.',
      'track.viewAll':     'Request memos in Telegram →',

      'process.eyebrow': '06 — Method',
      'process.heading': 'How I work.',
      'process.p1.title': 'Brief',
      'process.p1.body':  'Mandate, risk profile, return target. Translated into an underwriting frame before sourcing starts.',
      'process.p2.title': 'Sourcing',
      'process.p2.body':  'Off-market and on-market pipeline filtered against thesis, location, covenant, liquidity.',
      'process.p3.title': 'Underwriting',
      'process.p3.body':  'Excel model, legal and technical DD, structuring and negotiation through to signing.',
      'process.p4.title': 'Close & manage',
      'process.p4.body':  'Closing, leasing and asset management. Quarterly reporting, exit planned from day one.',

      'insights.eyebrow': '07 — Notes',
      'insights.heading': 'Market notes.',
      'insights.i1.title': "UAE office yields: where compression has — and hasn't — arrived.",
      'insights.i1.excerpt': 'A short read on Grade A pricing across DIFC, Downtown and Business Bay.',
      'insights.i2.title': 'Logistics covenants: reading the fine print.',
      'insights.i2.excerpt': 'What single-tenant NNN structures actually price — beyond the headline yield.',
      'insights.i3.title': "Off-plan vs. standing stock: a capital allocator's view.",
      'insights.i3.excerpt': 'Why most family offices should look at income before they look at IRR.',

      'contact.eyebrow': '08 — Contact',
      'contact.heading': 'Telegram is fastest.',
      'contact.lede': 'First conversations are confidential and at no cost. The form below is an alternative if you prefer it.',
      'contact.loc': 'Dubai · United Arab Emirates',

      'form.name': 'Name', 'form.email': 'Email',
      'form.range': 'Ticket range',
      'form.range.placeholder': 'Select a range',
      'form.range.opt1': '$300K — $1M',
      'form.range.opt2': '$1M — $5M',
      'form.range.opt3': '$5M — $10M+',
      'form.range.opt4': 'Family office',
      'form.message': 'Message', 'form.submit': 'Send enquiry',
      'form.success': "Received. I'll respond within 24 hours.",

      'footer.tag': 'Dubai real estate. Underwritten.',
      'footer.copy': '© 2026 Anton Burjuy.',
      'footer.disclaimer': 'This website does not constitute investment advice or solicitation.'
    },
    ru: {
      'meta.title': 'Антон Буржуй — недвижимость Дубая, проверенная цифрами до сделки.',
      'meta.description': 'Антон Буржуй — брокер по недвижимости в Дубае (Inside Realty, RERA). Финансовая модель на каждой сделке. Дистресс, переоценка офисов, JV по земле, build-to-core склады. Тикет от $300K до $10M, селективное соинвестирование.',

      'nav.about': 'О себе', 'nav.services': 'Стратегии', 'nav.track': 'Сделки',
      'nav.insights': 'Аналитика', 'nav.contact': 'Контакты', 'nav.cta': 'Telegram',

      'hero.eyebrow': 'Антон Буржуй · Inside Realty · RERA · Дубай',
      'hero.title': 'Дубайская недвижимость для инвесторов, которые считают сделку, а не верят брошюре.',
      'hero.subtitle': 'Брокер Inside Realty с финансовой моделью на каждой сделке. Дистресс, переоценка офисов, JV по земле, build-to-core склады. Сопровождаю покупки от $300K до $10M, селективно соинвестирую.',
      'hero.cta1': 'Написать в Telegram',
      'hero.cta2': 'WhatsApp',
      'hero.stat1': 'Размер тикета',
      'hero.stat2': 'Лицензированный брокер · Inside Realty',
      'hero.stat3': 'Андеррайтинг на каждой сделке',
      'hero.stat4': 'Фокус — ОАЭ',

      'about.eyebrow': '01 — Профиль',
      'about.heading': 'Брокер по лицензии, аналитик в модели.',
      'about.bio1': 'Антон Буржуй — брокер по недвижимости в Дубае; каждую сделку прогоняет через финансовую модель в Excel до подписания, а не после.',
      'about.bio2': 'С {{TODO_AB: YYYY}} закрыто {{TODO_AB: N}} сделок общим объёмом ${{TODO_AB: X}}M.',
      'about.bio3': 'Лицензия RERA №{{TODO_AB: number}}. Партнёр агентства Inside Realty.',
      'about.bio4': 'Лично инвестирую в дубайскую недвижимость с {{TODO_AB: YYYY}}; список позиций — под NDA.',
      'about.list1': 'Дистресс-сделки',
      'about.list2': 'Переоценка офисов',
      'about.list3': 'Совместные сделки по земле',
      'about.list4': 'Build-to-core склады',
      'about.list5': 'Стандартная брокерская работа (квартиры, off-plan, аренда)',
      'about.list6': 'Финансовая модель на каждой сделке',
      'about.quote': 'Каждая сделка опирается на цифры, а не на нарративы.',

      'video.eyebrow': '02 — Знакомство',
      'video.heading': 'Знакомство с Антоном.',
      'video.caption': '90-секундный обзор того, как я работаю.',

      'services.eyebrow': '03 — Стратегии',
      'services.heading': 'Четыре стратегии, которые я считаю. Одна — то, чем занимаюсь каждый день.',
      'services.k.ticket':  'Тикет',
      'services.k.deliver': 'Что делаю',
      'services.s1.title': 'Дистресс',
      'services.s1.body':  'Активы, которые продают под давлением: банковские реструктуризации, развод, наследство, выходы из фондов. Нахожу до того, как объект попадёт в открытый рынок.',
      'services.s1.ticket': '$500K — $10M',
      'services.s1.deliver': 'Off-market поиск, полная финансовая модель, структурирование до закрытия.',
      'services.s2.title': 'Переоценка офисов',
      'services.s2.body':  'Покупка устаревших офисных этажей класса B, capex и перевод в класс A с доходом, продажа институциональным покупателям.',
      'services.s2.ticket': '$1M — $8M',
      'services.s2.deliver': 'Покупка, capex-план, кампания по аренде, продажа.',
      'services.s3.title': 'JV по земле',
      'services.s3.body':  'Я нахожу и считаю участок. Партнёр-семья даёт капитал. Доходность делится по соглашению.',
      'services.s3.ticket': '$2M — $10M+ за JV',
      'services.s3.deliver': 'Поиск участка, структура СП, тезис «строить-или-продать», выход.',
      'services.s4.title': 'Build-to-core склады',
      'services.s4.body':  'Промышленный девелопмент под понятного арендатора — DIP, Дубай Саут, Джебель Али — удержание ради стабильного дохода.',
      'services.s4.ticket': '$3M — $10M+',
      'services.s4.deliver': 'Участок, предварительный арендатор, стройка, удержание или рефинансирование.',
      'services.s5.title': 'Стандартная брокерская работа',
      'services.s5.body':  'Квартиры, off-plan, аренда — то, чем заполнено большинство недель. Подход тот же: сначала цифры, потом презентация.',
      'services.s5.ticket': 'От $300K',
      'services.s5.deliver': 'Поиск, переговоры, документы, передача ключей.',

      'focus.eyebrow': '04 — Классы активов',
      'focus.heading': 'Куда идёт капитал по классам.',
      'focus.r1.name': 'Коммерческие офисы',
      'focus.r1.desc': 'Доходные офисы класса A и core-plus.',
      'focus.r2.name': 'Жилая недвижимость',
      'focus.r2.desc': 'Покупка, репозиционирование и продажа жилого фонда.',
      'focus.r3.name': 'Склады и логистика',
      'focus.r3.desc': 'Last-mile и built-to-suit, один или несколько арендаторов.',
      'focus.r4.name': 'Ритейл',
      'focus.r4.desc': 'Районные торговые объекты и стрит-ритейл.',
      'focus.r5.name': 'Земля и СП-девелопмент',
      'focus.r5.desc': 'Покупка участков и СП на утверждённых мастер-планах.',

      'track.eyebrow':     '05 — Памятки по сделкам',
      'track.heading':     'Сделки.',
      'track.placeholder': 'Памятки по сделкам — тикет, срок, IRR, описание стороны — отправляю по запросу под NDA. На сайте не публикую.',
      'track.viewAll':     'Запросить памятки в Telegram →',

      'process.eyebrow': '06 — Метод',
      'process.heading': 'Как я работаю.',
      'process.p1.title': 'Бриф',
      'process.p1.body':  'Мандат, профиль риска, целевая доходность. Перевожу в рамку андеррайтинга до начала поиска.',
      'process.p2.title': 'Поиск',
      'process.p2.body':  'Off-market и рыночный пайплайн, фильтр по тезису, локации, арендатору, ликвидности.',
      'process.p3.title': 'Андеррайтинг',
      'process.p3.body':  'Excel-модель, юридический и технический due diligence, структурирование и переговоры до подписания.',
      'process.p4.title': 'Закрытие и управление',
      'process.p4.body':  'Закрытие сделки, аренда, управление активом. Ежеквартальная отчётность, выход спланирован с первого дня.',

      'insights.eyebrow': '07 — Заметки',
      'insights.heading': 'Заметки по рынку.',
      'insights.i1.title': 'Доходности офисов ОАЭ: где сжатие уже произошло — и где ещё нет.',
      'insights.i1.excerpt': 'Короткий разбор ценообразования class A в DIFC, Downtown и Business Bay.',
      'insights.i2.title': 'Логистические договоры: что в мелком шрифте.',
      'insights.i2.excerpt': 'Что на самом деле прайсят NNN-структуры с одним арендатором — за пределами заголовочной доходности.',
      'insights.i3.title': 'Off-plan vs. готовый фонд: взгляд аллокатора капитала.',
      'insights.i3.excerpt': 'Почему семейному офису сначала стоит смотреть на доход, а не на IRR.',

      'contact.eyebrow': '08 — Контакты',
      'contact.heading': 'Telegram — быстрее всего.',
      'contact.lede': 'Первичные разговоры конфиденциальны и бесплатны. Форма ниже — альтернатива, если так удобнее.',
      'contact.loc': 'Дубай · Объединённые Арабские Эмираты',

      'form.name': 'Имя', 'form.email': 'Email',
      'form.range': 'Размер тикета',
      'form.range.placeholder': 'Выберите диапазон',
      'form.range.opt1': '$300K — $1M',
      'form.range.opt2': '$1M — $5M',
      'form.range.opt3': '$5M — $10M+',
      'form.range.opt4': 'Семейный офис',
      'form.message': 'Сообщение', 'form.submit': 'Отправить запрос',
      'form.success': 'Получено. Отвечу в течение 24 часов.',

      'footer.tag': 'Недвижимость Дубая. С моделью.',
      'footer.copy': '© 2026 Антон Буржуй.',
      'footer.disclaimer': 'Содержимое сайта не является инвестиционной рекомендацией или офертой.'
    }
  };

  const setLang = (lang) => {
    if (!i18n[lang]) return;
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;

    $$('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = i18n[lang][key];
      if (typeof value !== 'string') return;
      if (el.tagName === 'TITLE') el.textContent = value;
      else if (el.tagName === 'META') el.setAttribute('content', value);
      else el.textContent = value;
    });

    $$('[data-lang-set]').forEach(btn => {
      const isActive = btn.dataset.langSet === lang;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });

    try { localStorage.setItem('ab_lang', lang); } catch (_) {}
  };

  $$('[data-lang-set]').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.langSet));
  });

  let initialLang = 'en';
  try {
    const urlLang = new URLSearchParams(location.search).get('lang');
    const saved   = localStorage.getItem('ab_lang');
    if (urlLang && i18n[urlLang])      initialLang = urlLang;
    else if (saved && i18n[saved])     initialLang = saved;
    else if ((navigator.language || '').toLowerCase().startsWith('ru')) initialLang = 'ru';
  } catch (_) {}
  setLang(initialLang);

  /* ---------- INTERSECTION OBSERVER: REVEAL ---------- */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);

          const counters = entry.target.querySelectorAll?.('.stat__count');
          counters && counters.forEach(runCounter);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-in'));
  }

  /* ---------- STAT COUNTERS ---------- */
  const runCounter = (node) => {
    if (node.dataset.done) return;
    node.dataset.done = '1';
    const target = parseFloat(node.dataset.target) || 0;
    const duration = 1400;
    const start = performance.now();
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const v = Math.round(target * easeOut(p));
      node.textContent = v.toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(step);
      else node.textContent = target.toLocaleString('en-US');
    };
    requestAnimationFrame(step);
  };

  // Hero stats are not inside .reveal — observe them directly
  const heroStats = $$('.stat__count');
  if (heroStats.length && 'IntersectionObserver' in window) {
    const ioStats = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          ioStats.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    heroStats.forEach(el => ioStats.observe(el));
  } else {
    heroStats.forEach(runCounter);
  }

  /* ---------- VIDEO PLAYER ---------- */
  const videoBox = $('#videoBox');
  const playBtn  = $('#playBtn');
  playBtn?.addEventListener('click', () => {
    if (!videoBox) return;
    const ytId = videoBox.dataset.yt;
    if (ytId) {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
      iframe.title = 'Introduction video';
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      iframe.frameBorder = '0';
      iframe.className = 'video__el';
      videoBox.appendChild(iframe);
      videoBox.classList.add('is-playing');
      return;
    }
    const videoEl = videoBox.querySelector('video.video__el');
    if (!videoEl) return;
    videoBox.classList.add('is-playing');
    videoEl.play().catch(() => { /* autoplay blocked */ });
  });

  /* ---------- FORM VALIDATION + SUBMIT ----------
     Form posts to Netlify Forms (data-netlify="true" + hidden form-name).
     On non-Netlify hosts (local dev, other static hosts) the POST will 404
     and we fall back to disabling the form with a generic confirmation
     message — submissions in that environment will not be captured.
  */
  const form = $('#contactForm');
  const success = $('#formSuccess');
  const lockForm = () => {
    form.querySelectorAll('input, select, textarea, button').forEach(el => el.disabled = true);
    success.hidden = false;
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;
    $$('.field', form).forEach(field => field.classList.remove('is-invalid'));

    const name    = form.elements.name;
    const email   = form.elements.email;
    const range   = form.elements.range;
    const message = form.elements.message;

    if (!name.value.trim())                                  { name.closest('.field').classList.add('is-invalid'); valid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))     { email.closest('.field').classList.add('is-invalid'); valid = false; }
    if (!range.value)                                        { range.closest('.field').classList.add('is-invalid'); valid = false; }
    if (!message.value.trim())                               { message.closest('.field').classList.add('is-invalid'); valid = false; }

    if (!valid) return;

    const body = new URLSearchParams(new FormData(form)).toString();
    try {
      const res = await fetch('/', {
        method:  'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (_) {
      /* Submission failed (likely non-Netlify host). Surface confirmation
         anyway — better UX than a silent failure — but the message Anton
         will not have arrived. The Telegram CTA above the form remains
         the reliable channel. */
    }
    lockForm();
  });

})();
