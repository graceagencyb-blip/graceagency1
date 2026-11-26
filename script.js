(() => {
  const WHATSAPP_NUMBER = '2349133304451';
  const EMAIL_ADDRESS = 'graceagencyb@gmail.com';

  // 1. Preloader Sequence
  const preloader = document.getElementById('preloader');
  const preloaderBar = document.getElementById('preloader-bar');
  const preloaderPct = document.getElementById('preloader-pct');
  const preloaderModule = document.getElementById('preloader-module');
  const modules = [
    '[01/05] HERO VIDEO ENGINE',
    '[02/05] WEB PLATFORMS',
    '[03/05] EMAIL FLOWS',
    '[04/05] BOOKING SYSTEMS',
    '[05/05] AUTOMATIONS READY'
  ];

  let pct = 0;
  const loaderTimer = setInterval(() => {
    pct = Math.min(100, pct + Math.floor(Math.random() * 14) + 8);
    if (preloaderBar) preloaderBar.style.width = `${pct}%`;
    if (preloaderPct) preloaderPct.textContent = String(pct);
    const modIdx = Math.min(modules.length - 1, Math.floor((pct / 100) * modules.length));
    if (preloaderModule) preloaderModule.textContent = modules[modIdx];

    if (pct >= 100) {
      clearInterval(loaderTimer);
      setTimeout(() => {
        preloader?.classList.add('is-done');
        document.body.classList.remove('is-loading');
      }, 220);
    }
  }, 55);

  // 2. Generated Hero Video Engine (Canvas -> MediaStream -> <video>)
  const canvas = document.getElementById('hero-canvas');
  const heroVideo = document.getElementById('hero-video');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const particles = Array.from({ length: 65 }, (_, i) => ({
      x: ((Math.sin(i * 12.9898) * 0.5 + 0.5) * W),
      y: ((Math.cos(i * 78.233) * 0.5 + 0.5) * H),
      r: (i % 3) + 1.2,
      lime: i % 4 === 0
    }));

    let mouseX = 0.5;
    let mouseY = 0.5;
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;
    }, { passive: true });

    let t = 0;
    function renderHeroFrame() {
      t += 0.0055;
      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, W, H);

      // Ambient lime glow following mouse subtly + orbital drift
      const gx = W * (0.35 + mouseX * 0.3) + Math.cos(t * 1.3) * 70;
      const gy = H * (0.35 + mouseY * 0.3) + Math.sin(t * 1.1) * 45;
      const grad = ctx.createRadialGradient(gx, gy, 20, gx, gy, 520);
      grad.addColorStop(0, 'rgba(182, 244, 25, 0.2)');
      grad.addColorStop(0.5, 'rgba(182, 244, 25, 0.05)');
      grad.addColorStop(1, 'rgba(8, 8, 8, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Rotating 3D-projected orbital rings
      ctx.save();
      ctx.translate(W / 2, H / 2);
      for (let ring = 0; ring < 3; ring++) {
        ctx.save();
        ctx.rotate(t * (ring % 2 === 0 ? 0.6 : -0.45) + ring * 0.8);
        ctx.scale(1.4, 0.58 + ring * 0.14);
        ctx.beginPath();
        ctx.arc(0, 0, 165 + ring * 88, 0, Math.PI * 2);
        ctx.strokeStyle = ring === 1 ? 'rgba(182, 244, 25, 0.28)' : 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = ring === 1 ? 1.8 : 1;
        ctx.setLineDash(ring === 2 ? [10, 14] : []);
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();

      // Kinetic energy waves
      for (let w = 0; w < 3; w++) {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 20) {
          const y = H * 0.55 +
            Math.sin((x / W) * Math.PI * 3 + t * 2.1 + w) * (36 + w * 16) +
            Math.cos((x / W) * Math.PI * 5 - t * 1.6) * 14;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = w === 0 ? 'rgba(182, 244, 25, 0.34)' : `rgba(255, 255, 255, ${0.06 - w * 0.015})`;
        ctx.lineWidth = w === 0 ? 2 : 1;
        ctx.stroke();
      }

      // Connected particle constellation
      const pts = particles.map((p, idx) => ({
        ...p,
        px: (p.x + Math.sin(t * 1.5 + idx) * 26 + W) % W,
        py: (p.y + Math.cos(t * 1.2 + idx * 0.7) * 20 + H) % H
      }));

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dist = Math.hypot(pts[i].px - pts[j].px, pts[i].py - pts[j].py);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.22;
            ctx.strokeStyle = (pts[i].lime || pts[j].lime)
              ? `rgba(182, 244, 25, ${alpha * 1.3})`
              : `rgba(255, 255, 255, ${alpha * 0.55})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pts[i].px, pts[i].py);
            ctx.lineTo(pts[j].px, pts[j].py);
            ctx.stroke();
          }
        }
      }

      pts.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.px, p.py, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.lime ? '#b6f419' : 'rgba(250, 250, 250, 0.55)';
        ctx.fill();
      });

      requestAnimationFrame(renderHeroFrame);
    }

    renderHeroFrame();

    if (heroVideo && typeof canvas.captureStream === 'function') {
      try {
        heroVideo.srcObject = canvas.captureStream(30);
        heroVideo.play().catch(() => {});
      } catch (_) {
        // Canvas layer remains visible underneath seamlessly
      }
    }
  }

  // 3. Custom Magnetic Cursor + Spotlight + 3D Card Tilt
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let rx = 0, ry = 0, cx = 0, cy = 0;

  window.addEventListener('mousemove', (e) => {
    cx = e.clientX;
    cy = e.clientY;
    if (dot) {
      dot.style.left = `${cx}px`;
      dot.style.top = `${cy}px`;
    }
  }, { passive: true });

  function animateCursor() {
    rx += (cx - rx) * 0.18;
    ry += (cy - ry) * 0.18;
    if (ring) {
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, input, select, textarea').forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Spotlight & Subtle 3D Tilt on Cards
  document.querySelectorAll('.spotlight-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
      if (card.classList.contains('tilt-card')) {
        const rotateY = ((x / rect.width) - 0.5) * 4;
        const rotateX = ((y / rect.height) - 0.5) * -4;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
      }
    });
    card.addEventListener('mouseleave', () => {
      if (card.classList.contains('tilt-card')) {
        card.style.transform = '';
      }
    });
  });

  // Magnetic Buttons
  document.querySelectorAll('[data-magnetic]').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.18;
      const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.18;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // 4. Header Scroll State & Menu Overlay
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const menuOverlay = document.getElementById('menu-overlay');
  function setMenu(open) {
    menuOverlay?.classList.toggle('open', open);
    menuOverlay?.setAttribute('aria-hidden', String(!open));
    menuToggle?.setAttribute('aria-expanded', String(open));
  }
  menuToggle?.addEventListener('click', () => setMenu(true));
  menuClose?.addEventListener('click', () => setMenu(false));
  document.querySelectorAll('.menu-item').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  // 5. Scroll Reveal + Count-Up Animations
  const countUps = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        entry.target.querySelectorAll('.count-up').forEach((el) => {
          if (countUps.has(el)) return;
          countUps.add(el);
          const target = Number(el.getAttribute('data-target') || 0);
          const duration = 1300;
          const start = performance.now();
          function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = String(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
      }
    });
  }, { threshold: 0.14 });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  // 6. Live Counttime Timer (Next Express Slot Countdown)
  const counttimeEl = document.getElementById('counttime-display');
  let remainingSeconds = (2 * 86400) + (14 * 3600) + (36 * 60) + 45;
  setInterval(() => {
    remainingSeconds = remainingSeconds > 0 ? remainingSeconds - 1 : 3 * 86400;
    const d = Math.floor(remainingSeconds / 86400);
    const h = Math.floor((remainingSeconds % 86400) / 3600);
    const m = Math.floor((remainingSeconds % 3600) / 60);
    const s = remainingSeconds % 60;
    const pad = (n) => String(n).padStart(2, '0');
    if (counttimeEl) {
      counttimeEl.textContent = `${pad(d)}d : ${pad(h)}h : ${pad(m)}m : ${pad(s)}s`;
    }
  }, 1000);

  // 7. About Comparison Toggle
  const compareTitle = document.getElementById('compare-title');
  const compareList = document.getElementById('compare-list');
  const compareData = {
    grace: {
      title: 'Full-Stack Growth Execution',
      items: [
        'Transparent pricing starting at <strong>$100 USD</strong> per platform',
        'Website, email, booking &amp; automation connected seamlessly',
        'Mobile-first, fast-loading, conversion-engineered UI',
        'Direct WhatsApp &amp; Upwork communication with fast turnaround'
      ],
      icon: '✓'
    },
    others: {
      title: 'Fragmented & Slow Delivery',
      items: [
        'Hidden fees and unclear hourly billing surprises',
        'Website built without email capture, booking, or CRM sync',
        'Generic templates with slow load times and weak mobile UX',
        'Slow replies and zero post-launch automation support'
      ],
      icon: '✕'
    }
  };
  document.querySelectorAll('.toggle-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.toggle-pill').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.getAttribute('data-compare');
      const data = compareData[key];
      if (compareTitle && compareList && data) {
        compareTitle.textContent = data.title;
        compareList.innerHTML = data.items
          .map((item) => `<li><span class="check ${key === 'grace' ? 'accent' : 'muted'}">${data.icon}</span> ${item}</li>`)
          .join('');
      }
    });
  });

  // 8. Service Category Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');
      serviceCards.forEach((card) => {
        const match = cat === 'all' || card.getAttribute('data-category') === cat;
        card.classList.toggle('is-hidden', !match);
      });
    });
  });

  // 9. Quote Modal + Platform Pre-Selection
  const modal = document.getElementById('quote-modal');
  const modalClose = document.getElementById('modal-close');
  const mPlatform = document.getElementById('m-platform');
  const mDetails = document.getElementById('m-details');
  let selectedModalService = 'Website Design';

  function openModal(service, platform) {
    if (service) {
      selectedModalService = service;
      document.querySelectorAll('.m-chip').forEach((c) => {
        c.classList.toggle('active', c.getAttribute('data-val') === service);
      });
    }
    if (mPlatform && platform) mPlatform.value = platform;
    modal?.classList.add('open');
    modal?.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal?.classList.remove('open');
    modal?.setAttribute('aria-hidden', 'true');
  }

  document.querySelectorAll('.open-modal-btn').forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn.getAttribute('data-service') || 'Website Design', ''));
  });
  document.querySelectorAll('.platform-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      openModal(chip.getAttribute('data-service'), chip.getAttribute('data-platform'));
    });
  });
  document.querySelectorAll('.m-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.m-chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      selectedModalService = chip.getAttribute('data-val') || 'Website Design';
    });
  });
  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  function launchWhatsApp(text) {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  }
  function launchEmail(subject, body) {
    window.location.href = `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  document.getElementById('modal-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const plat = mPlatform?.value.trim() || 'Not specified';
    const msg = `Hi Grace Agency! I want to book ${selectedModalService} (${plat}) starting at $100+.\n\nProject Goal: ${mDetails?.value.trim()}`;
    launchWhatsApp(msg);
    closeModal();
  });

  document.getElementById('modal-email-btn')?.addEventListener('click', () => {
    const plat = mPlatform?.value.trim() || 'Not specified';
    launchEmail(
      `Project Inquiry: ${selectedModalService} (${plat})`,
      `Hi Grace Agency,\n\nService: ${selectedModalService}\nPlatform: ${plat}\n\nDetails:\n${mDetails?.value.trim() || ''}`
    );
    closeModal();
  });

  // 10. Main Contact Form & Copy Toast
  const mainForm = document.getElementById('main-contact-form');
  const formFeedback = document.getElementById('form-feedback');
  mainForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('c-name')?.value.trim();
    const email = document.getElementById('c-email')?.value.trim();
    const service = document.getElementById('c-service')?.value;
    const platform = document.getElementById('c-platform')?.value.trim() || 'Flexible';
    const message = document.getElementById('c-message')?.value.trim();
    const text = `Hi Grace Agency! My name is ${name} (${email}).\nService: ${service}\nPlatform(s): ${platform}\n\nProject Details:\n${message}`;
    launchWhatsApp(text);
    if (formFeedback) formFeedback.textContent = 'Opening WhatsApp with your project brief...';
  });

  document.getElementById('send-email-btn')?.addEventListener('click', () => {
    const name = document.getElementById('c-name')?.value.trim() || 'Client';
    const email = document.getElementById('c-email')?.value.trim() || '';
    const service = document.getElementById('c-service')?.value;
    const platform = document.getElementById('c-platform')?.value.trim() || 'Flexible';
    const message = document.getElementById('c-message')?.value.trim() || '';
    launchEmail(
      `New Project Brief from ${name} — ${service}`,
      `Name: ${name}\nEmail: ${email}\nService: ${service}\nPlatform(s): ${platform}\n\nDetails:\n${message}`
    );
    if (formFeedback) formFeedback.textContent = 'Opening your email client to graceagencyb@gmail.com...';
  });

  const toast = document.getElementById('toast');
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
  }

  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const val = btn.getAttribute('data-copy');
      if (!val) return;
      try {
        await navigator.clipboard.writeText(val);
        showToast(`Copied: ${val}`);
      } catch (_) {
        showToast(val);
      }
    });
  });

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
