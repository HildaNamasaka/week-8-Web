/* script.js
   Handles:
   - mobile nav toggle
   - smooth section scrolling
   - active nav highlighting
   - scroll progress bar
   - counter animation
   - fade-in on scroll
   - back-to-top button
   - appointment + contact form demo handling
   - doctor search filter
*/

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const dataPageLinks = document.querySelectorAll('[data-page]');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');

  // Mobile toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // Smooth scroll and handling data-page links
  dataPageLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const page = link.getAttribute('data-page');
      if (page) {
        e.preventDefault();
        const target = document.getElementById(page);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Close mobile menu if open
          if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
          }
        }
      }
    });
  });

  // Update active nav link based on scroll
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('data-page') === id);
        });
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(sec => sectionObserver.observe(sec));

  // Scroll progress
  window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    if (scrollProgress) scrollProgress.style.width = scrolled + '%';

    // Back to top visibility
    if (backToTop) {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  });

  // Back to top click
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Counters - animate when visible
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el) {
    const target = +el.getAttribute('data-count') || 0;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 200));
    const tick = () => {
      current += step;
      if (current >= target) {
        el.innerText = target;
      } else {
        el.innerText = current;
        requestAnimationFrame(tick);
      }
    };
    tick();
  }

  // Fade-in elements
  const faders = document.querySelectorAll('.fade-in');
  const faderObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  faders.forEach(f => faderObserver.observe(f));

  // Appointment form handling (demo)
  const appointmentForm = document.getElementById('appointmentForm');
  const appointmentSuccess = document.getElementById('appointmentSuccess');
  const appointmentLoading = document.getElementById('appointmentLoading');

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Basic validation
      let valid = true;
      const name = document.getElementById('patientName');
      const email = document.getElementById('patientEmail');
      const date = document.getElementById('appointmentDate');
      const time = document.getElementById('appointmentTime');
      const dept = document.getElementById('departmentSelect');

      // reset errors
      document.querySelectorAll('.form-error').forEach(el => el.style.display = 'none');

      if (!name.value.trim()) { document.getElementById('errName').style.display = 'block'; valid = false; }
      if (!email.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value)) { document.getElementById('errEmail').style.display = 'block'; valid = false; }
      if (!date.value) { document.getElementById('errDate').style.display = 'block'; valid = false; }
      if (!time.value) { document.getElementById('errTime').style.display = 'block'; valid = false; }
      if (!dept.value) { document.getElementById('errDept').style.display = 'block'; valid = false; }

      if (!valid) return;

      // show loading
      if (appointmentLoading) appointmentLoading.style.display = 'inline-block';

      // demo "send"
      setTimeout(() => {
        if (appointmentLoading) appointmentLoading.style.display = 'none';
        if (appointmentSuccess) {
          appointmentSuccess.style.display = 'block';
          appointmentForm.reset();
          window.scrollTo({ top: appointmentSuccess.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
          setTimeout(() => appointmentSuccess.style.display = 'none', 5000);
        }
      }, 900);
    });
  }

  // Contact form (demo)
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // reset errors
      document.querySelectorAll('.form-error').forEach(el => el.style.display = 'none');
      let valid = true;
      const cn = document.getElementById('contactName');
      const ce = document.getElementById('contactEmail');
      const cm = document.getElementById('contactMessage');

      if (!cn.value.trim()) { document.getElementById('errContactName').style.display = 'block'; valid = false; }
      if (!ce.value.trim() || !/^\S+@\S+\.\S+$/.test(ce.value)) { document.getElementById('errContactEmail').style.display = 'block'; valid = false; }
      if (!cm.value.trim()) { document.getElementById('errContactMessage').style.display = 'block'; valid = false; }

      if (!valid) return;

      // demo send
      contactSuccess.style.display = 'block';
      contactForm.reset();
      setTimeout(() => contactSuccess.style.display = 'none', 4000);
    });
  }

  // Doctor search filter
  const doctorSearch = document.getElementById('doctorSearch');
  const doctorList = document.getElementById('doctorList');
  if (doctorSearch && doctorList) {
    doctorSearch.addEventListener('input', () => {
      const q = doctorSearch.value.trim().toLowerCase();
      const cards = doctorList.querySelectorAll('.doctor-card');
      cards.forEach(card => {
        const dept = (card.getAttribute('data-dept') || '').toLowerCase();
        const name = (card.querySelector('.doctor-name')?.innerText || '').toLowerCase();
        card.style.display = (dept.includes(q) || name.includes(q)) ? '' : 'none';
      });
    });
  }

  // Accessibility: close mobile menu on outside click
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      mobileToggle.classList.remove('active');
    }
  });
});
