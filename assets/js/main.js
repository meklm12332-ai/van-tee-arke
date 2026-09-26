/* =========================================================
   MAISON VANDÉAC — interactions (vanilla JS, no dependencies)
   ========================================================= */
(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Intro fade-in ---------- */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { document.body.classList.add('is-loaded'); });
  });

  /* ---------- Custom cursor ---------- */
  var dot = document.querySelector('.cursor');
  var ring = document.querySelector('.cursor-follow');
  if (dot && ring && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    var mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    });
    (function loop() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a,button,.savoir__scroller,.collection__media').forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('is-hover'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('is-hover'); });
    });
  } else if (dot && ring) {
    dot.style.display = ring.style.display = 'none';
  }

  /* ---------- Nav: solid on scroll + hide on scroll-down ---------- */
  var nav = document.querySelector('.nav');
  var bar = document.querySelector('.progress');
  var lastY = 0;
  function onScroll() {
    var y = window.pageYOffset;
    if (nav) {
      nav.classList.toggle('is-solid', y > 60);
      nav.classList.toggle('is-hidden', y > lastY && y > 600);
    }
    lastY = y;
    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = document.querySelector('.nav__burger');
  var overlay = document.querySelector('.menu-overlay');
  if (burger && overlay) {
    burger.addEventListener('click', function () {
      var open = overlay.classList.toggle('is-open');
      burger.textContent = open ? 'Close' : 'Menu';
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    overlay.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        overlay.classList.remove('is-open');
        burger.textContent = 'Menu';
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Smooth anchor scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - 40, behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Reveal on view ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Parallax (hero bg + signature media) ---------- */
  if (!reduce) {
    var heroGem = document.querySelector('.hero__gem');
    var heroWash = document.querySelector('.hero__wash');
    var sigMedia = document.querySelector('.signature__media img');
    var bandMedia = [].slice.call(document.querySelectorAll('.band__media img'));
    window.addEventListener('scroll', function () {
      var y = window.pageYOffset, vh = window.innerHeight;
      if (y < vh) {
        if (heroGem) heroGem.style.transform = 'translate(-50%,-50%) rotate(45deg) translateY(' + (y * 0.06) + 'px)';
        if (heroWash) heroWash.style.transform = 'scale(1.35) translateY(' + (y * 0.04) + 'px)';
      }
      bandMedia.forEach(function (m) {
        var b = m.getBoundingClientRect();
        if (b.bottom > 0 && b.top < vh) {
          var o = (b.top + b.height / 2 - vh / 2) / vh;
          m.style.transform = 'translateY(' + (o * -40) + 'px)';
        }
      });
      if (sigMedia) {
        var r = sigMedia.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          var off = (r.top - window.innerHeight / 2) / window.innerHeight;
          sigMedia.style.transform = 'scale(1.14) translateY(' + (off * -26) + 'px)';
        }
      }
    }, { passive: true });
  }

  /* ---------- Broken images -> keep gradient placeholder ----------
     Capture-phase + delegation so this also covers images injected
     later (e.g. the shop grid, rendered from products.json). */
  document.addEventListener('error', function (e) {
    if (e.target && e.target.tagName === 'IMG') e.target.style.opacity = '0';
  }, true);

  /* ---------- Newsletter -> Netlify Forms ---------- */
  var nlForm = document.querySelector('.nl-form');
  var nlStatus = document.querySelector('.nl-status');
  function encodeForm(form) {
    return Array.prototype.map.call(new FormData(form), function (pair) {
      return encodeURIComponent(pair[0]) + '=' + encodeURIComponent(pair[1]);
    }).join('&');
  }
  if (nlForm) {
    nlForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = nlForm.querySelector('input[type="email"]');
      var honeypot = nlForm.querySelector('[name="bot-field"]');
      var btn = nlForm.querySelector('button');
      if (!input.value.trim()) return;
      if (honeypot && honeypot.value) return; // spam bot filled the trap field, silently drop

      btn.disabled = true;
      var prevLabel = btn.textContent;
      btn.textContent = 'Sending…';
      if (nlStatus) { nlStatus.textContent = ''; nlStatus.classList.remove('is-error'); }

      // Fallback: if the AJAX submit is blocked for any reason (extension, offline,
      // odd browser/network quirk), fall back to a real native form POST — that is
      // the plain HTML mechanism Netlify Forms is built around, so it always works.
      function nativeFallback() {
        HTMLFormElement.prototype.submit.call(nlForm);
      }

      try {
        fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: encodeForm(nlForm)
        }).then(function (res) {
          if (!res.ok) throw new Error('Network response was not ok');
          btn.textContent = 'Merci ✦';
          input.value = '';
          input.placeholder = 'Subscribed, thank you';
          if (nlStatus) nlStatus.textContent = 'You are on the list.';
          setTimeout(function () { btn.textContent = prevLabel; btn.disabled = false; }, 2600);
        }).catch(nativeFallback);
      } catch (err) {
        nativeFallback();
      }
    });
  }

  /* ---------- Shop: render assets/data/products.json into a filterable grid ----------
     To add products: edit assets/data/products.json (or regenerate it from the CSV
     template with scripts/csv_to_products_json.py) — this code needs no changes. */
  var shopGrid = document.querySelector('.shop-grid');
  if (shopGrid) {
    var shopFilterBar = document.querySelector('.shop-filter');
    var shopEmpty = document.querySelector('.shop-empty');

    var slug = function (s) {
      return String(s).toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'other';
    };
    var esc = function (s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    };
    var cardHTML = function (p, i) {
      var img = 'assets/images/' + String(p.image || '').replace(/^assets\/images\//, '');
      var price = p.price && String(p.price).trim() ? esc(p.price) : 'Price on request';
      var link = p.link || 'index.html#visit';
      return '<article class="product reveal" data-d="' + (i % 3) + '" data-cat="' + slug(p.collection || 'Other') + '">' +
        '<div class="frame"><img src="' + esc(img) + '" alt="' + esc(p.name || '') + '" loading="lazy" /></div>' +
        '<span class="product__cat">' + esc(p.collection || '') + '</span>' +
        '<h3>' + esc(p.name || 'Untitled piece') + '</h3>' +
        '<p class="product__meta">' + esc(p.material || '') + '</p>' +
        '<div class="product__row">' +
          '<span class="product__price">' + price + '</span>' +
          '<a href="' + esc(link) + '" class="product__link">Enquire</a>' +
        '</div>' +
      '</article>';
    };

    fetch('assets/data/products.json')
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (products) {
        products = Array.isArray(products) ? products : [];
        if (!products.length) { if (shopEmpty) shopEmpty.hidden = false; return; }

        shopGrid.innerHTML = products.map(cardHTML).join('');

        if (shopFilterBar) {
          var cats = [];
          products.forEach(function (p) {
            var c = p.collection || 'Other';
            if (cats.indexOf(c) === -1) cats.push(c);
          });
          shopFilterBar.innerHTML = ['<button type="button" class="is-active" data-cat="all">All</button>']
            .concat(cats.map(function (c) { return '<button type="button" data-cat="' + slug(c) + '">' + esc(c) + '</button>'; }))
            .join('');
          shopFilterBar.addEventListener('click', function (e) {
            var btn = e.target.closest('button');
            if (!btn) return;
            shopFilterBar.querySelectorAll('button').forEach(function (b) { b.classList.remove('is-active'); });
            btn.classList.add('is-active');
            var cat = btn.getAttribute('data-cat');
            shopGrid.querySelectorAll('.product').forEach(function (item) {
              item.classList.toggle('is-hidden', !(cat === 'all' || item.getAttribute('data-cat') === cat));
            });
          });
        }

        // reveal-on-scroll needs to run again for these newly injected cards
        var freshReveals = shopGrid.querySelectorAll('.reveal');
        if ('IntersectionObserver' in window && !reduce) {
          var shopIO = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
              if (en.isIntersecting) { en.target.classList.add('is-in'); shopIO.unobserve(en.target); }
            });
          }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
          freshReveals.forEach(function (el) { shopIO.observe(el); });
        } else {
          freshReveals.forEach(function (el) { el.classList.add('is-in'); });
        }
      })
      .catch(function () {
        if (shopEmpty) { shopEmpty.hidden = false; shopEmpty.textContent = 'Could not load products right now.'; }
      });
  }

  /* ---------- Year ---------- */
  var yr = document.querySelector('[data-year-now]');
  if (yr) yr.textContent = new Date().getFullYear();
})();
