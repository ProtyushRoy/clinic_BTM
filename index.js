/* ===================================================
   DENTAL ARCHITECTS — Interactive Behaviors
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- SCROLL PROGRESS BAR ----
  const scrollProgress = document.getElementById('scrollProgress');
  
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = progress + '%';
  }

  // ---- HEADER SCROLL BEHAVIOR ----
  const header = document.getElementById('header');
  let lastScroll = 0;

  function handleHeaderScroll() {
    const currentScroll = window.scrollY;

    if (currentScroll > 80) {
      header.classList.remove('header--transparent');
      header.classList.add('header--scrolled');
    } else {
      header.classList.add('header--transparent');
      header.classList.remove('header--scrolled');
    }

    lastScroll = currentScroll;
  }

  // ---- BACK TO TOP ----
  const backToTop = document.getElementById('backToTop');

  function handleBackToTop() {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- COMBINED SCROLL HANDLER ----
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        handleHeaderScroll();
        handleBackToTop();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Initial calls
  updateScrollProgress();
  handleHeaderScroll();
  handleBackToTop();

  // ---- MOBILE MENU ----
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');

  menuToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    
    // Animate hamburger to X
    const spans = menuToggle.querySelectorAll('span');
    if (mobileNav.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // ---- CLOSE MOBILE NAV (global function) ----
  window.closeMobileNav = function() {
    mobileNav.classList.remove('active');
    document.body.style.overflow = '';
    const spans = menuToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  };

  // ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---- INTERSECTION OBSERVER: Animate on Scroll ----
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    scrollObserver.observe(el);
  });

  // ---- COUNTER ANIMATION ----
  const statNumbers = document.querySelectorAll('.about__stat-number');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  if (statNumbers.length > 0) {
    statNumbers.forEach(el => counterObserver.observe(el));
  }

  function animateCounters() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.dataset.target, 10);
      const suffix = stat.dataset.suffix || '';
      const duration = 2000;
      const steps = 60;
      const stepTime = duration / steps;
      let current = 0;
      const increment = target / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        const displayValue = Math.floor(current);
        stat.textContent = displayValue.toLocaleString() + suffix;
      }, stepTime);
    });
  }

  // ---- SERVICE CLUSTER HOVER EFFECT ----
  document.querySelectorAll('.service-cluster').forEach(cluster => {
    cluster.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    });
  });

  // ---- STAGGERED ANIMATION FOR TRUST ITEMS ----
  const trustItems = document.querySelectorAll('.hero__trust-item');
  trustItems.forEach((item, index) => {
    item.style.animation = `fadeInUp 0.6s ease ${0.8 + index * 0.15}s both`;
  });

  // ---- STAGGERED ANIMATION FOR RATING ITEMS ----
  const ratingItems = document.querySelectorAll('.ratings-bar__item');
  const ratingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.ratings-bar__item');
        items.forEach((item, index) => {
          item.style.animation = `fadeInUp 0.5s ease ${index * 0.15}s both`;
        });
        ratingObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const ratingsBar = document.getElementById('ratingsBar');
  if (ratingsBar) {
    ratingObserver.observe(ratingsBar);
  }

  // ---- SERVICE CLUSTERS STAGGERED REVEAL ----
  const serviceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const clusters = entry.target.querySelectorAll('.service-cluster');
        clusters.forEach((cluster, index) => {
          setTimeout(() => {
            cluster.classList.add('visible');
          }, index * 120);
        });
        serviceObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const servicesSection = document.querySelector('.services__clusters');
  if (servicesSection) {
    serviceObserver.observe(servicesSection);
  }

  // ---- TESTIMONIALS STAGGERED REVEAL ----
  const testimonialObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.testimonial-card');
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('visible');
          }, index * 150);
        });
        testimonialObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const testimonialsGrid = document.querySelector('.testimonials__grid');
  if (testimonialsGrid) {
    testimonialObserver.observe(testimonialsGrid);
  }

  // ---- DOCTOR CARDS STAGGERED REVEAL ----
  const doctorObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.doctor-card');
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('visible');
          }, index * 200);
        });
        doctorObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  const doctorsGrid = document.querySelector('.doctors__grid');
  if (doctorsGrid) {
    doctorObserver.observe(doctorsGrid);
  }

  // ---- PARALLAX EFFECT ON HERO GEOMETRIC ----
  const heroGeometric = document.querySelector('.hero__geometric');

  if (heroGeometric) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      heroGeometric.style.transform = `translateY(-50%) translate(${x}px, ${y}px)`;
    }, { passive: true });
  }

});
