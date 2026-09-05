/* ===========================================================
   CALIXTO ACORDEÓN MÁGICO — TARJETA DIGITAL PREMIUM
   KONFÍO ZINC — script.js
   =========================================================== */
(() => {
  "use strict";

  /* ---------- DATA ---------- */
  const WHATSAPP_NUMBER = "573157866859";
  const WHATSAPP_MESSAGE = "Hola Calixto, vi tu tarjeta digital y quiero información para contratarte para un evento.";
  const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  // Fotos reales de Calixto
  const GALLERY_IMAGES = [
    { src: "assets/img/gallery/gallery-1.jpg", alt: "Calixto Acordeón Mágico en escenario ante gran multitud", tall: true },
    { src: "assets/img/gallery/gallery-2.jpg", alt: "Calixto y su banda en presentación en vivo con luces azules" },
    { src: "assets/img/gallery/gallery-3.jpg", alt: "Calixto Acordeón Mágico — imagen promocional" },
    { src: "assets/img/gallery/gallery-4.jpg", alt: "Calixto con sombrero vueltiao y acordeón", tall: true },
    { src: "assets/img/gallery/gallery-5.jpg", alt: "Calixto con acordeón Hohner rojo al aire libre" },
    { src: "assets/img/gallery/gallery-6.jpg", alt: "Calixto con su grupo musical" },
    { src: "assets/img/gallery/gallery-7.jpg", alt: "Calixto Acordeón Mágico con sombrero colombiano en bar" }
  ];

  /* ---------- UTIL ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function showToast(msg, ms = 2200) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), ms);
  }

  /* ---------- WHATSAPP LINKS ---------- */
  function wireWhatsappLinks() {
    ["ctaHero", "qaWhatsapp", "ctaContratar", "socialWhatsapp", "fabWhatsapp"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.setAttribute("href", WHATSAPP_URL);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      }
    });
  }

  /* ---------- SPLASH ---------- */
  function initSplash() {
    const splash = $("#splash");
    if (!splash) return;
    const delay = prefersReducedMotion ? 0 : 900;
    window.addEventListener("load", () => {
      setTimeout(() => splash.classList.add("hide"), delay);
    });
    setTimeout(() => splash.classList.add("hide"), 2500);
  }

  /* ---------- SCROLL REVEAL ---------- */
  function initReveal() {
    const items = $$(".reveal");
    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      items.forEach(el => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });
    items.forEach(el => io.observe(el));
  }

  /* ---------- STAT COUNTERS ---------- */
  function initCounters() {
    const nums = $$(".stat-num");
    if (!nums.length) return;
    const animate = (el) => {
      const target = parseInt(el.dataset.count, 10) || 0;
      const duration = 1200;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (!("IntersectionObserver" in window)) { nums.forEach(animate); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { animate(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    nums.forEach(el => io.observe(el));
  }

  /* ---------- GALLERY + LIGHTBOX ---------- */
  let galleryIndex = 0;

  function buildGallery() {
    const grid = $("#galleryGrid");
    if (!grid) return;
    grid.innerHTML = GALLERY_IMAGES.map((img, i) => `
      <img src="${img.src}" alt="${img.alt}" loading="lazy" decoding="async"
           class="${img.tall ? "tall" : ""}" data-index="${i}">`
    ).join("");
  }

  function initLightbox() {
    const lightbox = $("#lightbox");
    const lbImage  = $("#lbImage");
    const lbCounter = $("#lbCounter");
    if (!lightbox) return;

    const open = (index) => {
      galleryIndex = index; update();
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };
    const update = () => {
      const item = GALLERY_IMAGES[galleryIndex];
      lbImage.src = item.src; lbImage.alt = item.alt;
      lbCounter.textContent = `${galleryIndex + 1} / ${GALLERY_IMAGES.length}`;
    };
    const next = () => { galleryIndex = (galleryIndex + 1) % GALLERY_IMAGES.length; update(); };
    const prev = () => { galleryIndex = (galleryIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length; update(); };

    $("#galleryGrid").addEventListener("click", (e) => {
      const img = e.target.closest("img[data-index]");
      if (img) open(parseInt(img.dataset.index, 10));
    });
    $("#lbClose").addEventListener("click", close);
    $("#lbNext").addEventListener("click", next);
    $("#lbPrev").addEventListener("click", prev);
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });
    let touchStartX = 0;
    lightbox.addEventListener("touchstart", (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    lightbox.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) (dx < 0 ? next() : prev());
    }, { passive: true });
  }

  /* ---------- VIDEO MODAL ---------- */
  function initVideoModal() {
    const modal      = $("#videoModal");
    const modalVideo = $("#modalVideo");
    const overlay    = $("#videoModalOverlay");
    const closeBtn   = $("#videoModalClose");
    if (!modal) return;

    const open = (src) => {
      // TODO: reemplaza las rutas data-video de cada .video-card en index.html con los
      // mp4 reales de Calixto (formato H.264, máx 20MB, preferiblemente 720p vertical).
      modalVideo.src = src;
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      modalVideo.muted = true;
      const p = modalVideo.play();
      if (p && p.catch) p.catch(() => {});
    };
    const close = () => {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      modalVideo.pause();
      modalVideo.removeAttribute("src");
      modalVideo.load();
    };

    $$(".video-card").forEach(card => card.addEventListener("click", () => open(card.dataset.video)));
    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) close();
    });
  }

  /* ---------- VIDEO DOTS ---------- */
  function initVideoDots() {
    const slider   = $("#videoSlider");
    const dotsWrap = $("#videoDots");
    if (!slider || !dotsWrap) return;
    const cards = $$(".video-card", slider);
    dotsWrap.innerHTML = cards.map((_, i) => `<span class="${i === 0 ? "active" : ""}"></span>`).join("");
    const dots = $$("span", dotsWrap);
    let ticking = false;
    slider.addEventListener("scroll", () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        const scrollCenter = slider.scrollLeft + slider.clientWidth / 2;
        let closest = 0, min = Infinity;
        cards.forEach((c, i) => {
          const center = c.offsetLeft + c.clientWidth / 2;
          const d = Math.abs(center - scrollCenter);
          if (d < min) { min = d; closest = i; }
        });
        dots.forEach((d, i) => d.classList.toggle("active", i === closest));
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- AUDIO PLAYER ---------- */
  function initAudioPlayer() {
    const audio      = $("#audioEl");
    const playToggle = $("#playToggle");
    const iconPlay   = $("#iconPlay");
    const iconPause  = $("#iconPause");
    const waveform   = $("#waveform");
    const trackTitle = $("#playerTrack");
    const timeCurrent = $("#timeCurrent");
    const timeTotal   = $("#timeTotal");
    const items       = $$(".track-item");
    if (!audio) return;

    waveform.innerHTML = Array.from({ length: 28 }, () =>
      `<span style="height:${20 + Math.random() * 80}%;animation-delay:${Math.random().toFixed(2)}s"></span>`
    ).join("");

    const fmt = (s) => {
      if (!isFinite(s)) return "0:00";
      return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
    };

    const loadTrack = (item, autoplay = false) => {
      items.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      // TODO: reemplaza data-src en cada .track-item de index.html con los
      // clips de audio reales de Calixto (mp3, 128-192kbps).
      audio.src = item.dataset.src;
      trackTitle.textContent = item.dataset.title;
      if (autoplay) audio.play().catch(() => showToast("Agrega el clip de audio real para reproducir 🎵"));
    };

    items.forEach(item => item.addEventListener("click", () => loadTrack(item, true)));

    playToggle.addEventListener("click", () => {
      if (!audio.src) loadTrack(items[0]);
      audio.paused
        ? audio.play().catch(() => showToast("Agrega el clip de audio real para reproducir 🎵"))
        : audio.pause();
    });

    audio.addEventListener("play",  () => { iconPlay.style.display="none"; iconPause.style.display="block"; waveform.classList.add("playing"); });
    audio.addEventListener("pause", () => { iconPlay.style.display="block"; iconPause.style.display="none"; waveform.classList.remove("playing"); });
    audio.addEventListener("loadedmetadata", () => { timeTotal.textContent = fmt(audio.duration); });
    audio.addEventListener("timeupdate", () => { timeCurrent.textContent = fmt(audio.currentTime); });
    audio.addEventListener("ended", () => {
      const ai = items.findIndex(i => i.classList.contains("active"));
      loadTrack(items[ai + 1] || items[0], true);
    });
  }

  /* ---------- SHARE ---------- */
  function initShare() {
    const btn = $("#qaShare");
    if (!btn) return;
    btn.addEventListener("click", async () => {
      const data = { title: "Calixto Acordeón Mágico", text: "Mira la tarjeta digital de Calixto Acordeón Mágico 🎶", url: window.location.href };
      if (navigator.share) {
        try { await navigator.share(data); } catch {}
      } else {
        try { await navigator.clipboard.writeText(window.location.href); showToast("Enlace copiado ✅"); }
        catch { showToast("No se pudo copiar el enlace"); }
      }
    });
  }

  /* ---------- GUARDAR CONTACTO ---------- */
  function initSaveContact() {
    const btn  = $("#qaContact");
    const link = $("#vcardLink");
    if (!btn || !link) return;
    btn.addEventListener("click", () => {
      const vcard = [
        "BEGIN:VCARD", "VERSION:3.0",
        "N:;Calixto Acordeón Mágico;;;",
        "FN:Calixto Acordeón Mágico",
        "ORG:Calixto Acordeón Mágico",
        "TITLE:Acordeonista profesional y cantante",
        "TEL;TYPE=CELL:+573157866859",
        "EMAIL:calixtoacordeonmagico@gmail.com",
        "ADR:;;Bucaramanga;Santander;;;Colombia",
        "URL:https://www.facebook.com/share/14hmMyEhwV8/",
        "END:VCARD"
      ].join("\n");
      const blob = new Blob([vcard], { type: "text/vcard" });
      const url  = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      showToast("Contacto guardado ✅");
    });
  }

  /* ---------- FAB ---------- */
  function initFab() {
    const fab  = $("#fabWhatsapp");
    const hero = $("#hero");
    if (!fab || !hero) return;
    const onScroll = () => fab.classList.toggle("show", window.scrollY > hero.offsetHeight * 0.6);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- YEAR ---------- */
  function initYear() {
    const el = $("#year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- INIT ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    wireWhatsappLinks();
    initSplash();
    buildGallery();
    initReveal();
    initCounters();
    initLightbox();
    initVideoModal();
    initVideoDots();
    initAudioPlayer();
    initShare();
    initSaveContact();
    initFab();
    initYear();
  });
})();
