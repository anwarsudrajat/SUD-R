(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- Tema terang/gelap ---------- */
  function getSaved() {
    try { return localStorage.getItem('tema'); } catch (e) { return null; }
  }
  function save(v) {
    try { localStorage.setItem('tema', v); } catch (e) {}
  }
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#07070b' : '#f2f2f7');
  }

  var systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(getSaved() || (systemDark ? 'dark' : 'light'));

  var themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      save(next);
    });
  }

  /* ---------- Animasi muncul + progress skill ---------- */
  var reveals = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fillBars(scope) {
    scope.querySelectorAll('.bar i').forEach(function (bar) {
      bar.style.width = (bar.dataset.level || 0) + '%';
    });
  }

  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          fillBars(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
    fillBars(document);
  }

  /* ---------- Menu aktif sesuai posisi scroll ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.dock a'));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });

  function setActive(id) {
    links.forEach(function (a) {
      var on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('active', on);
      if (on && a.scrollIntoView) {
        // jaga dock tetap kelihatan di layar kecil
        var dock = a.parentElement;
        dock.scrollTo({ left: a.offsetLeft - dock.clientWidth / 2 + a.clientWidth / 2, behavior: 'smooth' });
      }
    });
  }

  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { if (s) spy.observe(s); });
  }

  /* ---------- Kilau kaca ngikutin kursor/jari ---------- */
  document.querySelectorAll('.card, .hero-card').forEach(function (el) {
    function move(e) {
      var rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      el.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    }
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerdown', move);
  });

  /* ---------- Form kontak (buka aplikasi email) ---------- */
  var form = document.getElementById('contactForm');
  var msg = document.getElementById('formMsg');
  var EMAIL_TUJUAN = 'emailkamu@example.com'; // ganti pakai email lo

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nama = form.elements.nama;
      var pesan = form.elements.pesan;
      var ok = true;

      [nama, pesan].forEach(function (f) {
        var kosong = !f.value.trim();
        f.setAttribute('aria-invalid', kosong ? 'true' : 'false');
        if (kosong) ok = false;
      });

      if (!ok) {
        msg.textContent = 'Isi dulu semua kolomnya ya.';
        return;
      }

      var subject = encodeURIComponent('Pesan dari ' + nama.value.trim());
      var body = encodeURIComponent(pesan.value.trim());
      msg.textContent = 'Membuka aplikasi email lo...';
      window.location.href = 'mailto:' + EMAIL_TUJUAN + '?subject=' + subject + '&body=' + body;
    });
  }

  /* ---------- Tahun footer ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
